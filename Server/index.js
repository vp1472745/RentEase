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
      "http://localhost:5173",
      "http://roommilega.in",
      "https://roommilega.in",
      "http://www.roommilega.in",
      "https://www.roommilega.in",
    ],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
// Middleware
app.use(morgan("dev"));
app.use(express.json({ limit: "500mb" }));
app.use(express.urlencoded({ limit: "500mb", extended: true }));
app.use(cookieParser());

//  Timeout Handling
const UPLOAD_TIMEOUT = 10 * 60 * 1000; // 10 minutes
app.use((req, res, next) => {
  req.setTimeout(UPLOAD_TIMEOUT);
  res.setTimeout(UPLOAD_TIMEOUT);
  next();
});

//UNCOMMENT if not working
// Serve Uploaded Files as Static Files
app.use("/uploads", express.static("uploads"));
app.use("/uploads/videos", express.static("uploads/videos"));

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

// 🔹 Route to Handle Image Uploads
// app.post(
//   "/api/properties/upload",
//   imageUpload.array("images", 5),
//   (req, res) => {
//     if (!req.files || req.files.length === 0)
//       return res.status(400).json({ message: "❌ No files uploaded" });

//     const imageUrls = req.files.map(
//       (file) => `http://localhost:5000/uploads/${file.filename}`
//     );
//     res.json({ imageUrls });
//   }
// );

// Initialize server only after DB connection
const startServer = async () => {
  try {
    // Load environment variables
    // Connect to MongoDB first

    // Initialize passport
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
    app.get("/api/test", (req, res) => {
      res.status(200).json({
        status: "success",
        message: "Backend server is running",
        timestamp: new Date().toISOString(),
      });
    });

    // Database test endpoint
    app.get("/api/test-db", async (req, res) => {
      try {
        if (mongoose.connection.readyState !== 1) {
          throw new Error("Database not connected");
        }

        const adminCount = await mongoose.connection.db
          .collection("admins")
          .countDocuments();

        res.status(200).json({
          status: "success",
          message: "Database connection verified",
          database: {
            state: "connected",
            adminCount,
            host: mongoose.connection.host,
          },
        });
      } catch (error) {
        res.status(500).json({
          status: "error",
          message: "Database connection test failed",
          error: error.message,
        });
      }
    });

    // Test Cloudinary configuration route
    app.get("/api/test-cloudinary", async (req, res) => {
      try {
        const result = await cloudinary.api.resources({ max_results: 1 });
        res.json({ success: true, result });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
    });

    // Start server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, async () => {
      console.log(`Server running on port ${PORT}`);
      try {
        await connectDB();
        await cloudinary.api.resources({ max_results: 1 });
        console.log("Cloudinary Connected");
      } catch (error) {
        console.log(error.message);
      }
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Start the server
startServer();
