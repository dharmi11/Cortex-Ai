import express from "express"
import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    firebaseUid: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
    },
    name: String,
    avatar: String,

    plan: {
        type: String,
        default: "free"
    },
    credits: {
        type: Number,
        default: 100
    },
    totalCredits: {
        type: Number,
        default: 100
    },
    planExpiredAt: Date,
}, {
    timestamps: true,
});

const User = mongoose.model("user", userSchema)

export default User;