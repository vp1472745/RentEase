import React, { useState } from 'react';

export default function ReportFraud() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [step, setStep] = useState(1);

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

  return (
<>
          <div className='bg-gradient-to-r from-[#7b5cff] to-[#a48dff] w-full h-15'></div>
    <div className="min-h-screen bg-gradient-to-r from-[#7b5cff] to-[#a48dff] flex items-center justify-center p-4 md:p-8 rounded-br-[150px] rounded-bl-[150px] w-360 ml-12 ">
      <div className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 lg:gap-12">
        {/* Left Side - Illustration */}
        <div className="w-full md:w-1/2 flex flex-col items-center text-white text-center mb-6 md:mb-0">
          <div className='mb-6 md:mb-10 w-full flex justify-center md:justify-start'>
            <span className='text-xl md:text-2xl ml-42'>RentEase</span>
          </div>
          <img
            src="https://c.housingcdn.com/chimera/s/client/common/assets/desktopAnimation1.f03898c6.svg?1743933292267"
            alt="Fraud Illustration"
            className="w-40 md:w-60 max-w-md mx-auto"
          />
          <h1 className="text-xl md:text-2xl font-bold mt-4">Report A Fraud</h1>
        </div>

        {/* Right Side - Conditional Form */}
        <div className="w-full md:w-80 h-auto md:h-[400px] bg-white shadow-xl rounded-xl border mr-50 ">
          <div className="p-4 md:p-6 h-full max-h-[550px] overflow-y-auto ">
            {step === 1 ? (
              <>
                <div className="mb-6">
                  <p className="text-sm text-gray-500">Step 1 of 2</p>
                  <h2 className="text-lg md:text-xl font-semibold text-gray-800">Select Category</h2>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6 ">
                  <button
                    onClick={() => handleCategorySelect('credit')}
                    className={`border p-4 rounded-lg flex flex-col items-center transition  cursor-pointer
                      ${selectedCategory === 'credit' ? 'bg-violet-200 border-violet-500' : 'border-gray-300 hover:bg-violet-100'}`}
                  >
                    <span className="text-2xl">💳</span>
                    <span className="text-sm mt-2">Credit Card Fraud</span>
                  </button>

                  <button
                    onClick={() => handleCategorySelect('other')}
                    className={`border p-4 rounded-lg flex flex-col items-center transition  cursor-pointer
                      ${selectedCategory === 'other' ? 'bg-violet-200 border-violet-500' : 'border-gray-300 hover:bg-violet-100'}`}
                  >
                    <span className="text-2xl">📂</span>
                    <span className="text-sm mt-2">Any Other Fraud</span>
                  </button>
                </div>

                <button
                  onClick={handleNext}
                  disabled={!selectedCategory}
                  className={`w-full py-2 px-4 rounded-md transition mt-25 cursor-pointer
                    ${selectedCategory ? 'bg-emerald-400 hover:bg-emerald-500 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                >
                  Next
                </button>
              </>
            ) : (
              <>
                {/* Back Button */}
                <button
                  onClick={handleBack}
                  className="mb-4 text-sm text-blue-600 hover:underline flex items-center"
                >
                  ← Back
                </button>

                <p className="text-sm text-gray-500 mb-2">Step 2 of 2</p>
                <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-6">Enter your Personal Details</h2>

                {selectedCategory === 'credit' ? (
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-600">Name</label>
                      <input type="text" placeholder="Your Name" className="w-full border-b outline-none py-2" />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600">Contact Number</label>
                      <input type="tel" maxLength="10" placeholder="Enter your mobile number" className="w-full border-b outline-none py-2" />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600">Email</label>
                      <input type="email" placeholder="example@mail.com" className="w-full border-b outline-none py-2" />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600">Credit Card last 4 digits</label>
                      <input type="text" maxLength="4" placeholder="1234" className="w-full border-b outline-none py-2" />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600">Amount</label>
                      <input type="text" placeholder="Amount lost" className="w-full border-b outline-none py-2" />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600">Date of Transaction</label>
                      <input type="date" className="w-full border-b outline-none py-2" />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600">Card issuer Bank</label>
                      <input type="text" placeholder="Bank name" className="w-full border-b outline-none py-2" />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600">Time of Transaction (optional)</label>
                      <input type="text" placeholder="hh:mm AM/PM" className="w-full border-b outline-none py-2" />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600">Would you like to add something? (optional)</label>
                      <input type="text" placeholder="Your message..." className="w-full border-b outline-none py-2" />
                    </div>

                    <button type="submit" className="w-full mt-4 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-md transition">
                      Submit
                    </button>
                  </form>
                ) : (
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-600">Name</label>
                      <input type="text" placeholder="Your Name" className="w-full border-b outline-none py-2" />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600">Contact Number</label>
                      <input type="tel" maxLength="10" placeholder="Enter your mobile number" className="w-full border-b outline-none py-2" />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600">Email</label>
                      <input type="email" placeholder="example@mail.com" className="w-full border-b outline-none py-2" />
                    </div>

                    <div>
                      {/* <label className="block text-sm text-gray-600">Select the property on which fraud was committed</label>
                      <div className="flex space-x-4 overflow-x-auto py-2">
                        <div className="min-w-[150px] bg-gray-100 rounded shadow p-2">
                          <img src="/house1.jpg" className="w-full h-24 object-cover rounded" alt="Property 1" />
                          <p className="text-sm mt-2 font-semibold">2 BHK Independent House</p>
                          <p className="text-xs text-gray-500">by Neeraj Kumar (Owner)</p>
                        </div>
                        <div className="min-w-[150px] bg-gray-100 rounded shadow p-2">
                          <img src="/house2.jpg" className="w-full h-24 object-cover rounded" alt="Property 2" />
                          <p className="text-sm mt-2 font-semibold">3 BHK Apartment</p>
                          <p className="text-xs text-gray-500">by Sharma Associates (Agent)</p>
                        </div>
                      </div> */}
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600">Share more details of the fraud?</label>
                      <textarea rows={4} placeholder="Type details here..." className="w-full border rounded p-2"></textarea>
                    </div>

                    <button type="submit" className="w-full mt-4 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-md transition">
                      Submit
                    </button>
                  </form>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}