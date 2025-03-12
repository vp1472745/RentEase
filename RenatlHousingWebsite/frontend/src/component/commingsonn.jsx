import React, { useState, useEffect } from "react";

const ComingSoon = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Add a delay before showing the modal for a smooth entrance effect
    setTimeout(() => {
      setIsOpen(true);
    }, 500);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in">
          <div className="relative bg-white p-8 rounded-lg shadow-lg max-w-md text-center border-4 border-transparent animate-border-glow">
            <h1 className="text-4xl font-bold text-gray-900 animate-glow">
              Coming Soon
            </h1>
            <p className="mt-4 py-5 text-gray-700">We're working hard to bring something amazing!</p>
            
            <a href="/" className="mt-5 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 shadow-md shadow-blue-500/50">
              Back
            </a>
          </div>
        </div>
      )}

      {/* Tailwind CSS keyframes */}
      <style>
        {`
          @keyframes fade-in {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate-fade-in {
            animation: fade-in 0.8s ease-out;
          }
          @keyframes border-glow {
            0% { border-color: blue; }
            20% { border-color: black; }
            40% { border-color: red; }
            60% { border-color: black; }
            80% { border-color: white; }
            100% { border-color: black }
          }
          .animate-border-glow {
            animation: border-glow 4s infinite alternate;
          }
          @keyframes glow {
            0%, 100% { text-shadow: 0 0 10px #ffffff; }
            50% { text-shadow: 0 0 20px #ffcc00; }
          }
          .animate-glow {
            animation: glow 2s infinite alternate;
          }
        `}
      </style>
    </div>
  );
};

export default ComingSoon;