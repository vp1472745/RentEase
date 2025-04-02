import express from 'express';
import uploadMiddleware from '../middleware/videoUploadMiddleware.js';
import { authMiddleware } from "../middleware/authMiddleware.js";
import Video from "../models/videosModel.js";  // ✅ Import Video Schema

const router = express.Router();

// ✅ Video Upload Route
router.post('/upload', authMiddleware, uploadMiddleware.single('video'), async (req, res) => {
  try {
    console.log('✅ Request Body:', req.body);
    console.log('📂 Uploaded File:', req.file);

    if (!req.file) {
      return res.status(400).json({ error: '❌ No file uploaded' });
    }

    // ✅ MongoDB me video save karna
    const videoUrl = `/uploads/videos/${req.file.filename}`;
    const newVideo = new Video({
      url: videoUrl,
      filename: req.file.filename,
      text:"vineet"
    });

    await newVideo.save();  // 🔥 Database me save karna

    console.log("✅ Saved video:", newVideo);  // 🔥 Debugging ke liye log

    res.status(200).json({ 
      success: true, 
      message: '✅ Video uploaded!', 
      file: req.file, 
      videoUrl: `http://localhost:5000${videoUrl}` 
    });

  } catch (error) {
    console.error("❌ Upload error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Dummy Data Insert Route
router.post('/add-dummy-video', async (req, res) => {
  try {
    const dummyVideo = new Video({
      url: '/uploads/videos/dummy-video.mp4',
      filename: 'dummy-video.mp4'
    });
    
    await dummyVideo.save();
    console.log("✅ Dummy video added:", dummyVideo);
    
    res.status(200).json({ 
      success: true, 
      message: '✅ Dummy video added!', 
      data: dummyVideo
    });
  } catch (error) {
    console.error("❌ Error adding dummy video:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
