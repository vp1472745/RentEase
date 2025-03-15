import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../lib/axios";

const Profile = () => {
  const [user, setUser ] = useState({ name: "", email: "", phone: "", profileImage: "" });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token missing! User not authenticated.");
          navigate("/login");
          return;
        }

        const res = await axios.get("/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser (res.data);
      } catch (error) {
        console.error("Error fetching profile:", error.response?.data?.msg || error.message);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    setUser ({ ...user, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("name", user.name);
      formData.append("phone", user.phone);
      if (file) formData.append("profileImage", file);

      const res = await axios.put("/api/auth/profile/update", formData, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
      });

      setUser (res.data.user);
      alert(res.data.msg);
    } catch (error) {
      const errorMsg = error.response?.data?.msg || error.message || "Something went wrong!";
      console.error("Error updating profile:", errorMsg);
      alert(errorMsg);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="max-w-lg mx-auto mt-30 p-6 bg-white shadow-lg rounded-lg border border-gray-200 ">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Profile</h2>

      <div className="flex justify-center mb-4">
        <img
          src={user.profileImage ? `http://localhost:5000${user.profileImage}` : "/default-avatar.png"}
          alt="Profile"
          className="w-32 h-32 rounded-full border-4 border-blue-500 shadow-md"
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 font-semibold">Name</label>
          <input
            type="text"
            name="name"
            value={user.name}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold">Email</label>
          <input
            type="email"
            name="email"
            value={user.email}
            readOnly
            className="w-full p-3 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold">Phone</label>
          <input
            type="text"
            name="phone"
            value={user.phone}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold">Profile Image</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        {file && (
          <div className="flex justify-center mt-2">
            <img
              src={URL.createObjectURL(file)}
              alt="New Preview"
              className="w-24 h-24 rounded-full border-2 border-blue-500 shadow-md"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-200"
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>

      <button
        onClick={handleLogout}
        className="w-full mt-4 bg-red-600 text-white py-3 rounded-md hover:bg-red-700 transition duration-200"
      >
        Back to Home
      </button>
    </div>
  );
};

export default Profile;