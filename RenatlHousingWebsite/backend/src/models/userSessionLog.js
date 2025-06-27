import mongoose from "mongoose";
const UserSessionLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  userType: String,
  eventType: String, // "login" or "logout"
  device: String,
  timestamp: { type: Date, default: Date.now }
});
const UserSessionLog = mongoose.model("UserSessionLog", UserSessionLogSchema);
export default UserSessionLog; 