import React, { useState, useEffect } from "react";
import API from "../lib/axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for toast notifications
import sii from "../assets/sii.gif"
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
      toast.success(response.data.msg); // Show success notification

      // Clear stored data after successful reset
      localStorage.removeItem("resetEmail");
      localStorage.removeItem("resetOTP");

      setTimeout(() => navigate("/login"), 3000); // Redirect to login after 3 sec
    } catch (err) {
      // setError(err.response?.data?.msg || "Password reset failed");
      toast.error(err.response?.data?.msg || "Password reset failed"); // Show error notification
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-200 to-blue-500">
      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-4xl mt-5 bg-white shadow-lg rounded-lg p-8">
                <div className="w-full md:w-1/2 mb-5 md:mb-0">
                <img src={sii} alt="Signup" className="w-full max-w-lg h-auto rounded-lg" />
      
                </div>
      <form onSubmit={handleSubmit} className="bg-white p-6 w-96 rounded ">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Reset Password</h2>
        {message && <p className="text-green-500">{message}</p>}
        {error && <p className="text-red-500">{error}</p>}
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          readOnly // Prevents user from changing email
        />
        <input
          type="text"
          name="otp"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          readOnly // Prevents user from changing OTP
        />
        <input
          type="password"
          name="newPassword"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
        />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200 cursor-pointer">
          Reset Password
        </button>
      </form>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
    </div>
  );
};

export default ResetPassword;