import Admin from "../models/adminModals.js";
import bcrypt from "bcryptjs";
import User from "../models/user.js"
import Property from "../models/property.js"
import jwt from "jsonwebtoken";

// Register Admin
export const registerAdmin = async (req, res) => {
   
    
    try {
        // Validate required fields
        const { name, email, phone, password, image } = req.body;
        
        if (!name || !email || !phone || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({
                success: false,
                message: "Admin already exists with this email"
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new admin
        const adminData = {
            name,
            email,
            phone,
            password: hashedPassword,
            image: image || "",
            role: "admin"
        };

        // Attempt to create admin
        const admin = await Admin.create(adminData);

        // Generate JWT token
        const token = jwt.sign(
            { id: admin._id },
            process.env.JWT_SECRET,
            { expiresIn: "30d" }
        );

        // Remove password from response
        const adminWithoutPassword = {
            _id: admin._id,
            name: admin.name,
            email: admin.email,
            phone: admin.phone,
            image: admin.image,
            role: admin.role
        };
        
        res.status(201).json({
            success: true,
            message: "Admin registered successfully",
            admin: adminWithoutPassword,
            token
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            });
        }

        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: "Validation error",
                errors: Object.values(error.errors).map(err => err.message)
            });
        }

        res.status(500).json({
            success: false,
            message: "Error in registration",
            error: error.message
        });
    }
};



// Login Admin
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: "Email and password are required" });

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ success: false, message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ success: false, message: "Invalid email or password" });

    // Create JWT token
    const token = jwt.sign(
      { userId: admin._id, role: "admin", email: admin.email, name: admin.name },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Set cookie (must match your authMiddleware)
    res.cookie("auth_token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: false // true only if using HTTPS in production
    });

    res.json({
      success: true,
      message: "Login successful",
      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        image: admin.image,
        role: "admin"
      }
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};


// Logout Admin
export const logoutAdmin = async (req, res) => {
    try {
        // Since we're using JWT tokens, we don't need to do anything on the server side
        // The client should remove the token from their storage
        res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error in logout",
            error: error.message
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
                message: "Admin not found"
            });
        }
        res.status(200).json({
            success: true,
            admin
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching admin profile",
            error: error.message
        });
    }
};

// ... existing code ...

// Get All Users (Tenants and Owners)
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select("-password -refreshToken").sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            users,
            count: users.length
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            success: false,
            message: "Error fetching users",
            error: error.message
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
                message: "User not found"
            });
        }

        // Prevent admin from deleting themselves
        if (user.role === 'admin') {
            return res.status(403).json({
                success: false,
                message: "Cannot delete admin users"
            });
        }

        await User.findByIdAndDelete(userId);
        
        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({
            success: false,
            message: "Error deleting user",
            error: error.message
        });
    }
};


export const getAllProperty =async(req,res)=>{
    try {
        const properties = await Property.find();
        
        res.status(200).json({
            success: true,
            message: "Properties fetched successfully",
            properties
        });
    } catch (error) {
        console.error('Error fetching properties:', error);
        res.status(500).json({
            success: false,
            message: "Error fetching properties",
            error: error.message
        });
    }
}

// Get All Properties for Admin
export const getAllProperties = async (req, res) => {
    try {
        const properties = await Property.find({})
            .populate('owner', 'name email phone')
            .sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            properties,
            count: properties.length
        });
    } catch (error) {
        console.error('Error fetching properties:', error);
        res.status(500).json({
            success: false,
            message: "Error fetching properties",
            error: error.message
        });
    }
};

// ... existing code ...