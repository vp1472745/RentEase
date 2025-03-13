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

  const navigate = useNavigate();

  // Google login success handler
  const handleGoogleSuccess = async (response) => {
    try {
      const { credential } = response;
      const googleUser  = await axios.post("/api/auth/google-signup", {
        token: credential,
      });

      toast.success(googleUser .data.msg || "Google signup successful!"); // Show success notification
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

  // Handling OTP send request
  const handleSendOtp = async () => {
    if (!validateEmail(email)) {
      toast.error("Invalid email format."); // Show error notification
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post("/api/auth/signup", { email });
      setOtpSent(true);
      toast.success(response.data.msg || "OTP sent to your email."); // Show success notification
      startCountdown();
    } catch (error) {
      toast.error(error.response?.data?.msg || "Error sending OTP. Try again."); // Show error notification
    } finally {
      setLoading(false);
    }
  };

  // Handling OTP verification
  const handleVerifyOtp = async () => {
    if (!validatePassword(password)) {
      toast.error("Password must be at least 8 characters long, include an uppercase letter, a number, and a special character."); // Show error notification
      return;
    }
    if (!validatePhone(phone)) {
      toast.error("Phone number must be 10 digits."); // Show error notification
      return;
    }
    if (!termsAccepted) {
      toast.error("You must accept the terms and conditions."); // Show error notification
      return;
    }
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

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-200 to-blue-500">
      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-4xl mt-5 bg-white shadow-lg rounded-lg p-8">
        <div className="w-full md:w-1/2 mb-5 md:mb-0">
          <img src={siin} alt="Signup" className="w-full max-w-lg h-auto  rounded-lg" />
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
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                disabled={loading}
              />
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
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                disabled={loading}
              />
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                disabled={loading}
              />
              <div className="relative mb-4">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-500 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />} {/* Eye icons */}
                </button>
              </div>
              <input
                type="text"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                disabled={loading}
              />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                disabled={loading}
              >
                <option value="user">Select Role</option>
                <option value="tenant">Tenant</option>
                <option value="owner">Owner</option>
                <option value="admin">Admin</option>
              </select>
              <label className="flex items-center mb-4">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={() => setTermsAccepted(!termsAccepted)}
                  className="mr-2"
                />
                I agree to the terms and conditions
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
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
};

export default Signup;