import { PLANS } from "../config/Plans.js";
import razorpay from "../config/razorpay.js";
import Payment from "../models/payment.model.js";
import { createHmac } from "node:crypto";
import axios from "axios";

export const createOrder = async (req, res) => {
  try {
    const { plan } = req.body;

    const userId = req.headers["x-user-id"];

    const selectedPlan = PLANS[plan];

    if (!selectedPlan) {
      return res.status(404).json({
        message: "Plan not found"
      });
    }

    const order = await razorpay.orders.create({
      amount: selectedPlan.amount * 100,
      currency: "INR",
      receipt: `receipt-${Date.now()}`
    });

    await Payment.create({
      userId,
      orderId: order.id,
      amount: selectedPlan.amount,
      credits: selectedPlan.credits,
      plan: selectedPlan.id,
      currency: order.currency,
      status: "created"
    });

    return res.status(200).json({
      order,
      plan: selectedPlan
    });

  } catch (error) {
    console.error("Create order error:", error);

    return res.status(500).json({
      message: `create order error ${error.message}`
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const userId = req.headers["x-user-id"];

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing Razorpay verification fields",
      });
    }

    // Generate Razorpay signature
    const generatedSignature = createHmac(
      "sha256",
      process.env.RAZORPAY_API_SECRET
    )
      .update(
        `${razorpay_order_id}|${razorpay_payment_id}`
      )
      .digest("hex");

    const isSignatureValid =
      generatedSignature === razorpay_signature;

    //  Find payment
    const paymentRecord = await Payment.findOne({
      orderId: razorpay_order_id,
      userId,
    });

    if (!paymentRecord) {
      return res.status(404).json({
        success: false,
        message: "Payment not found for this user",
      });
    }

    // Invalid signature
    if (!isSignatureValid) {
      paymentRecord.status = "failed";

      await paymentRecord.save();

      return res.status(400).json({
        success: false,
        message: "Payment verification failed - signature mismatch",
      });
    }

    //  Payment successful
    paymentRecord.status = "paid";
    paymentRecord.razorpayPaymentId = razorpay_payment_id;
    paymentRecord.razorpaySignature = razorpay_signature;

    await paymentRecord.save();

   
    await axios.post(
      `${process.env.AUTH_SERVICE}/update-plan`,
      {
        userId: paymentRecord.userId,
        plan: paymentRecord.plan,
        credits: paymentRecord.credits
      }
    );

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      data: paymentRecord,
    });

  } catch (error) {
    console.error("verifyPayment error:", error);
    console.log("AUTH SERVICE ERROR:");
    console.log("STATUS:", error.response?.status);
    console.log("DATA:", error.response?.data);
    throw error;

    return res.status(500).json({
      success: false,
      message: "Payment verification error",
      error: error.message,
    });
  }
};