import { FaCamera, FaTrash, FaVideo } from "react-icons/fa";

const PropertyFormStep4 = ({
  editFormData,
  setEditFormData,
  previewImages,
  setPreviewImages,
  previewVideos,
  setPreviewVideos,
  validationErrors,
}) => {
  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (!files || files.length === 0) return;

    if (editFormData.images.length + files.length > 10) {
      alert("Maximum 10 images allowed");
      return;
    }

    try {
      const uploadedImages = [];
      for (const file of files) {
        if (!file.type.startsWith("image/")) {
          alert("Only image files are allowed");
          continue;
        }

        if (file.size > 5 * 1024 * 1024) {
          alert("Image size should be less than 5MB");
          continue;
        }

        try {
          const uploadData = new FormData();
          uploadData.append("file", file);
          uploadData.append("upload_preset", "roommilega_unsigned");
          uploadData.append("cloud_name", "dzopb3luc");
          uploadData.append("resource_type", "image");

          const response = await fetch(
            "https://api.cloudinary.com/v1_1/dzopb3luc/image/upload",
            { method: "POST", body: uploadData }
          );

          const data = await response.json();

          if (!response.ok) {
            console.error("Cloudinary response:", data);
            throw new Error(data.error?.message || "Upload failed");
          }

          if (data.secure_url) {
            uploadedImages.push({
              url: data.secure_url,
              public_id: data.public_id,
              type: "image",
            });
          }
        } catch (uploadError) {
          console.error("Error uploading individual file:", uploadError);
          alert(`Failed to upload ${file.name}: ${uploadError.message}`);
          continue;
        }
      }

      if (uploadedImages.length > 0) {
        setEditFormData((prev) => ({
          ...prev,
          images: [...prev.images, ...uploadedImages],
        }));
        setPreviewImages((prev) => [...prev, ...uploadedImages.map((img) => img.url)]);
      }
    } catch (error) {
      console.error("Image upload failed:", error);
      alert(error.message || "Failed to upload images. Please try again.");
    }
  };

  const handleVideoUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (!files || files.length === 0) return;

    if (editFormData.videos.length + files.length > 3) {
      alert("Maximum 3 videos allowed");
      return;
    }

    try {
      const uploadedVideos = [];
      for (const file of files) {
        try {
          const uploadData = new FormData();
          uploadData.append("file", file);
          uploadData.append("upload_preset", "roommilega_unsigned");
          uploadData.append("cloud_name", "dzopb3luc");
          uploadData.append("resource_type", "video");

          const response = await fetch(
            "https://api.cloudinary.com/v1_1/dzopb3luc/video/upload",
            { method: "POST", body: uploadData }
          );

          const data = await response.json();

          if (!response.ok) {
            console.error("Cloudinary response:", data);
            throw new Error(data.error?.message || "Upload failed");
          }

          if (data.secure_url) {
            uploadedVideos.push({
              url: data.secure_url,
              public_id: data.public_id,
              type: "video",
            });
          }
        } catch (uploadError) {
          console.error("Error uploading individual video:", uploadError);
          alert(`Failed to upload ${file.name}: ${uploadError.message}`);
          continue;
        }
      }

      if (uploadedVideos.length > 0) {
        setEditFormData((prev) => ({
          ...prev,
          videos: [...prev.videos, ...uploadedVideos],
        }));
        setPreviewVideos((prev) => [...prev, ...uploadedVideos.map((v) => v.url)]);
      }
    } catch (error) {
      console.error("Video upload failed:", error);
      alert(error.message || "Failed to upload videos. Please try again.");
    }
  };

  const handlePlay = (videoUrl) => {
    const videoElement = document.getElementById(`video-${videoUrl}`);
    if (videoElement) videoElement.play();
  };

  const handlePause = (videoUrl) => {
    const videoElement = document.getElementById(`video-${videoUrl}`);
    if (videoElement) videoElement.pause();
  };

  const handleStop = (videoUrl) => {
    const videoElement = document.getElementById(`video-${videoUrl}`);
    if (videoElement) {
      videoElement.pause();
      videoElement.currentTime = 0;
    }
  };

  return (
    <div className="space-y-4">
      {/* Images Section */}
      <div>
        <label className="block text-sm font-bold text-purple-800 mb-1">
          Upload Images (Max 10)
        </label>

        <div className="relative border-2 border-dashed border-purple-800 rounded-lg p-6 text-center hover:border-purple-600 transition cursor-pointer mb-4">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex flex-col items-center justify-center">
            <FaCamera className="text-purple-800 text-3xl mb-2" />
            <p className="text-sm text-purple-800">
              Click to browse or drag and drop images
            </p>
            <p className="text-xs text-purple-600 mt-1">
              JPEG, PNG (Max 5MB each)
            </p>
          </div>
        </div>

        {validationErrors.images && (
          <p className="text-sm text-red-600">{validationErrors.images}</p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-4">
          {previewImages.map((src, index) => (
            <div key={index} className="relative group">
              <img
                src={src}
                alt="preview"
                className="w-full h-32 object-cover rounded-md border border-purple-800"
              />

              {/* Dropdown for selecting image category */}
              <select
                className="w-full mt-2 p-1 border border-purple-800 rounded-md text-sm"
                value={editFormData.images[index]?.type || ""}
                onChange={(e) => {
                  const newImages = [...editFormData.images];
                  newImages[index] = {
                    url: src,
                    type: e.target.value,
                  };
                  setEditFormData((prev) => ({
                    ...prev,
                    images: newImages,
                  }));
                }}
              >
                <option value="">Select Category</option>
                <option value="bedroom">Bedroom</option>
                <option value="master-bedroom">Master Bedroom</option>
                <option value="guest-bedroom">Guest Bedroom</option>
                <option value="kids-bedroom">Kids Bedroom</option>
                <option value="kitchen">Kitchen</option>
                <option value="drawing-room">Drawing Room</option>
                <option value="living-room">Living Room</option>
                <option value="dining-room">Dining Room</option>
                <option value="bathroom">Bathroom</option>
                <option value="toilet">Toilet</option>
                <option value="balcony">Balcony</option>
                <option value="study-room">Study Room</option>
                <option value="puja-room">Puja Room</option>
                <option value="store-room">Store Room</option>
              </select>

              <button
                type="button"
                onClick={() => {
                  setPreviewImages((prev) =>
                    prev.filter((_, i) => i !== index)
                  );
                  setEditFormData((prev) => ({
                    ...prev,
                    images: prev.images.filter((_, i) => i !== index),
                  }));
                }}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
                title="Remove image"
              >
                <FaTrash size={10} />
              </button>
            </div>
          ))}
        </div>

        <div className="text-sm text-purple-800 mt-2">
          {previewImages.length} of 10 images uploaded
        </div>
      </div>

      {/* Videos Section */}
      <div className="mt-8">
        <label className="block text-sm font-bold text-purple-800 mb-1">
          Upload Videos (Max 3)
        </label>

        <div className="relative border-2 border-dashed border-purple-800 rounded-lg p-6 text-center hover:border-purple-600 transition cursor-pointer">
          <input
            type="file"
            multiple
            accept="video/*"
            onChange={handleVideoUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex flex-col items-center justify-center">
            <FaVideo className="text-purple-800 text-3xl mb-2" />
            <p className="text-sm text-purple-800">
              Click to browse or drag and drop videos
            </p>
            <p className="text-xs text-purple-600 mt-1">
              MP4, MOV (Max 500MB each)
            </p>
          </div>
        </div>

        {validationErrors.videos && (
          <p className="text-sm text-red-600">{validationErrors.videos}</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          {previewVideos.map((src, index) => (
            <div key={index} className="relative group">
              <div className="w-full h-48 bg-gray-100 rounded-md border border-purple-800 overflow-hidden">
                <video
                  id={`video-${src}`}
                  src={src}
                  controls
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex justify-center space-x-2 mt-2">
                <button
                  type="button"
                  onClick={() => handlePlay(src)}
                  className="bg-green-500 text-white px-2 py-1 rounded text-sm"
                >
                  Play
                </button>
                <button
                  type="button"
                  onClick={() => handlePause(src)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded text-sm"
                >
                  Pause
                </button>
                <button
                  type="button"
                  onClick={() => handleStop(src)}
                  className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                >
                  Stop
                </button>
              </div>
              <button
                type="button"
                onClick={() => {
                  setPreviewVideos((prev) =>
                    prev.filter((_, i) => i !== index)
                  );
                  setEditFormData((prev) => ({
                    ...prev,
                    videos: prev.videos.filter((_, i) => i !== index),
                  }));
                }}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
                title="Remove video"
              >
                <FaTrash size={10} />
              </button>
            </div>
          ))}
        </div>

        <div className="text-sm text-purple-800 mt-2">
          {previewVideos.length} of 3 videos uploaded
        </div>
      </div>

      {(validationErrors.media ||
        validationErrors.images ||
        validationErrors.videos) && (
        <p className="text-sm text-red-600 mt-2">
          {validationErrors.media ||
            validationErrors.images ||
            validationErrors.videos}
        </p>
      )}
    </div>
  );
};

export default PropertyFormStep4;