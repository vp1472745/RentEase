import express from "express";
import mongoose from "mongoose";
import {
  addProperty,
  getAllProperties,
  updateProperty,
  getOwnerProperties,
  deleteProperty,
  recordPropertyView,
  
} from "../controller/propertyController.js";
import { authMiddleware, ownerOnly } from "../middleware/authMiddleware.js";
import uploadMiddleware from "../middleware/multerMiddleware.js";
import Property from "../models/property.js";
import { readFile } from "fs/promises";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

// ✅ Google Gemini AI Initialization
const genAI = new GoogleGenerativeAI("AIzaSyBlKO3DyscHHPdEE2Sp9qYaXrGNUj7wRjs");

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

// ✅ AI Text Formatting Endpoint
router.post("/format-description", authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text || typeof text !== "string") {
      return res.status(400).json({ 
        error: "Invalid input: Please provide a text description" 
      });
    }

    const prompt = `Convert this informal property description into a well-structured, professional real estate listing in Hindi:
    
    Original: ${text}
    
    Formatted:
    - Convert abbreviations to full words
    - Fix grammar and punctuation
    - Organize into logical paragraphs
    - Highlight key features with bullet points
    - Keep language professional but friendly
    - Preserve all original information
    - Use proper real estate terminology`;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const formattedText = response.text();
    
    res.json({
      success: true,
      originalText: text,
      formattedText: formattedText
    });
  } catch (error) {
    console.error("AI formatting error:", error);
    res.status(500).json({ 
      error: "Failed to format description",
      details: error.message 
    });
  }
});



router.post('/properties/:id/view', async (req, res) => {
  console.log('API hit: /properties/:id/view');
  res.status(200).json({ message: 'View recorded' });
});


// Route to save a property
// router.post("/properties/save",  saveProperty);
// ✅ Owner's Properties
router.get('/owner/my-properties', authMiddleware, getOwnerProperties);

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

// ✅ Get Property By ID
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.json(property);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Update Property (Secure Version)
router.put("/:id", authMiddleware, ownerOnly, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Owner verification
    if (property.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        message: "Not authorized to update this property" 
      });
    }

    // Format data before update (optional but useful)
    if (req.body.bhkType) {
      req.body.bhkType = Array.isArray(req.body.bhkType)
        ? req.body.bhkType.map(item => item.toUpperCase())
        : [req.body.bhkType.toUpperCase()];
    }

    if (req.body.propertyType) {
      req.body.propertyType = Array.isArray(req.body.propertyType)
        ? req.body.propertyType.map(item => item.toLowerCase())
        : [req.body.propertyType.toLowerCase()];
    }

    if (req.body.furnishType) {
      req.body.furnishType = Array.isArray(req.body.furnishType)
        ? req.body.furnishType.map(item => item.toLowerCase())
        : [req.body.furnishType.toLowerCase()];
    }

    if (req.body.facilities) {
      req.body.facilities = Array.isArray(req.body.facilities)
        ? req.body.facilities.map(item => item.toLowerCase())
        : [req.body.facilities.toLowerCase()];
    }

    // Update property without strict validation
    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({ 
      success: true,
      message: "Property updated successfully",
      property: updatedProperty 
    });

  } catch (error) {
    console.error("Update Property Error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to update property",
      error: error.message 
    });
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

// ✅ Video Upload Route
router.post("/api/properties/videos", async (req, res) => {
  try {
    const { propertyId, videos } = req.body;

    if (!propertyId || !videos || !videos.length) {
      return res.status(400).json({ error: "Property ID and videos are required" });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    property.videos.push(...videos);
    await property.save();

    res.status(200).json({ 
      message: "Videos added successfully", 
      videos: property.videos 
    });
  } catch (error) {
    console.error("Error saving videos:", error);
    res.status(500).json({ error: "Server error" });
  }
});



export default router;