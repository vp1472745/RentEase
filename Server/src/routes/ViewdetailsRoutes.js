import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import Property from '../models/property.js';  // ✅ Corrected import
import PropertyView from '../models/viewDetails.js';

const router = express.Router();

// Track property view
router.post('/:id/view', authMiddleware, async (req, res) => {
  try {
    const propertyId = req.params.id;
    const userId = req.user._id;

    // Check if property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Record view if not already viewed
    const existingView = await PropertyView.findOne({ user: userId, property: propertyId });
    
    if (!existingView) {
      const view = new PropertyView({
        user: userId,
        property: propertyId,
        viewedAt: new Date()
      });
      await view.save();
      
      // Dispatch event to update frontend count
      const userViews = await PropertyView.countDocuments({ user: userId });
      req.app.emit('userActivity', { userId, viewCount: userViews });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error recording view:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get user's viewed properties
router.get('/user/views', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const views = await PropertyView.find({ user: userId })
      .populate('property')
      .sort({ viewedAt: -1 });

    res.json(views.map(view => view.property));
  } catch (error) {
    console.error("Error fetching views:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
