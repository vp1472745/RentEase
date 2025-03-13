import React, { useState, useEffect } from "react";
import API from "../lib/axios";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [email, setEmail] = useState(localStorage.getItem("resetEmail") || ""); // Auto-fill email
  const [otp, setOtp] = useState(localStorage.getItem("resetOTP") || ""); // Auto-fill OTP
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setEmail(localStorage.getItem("resetEmail") || "");
    setOtp(localStorage.getItem("resetOTP") || "");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await API.post("/api/auth/reset-password", { email, otp, newPassword });
      setMessage(response.data.msg);

      // Clear stored data after successful reset
      localStorage.removeItem("resetEmail");
      localStorage.removeItem("resetOTP");

      setTimeout(() => navigate("/login"), 3000); // Redirect to login after 3 sec
    } catch (err) {
      setError(err.response?.data?.msg || "Password reset failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 w-96 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
        {message && <p className="text-green-500">{message}</p>}
        {error && <p className="text-red-500">{error}</p>}
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 border rounded mb-2"
          readOnly // Prevents user from changing email
        />
        <input
          type="text"
          name="otp"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
          className="w-full p-2 border rounded mb-2"
          readOnly // Prevents user from changing OTP
        />
        <input
          type="password"
          name="newPassword"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          className="w-full p-2 border rounded mb-2"
        />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
