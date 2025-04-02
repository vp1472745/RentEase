import Video from "../models/videoModel.js";
import fs from "fs/promises";
import path from "path";

// 🎥 Upload Video
export const uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: "No video file uploaded" });
    }

    const videoData = {
      title: req.body.title || path.parse(req.file.originalname).name,
      filename: req.file.filename,
      url: `/uploads/videos/${req.file.filename}`,
      mimetype: req.file.mimetype,
      size: req.file.size
    };

    const video = await Video.create(videoData);
    return res.status(201).json({ success: true, data: video });

  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ success: false, error: "Failed to upload video" });
  }
};

// 🎥 Stream Video
export const streamVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ success: false, error: "Video not found" });

    const videoPath = path.resolve(`uploads/videos/${video.filename}`);
    await fs.access(videoPath);

    const { size } = await fs.stat(videoPath);
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : size - 1;
      const chunkSize = end - start + 1;

      res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${size}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunkSize,
        "Content-Type": video.mimetype
      });

      fs.createReadStream(videoPath, { start, end }).pipe(res);
    } else {
      res.writeHead(200, { "Content-Length": size, "Content-Type": video.mimetype });
      fs.createReadStream(videoPath).pipe(res);
    }
  } catch (error) {
    console.error("Streaming error:", error);
    return res.status(500).json({ success: false, error: "Failed to stream video" });
  }
};

// 📜 Get Video Details
export const getVideoDetails = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ success: false, error: "Video not found" });

    return res.json({ success: true, data: video });
  } catch (error) {
    console.error("Details error:", error);
    return res.status(500).json({ success: false, error: "Failed to fetch video details" });
  }
};

// ❌ Delete Video
export const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findByIdAndDelete(req.params.id);
    if (!video) return res.status(404).json({ success: false, error: "Video not found" });

    await fs.unlink(`uploads/videos/${video.filename}`).catch(err => console.error("Delete error:", err));

    return res.json({ success: true, message: "Video deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    return res.status(500).json({ success: false, error: "Failed to delete video" });
  }
};
