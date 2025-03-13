import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../lib/axios";
import { Eye, EyeOff } from "lucide-react"; // ✅ Import Icons
import signup from "../assets/singup.gif";
const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // ✅ Password Visibility State
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // API Call for login
      const response = await API.post("/api/auth/login", formData);

      // Extracting response data
      const data = response.data;

      // Show success message
      alert(data.msg || "Login successful!");

      // If API returns a token, store it (if required)
      if (data.token) {
        localStorage.setItem("authToken", data.token);
      }

      navigate("/"); // Redirect to home page or any other page after login
    } catch (err) {
      console.error("Login Error:", err);
      setError(err.response?.data?.msg || "Login failed. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="flex bg-black w-200 h-160">
        <div>
          <img src={signup} alt="" className="bg-white  w-150 " />
        </div>
        <div>
          <form onSubmit={handleSubmit} className="bg-white p-6 h-160 w-96 ">
            <h2 className="text-2xl font-bold mb-4">Login</h2>

            {error && <p className="text-red-500">{error}</p>}

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded mb-2"
            />

            {/* Password Input with Toggle */}
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded mb-4 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-2 text-gray-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded"
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
    </div>
  );
};

export default Login;
