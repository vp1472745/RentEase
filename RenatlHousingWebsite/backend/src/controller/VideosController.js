const Video = require('../models/videosModel');
const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');

exports.uploadVideo = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No video uploaded' });

    const { originalname, filename, path: filePath, size, mimetype } = req.file;
    
    // Generate thumbnail
    const thumbnailPath = path.join('uploads', 'thumbnails', `${filename}.jpg`);
    await new Promise((resolve) => {
      ffmpeg(filePath)
        .screenshots({ count: 1, folder: path.dirname(thumbnailPath), filename: path.basename(thumbnailPath) })
        .on('end', resolve);
    });

    const video = new Video({
      title: originalname,
      filename,
      path: filePath,
      size,
      mimetype,
      thumbnail: thumbnailPath,
      owner: req.user._id
    });
    await video.save();

    res.status(201).json(video);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.streamVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ error: 'Video not found' });

    const range = req.headers.range;
    if (!range) return res.status(400).json({ error: 'Requires Range header' });

    const videoPath = video.path;
    const videoSize = fs.statSync(videoPath).size;
    const chunkSize = 10 ** 6; // 1MB
    const start = Number(range.replace(/\D/g, ''));
    const end = Math.min(start + chunkSize, videoSize - 1);

    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${videoSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': end - start + 1,
      'Content-Type': video.mimetype
    });

    fs.createReadStream(videoPath, { start, end }).pipe(res);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add other CRUD operations as needed