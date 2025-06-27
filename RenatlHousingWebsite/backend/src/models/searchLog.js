import mongoose from "mongoose";

const searchLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: { type: String, default: "Guest" },
  email: { type: String, default: "Guest" },
  role: { type: String, enum: ["tenant", "owner", "user", "guest"], default: "guest" },
  searchTerm: { type: String },
  device: { type: String, default: "Unknown Device" },
  timestamp: { type: Date, default: Date.now },
}, {
  timestamps: true
});

export default mongoose.model("SearchLog", searchLogSchema);
