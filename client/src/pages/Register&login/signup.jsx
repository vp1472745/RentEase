import React, { useState } from "react";
import axios from "../../lib/axios";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft, Shield, User, Mail, Phone, Lock, Building } from "lucide-react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import hero from "../../assets/hero.jpg";

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

  // Error States
  const [emailError, setEmailError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [nameError, setNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [roleError, setRoleError] = useState("");

  const navigate = useNavigate();

  const validateEmail = (email) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  const validatePassword = (password) => /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
  const validatePhone = (phone) => /^[6789][0-9]{9}$/.test(phone);
  const validateName = (name) => name.trim().length >= 3;

  const handleSendOtp = async () => {
    setEmailError("");
    if (!email) return setEmailError("Email is required");
    if (!validateEmail(email)) return setEmailError("Invalid email format");

    setLoading(true);
    try {
      const response = await axios.post("/api/auth/signup", { email });
      setOtpSent(true);
      toast.success(response.data.msg || "OTP sent");
      startCountdown();
    } catch (error) {
      const msg = error.response?.data?.msg || "Error sending OTP";
      setEmailError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    let isValid = true;
    setOtpError(""); setNameError(""); setPasswordError(""); setPhoneError(""); setRoleError("");

    if (!otp || otp.length !== 6) { setOtpError("OTP must be 6 digits"); isValid = false; }
    if (!name || !validateName(name)) { setNameError("Name must be at least 3 characters"); isValid = false; }
    if (!password || !validatePassword(password)) {
      setPasswordError("Password must be at least 8 characters with uppercase, number, and special character"); isValid = false;
    }
    if (!phone || !validatePhone(phone)) { setPhoneError("Phone must be 10 digits starting with 6-9"); isValid = false; }
    if (!role || role === "user") { setRoleError("Please select a role"); isValid = false; }

    if (!termsAccepted) return toast.error("Please accept terms and conditions");
    if (!isValid) return;

    setLoading(true);
    try {
      const response = await axios.post("/api/auth/verify-otp", {
        email, otp, name, password, phone, role
      });
      toast.success(response.data.msg || "Account created!");
      navigate("/login");
    } catch (error) {
      const msg = error.response?.data?.msg || "OTP verification failed";
      setOtpError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/api/auth/resend-otp", { email });
      toast.success(response.data.msg || "OTP resent");
      startCountdown();
    } catch (error) {
      toast.error(error.response?.data?.msg || "Error resending OTP");
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
    <div className="min-h-screen bg-gradient-to-r from-[#eef2ff] via-[#f3f4f6] to-[#ffffff] flex flex-col lg:flex-row items-center justify-center px-2 py-6 lg:py-0">
      
      {/* Back Button */}
      <div className="absolute top-4 left-4 z-30">
        <button
          onClick={() => navigate("/")}
          className="flex items-center px-3 py-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg hover:bg-white transition text-gray-700 text-sm font-medium"
        >
          <ArrowLeft size={18} />
          <span className="ml-2">Back to Home</span>
        </button>
      </div>

      {/* Left Card */}
      <div className="flex flex-col items-center w-full max-w-md bg-white rounded-3xl shadow-xl mb-6 lg:mb-0 lg:mr-10 overflow-hidden border border-purple-100">
        <h1 className="text-purple-800 font-bold mt-8 mb-4 text-2xl">RoomMilega.in</h1>
        <img src={hero} alt="hero" className="w-full h-64 object-cover" />
        <div className="p-6 text-center">
          <h2 className="text-2xl font-extrabold text-purple-700 mb-2">Find Your Perfect Home</h2>
          <p className="text-gray-500">
            Join <span className="text-purple-600 font-semibold">RoomMilega.in</span> and find the best rental properties for you.
          </p>
        </div>
      </div>

      {/* Right Card */}
      <div className="flex flex-1 justify-center items-center w-full max-w-md h-auto bg-white rounded-3xl shadow-2xl border border-purple-100">
        <div className="w-full max-h-[90vh] overflow-y-auto flex flex-col justify-start px-6 py-8 sm:px-8 lg:px-10 xl:px-14 rounded-3xl bg-white pb-8 scrollbar-thin scrollbar-thumb-purple-200">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-extrabold text-gray-800">Create Your Account</h1>
            <p className="text-gray-600">Join <span className="text-purple-700 font-semibold">RoomMilega.in</span></p>
          </div>

          {msg && <div className={`p-4 rounded-lg text-sm ${msg.includes("Error") ? "bg-red-100 text-red-600" : "bg-green-100 text-green-700"}`}>{msg}</div>}

          {!otpSent ? (
            <>
              {/* Email Input */}
              <label className="text-sm text-gray-700">Email Address</label>
              <div className="relative mb-4">
                <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="email"
                  placeholder="Enter email"
                  className={`pl-10 pr-4 py-3 w-full border-2 rounded-xl ${emailError ? "border-red-400" : "border-gray-200"}`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {emailError && <p className="text-xs text-red-500 mt-1">{emailError}</p>}
              </div>

              {/* Send OTP */}
              <button
                onClick={handleSendOtp}
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition mb-4"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>

              {/* Security Note */}
              <div className="bg-blue-50 p-4 text-center rounded-xl">
                <Shield className="inline-block text-blue-600 mb-2" size={20} />
                <p className="text-blue-800 font-semibold text-sm">Your security is our priority</p>
                <p className="text-blue-700 text-xs">All your data is encrypted</p>
              </div>
            </>
          ) : (
            <>
              {/* OTP Input */}
              <label className="text-sm text-gray-700">OTP</label>
              <input
                type="text"
                maxLength={6}
                placeholder="Enter OTP"
                className={`mb-4 pl-3 py-3 w-full border-2 rounded-xl ${otpError ? "border-red-400" : "border-gray-200"}`}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              {otpError && <p className="text-xs text-red-500 mb-2">{otpError}</p>}

              {/* Name */}
              <label className="text-sm text-gray-700">Full Name</label>
              <input
                type="text"
                className={`mb-4 pl-3 py-3 w-full border-2 rounded-xl ${nameError ? "border-red-400" : "border-gray-200"}`}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {nameError && <p className="text-xs text-red-500 mb-2">{nameError}</p>}

              {/* Password */}
              <label className="text-sm text-gray-700">Password</label>
              <div className="relative mb-4">
                <input
                  type={showPassword ? "text" : "password"}
                  className={`w-full pl-3 pr-10 py-3 border-2 rounded-xl ${passwordError ? "border-red-400" : "border-gray-200"}`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {passwordError && <p className="text-xs text-red-500 mb-2">{passwordError}</p>}

              {/* Phone */}
              <label className="text-sm text-gray-700">Phone</label>
              <input
                type="tel"
                className={`mb-4 pl-3 py-3 w-full border-2 rounded-xl ${phoneError ? "border-red-400" : "border-gray-200"}`}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              {phoneError && <p className="text-xs text-red-500 mb-2">{phoneError}</p>}

              {/* Role */}
              <label className="text-sm text-gray-700">I want to</label>
              <select
                className={`mb-4 pl-3 py-3 w-full border-2 rounded-xl ${roleError ? "border-red-400" : "border-gray-200"}`}
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="user">Select your role</option>
                <option value="tenant">Rent a property</option>
                <option value="owner">List my property</option>
              </select>
              {roleError && <p className="text-xs text-red-500 mb-2">{roleError}</p>}

              {/* Terms */}
              <label className="text-sm flex items-start mb-4">
                <input
                  type="checkbox"
                  className="mr-2 mt-1"
                  checked={termsAccepted}
                  onChange={() => setTermsAccepted(!termsAccepted)}
                />
                I agree to the <a href="/condition.pdf" className="text-blue-600 underline ml-1">Terms and Conditions</a>
              </label>

              {/* Create Account */}
              <button
                onClick={handleVerifyOtp}
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition mb-3"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>

              {/* Resend */}
              <button
                onClick={handleResendOtp}
                disabled={resendDisabled || loading}
                className="w-full text-sm py-2 bg-gray-100 rounded-xl hover:bg-gray-200"
              >
                {resendDisabled ? `Resend OTP in ${countdown}s` : "Resend OTP"}
              </button>
            </>
          )}

          {/* Login Link */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-blue-600 underline font-medium"
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Signup;
