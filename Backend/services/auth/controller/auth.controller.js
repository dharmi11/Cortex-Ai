import { getAuth } from "firebase-admin/auth";
import User from "../models/user.model.js";
import crypto from "crypto";
// import { getAuth as getFirebaseAuth } from "firebase/auth";
import connectDb from "../config/db.js";
import redis from "../../../shared/redis/redis.js";



export const login = async (req, res) => {
    try {

        const { token } = req.body;

        const decoded = await getAuth().verifyIdToken(token);

        let user = await User.findOne({
            firebaseUid: decoded.uid
        });

        if (!user) {
            user = await User.create({
                firebaseUid: decoded.uid,
                email: decoded.email,
                name: decoded.name,
                avatar: decoded.picture
            })
        }
        const sessionId = crypto.randomUUID();
        await redis.set(`user-session-${user?._id}`,
            sessionId
            , 'EX', 7 * 24 * 60 * 60)

        const data = await redis.set(`session:${sessionId}`, JSON.stringify({
            userId: user._id,
            email: user.email,
            name: user.name,
            avatar: user.avatar,
            plan: user.plan,
            credits: user.credits,
            totalCredits: user.totalCredits,
            planExpiredAt: user.planExpiredAt
        }), 'EX', 7 * 24 * 60 * 60);

        console.log("redis data", data);

        res.cookie('sessionId', sessionId, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                picture: user.picture,
                avatar: user.avatar,
                plan: user.plan,
                credits: user.credits,
                totalCredits: user.totalCredits,
                planExpiredAt: user.planExpiredAt

            }
        })

    } catch (error) {
        console.error("Login Error:", error);

        res.status(500).json({
            message: error.message
        });
    }
}


export const logout = async (req, res) => {
    try {
        const sessionId = req.cookies?.sessionId;

        if (sessionId) {
            await redis.del(`session:${sessionId}`);
        }

        res.clearCookie("sessionId");

        return res.status(200).json({
            success: true,
            message: "Logout successful"
        });

    } catch (error) {
        console.error("Logout Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const updateUserPayment = async (req, res) => {
    try {
        const { plan, credits, userId } = req.body;

        console.log("UPDATE PLAN BODY:", {
            userId,
            plan,
            credits
        });

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        user.plan = plan;
        user.credits = credits;
        user.totalCredits = credits;
        user.planExpiredAt = new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
        );

        await user.save();
        const sessionId = await redis.get(`user-session-${user._id}`);

        console.log("SESSION ID:", sessionId);

        const sessionData = {
            userId: user._id,
            email: user.email,
            name: user.name,
            avatar: user.avatar,
            plan: user.plan,
            credits: user.credits,
            totalCredits: user.totalCredits,
            planExpiredAt: user.planExpiredAt
        };

        await redis.set(
            `session:${sessionId}`,
            JSON.stringify(sessionData),
            "EX",
            7 * 24 * 60 * 60
        );

        const checkSession = await redis.get(`session:${sessionId}`);

        console.log(
            "REDIS AFTER UPDATE:",
            JSON.parse(checkSession)
        );

        console.log("UPDATED USER:", user);

        return res.status(200).json({
            success: true,
            message: "User plan updated successfully",
            user: {
                id: user._id,
                plan: user.plan,
                credits: user.credits,
                totalCredits: user.totalCredits,
                planExpiredAt: user.planExpiredAt
            }
        });

    } catch (error) {
        console.error("Update user error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


export const deductCredits = async (req, res) => {
    try {
        const { userId, agent } = req.body;
        const COST = {
            chat: 1,
            search: 5,
            coding: 10,
            pdf: 10,
            ppt: 10,
            image: 10,
            vision: 10
        };

        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: "user not found" })
        }
        const requiredCredits = COST[agent] || 1

        if (user.credits < requiredCredits) {
            return res.status(400).json({ message: "Not enough credits. " })
        }

        user.credits -= requiredCredits

        await user.save()

        const sessionId = await redis.get(`user-session-${user._id}`);

        const sessionData = {
            userId: user._id,
            email: user.email,
            name: user.name,
            avatar: user.avatar,
            plan: user.plan,
            credits: user.credits,
            totalCredits: user.totalCredits,
            planExpiredAt: user.planExpiredAt
        };

        await redis.set(
            `session:${sessionId}`,
            JSON.stringify(sessionData),
            "EX",
            7 * 24 * 60 * 60
        );

        const checkSession = await redis.get(`session:${sessionId}`);


        return res.status(200).json({
            success: true,
            message: "User plan updated successfully",
            credits:user.credits,
            user: {
                id: user._id,
                plan: user.plan,
                credits: user.credits,
                totalCredits: user.totalCredits,
                planExpiredAt: user.planExpiredAt
            },

        });

    } catch (error) {
        console.error("Deducted credits error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}