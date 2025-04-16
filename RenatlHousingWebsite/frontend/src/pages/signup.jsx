import React, { useState } from "react";
import axios from "../axios.js";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react"; // Import eye icons
import siin from "../assets/sii.gif";
import sing from "../assets/singup.gif";
import { GoogleLogin } from "@react-oauth/google"; // Import GoogleLogin component
import security from "../assets/security.png";
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
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-200 to-blue-500">
      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-4xl mt-5 bg-white shadow-lg rounded-lg p-8">
        <div className="w-full md:w-1/2 mb-5 md:mb-0">
          <img src={siin} alt="Signup" className="w-full max-w-lg h-auto rounded-lg" />
        </div>
        <div className="w-full md:w-1/2">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Create Your Account</h2>

          {msg && (
            <div
              className={`p-2 mb-4 text-center rounded border ${msg.includes("Error") ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}
            >
              {msg}
            </div>
          )}

          {!otpSent ? (
            <>
              <div className="mb-4">
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={handleEmailChange}
                  className={`w-full p-3 border ${emailError ? "border-red-500" : "border-gray-300"} rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200`}
                  disabled={loading}
                />
                {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
              </div>
              
              <button
                onClick={handleSendOtp}
                className={`w-full p-3 mb-5 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer transition duration-200 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={loading}
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>

              {/* Google Sign-up Button */}
              <GoogleLogin
                onSuccess={handleGoogleSuccess} // Handle success
                onError={handleGoogleFailure} // Handle error
                useOneTap
                shape="rectangular"
                text="signup_with"
                theme="outline"
              />

              <div className="mt-5 text-center">
                <img src={security} alt="Signup" className="w-65 h-60 text-center " />
              </div>
              <p className="text-center text-blue-800 font-bold">"Your security is our priority at RentEase.com"</p>
            </>
          ) : (
            <>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  onBlur={(e) => {
                    if (!e.target.value) {
                      setOtpError("OTP is required");
                    } else if (e.target.value.length !== 6) {
                      setOtpError("OTP must be 6 digits");
                    } else {
                      setOtpError("");
                    }
                  }}
                  className={`w-full p-3 border ${otpError ? "border-red-500" : "border-gray-300"} rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200`}
                  disabled={loading}
                />
                {otpError && <p className="text-red-500 text-sm mt-1">{otpError}</p>}
              </div>
              
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={handleNameChange}
                  onBlur={handleNameChange}
                  className={`w-full p-3 border ${nameError ? "border-red-500" : "border-gray-300"} rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200`}
                  disabled={loading}
                />
                {nameError && <p className="text-red-500 text-sm mt-1">{nameError}</p>}
              </div>
              
              <div className="mb-4 relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={handlePasswordChange}
                  onBlur={handlePasswordChange}
                  className={`w-full p-3 border ${passwordError ? "border-red-500" : "border-gray-300"} rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200`}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-500 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
              </div>
              
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={handlePhoneChange}
                  onBlur={handlePhoneChange}
                  className={`w-full p-3 border ${phoneError ? "border-red-500" : "border-gray-300"} rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200`}
                  disabled={loading}
                />
                {phoneError && <p className="text-red-500 text-sm mt-1">{phoneError}</p>}
              </div>
              
              <div className="mb-4">
                <select
                  value={role}
                  onChange={handleRoleChange}
                  onBlur={handleRoleChange}
                  className={`w-full p-3 border ${roleError ? "border-red-500" : "border-gray-300"} rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200`}
                  disabled={loading}
                >
                  <option value="user">Select Role</option>
                  <option value="tenant">Tenant</option>
                  <option value="owner">Owner</option>
                  <option value="admin">Admin</option>
                </select>
                {roleError && <p className="text-red-500 text-sm mt-1">{roleError}</p>}
              </div>
              
              <label className="flex items-center mb-4">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={() => setTermsAccepted(!termsAccepted)}
                  className="mr-2"
                />
                <a href="/condition.pdf" target="_blank" rel="noopener noreferrer">I agree to the terms and conditions</a>              
              </label>

              <button
                onClick={handleVerifyOtp}
                className={`w-full p-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
              
              <button
                onClick={handleResendOtp}
                disabled={resendDisabled || loading}
                className={`w-full p-3 mt-3 text-white rounded transition duration-200 ${resendDisabled ? "bg-gray-400" : "bg-red-600 hover:bg-red-700"} ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {resendDisabled ? `Resend OTP in ${countdown}s` : "Resend OTP"}
              </button>
            </>
          )}
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