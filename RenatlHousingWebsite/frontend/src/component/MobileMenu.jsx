import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Menu } from 'lucide-react';
import { FiHeart } from 'react-icons/fi';
import { FaHome, FaUser, FaDownload, FaRegFileAlt, FaRegLightbulb, FaUserPlus, FaSignInAlt } from 'react-icons/fa';
import { IoDiamondOutline, IoHomeOutline, IoBusinessOutline, IoReceiptOutline } from 'react-icons/io5';
import { HiOutlineNewspaper, HiOutlineQuestionMarkCircle } from 'react-icons/hi2';
import { MdOutlineWatchLater, MdOutlineKeyboardArrowUp } from 'react-icons/md';
import { CiBellOn } from 'react-icons/ci';
import { PiDetective } from 'react-icons/pi';
import { SlStar } from 'react-icons/sl';
import { RiArrowRightSLine } from 'react-icons/ri';
import { LogOut } from 'lucide-react';
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaYoutube,
} from 'react-icons/fa';

// Import images
import pheart from '../assets/HP.png';
import wwheart from '../assets/HW.png';
import FP from '../assets/FP.png';
import FW from '../assets/FW.png';
import contactp from '../assets/contactp.png';
import seen from '../assets/seen.png';
import cursor from '../assets/cursor.png';
import house from '../assets/house.png';
import property from '../assets/property.png';
import protection from '../assets/protection.png';
import services from '../assets/services.png';
import QR from '../assets/QR.png';

const MobileMenu = ({ 
  isOpen, 
  onClose, 
  isAuthenticated, 
  user, 
  profileImage, 
  handleLogout,
  seenCount 
}) => {
  const [isQuickSearchOpen, setIsQuickSearchOpen] = useState(false);
  const [isHousingOpen, setIsHousingOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Contacted");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const navigate = useNavigate();

  // Debug log to check if isOpen prop is received
  console.log("MobileMenu isOpen prop:", isOpen);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle ESC key to close auth modal
  useEffect(() => {
    function handleEscKey(event) {
      if (event.key === 'Escape' && isAuthModalOpen) {
        setIsAuthModalOpen(false);
      }
    }

    if (isAuthModalOpen) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isAuthModalOpen]);

  const handleMenuClick = () => {
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[55]"
          onClick={onClose}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-[60] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Menu</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <X size={20} className="text-gray-600" />
            </button>
          </div>

          {/* Menu Content */}
          <div className="flex-1 overflow-y-auto py-4">
            <div className="px-6 space-y-4">
              {/* Main Navigation Items */}
              {/* <Link
                to="/premium"
                onClick={handleMenuClick}
                className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <IoDiamondOutline size={20} className="text-purple-600 mr-3" />
                <span className="text-gray-800 font-medium">Premium</span>
              </Link> */}

              <Link
                to="/PayRent"
                onClick={handleMenuClick}
                className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FaDownload size={20} className="text-blue-600 mr-3" />
                <span className="text-gray-800 font-medium">Download APP</span>
              </Link>

              <div className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <img
                  src={pheart}
                  className="w-5 h-5 object-contain mr-3"
                  alt="Save"
                />
                <Link
                  to="/profile?tab=myactivity"
                  onClick={handleMenuClick}
                  className="text-gray-800 font-medium"
                >
                  Save
                </Link>
              </div>

              <div className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <img
                  src={FP}
                  className="w-6 h-6 object-contain mr-3"
                  alt="List Property"
                />
                <Link
                  to="/add-property"
                  onClick={handleMenuClick}
                  className="text-gray-800 font-medium"
                >
                  List Property
                </Link>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 my-4" />

              {/* Authentication Section */}
              {isAuthenticated && user ? (
                <div className="space-y-4">
                  {/* Profile Info */}
                  <div className="flex items-center p-3 rounded-lg bg-gray-50">
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-12 h-12 rounded-full object-cover border-2 border-purple-200"
                    />
                    <div className="ml-3">
                      <p className="font-semibold text-gray-800">{user?.name || localStorage.getItem('name')}</p>
                      <p className="text-sm text-gray-500">{user?.email || localStorage.getItem('email')}</p>
                    </div>
                  </div>

                  {/* Profile Actions */}
                  <Link
                    to="/profile"
                    onClick={handleMenuClick}
                    className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <FaUser size={20} className="text-purple-600 mr-3" />
                    <span className="text-gray-800 font-medium">My Profile</span>
                  </Link>

                  {/* My Activity */}
                  <Link
                    to="/profile?tab=myactivity"
                    onClick={handleMenuClick}
                    className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <FaRegFileAlt size={20} className="text-blue-600 mr-3" />
                    <span className="text-gray-800 font-medium">My Activity</span>
                  </Link>

                  {/* My Transactions */}
                  <Link
                    to="/profile?tab=myTransactions"
                    onClick={handleMenuClick}
                    className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <FaRegFileAlt size={20} className="text-green-600 mr-3" />
                    <span className="text-gray-800 font-medium">My Transactions</span>
                  </Link>

                  {/* My Reviews */}
                  <Link
                    to="/profile?tab=myReviews"
                    onClick={handleMenuClick}
                    className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <SlStar size={20} className="text-yellow-600 mr-3" />
                    <span className="text-gray-800 font-medium">My Reviews</span>
                  </Link>

                  {/* Quick Links */}
                  <div className="space-y-2">
                    <button
                      onClick={() => setIsQuickSearchOpen(!isQuickSearchOpen)}
                      className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center">
                        <img src={cursor} alt="Quick Links" className="w-5 h-5 mr-3" />
                        <span className="text-gray-800 font-medium">Quick Links</span>
                      </div>
                      <MdOutlineKeyboardArrowUp
                        size={16}
                        className={`transition-transform ${isQuickSearchOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    
                    {isQuickSearchOpen && (
                      <div className="ml-6 space-y-2">
                        <Link
                          to="/"
                          onClick={handleMenuClick}
                          className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <img src={house} alt="Home" className="w-5 h-5 mr-3" />
                          <span className="text-gray-700">Home</span>
                        </Link>
                        <Link
                          to="/add-property"
                          onClick={handleMenuClick}
                          className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <img src={property} alt="Post Properties" className="w-5 h-5 mr-3" />
                          <span className="text-gray-700">Post Properties</span>
                        </Link>
                        <Link
                          to="/News"
                          onClick={handleMenuClick}
                          className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <HiOutlineNewspaper size={18} className="text-gray-600 mr-3" />
                          <span className="text-gray-700">News</span>
                        </Link>
                        <Link
                          to="/ReportResearch"
                          onClick={handleMenuClick}
                          className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <FaHome size={18} className="text-gray-600 mr-3" />
                          <span className="text-gray-700">Research</span>
                        </Link>
                        <Link
                          to="/housingProtect"
                          onClick={handleMenuClick}
                          className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <img src={protection} alt="Housing Protect" className="w-5 h-5 mr-3" />
                          <span className="text-gray-700">Housing Protect</span>
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Housing Edge */}
                  <div className="space-y-2">
                    <button
                      onClick={() => setIsHousingOpen(!isHousingOpen)}
                      className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center">
                        <FaRegLightbulb size={20} className="text-orange-600 mr-3" />
                        <span className="text-gray-800 font-medium">Housing Edge</span>
                      </div>
                      <MdOutlineKeyboardArrowUp
                        size={16}
                        className={`transition-transform ${isHousingOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    
                    {isHousingOpen && (
                      <div className="ml-6 space-y-2">
                        <Link
                          to="/pay-rent"
                          onClick={handleMenuClick}
                          className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <img src={protection} alt="Pay Rent" className="w-5 h-5 mr-3" />
                          <span className="text-gray-700">Pay Rent</span>
                        </Link>
                        <Link
                          to="/premium"
                          onClick={handleMenuClick}
                          className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <IoDiamondOutline size={18} className="text-gray-600 mr-3" />
                          <span className="text-gray-700">Housing Premium</span>
                        </Link>
                        <Link
                          to="/receipted"
                          onClick={handleMenuClick}
                          className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <IoReceiptOutline size={18} className="text-gray-600 mr-3" />
                          <span className="text-gray-700">Rent Receipt</span>
                        </Link>
                        <Link
                          to="/housingProtect"
                          onClick={handleMenuClick}
                          className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <img src={protection} alt="Housing Protect" className="w-5 h-5 mr-3" />
                          <span className="text-gray-700">Housing Protect</span>
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Services */}
                  <div className="space-y-2">
                    <button
                      onClick={() => setIsServicesOpen(!isServicesOpen)}
                      className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center">
                        <img src={services} alt="Services" className="w-5 h-5 mr-3" />
                        <span className="text-gray-800 font-medium">Services</span>
                      </div>
                      <MdOutlineKeyboardArrowUp
                        size={16}
                        className={`transition-transform ${isServicesOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    
                    {isServicesOpen && (
                      <div className="ml-6 space-y-2">
                        <Link
                          to="/properties"
                          onClick={handleMenuClick}
                          className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <IoHomeOutline size={18} className="text-gray-600 mr-3" />
                          <span className="text-gray-700">Home Rent</span>
                        </Link>
                        <Link
                          to="/add-property"
                          onClick={handleMenuClick}
                          className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <IoBusinessOutline size={18} className="text-gray-600 mr-3" />
                          <span className="text-gray-700">Post Properties</span>
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Other Menu Items */}
                  <Link
                    to="/reviews"
                    onClick={handleMenuClick}
                    className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <CiBellOn size={20} className="text-yellow-600 mr-3" />
                    <span className="text-gray-800 font-medium">Unsubscribe Alert</span>
                  </Link>

                  <Link
                    to="/Fraud"
                    onClick={handleMenuClick}
                    className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <PiDetective size={20} className="text-red-600 mr-3" />
                    <span className="text-gray-800 font-medium">Report a Fraud</span>
                  </Link>

                  <button
                    onClick={handleMenuClick}
                    className="flex items-center w-full p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <HiOutlineQuestionMarkCircle size={20} className="text-blue-600 mr-3" />
                    <span className="text-gray-800 font-medium">Visit Help Center</span>
                  </button>

                  {/* Logout */}
                  <button
                    onClick={() => {
                      handleLogout();
                      handleMenuClick();
                    }}
                    className="flex items-center w-full p-3 rounded-lg hover:bg-red-50 transition-colors text-red-600"
                  >
                    <LogOut size={20} className="mr-3" />
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="flex items-center w-full p-3 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors"
                  >
                    <FaUserPlus size={20} className="mr-3" />
                    <span className="font-medium">Create Account</span>
                  </button>
                </div>
              )}

              {/* Divider */}
              <div className="border-t border-gray-200 my-4" />

              {/* Social Links */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-600">Follow Us</h3>
                <div className="flex space-x-4">
                  <FaFacebook className="text-2xl text-blue-600 hover:text-blue-700 cursor-pointer" />
                  <Link to="https://www.instagram.com/rentease_1611/">
                    <FaInstagram className="text-2xl text-pink-600 hover:text-pink-700 cursor-pointer" />
                  </Link>
                  <FaLinkedin className="text-2xl text-blue-700 hover:text-blue-800 cursor-pointer" />
                  <FaTwitter className="text-2xl text-blue-400 hover:text-blue-500 cursor-pointer" />
                  <FaYoutube className="text-2xl text-red-600 hover:text-red-700 cursor-pointer" />
                </div>
              </div>

              {/* App Download Section */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-800 mb-2">Download App</h3>
                <div className="flex space-x-2">
                  <img
                    src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                    alt="App Store"
                    className="w-16"
                  />
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                    alt="Google Play"
                    className="w-16"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      {isAuthModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70]"
          onClick={() => setIsAuthModalOpen(false)}
        >
          <div 
            className="bg-white rounded-lg p-8 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Welcome to RentEase</h2>
              <button
                onClick={() => setIsAuthModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <Link
                to="/signup"
                onClick={() => {
                  setIsAuthModalOpen(false);
                  onClose();
                }}
                className="block w-full bg-purple-600 text-white text-center py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors font-semibold"
              >
                Create Account
              </Link>
              
              <Link
                to="/login"
                onClick={() => {
                  setIsAuthModalOpen(false);
                  onClose();
                }}
                className="block w-full bg-white text-purple-600 text-center py-3 px-4 rounded-lg border-2 border-purple-600 hover:bg-purple-50 transition-colors font-semibold"
              >
                Login
              </Link>
            </div>
            
            <div className="mt-6 text-center text-gray-600 text-sm">
              <p>By continuing, you agree to our Terms of Service and Privacy Policy</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileMenu; 