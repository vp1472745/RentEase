import React, { useState, useEffect } from "react";
import axios from "axios";
import OtpModal from "../models/otpModel.jsx"; // Import the OtpModal

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [otpEmail, setOtpEmail] = useState("");
  const [otpValidEmail, setOtpValidEmail] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [phoneOtp, setPhoneOtp] = useState("");

  const [otpPageVisible, setOtpPageVisible] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [resendDisabled, setResendDisabled] = useState(false);

  const [otpModalVisible, setOtpModalVisible] = useState(false);

  // Name validation regex (only alphabet and spaces)
  const nameRegex = /^[A-Za-z\s]+$/;

  // Phone validation (should start with 6,7,8,9 and be 10 digits long)
  const phoneRegex = /^[6-9]\d{9}$/;

  // Password validation (min 8 chars, at least one number, one uppercase, and one special character)
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

  // Email validation regex
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  const validateForm = () => {
    if (!nameRegex.test(name)) {
      setMsg("Name must contain only alphabets and spaces.");
      return false;
    }

    if (!emailRegex.test(email)) {
      setMsg("Please enter a valid email address.");
      return false;
    }

    if (!phoneRegex.test(phone)) {
      setMsg("Phone number must start with 6, 7, 8, or 9 and be 10 digits long.");
      return false;
    }

    if (!passwordRegex.test(password)) {
      setMsg("Password must be at least 8 characters long, contain a number, an uppercase letter, and a special character.");
      return false;
    }

    if (!role) {
      setMsg("Please select a role.");
      return false;
    }

    return true;
  };

  const handleSignup = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("/api/auth/signup", {
        name,
        email,
        phone,
        password,
        role,
      });
      setMsg(response.data.msg);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setMsg(err.response ? err.response.data.msg : "Server Error");
    }
  };

  const handleOtpEmail = async () => {
    try {
      const response = await axios.post("/api/auth/verify-otp", {
        otp: emailOtp,
        email,
      });
      setOtpValidEmail(response.data.valid);
      setMsg(response.data.msg);
    } catch (err) {
      setMsg("Invalid OTP. Please try again.");
    }
  };

  const handleOtpPhone = async () => {
    try {
      const response = await axios.post("/api/auth/verify-otp", {
        otp: phoneOtp,
        phone,
      });
      setOtpValidPhone(response.data.valid);
      setMsg(response.data.msg);
    } catch (err) {
      setMsg("Invalid OTP. Please try again.");
    }
  };

  const handleSendOtpEmail = async () => {
    try {
      const response = await axios.post("/api/auth/signup", {
        email,
      });
      setMsg(response.data.msg);
      setOtpModalVisible(true); // Show OTP modal after sending OTP
      startCountdown();
    } catch (err) {
      setMsg(err.response ? err.response.data.msg : "Server Error");
    }
  };



  // Add to the render method
<OtpModal
  isOpen={otpModalVisible}
  onClose={() => setOtpModalVisible(false)} // Close handler for the modal
  onSubmitOtp={handleOtpEmail} // Submit OTP
  resendOtp={handleSendOtpEmail} // Resend OTP
  countdown={countdown}
  resendDisabled={resendDisabled}
/>

  const handleSendOtpPhone = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/send-phone-otp", {
        phone,
      });
      setMsg(response.data.msg);
      setOtpModalVisible(true); // Show OTP modal after sending OTP
      startCountdown();
    } catch (err) {
      setMsg(err.response ? err.response.data.msg : "Server Error");
    }
  };

  const startCountdown = () => {
    setResendDisabled(true);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          setResendDisabled(false); // Enable resend after countdown reaches 0
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Signup</h2>

        {/* Success or Error Message */}
        {msg && (
          <div
            className={`mb-4 p-2 rounded ${msg.includes("success") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
          >
            {msg}
          </div>
        )}

        <div>
          {/* Name */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Email with OTP button */}
          <div className="mb-4 flex">
            <div className="w-full">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                id="email"
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button
              onClick={handleSendOtpEmail}
              className="ml-2 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Send OTP
            </button>
          </div>

          {/* Phone with OTP button */}
          <div className="mb-4 flex">
            <div className="w-full">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="text"
                id="phone"
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                placeholder="Enter phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <button
              onClick={handleSendOtpPhone}
              className="ml-2 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Send OTP
            </button>
          </div>

          {/* Password with show/hide */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <div className="flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="ml-2 text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Role */}
          <div className="mb-4">
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
            <select
              id="role"
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="">Select Role</option>
              <option value="tenant">Tenant</option>
              <option value="owner">Owner</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            onClick={handleSignup}
            className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Signup"}
          </button>
        </div>

        {/* OTP Modal */}
        <OtpModal
          isOpen={otpModalVisible}
          onClose={() => setOtpModalVisible(false)}
          onSubmitOtp={handleOtpEmail}
          resendOtp={handleSendOtpEmail}
          countdown={countdown}
          resendDisabled={resendDisabled}
        />
      </div>
    </div>
  );
};

export default Signup;
