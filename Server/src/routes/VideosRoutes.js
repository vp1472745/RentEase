import { EventEmitter } from 'events';
EventEmitter.defaultMaxListeners = 15;

import express from "express";
import { authMiddleware, ownerOnly } from "../middleware/authMiddleware.js";
import Property from "../models/property.js";

const router = express.Router();

// Helper function to validate URLs
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;  
  }
}

// Save Cloudinary video URL to property
router.post('/api/properties/save-video', authMiddleware, async (req, res) => {
  try {
    const { propertyId, videoUrl } = req.body;

    // Input validation
    if (!propertyId || !videoUrl) {
      return res.status(400).json({ 
        success: false,
        error: "propertyId and videoUrl are required" 
      });
    }

    if (!isValidUrl(videoUrl)) {
      return res.status(400).json({
        success: false,
        error: "Invalid video URL format"
      });
    }

    // Update property with new video
    const property = await Property.findByIdAndUpdate(
      propertyId,
      { 
        $push: { 
          videos: { 
            url: videoUrl, 
            uploadedAt: new Date() 
          } 
        } 
      },
      { new: true }
    );

    if (!property) {
      return res.status(404).json({
        success: false,
        error: "Property not found"
      });
    }

    res.status(200).json({ 
      success: true, 
      property 
    });

  } catch (error) {
    console.error("Error saving video:", error);
    res.status(500).json({ 
      success: false,
      error: "Failed to save video" 
    });
  }
});

export default router;