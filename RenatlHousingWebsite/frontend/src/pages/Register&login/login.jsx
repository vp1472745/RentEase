import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../lib/axios";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = ({ setIsAuthenticated, setUser }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post("/api/auth/login", formData);
      const data = response.data;
      toast.success(data.msg || "Login successful!");
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("role", data.user.role);
        setIsAuthenticated(true);
        setUser(data.user);
        navigate("/");
      }
    } catch (err) {
      toast.error(err.response?.data?.msg || "Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      {/* Back Button */}
      <div className="absolute top-4 left-4 sm:left-6">
        <button
          onClick={() => navigate("/")}
          className="flex items-center px-3 py-2 bg-white/80 backdrop-blur-sm rounded-md shadow hover:bg-white transition-all duration-300 text-gray-700 hover:text-gray-900 text-sm sm:text-base"
        >
          <ArrowLeft className="mr-2" size={18} />
          <span>Back</span>
        </button>
      </div>

      {/* Form Card */}
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm sm:max-w-md md:max-w-lg bg-white/90 backdrop-blur-lg shadow-lg rounded-2xl p-6 sm:p-8 space-y-5"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800">
          Login
        </h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
        />

        <div className="relative w-full">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition"
        >
          Login
        </button>

        <div className="text-center text-sm">
          <p className="mb-1">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="text-blue-600 hover:underline font-medium"
            >
              Signup
            </button>
          </p>
          <p>
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-blue-600 hover:underline font-medium"
            >
              Forgot Password?
            </button>
          </p>
        </div>
      </form>

      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default Login;
