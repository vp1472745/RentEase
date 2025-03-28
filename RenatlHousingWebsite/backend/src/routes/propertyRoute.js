import express from "express";
import mongoose from "mongoose";
import {
  addProperty,
  getAllProperties,
  updateProperty,
  deleteProperty,
} from "../controller/propertyController.js";
import { authMiddleware, ownerOnly } from "../middleware/authMiddleware.js";
import uploadMiddleware from "../middleware/multerMiddleware.js";
import Property from "../models/property.js";
import { readFile } from "fs/promises";

const router = express.Router();

// ✅ Load Popular Localities JSON
let popularLocalitiesData = {};
(async () => {
  try {
    const data = await readFile(new URL("../data/popularLocalities.json", import.meta.url));
    popularLocalitiesData = JSON.parse(data);
    console.log("✅ Popular Localities JSON Loaded");
  } catch (error) {
    console.error("❌ Error loading JSON:", error);
  }
})();

// ✅ Add New Property (Only Owner)
router.post("/add", authMiddleware, ownerOnly, addProperty);

// ✅ Search Properties Route
router.get("/search", async (req, res) => {
  try {
    const { city, propertyType, locality, address, popularLocality } = req.query;
    let filter = {};

    if (city) filter.city = new RegExp(`^${city}$`, "i");
    if (propertyType) filter.propertyType = new RegExp(propertyType, "i");

    let conditions = [];
    if (locality) conditions.push({ address: new RegExp(locality, "i") });
    if (address) conditions.push({ address: new RegExp(address, "i") });

    // ✅ Popular Locality Check
    if (popularLocality) {
      const matchedLocalities = Object.values(popularLocalitiesData).flat();
      if (matchedLocalities.includes(popularLocality)) {
        conditions.push({ popularLocality: new RegExp(`^${popularLocality}$`, "i") });
      }
    }

    if (conditions.length > 0) {
      filter.$and = conditions;
    }

    console.log("🔍 Applied Filters:", filter);

    const properties = await Property.find(filter);

    if (!properties.length) {
      return res.status(404).json({ message: "No properties found with given filters" });
    }

    res.json(properties);
  } catch (error) {
    console.error("❌ API Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

// ✅ Get All Properties
router.get("/", getAllProperties);

// ✅ Get Property By ID (Improved Error Handling)
router.get("/:id", async (req, res) => {
  try {
    // Validate ID
    if (!req.params.id || req.params.id === "undefined") {
      return res.status(400).json({ message: "Property ID is required" });
    }

    // Check if it's a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid property ID format" });
    }

    // Fetch Property
    const property = await Property.findById(req.params.id).populate("owner", "name email phone");

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.json(property);
  } catch (error) {
    console.error("❌ Get Property by ID Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// ✅ Update Property (Only Owner)
router.put("/:id", authMiddleware, ownerOnly, async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.json(property);
  } catch (error) {
    console.error("❌ Update Property Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// ✅ Delete Property (Only Owner)
router.delete("/:id", authMiddleware, ownerOnly, async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.json({ message: "Property deleted successfully" });
  } catch (error) {
    console.error("❌ Delete Property Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// ✅ Image Upload Route
router.post("/upload", uploadMiddleware.array("images", 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const imageUrls = req.files.map((file) => file.path);
    res.status(200).json({ imageUrls });
  } catch (error) {
    console.error("❌ Upload Error:", error);
    res.status(500).json({ message: "Image upload failed", error });
  }
});

export default router;
