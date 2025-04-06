import React, { useState, useRef, useEffect } from 'react';
import { FiShield, FiHome, FiCheckCircle, FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import P from "../assets/Protect.png";

export default function HousingProtect() {
  const [selectedOption, setSelectedOption] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [openSectionIndex, setOpenSectionIndex] = useState(null);
  const [openInfoIndex, setOpenInfoIndex] = useState(null);
  const sidebarRef = useRef(null);

  // FAQ data for Cyber Safe
  const cyberFaqs = [
    {
      question: "What all benefits do I get as a part of Cyber Protect plan?",
      answer: "The Cyber Protect plan provides financial fraud protection, identity monitoring, and digital risk assessment with coverage up to ₹1 Lacs."
    },
    {
      question: "What are benefits provided by Boxx Insurance?",
      answer: "Boxx Insurance offers comprehensive coverage for cyber threats including funds insurance and 24/7 identity monitoring services."
    },
    {
      question: "What are Insurance Plan (Digital Suraksha Group insurance) benefits from BAGIC?",
      answer: "BAGIC's Digital Suraksha Group insurance provides group coverage for cyber threats with special corporate rates and extended protection limits."
    }
  ];

  // FAQ data for Rent Protect
  const rentFaqs = [
    {
      question: "What is Rent Protect cover?",
      answer: "Rent Protect covers your rent payments and provides health protection including personal accident coverage up to ₹1 Lac and medical expense coverage."
    },
    {
      question: "What is the maximum cover available under Rent Protect cover?",
      answer: "The maximum coverage under Rent Protect is ₹1 Lac for personal accident and up to ₹60,000 for medical expenses with unlimited medical referrals."
    }
  ];

  // Important Information data
  const importantInfo = {
    cyber: [
      "Coverage is valid for one year from date of purchase",
      "Claims must be reported within 30 days of incident",
      "Policy underwritten by Bajaj Allianz General Insurance",
      "All claims subject to terms and conditions of the policy"
    ],
    rentprotect: [
      "Coverage begins 15 days after policy purchase",
      "Pre-existing conditions are not covered",
      "Maximum claim amount per incident is ₹1 Lac",
      "24/7 customer support available for claims"
    ]
  };

  // Terms & Conditions data
  const termsConditions = {
    cyber: [
      "Digital Suraksha Policy terms apply",
      "Minimum age requirement: 18 years",
      "Coverage limited to India only",
      "Fraudulent claims will be rejected"
    ],
    rentprotect: [
      "Rent must be paid through registered bank account",
      "Medical reports required for health claims",
      "Coverage excludes pre-existing conditions",
      "Policy non-transferable"
    ]
  };

  // Cyber Safe sections data
  const cyberSections = [
    {
      title: `Funds Insurance                 Upto ₹1 Lacs`,
      items: [
        {
          value: "Digital theft of funds Insurance by Bajaj Allianz   Covered instruments: Credit Card, UPI, Debit Card, Net-banking, Wallets Unauthorised transaction due to cyber attacks, phishing, spoofing, telephonic calls, and simjacking are covered Exclusions: Physical cash transactions, ATM withdrawals, Loss due to gross negligence, Cyber extortion Exclusions: Direct financial loss due to theft of phone, laptop, card, or other devices"
        },
      ]
    },
    {
      title: "Identity Security  Unlimited",
      items: [
        {
          value: "Check your leaked info (password, order history etc) with your phone number and email address Unlimited checks with Boxx insurance"
        },
      ]
    },
    {
      title: "Digital Services",
      items: [
        {
          value: "Check your digital safety score with our Boxx Self Assessment tool Learn about online risks, identify scams, and improve your online safety"
        },
      ]
    }
  ];

  // Rent Protect sections data
  const rentSections = [
    {
      title: "Critical Illness",
      items: [
        {
          name: "Personal Accident",
          value: "Upto ₹1 Lac"
        },
        {
          name: "Critical Illness Cover",
          value: "Upto ₹50,000"
        }
      ]
    },
    {
      title: "Medical Expenses",
      items: [
        {
          name: "Second medical opinion",
          value: "Upto ₹60,000"
        },
        {
          name: "Hospitalization Cover",
          value: "Upto ₹30,000"
        }
      ]
    },
    {
      title: "Medical referral",
      items: [
        {
          name: "Medical Consultation",
          value: "Unlimited"
        },
        {
          name: "Emergency Services",
          value: "24/7 Available"
        }
      ]
    }
  ];

  const handleCyberSafe = () => {
    setSelectedOption('cyber');
    setSidebarOpen(true);
    setOpenFaqIndex(null);
    setOpenSectionIndex(null);
    setOpenInfoIndex(null);
  };

  const handleRentProtect = () => {
    setSelectedOption('rentprotect');
    setSidebarOpen(true);
    setOpenFaqIndex(null);
    setOpenSectionIndex(null);
    setOpenInfoIndex(null);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
    setOpenFaqIndex(null);
    setOpenSectionIndex(null);
    setOpenInfoIndex(null);
  };

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const toggleSection = (index) => {
    setOpenSectionIndex(openSectionIndex === index ? null : index);
  };

  const toggleInfo = (index) => {
    setOpenInfoIndex(openInfoIndex === index ? null : index);
  };

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        closeSidebar();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sidebarOpen]);

  return (
    <>
      <div className="w-full min-h-screen bg-purple-800">
        {/* Top Banner */}
        <div className="w-full h-15 bg-purple-800"></div>

        {/* Main Content */}
        <div className='flex text-center ml-60 items-center'>   
          <div>
            <div className="container px-4 py-12 mt-20">
              {/* Header Section */}
              <div className="mb-5">
                <h1 className="font-bold text-white mb-4 mr-112">RentEase PROTECT</h1>
                <p className="text-white mr-65">
                  Home & Lifestyle protection plans made simple  <br /> <span className='mr-45'>with Housing Protect</span> 
                </p>
              </div>
              <div className="text-center absolute">
                <h2 className="text-[20px] font-semibold text-white px-3 mt-6">WE OFFER</h2>
              </div>
              
              {/* Offer Cards Section */}
              <div className="grid grid-cols-2 md:grid-cols-2 w-95 h-70 rounded-lg border border-white shadow-lg">
                {/* Cyber Safe Card */}
                <div 
                  onClick={handleCyberSafe}
                  className="bg-purple-800 rounded-lg shadow-lg p-6 border border-white w-45 h-50 ml-2 m-18 cursor-pointer hover:bg-purple-700 transition-colors"
                >
                  <div className="flex flex-col h-full">
                    <h2 className="text-[20px] font-bold text-white mb-2">Cyber Safe</h2>
                    <p className="text-white mb-6 flex-grow">
                      Protect yourself from financial fraud
                    </p>
                    <div className="h-10 text-white rounded-lg flex items-center justify-center">
                      <FiShield size={18} />
                      <span className="ml-2">View Details</span>
                    </div>
                  </div>
                </div>

                {/* Rent Protect Card */}
                <div 
                  onClick={handleRentProtect}
                  className="bg-purple-800 rounded-lg shadow-lg p-6 border border-white w-45 h-50 ml-1 m-18 cursor-pointer hover:bg-purple-700 transition-colors"
                >
                  <div className="flex flex-col h-full">
                    <h2 className="text-[20px] font-bold text-white mb-2">Rent Protect</h2>
                    <p className="text-white flex-grow">
                      Protect your rent. Protect your health
                    </p>
                    <div className="h-10 mt-6 text-white rounded-lg flex items-center justify-center gap-2">
                      <FiHome size={18} />
                      <span>View Details</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className='w-70 h-70 mr-50 absolute left-200 top-55'>
            <img src={P} alt="" className='w-70 h-70'/>
          </div>
        </div>

        {/* Sidebar for Policy Details */}
        {sidebarOpen && (
          <div 
            ref={sidebarRef}
            className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">
                  {selectedOption === 'cyber' && 'Cyber Safe'}
                  {selectedOption === 'rentprotect' && 'Rent Protect'}
                </h3>
                <button 
                  onClick={closeSidebar}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX size={24} />
                </button>
              </div>

              <div className="text-gray-700 space-y-4">
                {selectedOption === 'cyber' ? (
                  <>
                    <h4 className="font-semibold text-lg">Protect yourself from Financial fraud</h4>
                    
                    {/* Cyber Safe Sections with Dropdown */}
                    <div className="space-y-4 mt-4">
                      {cyberSections.map((section, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-3">
                          <button 
                            onClick={() => toggleSection(index)}
                            className="w-full flex justify-between items-center text-left focus:outline-none"
                          >
                            <div className="flex items-center">
                              <h5 className="font-medium text-gray-800">{section.title}</h5>
                            </div>
                            {openSectionIndex === index ? (
                              <FiChevronUp className="text-gray-500" />
                            ) : (
                              <FiChevronDown className="text-gray-500" />
                            )}
                          </button>
                          
                          <div 
                            className={`overflow-hidden transition-all duration-300 ease-in-out ${
                              openSectionIndex === index ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'
                            }`}
                          >
                            <div className="space-y-3 pl-2">
                              {section.items.map((item, itemIndex) => (
                                <div key={itemIndex} className="flex items-start">
                                  <FiCheckCircle className="text-indigo-600 mr-2 mt-1 flex-shrink-0" />
                                  <div className="flex-1">
                                    <span className="font-medium text-gray-800">{item.name}</span>
                                    <p className="text-sm text-gray-600">{item.value}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6">
                      {/* Important Information Dropdown */}
                      <div className="border border-gray-200 rounded-lg p-3 mb-4">
                        <button 
                          onClick={() => toggleInfo(0)}
                          className="w-full flex justify-between items-center text-left focus:outline-none"
                        >
                          <h5 className="font-semibold text-gray-800">Important Information</h5>
                          {openInfoIndex === 0 ? (
                            <FiChevronUp className="text-gray-500" />
                          ) : (
                            <FiChevronDown className="text-gray-500" />
                          )}
                        </button>
                        
                        <div 
                          className={`overflow-hidden transition-all duration-300 ease-in-out ${
                            openInfoIndex === 0 ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'
                          }`}
                        >
                          <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
                            {importantInfo.cyber.map((item, index) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Terms & Conditions Dropdown */}
                      <div className="border border-gray-200 rounded-lg p-3 mb-4">
                        <button 
                          onClick={() => toggleInfo(1)}
                          className="w-full flex justify-between items-center text-left focus:outline-none"
                        >
                          <h5 className="font-semibold text-gray-800">Terms & Conditions</h5>
                          {openInfoIndex === 1 ? (
                            <FiChevronUp className="text-gray-500" />
                          ) : (
                            <FiChevronDown className="text-gray-500" />
                          )}
                        </button>
                        
                        <div 
                          className={`overflow-hidden transition-all duration-300 ease-in-out ${
                            openInfoIndex === 1 ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'
                          }`}
                        >
                          <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
                            {termsConditions.cyber.map((item, index) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      <h5 className="font-semibold mt-4">Frequently Asked Questions</h5>
                      <div className="space-y-2 mt-2">
                        {cyberFaqs.map((faq, index) => (
                          <div key={index} className="border-b border-gray-200 pb-2">
                            <button 
                              onClick={() => toggleFaq(index)}
                              className="w-full flex justify-between items-center text-left py-2 focus:outline-none"
                            >
                              <span className="text-sm font-medium text-gray-800">{faq.question}</span>
                              {openFaqIndex === index ? (
                                <FiChevronUp className="text-gray-500" />
                              ) : (
                                <FiChevronDown className="text-gray-500" />
                              )}
                            </button>
                            <div 
                              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                openFaqIndex === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                              }`}
                            >
                              <p className="text-sm mt-2 text-gray-600 pl-2 pb-2">{faq.answer}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : selectedOption === 'rentprotect' ? (
                  <>
                    <h4 className="font-semibold text-lg">Protect your Rent. Protect your health</h4>
                    
                    {/* Rent Protect Sections with Dropdown */}
                    <div className="space-y-4 mt-4">
                      {rentSections.map((section, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-3">
                          <button 
                            onClick={() => toggleSection(index)}
                            className="w-full flex justify-between items-center text-left focus:outline-none"
                          >
                            <div className="flex items-center">
                              <h5 className="font-medium text-gray-800">{section.title}</h5>
                            </div>
                            {openSectionIndex === index ? (
                              <FiChevronUp className="text-gray-500" />
                            ) : (
                              <FiChevronDown className="text-gray-500" />
                            )}
                          </button>
                          
                          <div 
                            className={`overflow-hidden transition-all duration-300 ease-in-out ${
                              openSectionIndex === index ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'
                            }`}
                          >
                            <div className="space-y-3 pl-2">
                              {section.items.map((item, itemIndex) => (
                                <div key={itemIndex} className="flex items-start">
                                  <FiCheckCircle className="text-amber-500 mr-2 mt-1 flex-shrink-0" />
                                  <div className="flex-1">
                                    <span className="font-medium text-gray-800">{item.name}</span>
                                    <p className="text-sm text-gray-600">{item.value}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6">
                      {/* Important Information Dropdown */}
                      <div className="border border-gray-200 rounded-lg p-3 mb-4">
                        <button 
                          onClick={() => toggleInfo(0)}
                          className="w-full flex justify-between items-center text-left focus:outline-none"
                        >
                          <h5 className="font-semibold text-gray-800">Important Information</h5>
                          {openInfoIndex === 0 ? (
                            <FiChevronUp className="text-gray-500" />
                          ) : (
                            <FiChevronDown className="text-gray-500" />
                          )}
                        </button>
                        
                        <div 
                          className={`overflow-hidden transition-all duration-300 ease-in-out ${
                            openInfoIndex === 0 ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'
                          }`}
                        >
                          <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
                            {importantInfo.rentprotect.map((item, index) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Terms & Conditions Dropdown */}
                      <div className="border border-gray-200 rounded-lg p-3 mb-4">
                        <button 
                          onClick={() => toggleInfo(1)}
                          className="w-full flex justify-between items-center text-left focus:outline-none"
                        >
                          <h5 className="font-semibold text-gray-800">Terms & Conditions</h5>
                          {openInfoIndex === 1 ? (
                            <FiChevronUp className="text-gray-500" />
                          ) : (
                            <FiChevronDown className="text-gray-500" />
                          )}
                        </button>
                        
                        <div 
                          className={`overflow-hidden transition-all duration-300 ease-in-out ${
                            openInfoIndex === 1 ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'
                          }`}
                        >
                          <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
                            {termsConditions.rentprotect.map((item, index) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      <h5 className="font-semibold mt-4">Frequently Asked Questions</h5>
                      <div className="space-y-2 mt-2">
                        {rentFaqs.map((faq, index) => (
                          <div key={index} className="border-b border-gray-200 pb-2">
                            <button 
                              onClick={() => toggleFaq(index)}
                              className="w-full flex justify-between items-center text-left py-2 focus:outline-none"
                            >
                              <span className="text-sm font-medium text-gray-800">{faq.question}</span>
                              {openFaqIndex === index ? (
                                <FiChevronUp className="text-gray-500" />
                              ) : (
                                <FiChevronDown className="text-gray-500" />
                              )}
                            </button>
                            <div 
                              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                openFaqIndex === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                              }`}
                            >
                              <p className="text-sm mt-2 text-gray-600 pl-2 pb-2">{faq.answer}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : null}
              </div>

              {/* Payment Button */}
              <button className="mt-8 px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white text-lg rounded-lg w-full transition-colors">
                Buy once for ₹199
              </button>
            </div>
          </div>
        )}

        {/* Testimonials Section - Hidden in this design */}
        <div className="mt-16 max-w-4xl text-center hidden">
          <h3 className="text-2xl font-bold text-gray-800">Why Choose Our Protection Services?</h3>
          <p className="text-gray-600 mt-4">
            Thousands of satisfied customers trust us for secure protection solutions.
          </p>
        </div>
      </div>
    </>
  );
}