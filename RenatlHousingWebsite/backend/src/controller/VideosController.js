import Video from '../models/videosModel.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export const uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      console.log("❌ No video file found");
      return res.status(400).json({ success: false, error: "No video file uploaded" });
    }

    console.log("✅ File received:", req.file.filename);
    console.log("✅ Request body:", req.body);

    if (!req.body.title || req.body.title.trim() === "") {
      console.log("❌ Title is missing");
      return res.status(400).json({ success: false, error: "Title is required" });
    }

    const videoData = {
      title: req.body.title || path.parse(req.file.originalname).name,
      filename: req.file.filename,
      url: `/uploads/videos/${req.file.filename}`,
      mimetype: req.file.mimetype,
      size: req.file.size
    };

    console.log("📌 Video Data:", videoData);

    const video = await Video.create(videoData);
    console.log("✅ Video Saved in DB:", video);

    return res.status(201).json({ 
      success: true, 
      message: "Video uploaded successfully",
      data: video 
    });

  } catch (error) {
    console.error("❌ Upload error:", error);
    return res.status(500).json({ 
      success: false, 
      error: "Failed to upload video",
      details: error.message 
    });
  }
};


export const getVideos = async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: videos });
  } catch (error) {
    console.error("Error fetching videos:", error);
    res.status(500).json({ success: false, error: "Failed to fetch videos" });
  }
};

export const streamVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ success: false, error: "Video not found" });
    }

    const videoPath = path.resolve(__dirname, "./uploads/videos", video.filename);

    if (!fs.existsSync(videoPath)) {
      return res.status(404).json({ success: false, error: "File not found" });
    }

    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      // Handling video streaming with range request
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = (end - start) + 1;

      const file = fs.createReadStream(videoPath, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': video.mimetype,
      };

      res.writeHead(206, head);
      file.pipe(res);
    } else {
      // Normal file serving
      const head = {
        'Content-Length': fileSize,
        'Content-Type': video.mimetype,
      };

      res.writeHead(200, head);
      fs.createReadStream(videoPath).pipe(res);
    }
  } catch (error) {
    console.error("Streaming error:", error);
    res.status(500).json({ success: false, error: "Failed to stream video" });
  }
};
