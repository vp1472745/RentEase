import React, { useState } from "react";
import axios from "../axios.js";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react"; // Import eye icons
// import signup from "../assets/singup.gif";
import siin from "../assets/sii.gif"
import { GoogleLogin } from "@react-oauth/google"; // Import GoogleLogin component
import security from "../assets/security.png"
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
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const navigate = useNavigate();

  // Google login success handler
  const handleGoogleSuccess = async (response) => {
    try {
      const { credential } = response;
      const googleUser = await axios.post("/api/auth/google-signup", {
        token: credential,
      });

      setMsg(googleUser.data.msg || "Google signup successful!");
      navigate("/login"); // Redirect after successful signup
    } catch (error) {
      setMsg(error.response?.data?.msg || "Google signup failed. Try again.");
    }
  };

  // Google login failure handler
  const handleGoogleFailure = (error) => {
    setMsg("Google login failed. Please try again.");
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
      setMsg("Invalid email format.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post("/api/auth/signup", { email });
      setOtpSent(true);
      setMsg(response.data.msg || "OTP sent to your email.");
      startCountdown();
    } catch (error) {
      setMsg(error.response?.data?.msg || "Error sending OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handling OTP verification
  const handleVerifyOtp = async () => {
    if (!validatePassword(password)) {
      setMsg("Password must be at least 8 characters long, include an uppercase letter, a number, and a special character.");
      return;
    }
    if (!validatePhone(phone)) {
      setMsg("Phone number must be 10 digits.");
      return;
    }
    if (!termsAccepted) {
      setMsg("You must accept the terms and conditions.");
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
      setMsg(response.data.msg || "OTP verified successfully!");
      navigate("/login");
    } catch (error) {
      setMsg(error.response?.data?.msg || "Invalid OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/api/auth/resend-otp", { email });
      setMsg(response.data.msg || "OTP resent!");
      startCountdown();
    } catch (error) {
      setMsg(error.response?.data?.msg || "Error resending OTP.");
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
    <div className="flex justify-center items-center min-h-screen bg-gray-200 rounded-lg" id="a">
      <div className="flex flex-col md:flex-row items-center justify-center w-400 max-w-4xl mt-5 bg-black border  border-black">
        <div className="w-full md:w-1/2 mb-5 md:mb-0 mt-5 ">
          <img src={siin} alt="Signup" className="w-full max-w-lg h-auto shadow-lg" />
        </div>
        <div className="w-full md:w-1/2 mt-5">
          <div className="w-full p-10 bg-white   shadow-lg border border-gray-300 h-174">
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
                  className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black-500"
                  disabled={loading}
                />
                <button
                  onClick={handleSendOtp}
                  className={`w-full p-3 mb-5 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer border-black transition duration-200 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
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


<div className="mt-5 text-center ml-11 ms-ml-15">
          <img src={security} alt="Signup" className="w-65 h-60 text-center " />
          
        </div>
        <p className="ml-5 text-center text-blue-800 font-bold ">"Your security is our priority at RentEase.com"</p>
              </>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black-500"
                  disabled={loading}
                />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black-500"
                  disabled={loading}
                />
                <div className="relative mb-4">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black-500"
                    disabled={loading}
                    
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-500"
                  >
                   {showPassword ? <EyeOff size={20} /> : <Eye size={20} />} {/* Eye icons */}
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black-500"
                  disabled={loading}
                />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black-500"
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
      </div>
    </div>
  );
};

export default Signup;
