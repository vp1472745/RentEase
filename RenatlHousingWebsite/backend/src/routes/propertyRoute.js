import express from "express";
import {
    addProperty,
    getAllProperties,
    getPropertyById,
    updateProperty,
    deleteProperty
} from "../controller/propertyController.js";
import { authMiddleware, ownerOnly } from "../middleware/authMiddleware.js";
import uploadMiddleware from "../middleware/multerMiddleware.js";
import Property from "../models/property.js";

const router = express.Router();

// ✅ Add New Property (Only Owner)
router.post("/add", authMiddleware, ownerOnly, addProperty);

// ✅ Search Properties (Multiple Filters)
router.get("/search", async (req, res) => { 
  try {
    const { city, propertyType } = req.query;

    let filter = {};
    if (city) filter.city = new RegExp(`^${city}$`, "i"); // Exact match, case-insensitive
    if (propertyType) filter.propertyType = new RegExp(propertyType, "i");

    console.log("🔍 Filter Object:", filter);

    const properties = await Property.find(filter);
    console.log("📢 Found Properties:", properties.length);
    
    if (locality) {
      const words = locality.split(" "); // Locality ko words me split karo
      const localityRegex = new RegExp(words.join("|"), "i"); // Match any word
      filter.address = localityRegex;
    }
    if (!properties.length) {
      return res.status(404).json({ message: "No properties found for this city" });
    }

    res.json(properties);
  } catch (error) {
    console.error("❌ API Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

// ✅ Get Localities by City (NEW ROUTE)
router.get("/localities", async (req, res) => {
  try {
    const { city } = req.query;
    console.log(city)
    if (!city) {
      return res.status(400).json({ message: "City is required" });
    }

    const properties = await Property.find({ city: new RegExp(`^${city}$`, "i") });

    if (!properties.length) {
      return res.status(404).json({ message: "No localities found for this city" });
    }

    // ✅ Get Unique Localities
    const uniqueLocalities = [...new Set(properties.map(p => p.address.split(",")[0]))];

    res.json(uniqueLocalities);
  } catch (error) {
    console.error("❌ Localities Fetch Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// ✅ Get All Properties
router.get("/", getAllProperties);

// ✅ Get Property By ID
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
