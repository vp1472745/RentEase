import React, { useState, useEffect } from "react";
import Modal from "react-modal";

Modal.setAppElement("#root");

const OtpModal = ({ isOpen, onClose, onSubmitOtp, resendOtp }) => {
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [resendDisabled, setResendDisabled] = useState(true);

  useEffect(() => {
    if (isOpen) {
      startCountdown();
    }
  }, [isOpen]);

  const startCountdown = () => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          setResendDisabled(false);
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSubmit = () => {
    onSubmitOtp(otp);
  };

  const handleResend = () => {
    resendOtp();
    setResendDisabled(true);
    setCountdown(60);
    startCountdown();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="modal"
      overlayClassName="overlay"
      contentLabel="OTP Modal"
    >
      <h3 className="text-center text-xl font-semibold">Enter OTP</h3>
      <div className="mb-4">
        <label htmlFor="otp" className="block text-sm font-medium text-gray-700">OTP</label>
        <input
          type="text"
          id="otp"
          className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
      </div>
      <button
        onClick={handleSubmit}
        className="mt-2 py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700"
      >
        Submit OTP
      </button>
      <button
        onClick={handleResend}
        className={`mt-2 py-2 px-4 bg-gray-300 text-white rounded-md ${resendDisabled ? "cursor-not-allowed" : ""}`}
        disabled={resendDisabled}
      >
        {resendDisabled ? `Resend in ${countdown}s` : "Resend OTP"}
      </button>
    </Modal>
  );
};

export default OtpModal;
