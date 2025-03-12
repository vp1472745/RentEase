import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Linking to User model
    required: true, // Ensure userId is always provided
  },
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  expiration: {
    type: Date,
    required: true,
  },
});

const OTP = mongoose.model("OTP", otpSchema);
export default OTP;
