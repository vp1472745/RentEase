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
import { readFile } from "fs/promises";

const router = express.Router();

// ✅ JSON से Popular Localities लोड करें
let popularLocalitiesData = {};
try {
  const data = await readFile(new URL("../data/popularLocalities.json", import.meta.url));
  popularLocalitiesData = JSON.parse(data);
  console.log("✅ Popular Localities JSON Loaded");
} catch (error) {
  console.error("❌ Error loading JSON:", error);
}

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

    // ✅ Popular Locality Check in JSON + Property Match in DB
    if (popularLocality) {
      const matchedLocalities = Object.values(popularLocalitiesData).flat(); // सभी शहरों की localities को flatten करो
      if (matchedLocalities.includes(popularLocality)) {
        conditions.push({ popularLocality: new RegExp(`^${popularLocality}$`, "i") });
      }
    }

    if (conditions.length > 0) {
      filter.$and = conditions; // ✅ `AND` से ensure करो कि सही properties ही आएं।
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


// ✅ Get Localities by City (NEW ROUTE)
// router.get("/localities", async (req, res) => {
//   try {
//     const { city } = req.query;

//     if (!city) {
//       return res.status(400).json({ message: "City is required" });
//     }

//     const properties = await Property.find({ city: new RegExp(`^${city}$`, "i") });

//     if (!properties.length) {
//       return res.status(404).json({ message: "No localities found for this city" });
//     }

//     // ✅ Get Unique Localities
//     const uniqueLocalities = [...new Set(properties.map(p => p.popularLocality))];

//     res.json(uniqueLocalities);
//   } catch (error) {
//     console.error("❌ Localities Fetch Error:", error);
//     res.status(500).json({ message: "Server Error" });
//   }
// });

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
