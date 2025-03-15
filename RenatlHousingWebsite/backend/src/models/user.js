import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "tenant", "owner", "user"], required: true },
  isVerified: { type: Boolean, default: false },  // OTP verification status
  otp: { type: String, default: "" },  // Store OTP temporarily for verification
  otpExpiration: { type: Date },  // Expiration time for OTP
  profileImage: { type: String, default: "" },  // ✅ Profile image field (URL of the uploaded image)
});

const User = mongoose.model("User", UserSchema);
export default User;
