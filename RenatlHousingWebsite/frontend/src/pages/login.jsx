import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../lib/axios";
import { Eye, EyeOff } from "lucide-react";
import signup from "../assets/sii.gif";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = ({ setIsAuthenticated, setUser }) => {  // ✅ Navbar में Auth अपडेट करने के लिए Props जोड़ा
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
  
    try {
      console.log("🔹 Sending Login Request:", formData);
  
      const response = await API.post("/api/auth/login", formData);
      const data = response.data;
  
      console.log("✅ Login Successful:", data);
      toast.success(data.msg || "Login successful!");
  
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));  // ✅ यूज़र डेटा भी स्टोर किया
  
        setIsAuthenticated(true);  // ✅ Auth State अपडेट किया
        setUser(data.user);  // ✅ यूज़र डेटा सेट किया
  
        navigate("/");
      } else {
        console.error("❌ No token received from API");
      }
    } catch (err) {
      console.error("❌ Login Error:", err.response?.data || err.message);
      toast.error(err.response?.data?.msg || "Login failed. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-200 to-blue-500">
      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-4xl mt-5 bg-white shadow-lg rounded-lg p-8">
        <div className="w-full md:w-1/2 mb-5 md:mb-0">
          <img src={signup} alt="Signup" className="w-full max-w-lg h-auto rounded-lg" />
        </div>
        <div className="w-full md:w-1/2">
          <form onSubmit={handleLogin} className="bg-white p-6 rounded-lg ">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Login</h2>

            {error && <p className="text-red-500">{error}</p>}

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />

            {/* Password Input with Toggle */}
            <div className="relative w-full mb-4">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-2 text-gray-500 cursor-pointer"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200 cursor-pointer"
            >
              Login
            </button>

            <p className="mt-2 text-sm">
              Don't have an account?{" "}
              <a href="/signup" className="text-blue-500">
                Signup
              </a>
            </p>
            <p className="text-sm mt-2">
              <a href="/forgot-password" className="text-blue-500">
                Forgot Password?
              </a>
            </p>
          </form>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
};

export default Login;
