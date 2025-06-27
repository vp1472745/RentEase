import React, { useState } from "react";
import axios from "../../axios";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft, Shield, User, Mail, Phone, Lock, Building } from "lucide-react"; // Import additional icons
import siin from "../../assets/sii.gif";
import sing from "../../assets/singup.gif";
import { GoogleLogin } from "@react-oauth/google"; // Import GoogleLogin component
import security from "../../assets/security.png";
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for toast notifications

const Signup = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("user");
  const [countdown, setCountdown] = useState(60);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [msg, setMsg] = useState("");
  
  // Validation states
  const [emailError, setEmailError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [nameError, setNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [roleError, setRoleError] = useState("");

  const navigate = useNavigate();

  // Google login success handler
  const handleGoogleSuccess = async (response) => {
    try {
      const { credential } = response;
      const googleUser  = await axios.post("/api/auth/google-signup", {
        token: credential,
      });

      toast.success(googleUser.data.msg || "Google signup successful!"); // Show success notification
      navigate("/login"); // Redirect after successful signup
    } catch (error) {
      toast.error(error.response?.data?.msg || "Google signup failed. Try again."); // Show error notification
    }
  };

  // Google login failure handler
  const handleGoogleFailure = (error) => {
    toast.error("Google login failed. Please try again."); // Show error notification
  };

  // Email validation using regex
  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  // Password validation for strong password
  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  // Phone validation
  const validatePhone = (phone) => {
    const regex = /^[6789][0-9]{9}$/; // Starts with 6, 7, 8, or 9 and followed by 9 digits
    return regex.test(phone);
  };

  // Name validation
  const validateName = (name) => {
    return name.trim().length >= 3;
  };

  // Handling OTP send request
  const handleSendOtp = async () => {
    setEmailError("");
    if (!email) {
      setEmailError("Email is required");
      return;
    }
    if (!validateEmail(email)) {
      setEmailError("Invalid email format");
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.post("/api/auth/signup", { email });
      setOtpSent(true);
      toast.success(response.data.msg || "OTP sent to your email."); // Show success notification
      startCountdown();
    } catch (error) {
      setEmailError(error.response?.data?.msg || "Error sending OTP. Try again.");
      toast.error(error.response?.data?.msg || "Error sending OTP. Try again."); // Show error notification
    } finally {
      setLoading(false);
    }
  };

  // Handling OTP verification
  const handleVerifyOtp = async () => {
    let isValid = true;
    
    // Reset all errors
    setOtpError("");
    setNameError("");
    setPasswordError("");
    setPhoneError("");
    setRoleError("");
    
    // Validate OTP
    if (!otp) {
      setOtpError("OTP is required");
      isValid = false;
    } else if (otp.length !== 6) {
      setOtpError("OTP must be 6 digits");
      isValid = false;
    }
    
    // Validate Name
    if (!name) {
      setNameError("Name is required");
      isValid = false;
    } else if (!validateName(name)) {
      setNameError("Name must be at least 3 characters");
      isValid = false;
    }
    
    // Validate Password
    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (!validatePassword(password)) {
      setPasswordError("Password must be at least 8 characters with uppercase, number, and special character");
      isValid = false;
    }
    
    // Validate Phone
    if (!phone) {
      setPhoneError("Phone number is required");
      isValid = false;
    } else if (!validatePhone(phone)) {
      setPhoneError("Phone must be 10 digits starting with 6/7/8/9");
      isValid = false;
    }
    
    // Validate Role
    if (!role || role === "user") {
      setRoleError("Please select a role");
      isValid = false;
    }
    
    if (!termsAccepted) {
      toast.error("You must accept the terms and conditions.");
      return;
    }
    
    if (!isValid) return;
    
    setLoading(true);
    try {
      const response = await axios.post("/api/auth/verify-otp", {
        email,
        otp,
        name,
        password,
        phone,
        role,
      });
      toast.success(response.data.msg || "OTP verified successfully!"); // Show success notification
      navigate("/login");
    } catch (error) {
      setOtpError(error.response?.data?.msg || "Invalid OTP. Try again.");
      toast.error(error.response?.data?.msg || "Invalid OTP. Try again."); // Show error notification
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/api/auth/resend-otp", { email });
      toast.success(response.data.msg || "OTP resent!"); // Show success notification
      startCountdown();
    } catch (error) {
      toast.error(error.response?.data?.msg || "Error resending OTP."); // Show error notification
    } finally {
      setLoading(false);
    }
  };

  const startCountdown = () => {
    setResendDisabled(true);
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          setResendDisabled(false);
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Handle input changes with validation
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (!e.target.value) {
      setEmailError("Email is required");
    } else if (!validateEmail(e.target.value)) {
      setEmailError("Invalid email format");
    } else {
      setEmailError("");
    }
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
    if (!e.target.value) {
      setNameError("Name is required");
    } else if (!validateName(e.target.value)) {
      setNameError("Name must be at least 3 characters");
    } else {
      setNameError("");
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (!e.target.value) {
      setPasswordError("Password is required");
    } else if (!validatePassword(e.target.value)) {
      setPasswordError("Password must be at least 8 characters with uppercase, number, and special character");
    } else {
      setPasswordError("");
    }
  };

  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
    if (!e.target.value) {
      setPhoneError("Phone number is required");
    } else if (!validatePhone(e.target.value)) {
      setPhoneError("Phone must be 10 digits starting with 6-9");
    } else {
      setPhoneError("");
    }
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
    if (!e.target.value || e.target.value === "user") {
      setRoleError("Please select a role");
    } else {
      setRoleError("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Back Button */}
      <div className="absolute top-4  sm:top-6 sm:left-6 z-10 ">
        <button
          onClick={() => navigate("/")}
          className="flex items-center space-x-2 px-3 py-2 sm:px-4 sm:py-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg hover:bg-white transition-all duration-300 text-gray-700 hover:text-gray-900 text-sm sm:text-base"
        >
          <ArrowLeft size={16} className="sm:w-5 sm:h-5" />
          <span className="font-medium hidden sm:inline">Back to Home</span>
          <span className="font-medium sm:hidden">Back</span>
        </button>
      </div>

      <div className="flex justify-center items-center min-h-screen px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-6xl">
          <div className="flex justify-center items-center">
            {/* Right Side - Form */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl p-4 sm:p-6 lg:p-8 xl:p-12 w-full max-w-md">
              <div className="text-center mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
                  Create Your Account
                </h1>
                <p className="text-sm sm:text-base text-gray-600">
                  Join RentEase and discover your perfect home
                </p>
              </div>

              {msg && (
                <div
                  className={`p-3 sm:p-4 mb-4 sm:mb-6 rounded-xl border-l-4 ${
                    msg.includes("Error") 
                      ? "bg-red-50 text-red-800 border-red-400" 
                      : "bg-green-50 text-green-800 border-green-400"
                  }`}
                >
                  {msg}
                </div>
              )}

              {!otpSent ? (
                <div className="space-y-4 sm:space-y-6">
                  {/* Email Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={handleEmailChange}
                        onBlur={handleEmailChange}
                        className={`w-full pl-9 sm:pl-10 pr-4 py-3 sm:py-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-sm sm:text-base ${
                          emailError ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-blue-500"
                        }`}
                        disabled={loading}
                      />
                    </div>
                    {emailError && <p className="text-red-500 text-xs sm:text-sm mt-2 flex items-center">
                      <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                      {emailError}
                    </p>}
                  </div>
                  
                  {/* Send OTP Button */}
                  <button
                    onClick={handleSendOtp}
                    className={`w-full py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg text-sm sm:text-base ${
                      loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Sending OTP...</span>
                      </div>
                    ) : (
                      "Send OTP"
                    )}
                  </button>

                  {/* Divider */}
                  <div className="relative my-4 sm:my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-xs sm:text-sm">
                      <span className="px-4 bg-white text-gray-500">Or continue with</span>
                    </div>
                  </div>

                  {/* Google Sign-up Button */}
                  <div className="flex justify-center">
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={handleGoogleFailure}
                      useOneTap
                      shape="rectangular"
                      text="signup_with"
                      theme="outline"
                    />
                  </div>

                  {/* Security Note */}
                  <div className="text-center p-3 sm:p-4 bg-blue-50 rounded-xl">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <Shield className="text-blue-600" size={18} />
                      <span className="text-blue-800 font-semibold text-sm sm:text-base">Your security is our priority</span>
                    </div>
                    <p className="text-blue-700 text-xs sm:text-sm">All your data is encrypted and secure</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 sm:space-y-6">
                  {/* OTP Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Verification Code
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        maxLength={6}
                        className={`w-full pl-9 sm:pl-10 pr-4 py-3 sm:py-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-sm sm:text-base ${
                          otpError ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-blue-500"
                        }`}
                        disabled={loading}
                      />
                    </div>
                    {otpError && <p className="text-red-500 text-xs sm:text-sm mt-2 flex items-center">
                      <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                      {otpError}
                    </p>}
                  </div>
                  
                  {/* Name Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="text"
                        placeholder="Enter your full name"
                        value={name}
                        onChange={handleNameChange}
                        onBlur={handleNameChange}
                        className={`w-full pl-9 sm:pl-10 pr-4 py-3 sm:py-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-sm sm:text-base ${
                          nameError ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-blue-500"
                        }`}
                        disabled={loading}
                      />
                    </div>
                    {nameError && <p className="text-red-500 text-xs sm:text-sm mt-2 flex items-center">
                      <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                      {nameError}
                    </p>}
                  </div>
                  
                  {/* Password Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        value={password}
                        onChange={handlePasswordChange}
                        onBlur={handlePasswordChange}
                        className={`w-full pl-9 sm:pl-10 pr-12 py-3 sm:py-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-sm sm:text-base ${
                          passwordError ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-blue-500"
                        }`}
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {passwordError && <p className="text-red-500 text-xs sm:text-sm mt-2 flex items-center">
                      <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                      {passwordError}
                    </p>}
                  </div>
                  
                  {/* Phone Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="tel"
                        placeholder="Enter your phone number"
                        value={phone}
                        onChange={handlePhoneChange}
                        onBlur={handlePhoneChange}
                        className={`w-full pl-9 sm:pl-10 pr-4 py-3 sm:py-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-sm sm:text-base ${
                          phoneError ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-blue-500"
                        }`}
                        disabled={loading}
                      />
                    </div>
                    {phoneError && <p className="text-red-500 text-xs sm:text-sm mt-2 flex items-center">
                      <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                      {phoneError}
                    </p>}
                  </div>
                  
                  {/* Role Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      I want to
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <select
                        value={role}
                        onChange={handleRoleChange}
                        onBlur={handleRoleChange}
                        className={`w-full pl-9 sm:pl-10 pr-4 py-3 sm:py-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 appearance-none bg-white text-sm sm:text-base ${
                          roleError ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-blue-500"
                        }`}
                        disabled={loading}
                      >
                        <option value="user">Select your role</option>
                        <option value="tenant">Rent a property</option>
                        <option value="owner">List my property</option>
                      </select>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    {roleError && <p className="text-red-500 text-xs sm:text-sm mt-2 flex items-center">
                      <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                      {roleError}
                    </p>}
                  </div>
                  
                  {/* Terms and Conditions */}
                  <div className="flex items-start space-x-3 p-3 sm:p-4 bg-gray-50 rounded-xl">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={() => setTermsAccepted(!termsAccepted)}
                      className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label className="text-xs sm:text-sm text-gray-700">
                      I agree to the{" "}
                      <a href="/condition.pdf" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 font-medium underline">
                        Terms and Conditions
                      </a>
                    </label>
                  </div>

                  {/* Verify OTP Button */}
                  <button
                    onClick={handleVerifyOtp}
                    className={`w-full py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg text-sm sm:text-base ${
                      loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Creating Account...</span>
                      </div>
                    ) : (
                      "Create Account"
                    )}
                  </button>
                  
                  {/* Resend OTP Button */}
                  <button
                    onClick={handleResendOtp}
                    disabled={resendDisabled || loading}
                    className={`w-full py-2 sm:py-3 text-xs sm:text-sm rounded-xl transition-all duration-200 ${
                      resendDisabled 
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {resendDisabled ? `Resend OTP in ${countdown}s` : "Resend OTP"}
                  </button>
                </div>
              )}

              {/* Login Link */}
              <div className="text-center mt-6 sm:mt-8">
                <p className="text-xs sm:text-sm text-gray-600">
                  Already have an account?{" "}
                  <button
                    onClick={() => navigate("/login")}
                    className="text-blue-600 hover:text-blue-700 font-semibold underline"
                  >
                    Sign in here
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <ToastContainer 
        position="top-right" 
        autoClose={5000} 
        hideProgressBar={false} 
        newestOnTop={false} 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
      />
    </div>
  );
};

export default Signup;