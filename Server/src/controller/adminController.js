import Admin from "../models/adminModals.js";
import bcrypt from "bcryptjs";
import User from "../models/user.js";
import Property from "../models/property.js";
import jwt from "jsonwebtoken";

// Register Admin
export const registerAdmin = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Admin already exists with this email",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: "admin",
    });

    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        role: admin.role,
      },
      token,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error in registration",
      error: error.message,
    });
  }
};


export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ msg: "Email and password are required" });

    // Use Admin model instead of User
    const admin = await Admin.findOne({ email });
    if (!admin)
      return res.status(401).json({ msg: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res.status(401).json({ msg: "Invalid email or password" });

    // Generate JWT token valid for 30 days
    const token = jwt.sign(
      {
        id: admin._id, // use 'id' for compatibility with middleware
        role: admin.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    // Set token in cookie valid for 30 days
    res.cookie("auth_token", token, {
      httpOnly: true,
      sameSite: "lax", // changed from 'strict' to 'lax' for local dev
      secure: false,    // set to true if using HTTPS
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.json({
      msg: "Login successful",
      token,
      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ msg: "Server Error", error: error.message });
  }
};


// Logout Admin
export const logoutAdmin = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in logout",
      error: error.message,
    });
  }
};

// Get Admin Profile
export const getAdminProfile = async (req, res) => {
  try {
    const adminId = req.user._id || req.user.id;
    const admin = await Admin.findById(adminId).select("-password");
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    res.status(200).json({
      success: true,
      admin,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching admin profile",
      error: error.message,
    });
  }
};

// Get All Users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .select("-password -refreshToken")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      users,
      count: users.length,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: error.message,
    });
  }
};

// Delete User
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role === "admin") {
      return res.status(403).json({
        success: false,
        message: "Cannot delete admin users",
      });
    }

    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting user",
      error: error.message,
    });
  }
};

// Get All Property (Basic)
export const getAllProperty = async (req, res) => {
  try {
    const properties = await Property.find();

    res.status(200).json({
      success: true,
      message: "Properties fetched successfully",
      properties,
    });
  } catch (error) {
    console.error("Error fetching properties:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching properties",
      error: error.message,
    });
  }
};

// Get All Properties with Owner Details
export const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find({})
      .populate("owner", "name email phone")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      properties,
      count: properties.length,
    });
  } catch (error) {
    console.error("Error fetching properties:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching properties",
      error: error.message,
    });
  }
};
