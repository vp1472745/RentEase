import React, { useState } from "react";
import API from "../lib/axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for toast notifications
import sii from "../assets/sii.gif"
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post("/api/auth/forgot-password", { email });

      // ✅ Save email to localStorage for auto-fill in Verify OTP and Reset Password
      localStorage.setItem("resetEmail", email);

      toast.success(response.data.msg); // Show success notification
      setTimeout(() => navigate("/verify-otp"), 3000); // Redirect after 3 sec
    } catch (err) {
      toast.error(err.response?.data?.msg || "Something went wrong"); // Show error notification
    }
  };

  return (  
      

    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-200 to-blue-500">
        <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-4xl mt-5 bg-white shadow-lg rounded-lg p-8">
          <div className="w-full md:w-1/2 mb-5 md:mb-0">
          <img src={sii} alt="Signup" className="w-full max-w-lg h-auto rounded-lg" />

          </div>
      <form onSubmit={handleSubmit} className="bg-white p-6 w-96 rounded ">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 cursor-pointer">Forgot Password</h2>
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
        />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200 cursor-pointer">
          Send OTP
        </button>
      </form>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
    </div>
  );
};

export default ForgotPassword;