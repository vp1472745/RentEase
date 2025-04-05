import User from "../models/user.js";
import cloudinary from "../config/cloudinaryConfig.js";
import fs from 'fs';

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    
    res.json({ 
      userId: user._id,
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

export const updateUserProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ msg: "Unauthorized Access" });
    }

    const { name, phone } = req.body;
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Update user details
    user.name = name || user.name;
    user.phone = phone || user.phone;

    // Handle profile image upload
    if (req.file) {
      try {
        // Delete old image from Cloudinary if exists
        if (user.profileImage) {
          const publicId = user.profileImage.split('/').pop().split('.')[0];
          await cloudinary.v2.uploader.destroy(`profiles/${publicId}`);
        }

        // Upload new image to Cloudinary
        const result = await cloudinary.v2.uploader.upload(req.file.path, {
          folder: 'profiles',
          use_filename: true,
          unique_filename: false,
        });

        // Save the Cloudinary URL
        user.profileImage = result.secure_url;
        
        // Delete file from server after upload
        fs.unlink(req.file.path, (err) => {
          if (err) console.error("Error deleting file:", err);
        });
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        return res.status(500).json({ msg: "Error uploading image" });
      }
    }

    await user.save();
    
    res.json({
      msg: "Profile updated successfully",
      user: {
        userId: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        profileImage: user.profileImage || null,
      }
    });
  } catch (err) {
    console.error("Profile Update Error:", err.message);
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
};