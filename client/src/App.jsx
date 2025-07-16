import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import { useState, useEffect } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Navbar from "../src/component/navbar/navbar.jsx";
import Home from "../src/pages/otherPage/home.jsx";
// import Receipt from "./pages/Receiptedgenator.jsx";
import Signup from "./pages/Register&login/signup.jsx";
import Login from "./pages/Register&login/login.jsx";
import OtpModal from "./models/otpModel.jsx";
import ForgotPassword from "./pages/Register&login/Forgotpassword.jsx";
import VerifyOTP from "./pages/Register&login/Verifyotp.jsx";
import ResetPassword from "./pages/Register&login/Resetpassword.jsx";
import Profile from "../src/component/navbar/profile/profile.jsx";
import AddProperty from "../src/pages/poprertyPage/addproperty/addproperty.jsx";
import Properties from "../src/pages/poprertyPage/property.jsx";
// import PropertyPage from "./component/horizontalproperty.jsx";
import ScrollToTop from "../src/pages/otherPage/scrolltop.jsx";
import MyProperties from "../src/pages/poprertyPage/myProperty.jsx"; // ✅ MyProperties को इम्पोर्ट किया
import Viewdetails from "../src/pages/poprertyPage/viewdetails.jsx";
// import Test from "./pages/testPage.jsx";
import ReportResearch from "../src/pages/otherPage/researchReport.jsx";
import AdminLogin from "./pages/Register&login/adminLogin.jsx";
import News from "../src/pages/otherPage/news.jsx";
// import Housingprotect from "./pages/housingProtect.jsx";
import PayRent from "../src/pages/otherPage/download.jsx";
import Fraud from "../src/pages/otherPage/fraud.jsx";
import UpdateProperty from "../src/pages/poprertyPage/propertyUpdate/propertyupdate.jsx";
import AdminDashboard from "./Dashboard/adminDashboard.jsx";
import AdminRegsiter from "../src/pages/Register&login/adminRegister.jsx";
import AboutUs from "../src/component/footerPage/aboutUs.jsx"
import PrivacyPolicy from "../src/component/footerPage/privacyPolicy.jsx"
import TermAndCondition from "../src/component/footerPage/term&condition.jsx"
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
  const hideNavbarRoutes = [
    "/login",
    "/signup",
    "/forgot-password",
    "/verify-otp",
    "/reset-password",
    "/admin/login",
    "/admin/register",
    "/Admin-Login",
    "/Admin-Regsiter",
  ];

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
          {/* <Route path="/receipted" element={<Receipt />} /> */}
         
          <Route
            path="/login"
            element={
              <Login
                setIsAuthenticated={setIsAuthenticated}
                setUser={setUser}
              />
            }
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/signup"
            element={<Signup setIsOtpModalOpen={setIsOtpModalOpen} />}
          />
          <Route path="/profile" element={<Profile />} />
          <Route path="/add-property" element={<AddProperty />} />
          {/* <Route path="/property" element={<PropertyPage />} /> */}
          <Route path="/properties" element={<Properties />} />
          <Route path="/my-properties" element={<MyProperties />} />
          <Route path="/property/:id" element={<Viewdetails />} />
          {/* <Route path="/test" element={<Test />} /> */}
          <Route path="/ReportResearch" element={<ReportResearch />} />
          <Route path="/News" element={<News />} />
          {/* <Route path="/housingProtect" element={<Housingprotect />} /> */}
          <Route path="/PayRent" element={<PayRent />} />
          <Route path="/Fraud" element={<Fraud />} />
          <Route path="/UpdateProperty/:id" element={<UpdateProperty />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/register" element={<AdminRegsiter />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/About-Us" element={<AboutUs />} />
          <Route path="/Privacy" element={<PrivacyPolicy/>}/>
          <Route path="/terms-and-conditions" element={<TermAndCondition />} />
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
