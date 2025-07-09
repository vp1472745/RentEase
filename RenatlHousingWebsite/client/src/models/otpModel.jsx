import React from "react";

const OtpModal = ({ isOpen, onClose, otpValue, setOtpValue, onSubmitOtp, resendOtp, countdown, resendDisabled }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Verify OTP</h2>

        <input
          type="text"
          placeholder="Enter OTP"
          value={otpValue}
          onChange={(e) => setOtpValue(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />

        <button onClick={onSubmitOtp} className="w-full bg-blue-500 text-white p-2 rounded mb-2">Submit OTP</button>

        <button onClick={resendOtp} disabled={resendDisabled} className="w-full text-blue-500">
          Resend OTP {resendDisabled ? `(${countdown}s)` : ""}
        </button>

        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500">✖</button>
      </div>
    </div>
  );
};

export default OtpModal;
