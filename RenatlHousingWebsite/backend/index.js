import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import passport from "passport";
import cookieParser from "cookie-parser"; // ✅ Import cookie-parser
import morgan from "morgan"; // ✅ Import Morgan
import authRoutes from "./src/routes/authRoutes.js";
import googleAuthRoutes from "./src/routes/Oauth-google.js";
import propertyRoutes from "./src/routes/propertyRoute.js";
import twilio from "twilio"; // ✅ Import Twilio
import profileRouter from './src/routes/profileRoutes.js'

dotenv.config();

// Import Passport Configuration
import "./src/config/passport.js";


// Initialize Express App
const app = express();

// Middleware Configuration
app.use(morgan("dev")); // ✅ Apply Morgan for logging
app.use(express.json());
app.use(cookieParser()); // ✅ Enable Cookie Parsing
app.use(
  cors({
    origin: "http://localhost:5173", // ✅ Frontend URL
    credentials: true, // ✅ Allow Cookies
  })
);
app.use(passport.initialize());

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(" MongoDB Connected Successfully");
  } catch (err) {
    console.error(" MongoDB Connection Error:", err.message);
    process.exit(1);
  }
};

connectDB();

// Twilio Client Setup
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

let phoneOtpDatabase = {}; // Store OTPs temporarily in-memory

// Route to send OTP to phone number
app.post("/api/auth/send-phone-otp", async (req, res) => {
  const { phoneNumber } = req.body;

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000);

  // Store OTP in memory
  phoneOtpDatabase[phoneNumber] = otp;

  try {
    // Send OTP via SMS (Twilio)
    const message = await client.messages.create({
      body: `Your OTP is: ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER, // Your Twilio phone number
      to: phoneNumber,
    });

    console.log("OTP sent:", message.sid);
    res.json({ message: "OTP sent successfully!" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

// Route to verify OTP
app.post("/api/auth/verify-phone-otp", (req, res) => {
  const { phoneNumber, otp } = req.body;

  // Check OTP from the in-memory database
  if (phoneOtpDatabase[phoneNumber] === parseInt(otp)) {
    delete phoneOtpDatabase[phoneNumber]; // Clear OTP after verification
    res.json({ message: "OTP verified successfully!" });
  } else {
    res.status(400).json({ message: "Invalid OTP" });
  }
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/auth/google", googleAuthRoutes); // Google Auth on Separate Route
app.use("/api/properties", propertyRoutes); // ✅ Property Routes
// Add this line after other routes
app.use("/api/profile",profileRouter)
app.get("/", (req, res) => {
  res.send("🏠 RentEase Backend Running...");
});


app.post("/api/auth/signup", (req, res) => {
  console.log("Request Received:", req.body);
  res.json({ msg: "OTP sent!" });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
