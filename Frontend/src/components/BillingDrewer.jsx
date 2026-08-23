import React, { useRef, useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Crown, X, Zap, Sparkles, Check, CreditCard } from "lucide-react";
import { useSelector } from "react-redux";
import { createOrder } from "../features/createOrder";
import { verifyPayment } from "../features/verifyPayment";

const BillingDrewer = ({ open, onclose }) => {
    const { userData } = useSelector((state) => state.user);

    const handleUpgrade = async (plan) => {
        try {
            const data = await createOrder({ plan });
            console.log("Order response:", data);

            const options = {
                key: import.meta.env.VITE_RAZORPAY_API_KEY,
                amount: data.order.amount,
                currency: data.order.currency,
                name: "CORTEX-AI",
                description: `${data.plan.name} Plan`,
                order_id: data.order.id,

                handler: async (response) => {
                    try {
                        const data = await verifyPayment({
                            razorpay_order_id: response?.razorpay_order_id,
                            razorpay_payment_id: response?.razorpay_payment_id,
                            razorpay_signature: response?.razorpay_signature,
                        });
                        console.log(data);
                    } catch (error) {
                        console.log(error);
                    }
                },
                theme: {
                    color: "#4F46E5",
                },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (error) {
            console.log("Upgrade error:", error.response?.data || error.message);
        }
    };

    // Mouse-follow glow component
    const GlowCard = ({ children, className = "" }) => {
        const cardRef = useRef(null);
        const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

        const handleMouseMove = (e) => {
            if (!cardRef.current) return;
            const rect = cardRef.current.getBoundingClientRect();
            setMousePos({
                x: ((e.clientX - rect.left) / rect.width) * 100,
                y: ((e.clientY - rect.top) / rect.height) * 100,
            });
        };

        return (
            <motion.div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setMousePos({ x: 50, y: 50 })}
                className={`relative overflow-hidden transition-all duration-300 ${className}`}
                style={{
                    background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(79,70,229,0.08) 0%, transparent 60%)`,
                }}
            >
                {children}
            </motion.div>
        );
    };

    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.7 }}
                        exit={{ opacity: 0 }}
                        onClick={onclose}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
                    />
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="fixed top-0 right-0 h-screen w-[95%] max-w-[440px] bg-gradient-to-b from-[#0a0b12] to-[#14161f] border-l border-white/5 shadow-2xl flex flex-col z-50 overflow-y-auto overflow-x-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/[0.02] shrink-0">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                                    <CreditCard className="w-3.5 h-3.5 text-indigo-400" />
                                </div>
                                <span className="text-white text-sm font-semibold tracking-tight">
                                    Billing
                                </span>
                                <span className="text-slate-400 text-[11px] ml-1 hidden sm:inline">
                                    Plans & Credits
                                </span>
                            </div>
                            <button
                                onClick={onclose}
                                className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center text-slate-400 hover:text-white cursor-pointer"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Current Plan */}
                        <div className="px-4 pt-3 pb-2 shrink-0">
                            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-500/10 via-indigo-500/5 to-transparent border border-indigo-500/20 p-3.5">
                                <div className="absolute -top-16 -right-16 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl" />
                                <div className="relative z-10 flex items-center justify-between">
                                    <div>
                                        <p className="text-slate-400 text-[10px] font-medium uppercase tracking-wider">
                                            Current Plan
                                        </p>
                                        <h3 className="text-white text-base font-bold capitalize mt-0.5">
                                            {userData?.plan || "Free"}
                                        </h3>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
                                        <Crown className="w-4 h-4 text-yellow-400" />
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-slate-400">Credits</span>
                                        <span className="text-white font-medium">
                                            {userData?.credits || 0}{" "}
                                            <span className="text-slate-500 font-normal">
                                                / {userData?.totalCredits || 0}
                                            </span>
                                        </span>
                                    </div>
                                    <div className="mt-1.5 h-1.5 rounded-full bg-white/5 overflow-hidden border border-white/5">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{
                                                width: `${((userData?.credits || 0) / (userData?.totalCredits || 1)) * 100}%`,
                                            }}
                                            transition={{ duration: 0.8, ease: "easeOut" }}
                                            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/25"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Plans - fully responsive, no scroll on normal viewports */}
<div className="flex-1 px-4 pb-4 space-y-3 overflow-y-auto flex flex-col justify-start min-h-[300px]">
                            {/* Starter */}
                            <GlowCard className="rounded-xl bg-white/[0.03] border border-white/5 hover:border-indigo-500/40 transition-all duration-300 p-3.5 hover:shadow-[0_0_30px_rgba(79,70,229,0.15)] group">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                            <h3 className="text-white font-semibold text-sm sm:text-base">
                                                Starter
                                            </h3>
                                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/20">
                                                Basic
                                            </span>
                                        </div>
                                        <div className="flex items-baseline gap-0.5 mt-0.5">
                                            <span className="text-white text-xl sm:text-2xl font-bold">
                                                ₹199
                                            </span>
                                            <span className="text-slate-500 text-xs">/mo</span>
                                        </div>
                                        <p className="text-slate-400 text-xs mt-0.5">500 Credits</p>
                                    </div>
                                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        <Zap className="w-4 h-4 text-indigo-400" />
                                    </div>
                                </div>
                                <ul className="mt-2 space-y-0.5">
                                    <li className="flex items-center gap-1.5 text-xs text-slate-300">
                                        <Check className="w-3 h-3 text-indigo-400 flex-shrink-0" />
                                        All features
                                    </li>
                                    <li className="flex items-center gap-1.5 text-xs text-slate-300">
                                        <Check className="w-3 h-3 text-indigo-400 flex-shrink-0" />
                                        500 credits/mo
                                    </li>
                                    <li className="flex items-center gap-1.5 text-xs text-slate-300">
                                        <Check className="w-3 h-3 text-indigo-400 flex-shrink-0" />
                                        Basic support
                                    </li>
                                </ul>
                                <button
                                    onClick={() => handleUpgrade("starter")}
                                    className="mt-2.5 w-full rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 py-1.5 text-white text-sm font-medium transition-all duration-300 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.97] cursor-pointer"
                                >
                                    Upgrade
                                </button>
                            </GlowCard>

                            {/* Pro */}
                            <GlowCard className="rounded-xl bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent border border-indigo-500/30 hover:border-indigo-400/50 transition-all duration-300 p-3.5 hover:shadow-[0_0_40px_rgba(79,70,229,0.2)] group relative overflow-hidden">
                                <div className="absolute top-0 right-0">
                                    <div className="bg-gradient-to-l from-indigo-500 to-purple-500 text-white text-[9px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-bl-lg rounded-tr-lg">
                                        Popular
                                    </div>
                                </div>
                                <div className="relative z-10">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="flex items-center gap-1.5 flex-wrap">
                                                <h3 className="text-white font-semibold text-sm sm:text-base">
                                                    Pro
                                                </h3>
                                                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/20">
                                                    Best Value
                                                </span>
                                            </div>
                                            <div className="flex items-baseline gap-0.5 mt-0.5">
                                                <span className="text-white text-xl sm:text-2xl font-bold">
                                                    ₹499
                                                </span>
                                                <span className="text-slate-500 text-xs">/mo</span>
                                            </div>
                                            <p className="text-slate-400 text-xs mt-0.5">1000 Credits</p>
                                        </div>
                                        <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                            <Sparkles className="w-4 h-4 text-purple-400" />
                                        </div>
                                    </div>
                                    <ul className="mt-2 space-y-0.5">
                                        <li className="flex items-center gap-1.5 text-xs text-slate-300">
                                            <Check className="w-3 h-3 text-purple-400 flex-shrink-0" />
                                            Everything in Starter
                                        </li>
                                        <li className="flex items-center gap-1.5 text-xs text-slate-300">
                                            <Check className="w-3 h-3 text-purple-400 flex-shrink-0" />
                                            1000 credits/mo
                                        </li>
                                        <li className="flex items-center gap-1.5 text-xs text-slate-300">
                                            <Check className="w-3 h-3 text-purple-400 flex-shrink-0" />
                                            Priority support
                                        </li>
                                        <li className="flex items-center gap-1.5 text-xs text-slate-300">
                                            <Check className="w-3 h-3 text-purple-400 flex-shrink-0" />
                                            Advanced analytics
                                        </li>
                                    </ul>
                                    <button
                                        onClick={() => handleUpgrade("pro")}
                                        className="mt-2.5 w-full rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 py-1.5 text-white text-sm font-medium transition-all duration-300 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/50 hover:scale-[1.02] active:scale-[0.97] cursor-pointer"
                                    >
                                        Upgrade to Pro
                                    </button>
                                </div>
                            </GlowCard>

                              {/* Coming Soon */}
    <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="rounded-xl bg-white/[0.025] border border-white/5 px-3.5 py-2.5"
    >
        <div className="flex items-center justify-between">
            <div>
                <p className="text-white text-xs font-medium">
                    More plans coming soon
                </p>
                <p className="text-slate-500 text-[10px] mt-0.5">
                    Flexible plans and more credits are on the way.
                </p>
            </div>

            <span className="text-[9px] font-medium px-2 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                Coming Soon
            </span>
        </div>
    </motion.div>


                        </div>

                        {/* Footer */}
                        <div className="text-center text-[10px] text-slate-500 pb-3 shrink-0">
                            🔒 Secure payment powered by Razorpay
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default BillingDrewer;