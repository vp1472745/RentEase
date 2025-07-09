import React, { useState, useEffect } from "react";
import API from "../../lib/axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for toast notifications
import sii from "../../assets/sii.gif"
import hero from "../../assets/hero.jpg";
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
    <div className="min-h-screen bg-gradient-to-r from-[#f0f2f8] via-[#e4ecf7] to-[#ffffff] flex flex-col lg:flex-row items-center justify-center px-2 py-6 lg:py-0">
      {/* Back Button */}
      <div className="absolute top-4 left-4 z-30">
        <button
          onClick={() => navigate("/")}
          className="flex items-center mt-3 space-x-2 px-3 py-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg hover:bg-white transition-all duration-300 text-gray-700 hover:text-gray-900 text-sm font-medium"
        >
          <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' /></svg>
          <span className="hidden sm:inline">Back to Home</span>
          <span className="sm:hidden">Back</span>
        </button>
      </div>
      {/* Left Card: Logo, Image, Tagline */}
      <div className="flex flex-col items-center w-full max-w-md h-auto lg:h-[600px] bg-white rounded-3xl shadow-xl mb-6 lg:mb-0 lg:mr-10 p-0 overflow-hidden border border-purple-100">
        <div className="w-full flex flex-col items-center pt-8 pb-2 bg-gradient-to-b from-purple-50 to-white">
          <h1 className="text-purple-800 font-bold mb-5 text-2xl">RoomMilega.in</h1>
        </div>
        <img src={hero} alt="Find your perfect home" className="w-[400px] h-48 sm:h-56 md:h-64 lg:h-[320px] object-cover rounded-2xl" />
        <div className="flex flex-col items-center px-6 py-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-purple-700 mb-2 text-center">Reset Your Password</h2>
          <p className="text-base sm:text-lg text-gray-500 text-center max-w-xs">Secure your account and continue your journey with <span className="text-purple-600 font-semibold">RoomMilega.in</span>.</p>
        </div>
      </div>
      {/* Right Card: Reset Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-md h-auto lg:h-[600px] bg-gradient-to-br from-white via-blue-50 to-purple-50 rounded-3xl shadow-2xl border border-purple-100 flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-14 space-y-6">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-2 text-center">Reset Password</h1>
          <p className="text-base sm:text-lg text-gray-600 text-center mb-4">Enter your new password to regain access to <span className="text-purple-700 font-semibold">RoomMilega.in</span></p>
        </div>
        {message && <p className="text-green-500 text-center">{message}</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}
        <div className="space-y-5 w-full">
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            readOnly
          />
          <input
            type="text"
            name="otp"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            readOnly
          />
          <input
            type="password"
            name="newPassword"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          />
        </div>
        <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition mt-2 mb-4">
          Reset Password
        </button>
      </form>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
};

export default ResetPassword;