import User from "../models/user.js";
import path from "path";

// ✅ Get Profile Controller
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    
    res.json({ 
      userId: user._id, // ✅ User ID भी return कर रहा हूँ 
      name: user.name,
      email: user.email,
      phone: user.phone,
      profileImage: user.profileImage
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ msg: "Server Error" });
  }
};

// 🔹 Update User Profile
export const updateUserProfile = async (req, res) => {
  try {
    console.log("✅ Profile update request received.");
    console.log("📂 Uploaded file details:", req.file);
    console.log("📩 Request Body:", req.body);
    console.log("📢 Headers:", req.headers);

    if (!req.user || !req.user._id) {
      return res.status(401).json({ msg: "Unauthorized Access" });
    }

    const { name, phone } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Update user details
    user.name = name || user.name;
    user.phone = phone || user.phone;

    // Handle profile image upload
    if (req.file) {
      user.profileImage = `/uploads/${req.file.filename}`;
    } else {
      console.log("⚠ No file uploaded!");
    }

    await user.save();
    console.log("✅ User updated successfully.");

    res.json({
      msg: "Profile updated successfully",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        profileImage: user.profileImage ? `${req.protocol}://${req.get("host")}${user.profileImage}` : null
      }
    });

  } catch (err) {
    console.error("❌ Profile Update Error:", err.message);
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
};
