// models/propertyView.js
import mongoose from "mongoose";

const propertyViewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Property",
    required: true
  },
  viewedAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to ensure one view per user per property
propertyViewSchema.index({ user: 1, property: 1 }, { unique: true });

const PropertyView = mongoose.model("PropertyView", propertyViewSchema);

export default PropertyView;