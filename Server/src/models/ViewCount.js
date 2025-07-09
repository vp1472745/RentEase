import mongoose from "mongoose";

const propertySchema = new mongoose.Schema({
  // ... your other fields,
  viewCount: {
    type: Number,
    default: 0,
  },
  // ...
}, { timestamps: true });

export default mongoose.model("Property", propertySchema);
