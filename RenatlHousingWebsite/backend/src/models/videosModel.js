import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  filename: { type: String, required: true },
  url: { type: String, required: true },
  mimetype: { type: String, required: true },
  size: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Video = mongoose.model("Video", videoSchema);
export default Video;
