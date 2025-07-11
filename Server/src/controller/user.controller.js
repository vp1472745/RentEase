import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { randomBytes } from "crypto";
import OTP from "../models/otpModels.js";
import UserSessionLog from "../models/userSessionLog.js";

dotenv.config();

// ✅ Nodemailer Configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ OTP Generate Function
const generateOTP = () => randomBytes(3).toString("hex").toUpperCase();

// ✅ Send OTP Email Function
export const sendOTPEmail = async (email, otp) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Email Verification OTP",
      html: `<p>Your OTP is: <strong>${otp}</strong></p>
      click the link
      http://localhost:5173/varifi/${otp}>`,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending OTP email:", error.message);
  }
};

// ✅ Resend OTP Function
export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ msg: "Email is required" });
    const otp = generateOTP();
    await OTP.findOneAndUpdate(
      { email },
      { otp, expiration: new Date(Date.now() + 15 * 60 * 1000) },
      { upsert: true }
    );
    await sendOTPEmail(email, otp);
    res.status(200).json({ msg: "OTP resent successfully." });
  } catch (err) {
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
};

// ✅ Signup Function
export const signup = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ msg: "Email is required" });
    if (await User.findOne({ email }))
      return res.status(400).json({ msg: "User already exists" });

    const otp = generateOTP();
    await OTP.findOneAndUpdate(
      { email },
      { otp, expiration: new Date(Date.now() + 15 * 60 * 1000) },
      { upsert: true }
    );
    await sendOTPEmail(email, otp);
    res.status(201).json({ msg: "OTP sent. Verify your email." });
  } catch (err) {
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
};

// ✅ Verify OTP Function
export const verifyOTP = async (req, res) => {
  try {
    const { otp, email, name, password, phone, role } = req.body;
    if (!otp || !email || !name || !password || !phone || !role)
      return res.status(400).json({ msg: "All fields are required" });

    const otpEntry = await OTP.findOne({ email });
    if (!otpEntry) return res.status(400).json({ msg: "OTP not found" });
    if (otpEntry.otp !== otp)
      return res.status(400).json({ msg: "Invalid OTP" });
    if (new Date(otpEntry.expiration) < new Date())
      return res.status(400).json({ msg: "OTP expired" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      role,
      isVerified: true,
    });
    await user.save();
    await OTP.deleteOne({ email });

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
       { expiresIn: "7d" }
    );
    res.json({ token, msg: "Account verified & created successfully", user });
  } catch (err) {
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
};

// ✅ User Login Function
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ msg: "Email and password are required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ msg: "Invalid email or password" });
    console.log(user);
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(isMatch);
    if (!isMatch)
      return res.status(401).json({ msg: "Invalid email or password" });

    if (!user.isVerified)
      return res.status(403).json({ msg: "Please verify your email first" });

    const token = jwt.sign(
      { userId: user._id, role: user.role, profileImage: user.profileImage },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.cookie("auth_token", token, { httpOnly: true, sameSite: "strict" });
    res.json({
      msg: "Login successful",
      token,
      user: { name: user.name, email: user.email, role: user.role },
    });

    // Log login event
    try {
      await new UserSessionLog({
        userId: user._id,
        userType: user.role,
        eventType: "login",
        device: req.headers["user-agent"],
        timestamp: new Date(),
      }).save();
    } catch (logErr) {
      console.error("Failed to log login event:", logErr);
    }
  } catch (error) {
    console.error("Server Error:", error); // Log the error to server console
    res.status(500).json({ msg: "Server Error", error: error.message });
  }
};

// ✅ Forgot Password Function (Send OTP for Reset Password)
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ msg: "Email is required" });
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });
    const otp = generateOTP();
    await OTP.findOneAndUpdate(
      { email },
      { otp, expiration: new Date(Date.now() + 15 * 60 * 1000) },
      { upsert: true }
    );
    await sendOTPEmail(email, otp);
    res.status(200).json({ msg: "OTP sent for password reset." });
  } catch (err) {
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
};

// ✅ Verify OTP for Password Reset
export const verifyResetOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp)
      return res.status(400).json({ msg: "Email and OTP are required" });
    const otpEntry = await OTP.findOne({ email });
    if (!otpEntry) return res.status(400).json({ msg: "OTP not found" });
    if (otpEntry.otp !== otp)
      return res.status(400).json({ msg: "Invalid OTP" });
    if (new Date(otpEntry.expiration) < new Date())
      return res.status(400).json({ msg: "OTP expired" });
    res
      .status(200)
      .json({ msg: "OTP verified successfully. Proceed to reset password." });
  } catch (err) {
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
};

// ✅ Reset Password Function
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword)
      return res.status(400).json({ msg: "All fields are required" });
    const otpEntry = await OTP.findOne({ email });
    if (!otpEntry) return res.status(400).json({ msg: "OTP not found" });
    if (otpEntry.otp !== otp)
      return res.status(400).json({ msg: "Invalid OTP" });
    if (new Date(otpEntry.expiration) < new Date())
      return res.status(400).json({ msg: "OTP expired" });
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate({ email }, { password: hashedPassword });
    await OTP.deleteOne({ email });
    res.status(200).json({ msg: "Password reset successfully." });
  } catch (err) {
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
};

// ✅ Logout Function
export const logout = (req, res) => {
  // Log logout event
  try {
    let userId = null;
    let userType = null;
    if (req.user) {
      userId = req.user.userId || req.user._id;
      userType = req.user.role;
    }
    new UserSessionLog({
      userId,
      userType,
      eventType: "logout",
      device: req.headers["user-agent"],
      timestamp: new Date(),
    })
      .save()
      .catch((err) => {
        console.error("Failed to log logout event:", err);
      });
  } catch (err) {
    console.error("Failed to log logout event:", err);
  }
  res.clearCookie("auth_token");
  res.json({ msg: "Logout successful" });
};

// ✅ Get User Profile
export const getUserProfile = async (req, res) => {
  try {
    console.log("✅ API Hit: /profile"); // Debugging Step 1

    console.log("🔹 Token से आया हुआ User:", req.user); // Debugging Step 2

    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      console.log("❌ User Not Found in DB!"); // Debugging Step 3
      return res.status(404).json({ message: "User not found" });
    }

    console.log("✅ User Found:", user); // Debugging Step 4

    res.json(user); // ✅ Successfully Sending User Data
  } catch (error) {
    console.log("❌ Error in getUserProfile:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Update User Profile
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Image Update Logic
    if (req.file) {
      user.profileImage = req.file.path;
    }

    await user.save();
    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
