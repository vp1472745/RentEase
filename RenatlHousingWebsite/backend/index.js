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
import Video from "./src/models/videosModel.js"; // ✅ Import Video Model
import { GoogleGenerativeAI } from "@google/generative-ai";

import authRoutes from "./src/routes/authRoutes.js";
import googleAuthRoutes from "./src/routes/Oauth-google.js";
import propertyRoutes from "./src/routes/propertyRoute.js";
import profileRoutes from "./src/routes/profileRoutes.js";
import videoRoutes from "./src/routes/VideosRoutes.js";
import Viewdetails from "./src/routes/ViewdetailsRoutes.js"
import fraudRoutes from './src/routes/fraudRoutes.js';
import  FraudModel from "./src/models/fraud.js"; // ✅ Ensure Correct Path
dotenv.config();
mongoose.set("debug", true); // ✅ Yeh query logs print karega
// ✅ Passport Configuration
import "./src/config/passport.js";

// ✅ Initialize Express App
const app = express();

// ✅ Middleware
app.use(morgan("dev"));
app.use(express.json({ limit: "500mb" }));
app.use(express.urlencoded({ limit: "500mb", extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(passport.initialize());

// ✅ Timeout Handling
const UPLOAD_TIMEOUT = 10 * 60 * 1000; // 10 minutes
app.use((req, res, next) => {
  req.setTimeout(UPLOAD_TIMEOUT);
  res.setTimeout(UPLOAD_TIMEOUT);
  next();
});

// ✅ Serve Uploaded Files as Static Files
app.use("/uploads", express.static("uploads"));
app.use("/uploads/videos", express.static("uploads/videos"));

// ✅ MongoDB Connection (Fixed Here)
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/RentEaseDB";
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });

// ✅ Twilio OTP Setup
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
let phoneOtpDatabase = {};

// ✅ Google Generative AI Setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 🔹 Gemini AI Text Generation Route
app.post("/api/generate-text", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Prompt is required" });

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ generatedText: text });
  } catch (error) {
    console.error("AI Error:", error);
    res
      .status(500)
      .json({ error: "AI generation failed", details: error.message });
  }
});

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
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/";
    if (!fs.existsSync(uploadPath))
      fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const imageUpload = multer({ storage: imageStorage });

// 🔹 Route to Handle Image Uploads
app.post(
  "/api/properties/upload",
  imageUpload.array("images", 5),
  (req, res) => {
    if (!req.files || req.files.length === 0)
      return res.status(400).json({ message: "❌ No files uploaded" });

    const imageUrls = req.files.map(
      (file) => `http://localhost:5000/uploads/${file.filename}`
    );
    res.json({ imageUrls });
  }
);

// ✅ Multer Storage Setup for Video Uploads
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/videos/";
    if (!fs.existsSync(uploadPath))
      fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const videoUpload = multer({
  storage: videoStorage,
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      "video/mp4",
      "video/mkv",
      "video/webm",
      "video/avi",
    ];
    if (allowedMimeTypes.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only video files are allowed!"), false);
  },
});



// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/auth/google", googleAuthRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/videos", videoRoutes);
app.post("/api/properties/:propertyId/view", async (req, res) => {
  try {
      const { propertyId } = req.params;
      if (!propertyId) {
          return res.status(400).json({ error: "Property ID is required" });
      }

      const property = await PropertyModel.findById(propertyId);
      if (!property) {
          return res.status(404).json({ error: "Property not found" });
      }

      // Example: Increase view count
      property.views = (property.views || 0) + 1;
      await property.save();

      res.status(200).json({ message: "Property view recorded", views: property.views });
  } catch (error) {
      console.error("Error updating property views:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/report-fraud", async (req, res) => {
  try {
    console.log("Received Data:", req.body); // ✅ Debugging ke liye

    const { name, contact, email, category, details } = req.body;

    if (!name || !contact || !email || !category) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newFraudReport = new FraudModel({
      name,
      contact,
      email,
      category,
      details,
    });

    console.log("Saving to DB:", newFraudReport); // ✅ Yeh check karega ki model instance sahi hai ya nahi

    await newFraudReport.save(); // ✅ MongoDB me save karega

    console.log("✅ Data saved successfully!"); // ✅ Debugging ke liye
    res.status(201).json({ message: "Report saved successfully!" });

  } catch (error) {
    console.error("❌ Error saving report:", error); // ✅ Agar error aaya to yeh print karega
    res.status(500).json({ error: "Internal Server Error" });
  }
});




// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));