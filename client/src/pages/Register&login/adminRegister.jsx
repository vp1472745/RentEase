import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../lib/axios";
import { toast } from "react-toastify";
import { FiEye, FiEyeOff, FiX } from "react-icons/fi";
import { motion } from "framer-motion";
import { FaUserShield } from "react-icons/fa";

const AdminRegister = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [backendStatus, setBackendStatus] = useState("checking");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    console.log("🔑 Environment Variables:", {
      cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
      uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
      apiUrl: import.meta.env.VITE_API_URL,
    });
  }, []);

  useEffect(() => {
    const testBackendConnection = async () => {
      try {
        console.log("🔄 Testing backend connection...");
        const response = await axios.get("/api/admin/test", {
          timeout: 5000,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        if (response.data.status === "success") {
          console.log("✅ Backend connection successful:", response.data.message);
          setBackendStatus("connected");
          toast.success("Connected to backend server");
        } else {
          console.warn("⚠️ Backend returned unexpected status:", response.data);
          setBackendStatus("error");
          toast.warning("Backend server returned unexpected response");
        }
      } catch (error) {
        console.error("❌ Backend connection test failed:", error);
        setBackendStatus("error");
        toast.error("Failed to connect to backend server");
      }
    };

    testBackendConnection();
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    } else if (!/^[a-zA-Z\s]*$/.test(formData.name)) {
      newErrors.name = "Name should only contain letters and spaces";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid 10-digit Indian phone number";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])/.test(formData.password)) {
      newErrors.password = "Password must contain at least one lowercase letter";
    } else if (!/(?=.*[A-Z])/.test(formData.password)) {
      newErrors.password = "Password must contain at least one uppercase letter";
    } else if (!/(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must contain at least one number";
    } else if (!/(?=.*[!@#$%^&*])/.test(formData.password)) {
      newErrors.password = "Password must contain at least one special character";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axios.get("/api/admin/test");
      console.log("✅ Backend connection test:", response.data);
    } catch (error) {
      console.error("❌ Backend connection test failed:", error);
      toast.error("Cannot connect to server. Please try again later.");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const registrationData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: "admin",
      };

      console.log("📤 Sending registration request:", {
        ...registrationData,
        password: "********",
      });

      const response = await axios.post("/api/admin/register", registrationData);

      if (response.data.success) {
        toast.success("Registration successful! Redirecting to login...");
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
        }
        setTimeout(() => {
          navigate("/admin/login");
        }, 2000);
      } else {
        toast.error(response.data.message || "Registration failed");
      }
    } catch (error) {
      console.error("❌ Registration error:", error);
      if (error.response) {
        toast.error(error.response.data.message || "Registration failed");
      } else if (error.request) {
        toast.error("No response from server. Please try again.");
      } else {
        toast.error("Error setting up request. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="flex justify-center">
          <FaUserShield className="h-12 w-12 text-purple-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Admin Registration
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 border border-purple-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {["name", "email", "phone"].map((field) => (
              <div key={field}>
                <label htmlFor={field} className="block text-sm font-medium text-gray-700">
                  {field === "name" ? "Full Name" : field === "email" ? "Email Address" : "Phone Number"}
                </label>
                <input
                  id={field}
                  name={field}
                  type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
                  value={formData[field]}
                  onChange={handleChange}
                  required
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors[field] ? "border-red-300" : "border-gray-300"
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm`}
                  placeholder={
                    field === "name"
                      ? "Enter your full name"
                      : field === "email"
                      ? "Enter your email address"
                      : "Enter your 10-digit phone number"
                  }
                />
                {errors[field] && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <FiX className="mr-1" /> {errors[field]}
                  </p>
                )}
              </div>
            ))}

            {/* Password */}
            {["password", "confirmPassword"].map((field, i) => (
              <div key={field}>
                <label htmlFor={field} className="block text-sm font-medium text-gray-700">
                  {i === 0 ? "Password" : "Confirm Password"}
                </label>
                <div className="mt-1 relative">
                  <input
                    id={field}
                    name={field}
                    type={showPassword ? "text" : "password"}
                    value={formData[field]}
                    onChange={handleChange}
                    required
                    className={`appearance-none block w-full px-3 py-2 border ${
                      errors[field] ? "border-red-300" : "border-gray-300"
                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm`}
                    placeholder={i === 0 ? "Create a strong password" : "Confirm your password"}
                  />
                  {i === 0 && (
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <FiEyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <FiEye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  )}
                </div>
                {errors[field] && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <FiX className="mr-1" /> {errors[field]}
                  </p>
                )}
              </div>
            ))}

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 transition-colors duration-200 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Registering..." : "Register"}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="text-center text-sm text-gray-600">Already have an account?</div>
            <button
              onClick={() => navigate("/admin/login")}
              className="mt-2 w-full flex justify-center py-2 px-4 border border-purple-500 rounded-md shadow-sm text-sm font-medium text-purple-600 hover:bg-purple-50"
            >
              Sign in to your account
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminRegister;
