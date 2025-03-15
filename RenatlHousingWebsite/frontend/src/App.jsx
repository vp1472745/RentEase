import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Navbar from "./component/navbar.jsx";
import Home from "./pages/home.jsx";
import ComingSoon from "./component/commingsonn.jsx";
import Receipt from "./pages/Receiptedgenator.jsx";
import Signup from "./pages/signup.jsx";
import Login from "./pages/login.jsx";
import OtpModal from "./models/otpModel.jsx";
import ForgotPassword from "./pages/Forgotpassword.jsx";
import VerifyOTP from "./pages/Verifyotp.jsx";
import ResetPassword from "./pages/Resetpassword.jsx";
import Profile from "./pages/profile.jsx";  

function App() {
  // ✅ Authentication State Management
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));  // ✅ LocalStorage से User Load करो
      setIsAuthenticated(true);
    }
  }, []);

  // ✅ Logout Function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    setIsAuthenticated(false);
    setUser(null);
    setToken(null);
  };

  const handleOtpSubmit = (enteredOtp) => {
    console.log("Entered OTP:", enteredOtp);
    if (enteredOtp === "123456") {
      alert("OTP Verified Successfully!");
      setIsOtpModalOpen(false);
    } else {
      alert("Invalid OTP, try again.");
    }
  };

  const handleResendOtp = () => {
    console.log("Resending OTP...");
    alert("New OTP sent to your registered email/phone!");
  };

  return (
    <GoogleOAuthProvider clientId="385746889631-oepj52hiaskkn8oqbp3244r888uupr2d.apps.googleusercontent.com">
      <Router>
        <header>
          <Navbar 
            isAuthenticated={isAuthenticated} 
            user={user} 
            setIsAuthenticated={setIsAuthenticated} 
            setUser={setUser} 
            token={token}
            handleLogout={handleLogout}  // ✅ Logout Function Pass किया
          />
        </header>

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/receipted" element={<Receipt />} />
            <Route path="/comming" element={<ComingSoon />} />
            <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} setUser={setUser} />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/signup" element={<Signup setIsOtpModalOpen={setIsOtpModalOpen} />} />
            <Route path="/profile" element={<Profile />} /> 
          </Routes>
        </main>

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
