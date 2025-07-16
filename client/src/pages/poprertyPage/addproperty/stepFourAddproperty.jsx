import { FaCamera, FaTrash, FaVideo } from "react-icons/fa";

const Step4 = ({
  formData,
  previewImages,
  previewVideos,
  uploading,
  uploadingVideos,
  uploadProgress,
  setFormData,
  setPreviewImages,
  setPreviewVideos,
  setUploading,
  setUploadingVideos,
  setUploadProgress,
  validationErrors,
  setError,
}) => {
  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (!files || files.length === 0) return;

    if (formData.images.length + files.length > 10) {
      setError("Maximum 10 images allowed");
      return;
    }

    try {
      setUploading(true);
      setError(null);
      setUploadProgress(0);

      const uploadedImages = [];
      for (const file of files) {
        if (!file.type.startsWith("image/")) {
          setError("Only image files are allowed");
          continue;
        }

        if (file.size > 5 * 1024 * 1024) {
          setError("Image size should be less than 5MB");
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
            setUploadProgress((prev) =>
              Math.min(prev + 100 / files.length, 100)
            );
          }
        } catch (uploadError) {
          console.error("Error uploading individual file:", uploadError);
          setError(`Failed to upload ${file.name}: ${uploadError.message}`);
          continue;
        }
      }

      if (uploadedImages.length > 0) {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, ...uploadedImages],
        }));
        setPreviewImages((prev) => [
          ...prev,
          ...uploadedImages.map((img) => img.url),
        ]);
      }
    } catch (error) {
      console.error("Image upload failed:", error);
      setError(error.message || "Failed to upload images. Please try again.");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleVideoUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (!files || files.length === 0) return;

    if (formData.videos.length + files.length > 3) {
      setError("Maximum 3 videos allowed");
      return;
    }

    try {
      setUploadingVideos(true);
      setError(null);
      setUploadProgress(0);

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
            setUploadProgress((prev) =>
              Math.min(prev + 100 / files.length, 100)
            );
          }
        } catch (uploadError) {
          console.error("Error uploading individual video:", uploadError);
          setError(`Failed to upload ${file.name}: ${uploadError.message}`);
          continue;
        }
      }

      if (uploadedVideos.length > 0) {
        setFormData((prev) => ({
          ...prev,
          videos: [...prev.videos, ...uploadedVideos],
        }));
        setPreviewVideos((prev) => [
          ...prev,
          ...uploadedVideos.map((v) => v.url),
        ]);
      }
    } catch (error) {
      console.error("Video upload failed:", error);
      setError(error.message || "Failed to upload videos. Please try again.");
    } finally {
      setUploadingVideos(false);
      setUploadProgress(0);
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
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 shadow-sm mt-4">
        <label className="block font-semibold text-slate-700 text-sm mb-1">
          Upload Images (Max 10)
        </label>

        <div className="relative border-2 border-dashed border-purple-800 rounded-lg p-6 text-center hover:border-purple-600 transition cursor-pointer mb-4">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={uploading}
          />
          <div className="flex flex-col items-center justify-center">
            <FaCamera className="text-purple-800 text-3xl mb-2" />
            <p className="block font-semibold text-slate-700 text-sm mb-1">
              {uploading
                ? "Uploading..."
                : "Click to browse or drag and drop images"}
            </p>
            <p className="block font-semibold text-slate-700 text-sm mb-1 mt-1">
              JPEG, PNG (Max 5MB each)
            </p>
          </div>
        </div>

        {validationErrors.images && (
          <p className="text-sm text-red-600">{validationErrors.images}</p>
        )}

        {uploading && (
          <div className="text-purple-800 flex items-center mb-4">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-purple-800"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Uploading images...
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-4">
          {previewImages.map((src, index) => (
            <div key={index} className="relative group">
              <img
                src={src}
                alt="preview"
                className="w-full h-32 object-cover rounded-md border border-purple-800"
              />

              <select
                className="w-full mt-2 p-1 border border-purple-800 rounded-md text-sm"
                value={formData.images[index]?.type || ""}
                onChange={(e) => {
                  const newImages = [...formData.images];
                  newImages[index] = {
                    ...newImages[index],
                    type: e.target.value,
                  };
                  setFormData((prev) => ({ ...prev, images: newImages }));
                }}
              >
                <option value="">Select Category</option>
                <option value="bedroom">Bedroom</option>
                <option value="master-bedroom">Master Bedroom</option>
                <option value="guest-bedroom">Guest Bedroom</option>
                <option value="kids-bedroom">Kids Bedroom</option>
                <option value="kitchen">Kitchen</option>
                <option value="modular-kitchen">Modular Kitchen</option>
                <option value="drawing-room">Drawing Room</option>
                <option value="living-room">Living Room</option>
                <option value="dining-room">Dining Room</option>
                <option value="bathroom">Bathroom</option>
                <option value="toilet">Toilet</option>
                <option value="combined-bathroom">Combined Bathroom</option>
                <option value="balcony">Balcony</option>
                <option value="utility-area">Utility Area</option>
                <option value="laundry-room">Laundry Room</option>
                <option value="study-room">Study Room</option>
                <option value="home-office">Home Office</option>
                <option value="puja-room">Puja Room</option>
                <option value="store-room">Store Room</option>
                <option value="garage">Garage</option>
                <option value="parking-area">Parking Area</option>
                <option value="terrace">Terrace</option>
                <option value="basement">Basement</option>
                <option value="front-yard">Front Yard</option>
                <option value="backyard">Backyard</option>
                <option value="garden">Garden</option>
                <option value="servant-room">Servant Room</option>
                <option value="guest-room">Guest Room</option>
                <option value="hallway">Hallway / Passage</option>
                <option value="staircase">Staircase Area</option>
                <option value="entrance-lobby">Entrance / Lobby</option>
                <option value="roof">Roof</option>
                <option value="veranda">Veranda</option>
                <option value="atrium">Atrium</option>
                <option value="porch">Porch</option>
                <option value="lift-area">Lift / Elevator Area</option>
              </select>

              <button
                type="button"
                onClick={() => {
                  setPreviewImages((prev) =>
                    prev.filter((_, i) => i !== index)
                  );
                  setFormData((prev) => ({
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

        <div className="block font-semibold text-slate-700 text-sm mb-1 mt-2">
          {previewImages.length} of 10 images uploaded
        </div>
      </div>

      <div className="mt-8 bg-slate-50 border border-slate-200 rounded-lg p-4 shadow-sm">
        <label className="block font-semibold text-slate-700 text-sm mb-1">
          Upload Videos (Max 3)
        </label>

        <div className="relative border-2 border-dashed border-purple-800 rounded-lg p-6 text-center hover:border-purple-600 transition cursor-pointer">
          <input
            type="file"
            multiple
            accept="video/*"
            onChange={handleVideoUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={uploadingVideos}
          />
          <div className="flex flex-col items-center justify-center">
            <FaVideo className="text-slate-700 text-3xl mb-2" />
            <p className="block font-semibold text-slate-700 text-sm mb-1">
              {uploadingVideos
                ? "Uploading..."
                : "Click to browse or drag and drop videos"}
            </p>
            <p className="block font-semibold text-slate-700 text-sm mb-1 mt-1">
              MP4, MOV (Max 500MB each)
            </p>
          </div>
        </div>

        {validationErrors.videos && (
          <p className="text-sm text-red-600">{validationErrors.videos}</p>
        )}

        {uploadingVideos && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-purple-600 h-2.5 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-purple-800 mt-1">
              <span>Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>
          </div>
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
                  setFormData((prev) => ({
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

        <div className="block font-semibold text-slate-700 text-sm mb-1 mt-2">
          {previewVideos.length} of 3 videos uploaded
        </div>
      </div>
    </div>
  );
};

export default Step4;
