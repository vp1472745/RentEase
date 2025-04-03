import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  // In your Property model (backend)
videos: [{
  url: String,
  public_id: String,
  type: { type: String, default: 'video' }
}]
}, { timestamps: true }); // ✅ Yeh timestamps bhi store karega

const Video = mongoose.model("Video", videoSchema);
export default Video;
