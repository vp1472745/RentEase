import express from "express";
import { addProperty, getAllProperties, getPropertyById, searchProperties, updateProperty, deleteProperty } from "../controller/propertyController.js";
import { authMiddleware, ownerOnly } from "../middleware/authMiddleware.js";
import uploadMiddleware from "../middleware/multerMiddleware.js"; // ✅ Ensure multer middleware is imported

const router = express.Router();

// Route to Add New Property (Only Owner can add)
router.post("/add", authMiddleware, ownerOnly, addProperty);

// Other routes for getting properties, updating, etc.
router.get("/", getAllProperties);
router.get("/:id", getPropertyById);
router.put("/:id", authMiddleware, ownerOnly, updateProperty);
router.delete("/:id",authMiddleware, ownerOnly, deleteProperty);

// ✅ Image Upload Route
router.post("/upload", uploadMiddleware.array("images", 10), (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "No files uploaded" });
        }
        const imageUrls = req.files.map((file) => file.path);
        res.status(200).json({ imageUrls });
    } catch (error) {
        console.error("Upload Error:", error);
        res.status(500).json({ message: "Image upload failed", error });
    }
});

export default router;