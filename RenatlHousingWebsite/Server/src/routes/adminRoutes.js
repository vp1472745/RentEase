import express from "express";
import multer from "multer";
import { registerAdmin, loginAdmin, logoutAdmin, getAdminProfile , getAllUsers,deleteUser,getAllProperty, getAllProperties} from "../controller/adminController.js";
import { adminOnly, authMiddleware } from "../middleware/authMiddleware.js";
import jwt from "jsonwebtoken";
import SearchLogSchema from "../models/searchLog.js";
import UserSessionLog from "../models/userSessionLog.js";
import Admin from "../models/adminModals.js";
import bcrypt from "bcryptjs";

const router = express.Router();

// Configure multer for file upload
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
        files: 1
    },
    fileFilter: (req, file, cb) => {
        // Accept only image files
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

// Image upload endpoint (now uploads to Cloudinary directly, not using multer-storage-cloudinary)
router.post('/upload-image', upload.single('image'), async (req, res) => {
    try {
        console.log('📤 Image upload request received');
        
        if (!req.file) {
            console.error('❌ No file uploaded');
            return res.status(400).json({ 
                success: false, 
                message: 'No file uploaded' 
            });
        }

        // Log file details
        console.log('File details:', {
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: `${(req.file.size / 1024 / 1024).toFixed(2)}MB`
        });

        // Convert buffer to base64
        const b64 = Buffer.from(req.file.buffer).toString('base64');
        const dataURI = `data:${req.file.mimetype};base64,${b64}`;

        // Upload to Cloudinary with timeout
        const uploadPromise = new Promise((resolve, reject) => {
            cloudinary.uploader.upload(dataURI, {
                folder: 'admin_profiles',
                resource_type: 'auto',
                timeout: 30000 // 30 second timeout
            }, (error, result) => {
                if (error) {
                    console.error('❌ Cloudinary upload error:', error);
                    reject(error);
                } else {
                    console.log('✅ Cloudinary upload successful:', {
                        url: result.secure_url,
                        public_id: result.public_id
                    });
                    resolve(result);
                }
            });
        });

        const result = await uploadPromise;
        res.status(200).json({
            success: true,
            message: 'Image uploaded successfully',
            url: result.secure_url,
            public_id: result.public_id
        });
    } catch (error) {
        console.error('❌ Error uploading image:', error);
        res.status(500).json({
            success: false,
            message: 'Error uploading image',
            error: error.message
        });
    }
});

// Public routes
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.post("/logout", authMiddleware, adminOnly, logoutAdmin);

// Protected routes (require authentication)
router.get("/profile", authMiddleware, adminOnly, getAdminProfile);
router.get("/getAllUsers", getAllUsers);
router.get("/getAllProperty", authMiddleware, adminOnly, getAllProperties);
router.delete("/deleteUser/:userId", authMiddleware, adminOnly, deleteUser);
router.delete("/login", (req, res) => {
    res.json({ status: "success", message: "Admin login endpoint is reachable" });
  });

router.get('/search-logs',authMiddleware, adminOnly, async (req, res) => {
  try {
    const logs = await SearchLogSchema.find().populate('userId', 'email role');
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch search logs', error: error.message });
  }
});

// Delete search logs endpoint
router.delete('/search-logs', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { logIds } = req.body;
    
    if (!logIds || !Array.isArray(logIds) || logIds.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide an array of log IDs to delete' 
      });
    }

    const result = await SearchLogSchema.deleteMany({ _id: { $in: logIds } });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'No logs found to delete' 
      });
    }

    res.json({ 
      success: true, 
      message: `Successfully deleted ${result.deletedCount} search log(s)` 
    });
  } catch (error) {
    console.error('Error deleting search logs:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete search logs', 
      error: error.message 
    });
  }
});

router.get('/session-logs',authMiddleware, adminOnly, async (req, res) => {
  try {
    const logs = await UserSessionLog.find().populate('userId', 'email role');
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch session logs', error: error.message });
  }
});

// Delete session logs endpoint
router.delete('/session-logs', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { logIds } = req.body;
    
    if (!logIds || !Array.isArray(logIds) || logIds.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide an array of log IDs to delete' 
      });
    }

    const result = await UserSessionLog.deleteMany({ _id: { $in: logIds } });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'No logs found to delete' 
      });
    }

    res.json({ 
      success: true, 
      message: `Successfully deleted ${result.deletedCount} session log(s)` 
    });
  } catch (error) {
    console.error('Error deleting session logs:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete session logs', 
      error: error.message 
    });
  }
});

export default router;
