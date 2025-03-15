import express from "express";
import { getUserProfile, updateUserProfile } from "../controller/profileController.js";
import upload from "../middleware/multerMiddleware.js"; // ✅ Multer Middleware
import { authMiddleware } from "../middleware/authMiddleware.js";
// import upload from "./path/to/uploadConfig.js"; // Import multer configuration
const router = express.Router();

// ✅ Get Profile API (User Data देगा)
router.get("/", authMiddleware, getUserProfile);

// ✅ Update Profile API (User Data अपडेट करेगा)
router.put("/profile/update", authMiddleware, upload.single("profileImage"), updateUserProfile);


export default router;
