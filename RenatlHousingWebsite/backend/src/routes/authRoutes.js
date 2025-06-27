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

import { adminOnly, authMiddleware } from "../middleware/authMiddleware.js"; 
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
router.get("/profile", authMiddleware,adminOnly, getUserProfile);
router.put("/profile", authMiddleware, updateUserProfile);

router.get('/search-logs', authMiddleware, adminOnly, async (req, res) => {
  try {
    const logs = await SearchLog.find().populate('userId', 'name email role');
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch search logs', error: error.message });
  }
});

router.post('/search-log', authMiddleware, async (req, res) => {
  try {
    const { searchTerm, device } = req.body;
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const log = new SearchLog({
      userId: req.user._id,
      userType: req.user.role,
      searchTerm,
      device,
      timestamp: new Date()
    });
    await log.save();
    res.status(201).json({ message: 'Search logged' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to log search', error: error.message });
  }
});

export default router;  // ✅ Correct Export
