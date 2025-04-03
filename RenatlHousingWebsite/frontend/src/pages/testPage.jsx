import React, { useState, useRef } from "react";

const VideoUploader = () => {
  const [videoUrl, setVideoUrl] = useState(localStorage.getItem("videoUrl") || "");
  const [loading, setLoading] = useState(false);
  const videoRef = useRef(null);

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "RentEase_Videos"); // Replace with your Cloudinary upload preset

    try {
      const response = await fetch("https://api.cloudinary.com/v1_1/dkrrpzlbl/video/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setVideoUrl(data.secure_url);
      localStorage.setItem("videoUrl", data.secure_url);
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = () => videoRef.current?.play();
  const handlePause = () => videoRef.current?.pause();
  const handleStop = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto mt-20">
      <input type="file" accept="video/*" onChange={handleUpload} className="mb-4" />
      {loading && <p>Uploading...</p>}
      {videoUrl && (
        <div className="relative w-full max-w-md mx-auto">
          <video ref={videoRef} src={videoUrl} className="w-full rounded-lg" controls />
          <div className="absolute inset-0 flex justify-center items-center space-x-4">
            <button onClick={handlePlay} className="bg-green-500 p-2 text-white rounded">Play</button>
            <button onClick={handlePause} className="bg-yellow-500 p-2 text-white rounded">Pause</button>
            <button onClick={handleStop} className="bg-red-500 p-2 text-white rounded">Stop</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoUploader;
