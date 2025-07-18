import { useState, useRef } from "react";
import { FaCamera } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "../../../lib/axios.js";
import { toast } from "react-hot-toast";

const EditProfileForm = ({ profileImage, setProfileImage, name, setName }) => {
  const [tempName, setTempName] = useState(name);
  const [tempEmail, setTempEmail] = useState(localStorage.getItem("email") || "user@example.com");
  const [phone, setPhone] = useState(localStorage.getItem("phone") || "");
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    const imageUrl = URL.createObjectURL(file);
    setProfileImage(imageUrl);
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const saveProfileDetails = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login to update profile");
        navigate("/login");
        return;
      }

      const formData = new FormData();
      formData.append("name", tempName);
      formData.append("email", tempEmail);
      formData.append("phone", phone);

      if (selectedFile) {
        formData.append("profileImage", selectedFile);
      }

      const response = await axios.put("/api/profile/update", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        setName(tempName);
        localStorage.setItem("name", tempName);
        localStorage.setItem("email", tempEmail);
        if (response.data.profileImage) {
          setProfileImage(response.data.profileImage);
          localStorage.setItem("profileImage", response.data.profileImage);
        }
        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      // If token expired, clear storage and let Navbar react
      if (error.response && error.response.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("profileImage");
        localStorage.removeItem("name");
        localStorage.removeItem("email");
        // Do NOT navigate to /login; Navbar will show Create Account button
        return;
      }
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Profile</h1>
        <p className="text-slate-600">Update your personal information and account settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Picture Section */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-indigo-100 rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-indigo-900 mb-6">Profile Picture</h2>
          <div className="text-center">
            <div className="relative inline-block">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-slate-300 cursor-pointer hover:border-indigo-500 transition-all duration-200"
                  onClick={handleImageClick}
                />
              ) : (
                <div
                  className="w-32 h-32 rounded-full bg-indigo-200 flex items-center justify-center text-4xl font-bold text-indigo-700 border-4 border-slate-300 cursor-pointer hover:border-indigo-500 transition-all duration-200"
                  onClick={handleImageClick}
                >
                  {tempName?.trim()?.[0]?.toUpperCase() || "U"}
                </div>
              )}
              <div
                onClick={handleImageClick}
                className="absolute bottom-2 right-2 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-indigo-700 transition"
              >
                <FaCamera className="text-white text-sm" />
              </div>
            </div>

            {imageLoading && (
              <div className="mt-4 flex items-center justify-center text-indigo-600">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-indigo-600 mr-2"></div>
                <span className="text-sm">Uploading image...</span>
              </div>
            )}

            <p className="text-slate-500 text-sm mt-4">Click the image to upload a new profile picture</p>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
        </div>

        {/* Profile Information */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-indigo-100 rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-indigo-900 mb-6">Personal Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
              <input
                type="email"
                placeholder="Enter your email address"
                value={tempEmail}
                onChange={(e) => setTempEmail(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Save Changes Button */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={saveProfileDetails}
          disabled={isLoading || imageLoading}
          className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 ${
            isLoading || imageLoading
              ? "bg-slate-400 cursor-not-allowed text-white"
              : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md hover:shadow-lg"
          }`}
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
              Saving Changes...
            </div>
          ) : (
            "Save Changes"
          )}
        </button>
      </div>

      {/* Security Section */}
      <div className="mt-8 bg-gradient-to-br from-blue-50 to-indigo-50 border border-indigo-100 rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-indigo-900 mb-6">Security Settings</h2>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-slate-800">Change Password</h3>
            <p className="text-slate-600 text-sm mt-1">Update your password to keep your account secure</p>
          </div>
          <button
            onClick={() => navigate("/forgot-password")}
            className="px-6 py-3 bg-white hover:bg-slate-100 text-slate-700 font-medium rounded-lg border border-slate-200 shadow-sm transition"
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileForm;
