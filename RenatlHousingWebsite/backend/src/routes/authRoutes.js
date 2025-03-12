import express from "express";
import { signup, login, logout, getUserProfile, updateUserProfile, verifyOTP,resendOTP  } from "../controller/user.controller.js";
import { authMiddleware, ownerOnly } from "../middleware/authMiddleware.js"; // ✅ सही Import Path
import { validateSignup, validateLogin } from "../middleware/authValidate.js";

const router = express.Router();

// ✅ Signup Route with Validation (Sends OTP)
router.post("/signup", validateSignup, signup);

// ✅ Verify OTP Route (Activates Account after OTP Verification)
router.post("/verify-otp", verifyOTP);  // OTP verification and account activation



// Resend OTP API Route
router.post("/resend-otp", resendOTP);  // <-- Add this route for resend OTP

// ✅ Login Route with Validation
router.post("/login", validateLogin, login);

// ✅ Logout Route
router.post("/logout", logout);

// ✅ Protected Routes (Require Token)
router.get("/profile", authMiddleware, getUserProfile);
router.put("/profile", authMiddleware, updateUserProfile);

export default router;  // ✅ सही Export
