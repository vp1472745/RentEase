import React, { useState } from 'react';

export default function ReportFraud() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [details, setDetails] = useState('');

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handleNext = () => {
    if (selectedCategory) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = { name, contact, email, category: selectedCategory, details };
    try {
      const response = await fetch("http://localhost:5000/report-fraud", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log("Response from server:", data);
      
      // Reset form after successful submission
      setName('');
      setContact('');
      setEmail('');
      setDetails('');
      setSelectedCategory('');
      setStep(1);
    } catch (error) {
      console.error("Error submitting fraud report:", error);
    }
  };

  return (
    <>
      <div className='bg-gradient-to-r from-[#7b5cff] to-[#a48dff] w-full h-4'></div>
      <div className="min-h-screen bg-gradient-to-r from-[#7b5cff] to-[#a48dff] flex items-center justify-center p-4 md:p-8 rounded-br-[150px] rounded-bl-[150px]">
        <div className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 lg:gap-16">
          {/* Left Section */}
          <div className="w-full md:w-1/2 flex flex-col items-center text-white text-center mb-6 md:mb-0">
            <div className='mb-8 md:mb-12 w-full'>
              <span className='text-2xl md:text-3xl font-bold cursor-pointer'>RentEase</span>
            </div>
            <img
              src="https://c.housingcdn.com/chimera/s/client/common/assets/desktopAnimation1.f03898c6.svg?1743933292267"
              alt="Fraud Illustration"
              className="w-48 md:w-72 lg:w-80 max-w-md mx-auto cursor-pointer transition-transform hover:scale-105"
            />
            <h1 className="text-2xl md:text-3xl font-bold mt-6 mb-2">Report A Fraud</h1>
            <p className="text-sm md:text-base opacity-90 max-w-md">
              Help us maintain a safe community by reporting any fraudulent activities you encounter.
            </p>
          </div>

          {/* Right Section */}
          <div className="w-full md:w-96 h-auto bg-white shadow-2xl rounded-xl border border-gray-200">
            <div className="p-6 md:p-8 h-full max-h-[600px] overflow-y-auto">
              {step === 1 ? (
                <>
                  <div className="mb-8">
                    <p className="text-sm text-gray-500 font-medium">Step 1 of 2</p>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800 mt-1">Select Fraud Category</h2>
                    <p className="text-sm text-gray-500 mt-1">Choose the type of fraud you want to report</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <button
                      onClick={() => handleCategorySelect('credit')}
                      className={`border-2 p-4 rounded-xl flex flex-col items-center transition-all duration-300 cursor-pointer
                        ${selectedCategory === 'credit' ? 
                          'bg-violet-100 border-violet-500 shadow-md' : 
                          'border-gray-300 hover:bg-violet-50 hover:border-violet-300 hover:shadow-sm'}`}
                    >
                      <span className="text-3xl mb-2">💳</span>
                      <span className="text-sm font-medium text-gray-700">Credit Card Fraud</span>
                    </button>

                    <button
                      onClick={() => handleCategorySelect('other')}
                      className={`border-2 p-4 rounded-xl flex flex-col items-center transition-all duration-300 cursor-pointer
                        ${selectedCategory === 'other' ? 
                          'bg-violet-100 border-violet-500 shadow-md' : 
                          'border-gray-300 hover:bg-violet-50 hover:border-violet-300 hover:shadow-sm'}`}
                    >
                      <span className="text-3xl mb-2">📂</span>
                      <span className="text-sm font-medium text-gray-700">Other Fraud</span>
                    </button>
                  </div>

                  <button
                    onClick={handleNext}
                    disabled={!selectedCategory}
                    className={`w-full py-3 px-4 rounded-lg transition-all duration-300 cursor-pointer font-medium
                      ${selectedCategory ? 
                        'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md' : 
                        'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                  >
                    Continue
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleBack}
                    className="mb-6 text-sm text-violet-600 hover:text-violet-800 font-medium hover:underline flex items-center transition-colors cursor-pointer"
                  >
                    <span className="mr-1">←</span> Back to Categories
                  </button>

                  <div className="mb-6">
                    <p className="text-sm text-gray-500 font-medium">Step 2 of 2</p>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800 mt-1">Personal Details</h2>
                    <p className="text-sm text-gray-500 mt-1">Please provide your information to help us investigate</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        placeholder="Your full name" 
                        className="w-full border-b-2 border-gray-300 focus:border-violet-500 outline-none py-2 px-1 transition-colors cursor-text" 
                        required 
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                      <input 
                        type="tel" 
                        value={contact} 
                        onChange={(e) => setContact(e.target.value)} 
                        maxLength="10" 
                        placeholder="10-digit mobile number" 
                        className="w-full border-b-2 border-gray-300 focus:border-violet-500 outline-none py-2 px-1 transition-colors cursor-text" 
                        required 
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        placeholder="example@mail.com" 
                        className="w-full border-b-2 border-gray-300 focus:border-violet-500 outline-none py-2 px-1 transition-colors cursor-text" 
                        required 
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Fraud Details</label>
                      <textarea 
                        rows={4} 
                        value={details} 
                        onChange={(e) => setDetails(e.target.value)} 
                        placeholder="Please describe the fraud incident in detail..." 
                        className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-violet-500 outline-none transition-colors cursor-text"
                        required
                      ></textarea>
                    </div>

                    <button 
                      type="submit" 
                      className="w-full mt-6 bg-violet-600 hover:bg-violet-700 text-white py-3 rounded-lg transition-all duration-300 font-medium shadow-md hover:shadow-lg cursor-pointer"
                    >
                      Submit Report
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}