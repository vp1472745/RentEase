import express from "express";
import {
    addProperty,
    getAllProperties,
    getPropertyById,
    updateProperty,
    deleteProperty
} from "../controller/propertyController.js";
import { authMiddleware, ownerOnly } from "../middleware/authMiddleware.js";
import uploadMiddleware from "../middleware/multerMiddleware.js"; // ✅ Ensure multer middleware is imported
import Property from "../models/property.js";

const router = express.Router();

// ✅ Add New Property (Only Owner)
router.post("/add", authMiddleware, ownerOnly, addProperty);

// ✅ Search Properties (Fix)

router.get("/search", async (req, res) => {
    try {
      // Add Cache-Control header to disable caching
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  
      let query = {};
  
      // If city is provided, filter based on city
      if (req.query.city) {
        query.city = { $regex: req.query.city, $options: "i" }; // case-insensitive match
      }
  
      // If locality is provided, filter based on locality (address field in database)
      if (req.query.locality) {
        query.address = { $regex: req.query.locality, $options: "i" }; // case-insensitive match
      }
  
      // If propertyType is provided, filter based on propertyType
      if (req.query.propertyType) {
        query.propertyType = { $regex: req.query.propertyType, $options: "i" }; // case-insensitive match
      }
  
      console.log("🔍 Query Params for Filtering:", query);
  
      // Fetch filtered properties from the database
      const properties = await Property.find(query);
  
      if (!properties.length) {
        return res.status(404).json({ message: "No matching properties found" });
      }
  
      res.json(properties); // Send the filtered properties as a response
    } catch (error) {
      console.error("❌ Error fetching properties:", error);
      res.status(500).json({ error: "Server Error" });
    }
  });
  


// ✅ Get All Properties
router.get("/", getAllProperties);

// ✅ Get Property By ID (Fix _id Conflict)
router.get("/:id", async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) {
            return res.status(404).json({ message: "Property not found" });
        }
        res.json(property);
    } catch (error) {
        console.error("❌ Get Property by ID Error:", error);
        res.status(500).json({ error: "Invalid property ID" });
    }
});

// ✅ Update & Delete Property (Only Owner)
router.put("/:id", authMiddleware, ownerOnly, updateProperty);
router.delete("/:id", authMiddleware, ownerOnly, deleteProperty);

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
