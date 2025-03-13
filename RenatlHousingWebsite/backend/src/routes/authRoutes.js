import express from "express";
import { 
    signup, 
    login, 
    logout, 
    getUserProfile, 
    updateUserProfile, 
    verifyOTP, 
    resendOTP, 
    sendOTPEmail ,
     // ✅ Make sure this function exists in user.controller.js
     forgotPassword, 
  verifyResetOTP, 
  resetPassword 
    } from "../controller/user.controller.js"; 

import { authMiddleware } from "../middleware/authMiddleware.js"; 
import { validateSignup, validateLogin } from "../middleware/authValidate.js";

const router = express.Router();

// ✅ Signup Route with Validation (Sends OTP)
router.post("/signup", validateSignup, signup);

// ✅ New API for sending OTP without signup
router.post("/send-otp",  sendOTPEmail);

// ✅ Verify OTP Route (Activates Account after OTP Verification)
router.post("/verify-otp", verifyOTP);  

// ✅ Resend OTP API Route
router.post("/resend-otp", resendOTP);  

// ✅ Login Route with Validation
router.post("/login", validateLogin, login);

// Forgot Password Routes
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-otp", verifyResetOTP);
router.post("/reset-password", resetPassword);

// ✅ Logout Route
router.post("/logout", logout);

// ✅ Protected Routes (Require Token)
router.get("/profile", authMiddleware, getUserProfile);
router.put("/profile", authMiddleware, updateUserProfile);

export default router;  // ✅ Correct Export
