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
import { authMiddleware, ownerOnly ,adminOnly, ownerOrAdmin} from "../middleware/authMiddleware.js";
import uploadMiddleware from "../middleware/multerMiddleware.js";
import Property from "../models/property.js";
import { readFile } from "fs/promises";
import { GoogleGenerativeAI } from "@google/generative-ai";
import SaveProperty from "../models/SaveProperty.js";
import User from "../models/user.js";
import SearchLog from "../models/searchLog.js";

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



// router.post('/properties/:id/view', async (req, res) => {
//   console.log('API hit: /properties/:id/view');
//   res.status(200).json({ message: 'View recorded' });
// });


// Route to save a property
// router.post("/properties/save",  saveProperty);
// ✅ Owner's Properties
router.get('/owner/my-properties', authMiddleware, getOwnerProperties);

// ✅ Add New Property (Only Owner)
router.post("/add", authMiddleware, ownerOnly, addProperty);

// ✅ Search Properties Route
router.get("/search", async (req, res) => {
  try {
    const { city, propertyType, address, popularLocality, locality } = req.query;
    let filter = {};

    let orConditions = [];
    // Collect all search values from locality, address, and popularLocality
    const searchValues = [locality, address, popularLocality].filter(Boolean);
    searchValues.forEach(val => {
      orConditions.push({ city: new RegExp(val, "i") });
      orConditions.push({ address: new RegExp(val, "i") });
      orConditions.push({ popularLocality: new RegExp(val, "i") });
    });

    if (city) filter.city = new RegExp(city, "i");
    if (propertyType) filter.propertyType = new RegExp(propertyType, "i");

    if (orConditions.length > 0) {
      filter.$or = orConditions;
    }

    console.log("🔍 Applied Filters:", filter);

    const properties = await Property.find(filter);

    if (!properties.length) {
      return res.status(404).json({ message: "No properties found with given filters" });
    }

    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// ✅ Get All Properties
router.get("/", getAllProperties);

// Get user's viewed properties - MUST be before /:id route
router.get('/viewed', authMiddleware, async (req, res) => {
  try {
    // Get seen properties from query parameter
    let seenPropertyIds = [];
    try {
      if (req.query.ids) {
        seenPropertyIds = JSON.parse(req.query.ids);
        if (!Array.isArray(seenPropertyIds)) {
          console.warn("Invalid seen properties format:", req.query.ids);
          return res.status(400).json({ 
            message: 'Invalid seen properties data format' 
          });
        }
      }
    } catch (e) {
      console.error("Error parsing seen properties:", e);
      return res.status(400).json({ 
        message: 'Invalid seen properties data format' 
      });
    }

    // Fetch properties that exist and are active
    const properties = await Property.find({
      _id: { $in: seenPropertyIds },
      isActive: true
    }).select('-__v').populate('owner', 'name email phone');

    // Sort properties to match the order of seenPropertyIds
    const sortedProperties = seenPropertyIds
      .map(id => properties.find(p => p._id.toString() === id))
      .filter(Boolean); // Remove any null/undefined entries

    res.json(sortedProperties);
  } catch (error) {
    console.error('❌ Error fetching viewed properties:', error);
    res.status(500).json({ 
      message: 'Failed to fetch viewed properties',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ✅ Get Property By ID - MUST be after /viewed route
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

// ✅ Update Property (Owner or Admin)
router.put("/:id", authMiddleware, ownerOrAdmin, async (req, res) => {
  try {
    console.log('🔍 Update Property Request:', {
      propertyId: req.params.id,
      userRole: req.user.role,
      requestBody: req.body
    });

    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // If user is owner, verify they own the property
    if (req.user.role.toLowerCase() === "owner") {
      if (property.owner.toString() !== req.user._id.toString()) {
        return res.status(403).json({ 
          message: "Not authorized to update this property" 
        });
      }
    }

    // Handle date formatting for availableFrom
    if (req.body.availableFrom) {
      // Convert string date to proper Date object
      const dateValue = new Date(req.body.availableFrom);
      if (isNaN(dateValue.getTime())) {
        return res.status(400).json({ 
          message: "Invalid date format for availableFrom" 
        });
      }
      req.body.availableFrom = dateValue;
      console.log('📅 Formatted availableFrom date:', req.body.availableFrom);
    }

    // Convert string numbers to actual numbers
    const numericFields = ['monthlyRent', 'securityDeposit', 'maintenanceCharges', 'rentalDurationMonths', 'area', 'floorNumber', 'totalFloors', 'ageOfProperty'];
    numericFields.forEach(field => {
      if (req.body[field] !== undefined && req.body[field] !== '') {
        const numValue = Number(req.body[field]);
        if (!isNaN(numValue)) {
          req.body[field] = numValue;
        }
      }
    });

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

    console.log('🔧 Processed update data:', req.body);

    // Update property with validation
    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    console.log('✅ Property updated successfully');

    res.status(200).json({ 
      success: true,
      message: "Property updated successfully",
      property: updatedProperty 
    });

  } catch (error) {
    console.error("❌ Update Property Error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to update property",
      error: error.message 
    });
  }
});

// ✅ Delete Property (Owner or Admin)
router.delete("/:id", authMiddleware, ownerOrAdmin, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // If user is owner, verify they own the property
    if (req.user.role.toLowerCase() === "owner") {
      if (property.owner.toString() !== req.user._id.toString()) {
        return res.status(403).json({ 
          message: "Not authorized to delete this property" 
        });
      }
    }

    // Admin can delete any property, owner can only delete their own
    await Property.findByIdAndDelete(req.params.id);
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

// ✅ Save Property
router.post("/save/:propertyId", authMiddleware, async (req, res) => {
  try {
    const { propertyId } = req.params;
    const userId = req.user._id;

    // Check if property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Check if already saved
    const existingSave = await SaveProperty.findOne({ user: userId, property: propertyId });
    if (existingSave) {
      return res.status(400).json({ message: "Property already saved" });
    }

    // Save property
    const savedProperty = new SaveProperty({
      user: userId,
      property: propertyId
    });

    await savedProperty.save();

    // Update user's savedProperties array
    await User.findByIdAndUpdate(userId, {
      $addToSet: { savedProperties: propertyId }
    });

    res.status(201).json({ 
      success: true, 
      message: "Property saved successfully" 
    });
  } catch (error) {
    console.error("❌ Error saving property:", error);
    res.status(500).json({ 
      message: "Failed to save property",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ✅ Unsave Property
router.delete("/save/:propertyId", authMiddleware, async (req, res) => {
  try {
    const { propertyId } = req.params;
    const userId = req.user._id;

    // Remove from SaveProperty collection
    const result = await SaveProperty.findOneAndDelete({ 
      user: userId, 
      property: propertyId 
    });

    if (!result) {
      return res.status(404).json({ message: "Saved property not found" });
    }

    // Remove from user's savedProperties array
    await User.findByIdAndUpdate(userId, {
      $pull: { savedProperties: propertyId }
    });

    res.status(200).json({ 
      success: true, 
      message: "Property unsaved successfully" 
    });
  } catch (error) {
    console.error("❌ Error unsaving property:", error);
    res.status(500).json({ 
      message: "Failed to unsave property",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ✅ Get User's Saved Properties
router.get("/saved", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;

    // Get saved properties with populated property details
    const savedProperties = await SaveProperty.find({ user: userId })
      .populate({
        path: 'property',
        select: '-__v',
        populate: {
          path: 'owner',
          select: 'name email phone'
        }
      })
      .sort({ savedAt: -1 });

    // Extract property data
    const properties = savedProperties
      .map(sp => sp.property)
      .filter(Boolean); // Remove any null properties

    res.json(properties);
  } catch (error) {
    console.error("❌ Error fetching saved properties:", error);
    res.status(500).json({ 
      message: "Failed to fetch saved properties",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ✅ Check if property is saved by user
router.get("/saved/:propertyId", authMiddleware, async (req, res) => {
  try {
    const { propertyId } = req.params;
    const userId = req.user._id;

    const savedProperty = await SaveProperty.findOne({ 
      user: userId, 
      property: propertyId 
    });

    res.json({ 
      isSaved: !!savedProperty 
    });
  } catch (error) {
    console.error("❌ Error checking saved property:", error);
    res.status(500).json({ 
      message: "Failed to check saved property",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

router.post('/search-log', authMiddleware, async (req, res) => {
  try {
    const { searchTerm, userType, device } = req.body;
    let userId = null;
    if (req.user && req.user._id) userId = req.user._id;
    const log = new SearchLog({
      userId,
      userType,
      searchTerm,
      device,
      timestamp: new Date()
    });
    await log.save();
    res.status(201).json({ message: 'Search logged' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to log search', error: error.message });
  }
});

export default router;