import { FaCamera, FaTrash, FaVideo } from "react-icons/fa";

const Step4 = ({
  formData,
  uploading,
  uploadingVideos,
  handleImageUpload,
  handleVideoUpload,
  removeImage,
  removeVideo,
  validationErrors
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-purple-800 mb-4">Property Media</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Images (Max 10)*</label>
        <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="image-upload"
          />
          <label htmlFor="image-upload" className="cursor-pointer">
            <FaCamera className="mx-auto text-3xl text-purple-800 mb-2" />
            <p className="text-sm text-gray-600">
              {uploading ? "Uploading..." : "Click to upload or drag and drop"}
            </p>
            <p className="text-xs text-gray-500 mt-1">JPEG, PNG (Max 5MB each)</p>
          </label>
        </div>
        {validationErrors.images && (
          <p className="text-red-500 text-sm mt-1">{validationErrors.images}</p>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {formData.images.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={image.url}
                alt={`Property ${index}`}
                className="w-full h-32 object-cover rounded-md"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <FaTrash size={12} />
              </button>
              <select
                value={image.type || ""}
                onChange={(e) => {
                  const newImages = [...formData.images];
                  newImages[index].type = e.target.value;
                  setFormData(prev => ({ ...prev, images: newImages }));
                }}
                className="w-full mt-1 text-sm border rounded p-1"
              >
                <option value="">Select Category</option>
                <option value="bedroom">Bedroom</option>
                <option value="kitchen">Kitchen</option>
                <option value="living-room">Living Room</option>
                <option value="bathroom">Bathroom</option>
                <option value="exterior">Exterior</option>
              </select>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Videos (Max 3)</label>
        <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
          <input
            type="file"
            multiple
            accept="video/*"
            onChange={handleVideoUpload}
            className="hidden"
            id="video-upload"
          />
          <label htmlFor="video-upload" className="cursor-pointer">
            <FaVideo className="mx-auto text-3xl text-purple-800 mb-2" />
            <p className="text-sm text-gray-600">
              {uploadingVideos ? "Uploading..." : "Click to upload or drag and drop"}
            </p>
            <p className="text-xs text-gray-500 mt-1">MP4, MOV (Max 500MB each)</p>
          </label>
        </div>
        {validationErrors.videos && (
          <p className="text-red-500 text-sm mt-1">{validationErrors.videos}</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {formData.videos.map((video, index) => (
            <div key={index} className="relative group">
              <video
                src={video.url}
                controls
                className="w-full h-48 bg-black rounded-md"
              />
              <button
                type="button"
                onClick={() => removeVideo(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <FaTrash size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Step4;