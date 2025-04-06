import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
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
import AddProperty from "./pages/addproperty.jsx";
import Properties from "./pages/property.jsx";
import Premium from "./pages/Premium.jsx";
import PropertyPage from "./component/horizontalproperty.jsx";
import ScrollToTop from "./pages/scrolltop.jsx";
import MyProperties from "./pages/myProperty.jsx"; // ✅ MyProperties को इम्पोर्ट किया
import Viewdetails from '../src/pages/popertyCardPart/viewdetails.jsx';
import Test from "./pages/testPage.jsx"
import ReportResearch from "./pages/researchReport.jsx"
import News from "./pages/news.jsx"
import Housingprotect from"./pages/housingProtect.jsx"
import PayRent from "./pages/payRent.jsx"
import Fraud from "./pages/fraud.jsx"
function App() {
  return (
    <GoogleOAuthProvider clientId="385746889631-oepj52hiaskkn8oqbp3244r888uupr2d.apps.googleusercontent.com">
      <Router>
        <ScrollToTop />
        <AppContent />
      </Router>
    </GoogleOAuthProvider>
  );
}

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const location = useLocation(); 

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

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

  // Define routes where Navbar should NOT be visible
  const hideNavbarRoutes = ["/login", "/signup", "/forgot-password", "/verify-otp", "/reset-password"];

  return (
    <>
      <header>
        {!hideNavbarRoutes.includes(location.pathname) && (
          <Navbar 
            isAuthenticated={isAuthenticated} 
            user={user} 
            setIsAuthenticated={setIsAuthenticated} 
            setUser={setUser} 
            token={token}
            handleLogout={handleLogout}
          />
        )}
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
          <Route path="/add-property" element={<AddProperty />} />
          <Route path="/property" element={<PropertyPage />} />  
          <Route path="/properties" element={<Properties />} />
          <Route path="/premium" element={<Premium />} /> 
          <Route path="/my-properties" element={<MyProperties />} /> {/* ✅ नया Route */}
          <Route path="/property/:id" element={<Viewdetails />} />        
          <Route path="/test" element={<Test/>}/>
          <Route path="/ReportResearch" element={<ReportResearch/>}/>
          <Route path="/News" element={<News/>}/>
          <Route path="/housingProtect" element={<Housingprotect/>}/>
          <Route path="/PayRent" element={<PayRent/>}/>
          <Route path="/Fraud" element={<Fraud/>}/>
          </Routes>


      </main>

      <OtpModal
        isOpen={isOtpModalOpen}
        onClose={() => setIsOtpModalOpen(false)}
        onSubmitOtp={handleOtpSubmit}
        resendOtp={handleResendOtp}
      />
    </>
  );
}

export default App;
