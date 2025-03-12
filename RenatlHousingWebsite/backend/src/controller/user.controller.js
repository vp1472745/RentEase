import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import dotenv from "dotenv";
import nodemailer from "nodemailer"; // Nodemailer for email sending
import { randomBytes } from "crypto"; // To generate a random OTP
import OTP from "../models/otpModels.js";  // OTP model import

dotenv.config();

// Email Configuration
// Email Configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body; // The email provided by the user

    console.log("Resend OTP request received for email:", email);

    // 🔹 Check if the user exists with the given email
    let user = await User.findOne({ email });
    if (!user) {
      console.log("User not found with email:", email);
      return res.status(400).json({ msg: "User with this email doesn't exist" });
    }

    // 🔹 Generate a new OTP
    const otp = randomBytes(3).toString("hex").toUpperCase(); // Generate OTP
    console.log("Generated OTP:", otp);

    // 🔹 Save the new OTP in the user's document
    user.otp = otp;
    await user.save();
    console.log("OTP saved to user:", user);

    // 🔹 Send OTP to the user's email using Nodemailer
    const verificationUrl = `http://yourwebsite.com/verify-email?token=${otp}&userId=${user._id}`;
    console.log("Verification URL:", verificationUrl);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Email Verification",
      html: `<p>Please verify your email by clicking <a href="${verificationUrl}">here</a>.</p><p>Your OTP is: ${otp}</p>`,
    };

    // Send verification email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error sending email:", error);
        return res.status(500).json({ msg: "Failed to send verification email" });
      } else {
        console.log("Verification email sent:", info.response);
      }
    });

    res.status(200).json({ msg: "OTP has been resent to your email." });
  } catch (err) {
    console.error("Error in resendOTP:", err);
    res.status(500).send("Server Error");
  }
};


export const signup = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists with this email" });

    // Create a new user object but don't save yet (temporary user)
    user = new User({
      name,
      email,
      password: await bcrypt.hash(password, 10), // Hash the password
      phone,
      role,
      isVerified: false, // User is not verified yet
    });

    // Generate OTP
    const otp = randomBytes(3).toString("hex").toUpperCase();
    console.log("Generated OTP:", otp);

    // Save the user temporarily without the OTP
    await user.save(); // User is saved here, but 'isVerified' is false

    // Save OTP in OTP collection with expiration time
    const otpExpiration = Date.now() + 15 * 60 * 1000; // 15 minutes expiration
    const otpEntry = new OTP({
      userId: user._id, // Link OTP to the new user
      email,
      otp,
      expiration: new Date(otpExpiration),
    });

    await otpEntry.save(); // Save OTP for later validation

    // Send OTP to the user's email
    const verificationUrl = `http://yourwebsite.com/verify-email?token=${otp}&userId=${user._id}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Email Verification",
      html: `<p>Please verify your email by clicking <a href="${verificationUrl}">here</a>.</p><p>Your OTP is: ${otp}</p>`,
    };

    // Send verification email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error sending email:", error);
        return res.status(500).json({ msg: "Failed to send verification email" });
      } else {
        console.log("Verification email sent:", info.response);
      }
    });

    res.status(201).json({ msg: "OTP sent to email. Please verify." });

  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

// verify otp
export const verifyOTP = async (req, res) => {
  try {
    const { otp, email, password, userId } = req.body;

    // Check if OTP exists for the given email
    const otpEntry = await OTP.findOne({ email, userId });
    if (!otpEntry) {
      return res.status(400).json({ msg: "OTP not found for this email" });
    }

    // Check if OTP matches
    if (otpEntry.otp !== otp) {
      return res.status(400).json({ msg: "Invalid OTP" });
    }

    // Check if OTP expired
    if (otpEntry.expiration < Date.now()) {
      return res.status(400).json({ msg: "OTP has expired. Please request a new one." });
    }

    // Now create the final user record
    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Update the user as verified
    user.isVerified = true;
    user.password = await bcrypt.hash(password, 10); // Update password
    await user.save(); // Save the user with updated verification status

    // Remove OTP entry after successful verification
    await OTP.deleteOne({ email });

    // Generate JWT Token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, msg: "Account created and verified successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};


// ✅ Login Controller
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔹 Check if User Exists
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    // 🔹 Check Password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 🔹 Generate JWT Token
    const token = jwt.sign(
      { userId: user._id, role: user.role }, // Role will still be included in Token
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 🔹 Set Cookie (HTTP Only, Secure, SameSite)
    res.cookie("auth_token", token, {
      httpOnly: true,  // For security
      secure: false,   // Set to true if using HTTPS
      sameSite: "strict",
    });

    return res.json({ message: "Login successful", token, role: user.role });
  } catch (error) {
    console.error("❌ Login Error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};




// ✅ Logout API
export const logout = (req, res) => {
  res.clearCookie("auth_token"); // ✅ Remove Cookie
  return res.json({ message: "Logout successful" });
};

// ✅ Get User Profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

// ✅ Update Profile API (Owner, Tenant, Admin)
export const updateUserProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;

    // 🔹 Find User By ID
    let user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    // 🔹 Update Name & Phone
    user.name = name || user.name;
    user.phone = phone || user.phone;

    await user.save();

    res.json({ msg: "Profile Updated Successfully", user });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};
