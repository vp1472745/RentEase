import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../../lib/axios";
import { toast } from "react-toastify";
import { FiEye, FiEyeOff, FiUpload, FiX } from "react-icons/fi";
import { motion } from "framer-motion";
import { FaUserShield } from "react-icons/fa";

const AdminRegister = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [backendStatus, setBackendStatus] = useState("checking"); // 'checking', 'connected', 'error'
  const [error, setError] = useState(""); // Add error state
  const [success, setSuccess] = useState(""); // Add success state
  const [uploading, setUploading] = useState(false);
  
  // Add this at the start of the component to verify env variables
  useEffect(() => {
    console.log("🔑 Environment Variables:", {
      cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
      uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
      apiUrl: import.meta.env.VITE_API_URL
    });
  }, []);

  // Test backend connection
  useEffect(() => {
    const testBackendConnection = async () => {
      try {
        console.log("🔄 Testing backend connection...");
        const response = await axios.get("/api/admin/test", {
          timeout: 5000, // 5 second timeout
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
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

  // Enhanced validation
  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    } else if (!/^[a-zA-Z\s]*$/.test(formData.name)) {
      newErrors.name = "Name should only contain letters and spaces";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid 10-digit Indian phone number";
    }

    // Password validation
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

    // Confirm password validation
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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    console.log("🚀 Starting admin registration form submission");
    
    // Check backend connection first
    try {
      const response = await axios.get("/api/admin/test");
      console.log("✅ Backend connection test:", response.data);
    } catch (error) {
      console.error("❌ Backend connection test failed:", error);
      toast.error("Cannot connect to server. Please try again later.");
      return;
    }

    // Validate form
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Prepare registration data
      const registrationData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
       
        role: "admin"
      };

      console.log("📤 Sending registration request with data:", {
        ...registrationData,
        password: "********" // Hide password in logs
      });

      // Send registration request
      const response = await axios.post("/api/admin/register", registrationData);
      
      console.log("✅ Registration response:", {
        status: response.status,
        headers: response.headers,
        data: response.data
      });

      if (response.data.success) {
        toast.success("Registration successful! Redirecting to login...");
        // Store token if provided
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
        }
        // Redirect after a short delay
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
    <div className="space-y-4 sm:space-y-6 overflow-y-auto max-h-[calc(100vh-120px)] scrollbar-thin scrollbar-thumb-[#334155] scrollbar-track-[#1E293B] bg-[#0F172A] px-2 py-4">
      <div className="bg-[#1E293B] rounded-xl shadow-sm border border-[#334155] p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-[#334155] rounded-full flex items-center justify-center">
              <FaUserShield className="text-[#3B82F6] text-2xl" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#F8FAFC] mb-2">Admin Registration</h1>
          <p className="text-[#94A3B8] max-w-md mx-auto">
            Create a new admin account with full access to the platform management system.
          </p>
        </div>

        {/* Backend Status */}
        <div className="mb-6">
          <div className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium ${
            backendStatus === 'connected' 
              ? 'bg-[#22C55E]/20 text-[#22C55E]' 
              : backendStatus === 'error' 
              ? 'bg-[#FACC15]/20 text-[#FACC15]' 
              : 'bg-[#3B82F6]/20 text-[#3B82F6]'
          }`}>
            <div className={`w-2 h-2 rounded-full mr-2 ${
              backendStatus === 'connected' 
                ? 'bg-[#22C55E]' 
                : backendStatus === 'error' 
                ? 'bg-[#FACC15]' 
                : 'bg-[#3B82F6]'
            }`}></div>
            {backendStatus === 'connected' 
              ? 'Backend Connected' 
              : backendStatus === 'error' 
              ? 'Backend Connection Failed' 
              : 'Checking Backend...'}
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#22C55E]/10 border border-[#22C55E] rounded-lg p-4 mb-6"
          >
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-[#22C55E]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-[#22C55E]">{success}</p>
              </div>
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#FACC15]/10 border border-[#FACC15] rounded-lg p-4 mb-6"
          >
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-[#FACC15]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-[#FACC15]">{error}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Registration Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Form Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[#F8FAFC] mb-2">
                  Full Name *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-colors bg-[#1E293B] text-[#F8FAFC] placeholder-[#94A3B8] ${
                    errors.name ? "border-[#FACC15]" : "border-[#334155]"
                  }`}
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-[#FACC15] flex items-center">
                    <FiX className="mr-1" /> {errors.name}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#F8FAFC] mb-2">
                  Email Address *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-colors bg-[#1E293B] text-[#F8FAFC] placeholder-[#94A3B8] ${
                    errors.email ? "border-[#FACC15]" : "border-[#334155]"
                  }`}
                  placeholder="Enter your email address"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-[#FACC15] flex items-center">
                    <FiX className="mr-1" /> {errors.email}
                  </p>
                )}
              </div>

              {/* Phone Field */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-[#F8FAFC] mb-2">
                  Phone Number *
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-colors bg-[#1E293B] text-[#F8FAFC] placeholder-[#94A3B8] ${
                    errors.phone ? "border-[#FACC15]" : "border-[#334155]"
                  }`}
                  placeholder="Enter your phone number"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-[#FACC15] flex items-center">
                    <FiX className="mr-1" /> {errors.phone}
                  </p>
                )}
              </div>

            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#F8FAFC] mb-2">
                  Password *
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-colors bg-[#1E293B] text-[#F8FAFC] placeholder-[#94A3B8] ${
                      errors.password ? "border-[#FACC15]" : "border-[#334155]"
                    }`}
                    placeholder="Create a strong password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FiEyeOff className="h-5 w-5 text-[#94A3B8] hover:text-[#F8FAFC]" />
                    ) : (
                      <FiEye className="h-5 w-5 text-[#94A3B8] hover:text-[#F8FAFC]" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-[#FACC15] flex items-center">
                    <FiX className="mr-1" /> {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#F8FAFC] mb-2">
                  Confirm Password *
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-colors bg-[#1E293B] text-[#F8FAFC] placeholder-[#94A3B8] ${
                    errors.confirmPassword ? "border-[#FACC15]" : "border-[#334155]"
                  }`}
                  placeholder="Confirm your password"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-[#FACC15] flex items-center">
                    <FiX className="mr-1" /> {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Password Requirements */}
              <div className="bg-[#334155] rounded-lg p-4">
                <h4 className="text-sm font-medium text-[#F8FAFC] mb-3">Password Requirements:</h4>
                <ul className="space-y-2 text-xs text-[#94A3B8]">
                  <li className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      formData.password.length >= 8 ? 'bg-[#22C55E]' : 'bg-[#94A3B8]'
                    }`}></div>
                    At least 8 characters
                  </li>
                  <li className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      /[a-z]/.test(formData.password) ? 'bg-[#22C55E]' : 'bg-[#94A3B8]'
                    }`}></div>
                    One lowercase letter
                  </li>
                  <li className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      /[A-Z]/.test(formData.password) ? 'bg-[#22C55E]' : 'bg-[#94A3B8]'
                    }`}></div>
                    One uppercase letter
                  </li>
                  <li className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      /\d/.test(formData.password) ? 'bg-[#22C55E]' : 'bg-[#94A3B8]'
                    }`}></div>
                    One number
                  </li>
                  <li className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      /[!@#$%^&*]/.test(formData.password) ? 'bg-[#22C55E]' : 'bg-[#94A3B8]'
                    }`}></div>
                    One special character (!@#$%^&*)
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-[#334155]">
            <button
              type="submit"
              disabled={loading || backendStatus === 'error'}
              className="flex-1 bg-[#3B82F6] text-[#F8FAFC] py-3 px-6 rounded-lg hover:bg-[#2563EB] disabled:bg-[#334155] disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#F8FAFC]"></div>
                  <span>Creating Account...</span>
                </>
              ) : (
                <span>Create Admin Account</span>
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/login')}
              className="flex-1 bg-[#334155] text-[#F8FAFC] py-3 px-6 rounded-lg hover:bg-[#475569] transition-colors font-medium"
            >
              Back to Login
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default AdminRegister;