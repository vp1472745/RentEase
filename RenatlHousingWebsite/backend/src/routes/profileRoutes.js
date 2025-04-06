import express from "express";
import { 
  getUserProfile, 
  updateUserProfile 
} from "../controller/profileController.js";
import upload from "../middleware/multerMiddleware.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Add proper response headers
router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

// ✅ Get profile data route
router.get("/", authMiddleware, getUserProfile);

// ✅ Profile update route
router.put(
  "/update",
  authMiddleware,
  upload.single("profileImage"), // Multer middleware
  (err, req, res, next) => { // Error handling for Multer
    if (err) {
      return res.status(400).json({
        success: false,
        message: "File upload error",
        error: err.message
      });
    }
    next();
  },
  updateUserProfile // Cloudinary upload and MongoDB update
);

export default router;