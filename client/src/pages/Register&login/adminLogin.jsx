import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../lib/axios"; // Ensure this has withCredentials: true
import { toast } from "react-toastify";
import { FiUser, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { FaUserShield } from "react-icons/fa";
import { motion } from "framer-motion";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("/api/admin/login", formData, {
        withCredentials: true,
      });

      console.log("Login response:", response.data); // Debug log

      // Prefer 'admin', fallback to 'user', fallback to null
      const user = response.data?.admin || response.data?.user || null;
      console.log("User object:", user); // Debug log

      if (user && user.role === "admin") {
        toast.success("Admin login successful!");
        localStorage.setItem("adminInfo", JSON.stringify(user));
        navigate("/admin/dashboard");
      } else {
        toast.error("You are not authorized as an admin.");
      }
    } catch (err) {
      console.error("Login Error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 shadow-lg rounded-lg">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <FaUserShield className="mx-auto text-purple-600 text-4xl mb-2" />
          <h2 className="text-2xl font-bold text-gray-800">Admin Login</h2>
          <p className="text-sm text-gray-500">
            Sign in to manage your dashboard
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <FiUser className="absolute top-2.5 left-3 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <FiLock className="absolute top-2.5 left-3 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full pl-10 pr-10 py-2 border rounded-md focus:ring-2 focus:ring-purple-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-2.5 right-3 text-gray-400"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-sm text-red-600 bg-red-50 p-2 rounded">
              {error}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 text-white rounded-md font-semibold transition duration-200 ${
              loading
                ? "bg-purple-400 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Links */}
        <div className="mt-5 flex justify-between text-sm">
          <button
            onClick={() => navigate("/admin/register")}
            className="text-purple-600 hover:underline"
          >
            Register
          </button>
          <button
            onClick={() => navigate("/admin/forgot-password")}
            className="text-purple-600 hover:underline"
          >
            Forgot Password?
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
