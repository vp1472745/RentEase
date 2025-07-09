import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../lib/axios";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import hero from "../../assets/hero.jpg";

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
      toast.success( "Login successful!");
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
    <div className="min-h-screen bg-gradient-to-r from-[#f0f2f8] via-[#e4ecf7] to-[#ffffff] flex flex-col lg:flex-row items-center justify-center px-2 py-6 lg:py-0">
      {/* Back Button */}
      <div className="absolute top-4 left-4 z-30">
        <button
          onClick={() => navigate("/")}
          className="flex items-center mt-3 space-x-2 px-3 py-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg hover:bg-white transition-all duration-300 text-gray-700 hover:text-gray-900 text-sm font-medium"
        >
          <ArrowLeft size={18} />
          <span className="hidden sm:inline">Back to Home</span>
          <span className="sm:hidden">Back</span>
        </button>
      </div>
      {/* Left Card: Logo, Image, Tagline */}
      <div className="flex flex-col items-center w-full max-w-md h-auto lg:h-[600px] bg-white rounded-3xl shadow-xl mb-6 lg:mb-0 lg:mr-10 p-0 overflow-hidden border border-purple-100">
        <div className="w-full flex flex-col items-center pt-8 pb-2 bg-gradient-to-b from-purple-50 to-white">
          <h1 className="text-purple-800 font-bold mb-5 text-2xl">RoomMilega.in</h1>
        </div>
        <img src={hero} alt="Find your perfect home" className="w-[400px] h-48 sm:h-56 md:h-64 lg:h-[320px] object-cover rounded-2xl" />
        <div className="flex flex-col items-center px-6 py-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-purple-700 mb-2 text-center">Welcome Back!</h2>
          <p className="text-base sm:text-lg text-gray-500 text-center max-w-xs">Login to <span className="text-purple-600 font-semibold">RoomMilega.in</span> and continue your property journey.</p>
        </div>
      </div>
      {/* Right Card: Login Form */}
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md h-auto lg:h-[600px] bg-gradient-to-br from-white via-blue-50 to-purple-50 rounded-3xl shadow-2xl border border-purple-100 flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-14 space-y-6"
      >
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-2 text-center">Login</h1>
          <p className="text-base sm:text-lg text-gray-600 text-center mb-4">Welcome back to <span className="text-purple-700 font-semibold">RoomMilega.in</span></p>
        </div>
        <div className="space-y-5 w-full">
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
        </div>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition mt-2 mb-4"
        >
          Login
        </button>
        <div className="text-center text-sm space-y-2 mt-2">
          <p>
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="text-blue-600 hover:underline font-medium"
            >
              Signup
            </button>
          </p>
          <p>
            <button
              type="button"
              onClick={() => navigate('/forgot-password')}
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
