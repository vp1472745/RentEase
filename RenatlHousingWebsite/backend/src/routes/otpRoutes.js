import express from "express";
import { sendOtp, verifyOtp } from "../controller/otpController.js";

const router = express.Router();

// ✅ Route to send OTP (Email or Phone)
router.post("/send-otp", sendOtp);

// ✅ Route to verify OTP
router.post("/verify-otp", verifyOtp);

export default router;
