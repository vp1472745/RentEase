import express from "express";
import { getUserProfile, updateUserProfile } from "../controller/profileController.js";
import upload from "../middleware/multerMiddleware.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ प्रोफाइल डेटा प्राप्त करने का रूट
router.get("/", authMiddleware, getUserProfile);

// ✅ प्रोफाइल अपडेट रूट (क्लाउडिनेरी पर इमेज अपलोड करेगा और URL MongoDB में सेव करेगा)
router.put(
  "/update",
  authMiddleware,
  upload.single("profileImage"), // 1. मल्टर द्वारा इमेज प्रोसेसिंग
  updateUserProfile // 2. क्लाउडिनेरी अपलोड और MongoDB अपडेट
);

export default router;