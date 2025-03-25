import React, { useState } from "react";
import axios from "axios";

const OtpVerification = () => {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
// kjj
  const sendOtp = async () => {
    try {
      await axios.post("http://localhost:5000/api/send-otp", { 
        email: emailOrPhone.includes("@") ? emailOrPhone : undefined,
        phone: emailOrPhone.includes("@") ? undefined : emailOrPhone
      });
      setOtpSent(true);
    } catch (error) {
      console.error("Error sending OTP:", error.response.data);
    }
  };

  const verifyOtp = async () => {
    try {
      await axios.post("http://localhost:5000/api/verify-otp", { identifier: emailOrPhone, otp });
      alert("OTP verified successfully!");
    } catch (error) {
      alert("Invalid OTP!");
    }
  };

  return (
    <div>
      {!otpSent ? (
        <div>
          <input 
            type="text" 
            placeholder="Enter Email or Phone" 
            value={emailOrPhone} 
            onChange={(e) => setEmailOrPhone(e.target.value)}
          />
          <button onClick={sendOtp}>Send OTP</button>
        </div>
      ) : (
        <div>
          <input 
            type="text" 
            placeholder="Enter OTP" 
            value={otp} 
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={verifyOtp}>Verify OTP</button>
        </div>
      )}
    </div>
  );
};

export default OtpVerification;
