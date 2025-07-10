import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import passport from "passport";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import twilio from "twilio";
dotenv.config();
import authRoutes from "./src/routes/authRoutes.js";
import googleAuthRoutes from "./src/routes/Oauth-google.js";
import propertyRoutes from "./src/routes/propertyRoute.js";
import profileRoutes from "./src/routes/profileRoutes.js";
import videoRoutes from "./src/routes/VideosRoutes.js";
import Viewdetails from "./src/routes/ViewdetailsRoutes.js";
import fraudRoutes from "./src/routes/fraudRoutes.js";
import AdminRegister from "./src/routes/adminRoutes.js";
import searchLogRoutes from "./src/routes/searchLogRoutes.js";
import connectDB from "./src/config/db.js";
import cloudinary from "./src/config/cloudinaryConfig.js";

// Initialize Express App
const app = express();

app.use(
  cors({
    origin: [
      "http://roommilega.in",
      "https://roommilega.in",
      "http://www.roommilega.in",
      "https://www.roommilega.in",
      ...(process.env.NODE_ENV === "development"
        ? ["http://localhost:5173", "http://localhost:3000"]
        : []),
    ],
    credentials: true,
  })
);
// Middleware
app.use(morgan("dev"));
app.use(express.json({ limit: "500mb" }));
app.use(express.urlencoded({ limit: "500mb", extended: true }));
app.use(cookieParser());


app.use(passport.initialize());

// Register routes
app.use("/api/admin", AdminRegister);
app.use("/api/auth", authRoutes);
app.use("/api/auth/google", googleAuthRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/view-details", Viewdetails);
app.use("/api/fraud", fraudRoutes);
app.use("/api/user", searchLogRoutes);

// Test endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Backend server is running",
    timestamp: new Date().toISOString(),
  });
});

// Twilio OTP Setup
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
let phoneOtpDatabase = {};

// 🔹 Route to Send OTP
app.post("/api/auth/send-phone-otp", async (req, res) => {
  const { phoneNumber } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000);
  phoneOtpDatabase[phoneNumber] = otp;

  try {
    const message = await client.messages.create({
      body: `Your OTP is: ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });

    console.log(" OTP Sent:", message.sid);
    res.json({ message: "OTP sent successfully!" });
  } catch (error) {
    console.error(" Error sending OTP:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

// 🔹 Route to Verify OTP
app.post("/api/auth/verify-phone-otp", (req, res) => {
  const { phoneNumber, otp } = req.body;

  if (phoneOtpDatabase[phoneNumber] === parseInt(otp)) {
    delete phoneOtpDatabase[phoneNumber];
    res.json({ message: " OTP Verified Successfully!" });
  } else {
    res.status(400).json({ message: "❌ Invalid OTP" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", async () => {
  console.log(`Server running on port ${PORT}`);
  try {
    await connectDB();
    await cloudinary.api.resources({ max_results: 1 });
    console.log("Cloudinary Connected");
  } catch (error) {
    console.log(error.message);
  }
});
