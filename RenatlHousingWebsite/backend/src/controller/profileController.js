import User from "../models/user.js";

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
import cloudinary from "../config/cloudinaryConfig.js"; // import the cloudinary config

export const updateUserProfile = async (req, res) => {
  try {
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

    // Handle profile image upload using Cloudinary
    if (req.file) {
      // Upload the image to Cloudinary
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: 'profiles', // specify the folder (optional)
        use_filename: true,  // keep the original file name
        unique_filename: false, // avoid appending random characters to the file name
      });

      // Save the Cloudinary URL in the user's profile
      user.profileImage = result.secure_url;
      
    }

    await user.save();
    res.json({
      msg: "Profile updated successfully",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        profileImage: user.profileImage || null,
      }
    });
  } catch (err) {
    console.error("❌ Profile Update Error:", err.message);
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
};
