import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import passport from "passport";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import twilio from "twilio";
import multer from "multer";
import path from "path";
import fs from "fs";

import authRoutes from "./src/routes/authRoutes.js";
import googleAuthRoutes from "./src/routes/Oauth-google.js";
import propertyRoutes from "./src/routes/propertyRoute.js";
import profileRoutes from "./src/routes/profileRoutes.js";

dotenv.config();

// ✅ Passport Configuration
import "./src/config/passport.js";

// ✅ Initialize Express App
const app = express();

// ✅ Middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(passport.initialize());
app.use(express.urlencoded({ extended: true }));

// ✅ Serve Uploaded Images as Static Files
app.use("/uploads", express.static("uploads"));

// ✅ MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("🚀 MongoDB Connected Successfully");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  }
};

connectDB();

// ✅ Twilio OTP Setup
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
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

    console.log("📨 OTP Sent:", message.sid);
    res.json({ message: "OTP sent successfully!" });
  } catch (error) {
    console.error("❌ Error sending OTP:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

// 🔹 Route to Verify OTP
app.post("/api/auth/verify-phone-otp", (req, res) => {
  const { phoneNumber, otp } = req.body;

  if (phoneOtpDatabase[phoneNumber] === parseInt(otp)) {
    delete phoneOtpDatabase[phoneNumber];
    res.json({ message: "✅ OTP Verified Successfully!" });
  } else {
    res.status(400).json({ message: "❌ Invalid OTP" });
  }
});

// ✅ Multer Storage Setup for Image Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// 🔹 Route to Handle Image Uploads
app.post("/api/properties/upload", upload.array("images", 5), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "❌ No files uploaded" });
  }

  // ✅ Generate Image URLs
  const imageUrls = req.files.map((file) => `http://localhost:5000/uploads/${file.filename}`);
  res.json({ imageUrls });
});

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/auth/google", googleAuthRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/profile", profileRoutes);

// ✅ Default Route
app.get("/", (req, res) => {
  res.send("🏠 RentEase Backend Running...");
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
