import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./component/navbar.jsx";
import Home from "./pages/home.jsx";
import ComingSoon from "./component/commingsonn.jsx";
import Receipt from "./pages/Receiptedgenator.jsx";
import Signup from "./pages/signup.jsx";
import Login from "./pages/login.jsx"; // No need to pass setIsOTPModalOpen anymore

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Update token from localStorage and force re-render
  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  return (
    <>
      <Router>
        <header>
          <Navbar token={token} /> {/* Pass the token to Navbar for conditional rendering */}
        </header>

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/receipted" element={<Receipt />} />
            <Route path="/comming" element={<ComingSoon />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} /> {/* No OTPModal logic here */}
          </Routes>
        </main>
      </Router>
    </>
  );
}

export default App;
