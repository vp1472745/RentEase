import React, { useState } from 'react';
import { FiShield, FiHome, FiCheckCircle } from 'react-icons/fi';

export default function HousingProtect() {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleRenterProtection = () => {
    setSelectedOption('renter');
  };

  const handleListProperty = () => {
    setSelectedOption('owner');
  };

  return (

          <>
          <div className='w-[100%] h-15 bg-purple-800'></div>

    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-6">
      {/* Hero Section */}
      <div className="text-center max-w-3xl">
        <h1 className="text-5xl font-extrabold text-gray-800">Housing Protect</h1>
        <p className="text-xl text-gray-600 mt-4">
          Secure your rental property with our trusted protection services. Whether you're a renter or a property owner, we've got you covered.
        </p>
      </div>

      {/* Features Section */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl">
        {/* For Renters */}
        <div className="bg-white shadow-xl rounded-2xl p-8 text-center transition-transform transform hover:scale-105">
          <h2 className="text-3xl font-semibold text-gray-700">For Renters</h2>
          <p className="text-lg text-gray-600 mt-4">
            Protect your home with affordable rental insurance and stay stress-free.
          </p>
          <button
            onClick={handleRenterProtection}
            className="mt-6 px-6 py-3 text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-xl inline-flex items-center gap-2"
          >
            <FiShield size={20} />
            View Policy
          </button>
        </div>

        {/* For Property Owners */}
        <div className="bg-white shadow-xl rounded-2xl p-8 text-center transition-transform transform hover:scale-105">
          <h2 className="text-3xl font-semibold text-gray-700">For Property Owners</h2>
          <p className="text-lg text-gray-600 mt-4">
            List your property with us and get insurance coverage for secure leasing.
          </p>
          <button
            onClick={handleListProperty}
            className="mt-6 px-6 py-3 text-lg bg-green-600 hover:bg-green-700 text-white rounded-xl inline-flex items-center gap-2"
          >
            <FiHome size={20} />
            View Policy
          </button>
        </div>
      </div>

      {/* Policy Details */}
      {selectedOption && (
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8 max-w-3xl w-full">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            {selectedOption === 'renter' ? 'Renter Insurance Policy' : 'Owner Insurance Policy'}
          </h3>
          <ul className="text-gray-700 space-y-3 text-left list-inside">
            {selectedOption === 'renter' ? (
              <>
                <li><FiCheckCircle className="inline text-blue-600 mr-2" />Coverage up to ₹2,00,000 for theft & fire damage</li>
                <li><FiCheckCircle className="inline text-blue-600 mr-2" />Emergency support within 24 hours</li>
                <li><FiCheckCircle className="inline text-blue-600 mr-2" />Monthly premium: ₹199 only</li>
              </>
            ) : (
              <>
                <li><FiCheckCircle className="inline text-green-600 mr-2" />Property damage coverage up to ₹5,00,000</li>
                <li><FiCheckCircle className="inline text-green-600 mr-2" />Legal assistance for rental disputes</li>
                <li><FiCheckCircle className="inline text-green-600 mr-2" />Yearly premium: ₹999 only</li>
              </>
            )}
          </ul>

          {/* Payment Button */}
          <button className="mt-8 px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white text-lg rounded-xl">
            Pay Now
          </button>
        </div>
      )}

      {/* Testimonials Section */}
      <div className="mt-16 max-w-4xl text-center">
        <h3 className="text-2xl font-bold text-gray-800">Why Choose Housing Protect?</h3>
        <p className="text-gray-600 mt-4">
          Thousands of satisfied renters and owners trust us for secure housing solutions.
        </p>
      </div>
    </div>
    </>
  );
}
