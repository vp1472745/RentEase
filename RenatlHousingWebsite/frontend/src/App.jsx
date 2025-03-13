import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Navbar from "./component/navbar.jsx";
import Home from "./pages/home.jsx";
import ComingSoon from "./component/commingsonn.jsx";
import Receipt from "./pages/Receiptedgenator.jsx";
import Signup from "./pages/signup.jsx";
import Login from "./pages/login.jsx";
import OtpModal from "./models/otpModel.jsx"; // ✅ Import OTP Modal
import ForgotPassword from "./pages/Forgotpassword.jsx";
import VerifyOTP from "./pages/Verifyotp.jsx";
import ResetPassword from "./pages/Resetpassword.jsx";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false); // ✅ OTP Modal state
  const [otp, setOtp] = useState("");

  // ✅ Update token from localStorage
  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  // ✅ OTP Submit Handler
  const handleOtpSubmit = (enteredOtp) => {
    console.log("Entered OTP:", enteredOtp);
    if (enteredOtp === "123456") {
      // Dummy check
      alert("OTP Verified Successfully!");
      setIsOtpModalOpen(false);
    } else {
      alert("Invalid OTP, try again.");
    }
  };

  // ✅ Resend OTP Function
  const handleResendOtp = () => {
    console.log("Resending OTP...");
    alert("New OTP sent to your registered email/phone!");
  };

  return (
    <GoogleOAuthProvider clientId="385746889631-oepj52hiaskkn8oqbp3244r888uupr2d.apps.googleusercontent.com">
      <Router>
        <header>
          <Navbar token={token} />
        </header>

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/receipted" element={<Receipt />} />
            <Route path="/comming" element={<ComingSoon />} />
            <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/reset-password" element={<ResetPassword />} />
            <Route
              path="/signup"
              element={<Signup setIsOtpModalOpen={setIsOtpModalOpen} />} // ✅ Pass OTP state
            />
            <Route
              path="/login"
              element={<Login setIsOtpModalOpen={setIsOtpModalOpen} />} // ✅ Pass OTP state
            />
          </Routes>
        </main>

        {/* ✅ OTP Modal Component */}
        <OtpModal
          isOpen={isOtpModalOpen}
          onClose={() => setIsOtpModalOpen(false)}
          onSubmitOtp={handleOtpSubmit}
          resendOtp={handleResendOtp}
        />
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
