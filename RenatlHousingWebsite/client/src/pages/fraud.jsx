import React, { useState } from 'react';
import API from '../lib/axios'; // Using the custom axios instance
import { FiCheckCircle, FiAlertTriangle, FiArrowLeft } from 'react-icons/fi';

export default function ReportFraud() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [step, setStep] = useState(1);

  // State for form fields
  const [reporter, setReporter] = useState({ name: '', contactNumber: '', email: '' });
  const [creditCardDetails, setCreditCardDetails] = useState({
    cardLastFour: '',
    amount: '',
    transactionDate: '',
    cardIssuerBank: '',
    transactionTime: '',
    additionalInfo: ''
  });
  const [otherFraudDetails, setOtherFraudDetails] = useState('');

  // State for submission status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setError(null);
    setSuccess(null);
  };

  const handleNext = () => {
    if (selectedCategory) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
  };
  
  const resetForm = () => {
      setReporter({ name: '', contactNumber: '', email: '' });
      setCreditCardDetails({ cardLastFour: '', amount: '', transactionDate: '', cardIssuerBank: '', transactionTime: '', additionalInfo: '' });
      setOtherFraudDetails('');
      setSelectedCategory('');
      setStep(1);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    let endpoint = '';
    let payload = {};

    if (selectedCategory === 'credit') {
        endpoint = '/api/fraud/report/credit-card';
        payload = { ...reporter, ...creditCardDetails };
    } else if (selectedCategory === 'other') {
        endpoint = '/api/fraud/report/other';
        payload = { ...reporter, fraudDetails: otherFraudDetails };
    }

    try {
      const response = await API.post(endpoint, payload);
      setSuccess(response.data.message || 'Report submitted successfully!');
      setTimeout(() => {
          resetForm();
          setSuccess(null);
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep2 = () => {
      if (selectedCategory === 'credit') {
          return (
            <>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mt-1">Credit Card Fraud Details</h2>
              <p className="text-sm text-gray-500 mt-1 mb-6">Provide details about the fraudulent transaction.</p>
              
              <input type="text" value={creditCardDetails.cardLastFour} onChange={(e) => setCreditCardDetails({...creditCardDetails, cardLastFour: e.target.value})} placeholder="Card's Last Four Digits" maxLength="4" className="w-full border-b-2 border-gray-300 focus:border-violet-500 outline-none py-2 px-1 transition-colors cursor-text mb-4" required />
              <input type="number" value={creditCardDetails.amount} onChange={(e) => setCreditCardDetails({...creditCardDetails, amount: e.target.value})} placeholder="Transaction Amount (₹)" className="w-full border-b-2 border-gray-300 focus:border-violet-500 outline-none py-2 px-1 transition-colors cursor-text mb-4" required />
              <input type="text" value={creditCardDetails.cardIssuerBank} onChange={(e) => setCreditCardDetails({...creditCardDetails, cardIssuerBank: e.target.value})} placeholder="Card Issuer Bank" className="w-full border-b-2 border-gray-300 focus:border-violet-500 outline-none py-2 px-1 transition-colors cursor-text mb-4" required />
              <input type="date" value={creditCardDetails.transactionDate} onChange={(e) => setCreditCardDetails({...creditCardDetails, transactionDate: e.target.value})} placeholder="Transaction Date" className="w-full border-b-2 border-gray-300 focus:border-violet-500 outline-none py-2 px-1 transition-colors cursor-text mb-4" required />
              <input type="time" value={creditCardDetails.transactionTime} onChange={(e) => setCreditCardDetails({...creditCardDetails, transactionTime: e.target.value})} placeholder="Transaction Time" className="w-full border-b-2 border-gray-300 focus:border-violet-500 outline-none py-2 px-1 transition-colors cursor-text mb-4" required />
              <textarea rows={3} value={creditCardDetails.additionalInfo} onChange={(e) => setCreditCardDetails({...creditCardDetails, additionalInfo: e.target.value})} placeholder="Any additional information..." className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-violet-500 outline-none transition-colors cursor-text" />
            </>
          )
      } else if (selectedCategory === 'other') {
          return (
            <>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mt-1">Fraud Details</h2>
              <p className="text-sm text-gray-500 mt-1 mb-6">Please describe the incident in detail.</p>
              <textarea rows={4} value={otherFraudDetails} onChange={(e) => setOtherFraudDetails(e.target.value)} placeholder="Provide all relevant details..." className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-violet-500 outline-none transition-colors cursor-text" required />
            </>
          )
      }
      return null;
  }

  return (
    <>
      <div className='bg-gradient-to-r from-[#7b5cff] to-[#a48dff] w-full h-4'></div>
      <div className="min-h-screen bg-gradient-to-r from-[#7b5cff] to-[#a48dff] flex items-center justify-center p-4 md:p-8 rounded-br-[150px] rounded-bl-[150px]">
        <div className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 lg:gap-16">
          {/* Left Section */}
          <div className="w-full md:w-1/2 flex flex-col items-center text-white text-center mb-6 md:mb-0">
            <div className='mb-8 md:mb-12 w-full'>
              <span className='text-2xl md:text-3xl font-bold cursor-pointer'>RoomMilega</span>
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
                    <FiArrowLeft className="mr-1" /> Back to Categories
                  </button>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="mb-6">
                        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mt-1">Your Details</h2>
                        <p className="text-sm text-gray-500 mt-1">Please provide your contact information.</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input 
                        type="text" 
                        value={reporter.name} 
                        onChange={(e) => setReporter({...reporter, name: e.target.value})} 
                        placeholder="Your full name" 
                        className="w-full border-b-2 border-gray-300 focus:border-violet-500 outline-none py-2 px-1 transition-colors cursor-text" 
                        required 
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                      <input 
                        type="tel" 
                        value={reporter.contactNumber} 
                        onChange={(e) => setReporter({...reporter, contactNumber: e.target.value})} 
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
                        value={reporter.email} 
                        onChange={(e) => setReporter({...reporter, email: e.target.value})} 
                        placeholder="example@mail.com" 
                        className="w-full border-b-2 border-gray-300 focus:border-violet-500 outline-none py-2 px-1 transition-colors cursor-text" 
                        required 
                      />
                    </div>
                    
                    <div className="pt-4 border-t border-gray-200">
                        {renderStep2()}
                    </div>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative flex items-center" role="alert">
                            <FiAlertTriangle className="mr-2"/>
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative flex items-center" role="alert">
                            <FiCheckCircle className="mr-2"/>
                            <span className="block sm:inline">{success}</span>
                        </div>
                    )}

                    <button 
                      type="submit"
                      disabled={loading}
                      className="w-full mt-6 bg-violet-600 hover:bg-violet-700 text-white py-3 rounded-lg transition-all duration-300 font-medium shadow-md hover:shadow-lg disabled:bg-violet-400 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {loading ? 'Submitting...' : 'Submit Report'}
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