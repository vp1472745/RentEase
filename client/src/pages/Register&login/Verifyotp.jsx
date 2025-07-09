import React, { useState, useEffect } from "react";
import API from "../../lib/axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for toast notifications
import sii from "../../assets/sii.gif"
const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState(localStorage.getItem("resetEmail") || ""); // Auto-fill email
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Ensure email is filled if stored in localStorage
    setEmail(localStorage.getItem("resetEmail") || "");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await API.post("/api/auth/verify-reset-otp", { email, otp });

      // Store OTP in localStorage for Reset Password auto-fill
      localStorage.setItem("resetOTP", otp);

      toast.success(response.data.msg); // Show success notification
      setTimeout(() => navigate("/reset-password"), 3000); // Redirect after 3 sec
    } catch (err) {
      setError(err.response?.data?.msg || "Invalid OTP");
      toast.error(err.response?.data?.msg || "Invalid OTP"); // Show error notification
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-200 to-blue-500">
      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-4xl mt-5 bg-white shadow-lg rounded-lg p-8">
                <div className="w-full md:w-1/2 mb-5 md:mb-0">
                <img src={sii} alt="Signup" className="w-full max-w-lg h-auto rounded-lg" />
      
                </div>
      <form onSubmit={handleSubmit} className="bg-white p-6 w-96 rounded ">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Verify OTP</h2>
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
        />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200 cursor-pointer">
          Verify OTP
        </button>
      </form>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
    </div>
  );
};

export default VerifyOTP;