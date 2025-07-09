import mongoose from "mongoose";

const savedPropertySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  property: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
  savedAt: { type: Date, default: Date.now },
});

export default mongoose.model("SavedProperty", savedPropertySchema);
