import express from "express";
import { getUserProfile, updateUserProfile } from "../controller/profileController.js";
import upload from "../middleware/multerMiddleware.js"; // ✅ Multer Middleware
import { authMiddleware } from "../middleware/authMiddleware.js";

// Create a router instance
const router = express.Router();

// ✅ Get Profile API (User Data देगा)
router.get("/", authMiddleware, getUserProfile);

// ✅ Update Profile API (User Data अपडेट करेगा)
router.put("/update", authMiddleware, upload.single("profileImage"), updateUserProfile);

// Export the router so it can be used in the main server file
export default router;
