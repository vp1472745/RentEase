import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { FiHeart } from "react-icons/fi";
import {
  FaHome,
  FaUser,
  FaDownload,
  FaRegFileAlt,
  FaRegLightbulb,
  FaUserPlus,
  FaSignInAlt,
} from "react-icons/fa";
import {
  IoDiamondOutline,
  IoHomeOutline,
  IoBusinessOutline,
  IoReceiptOutline,
} from "react-icons/io5";
import {
  HiOutlineNewspaper,
  HiOutlineQuestionMarkCircle,
} from "react-icons/hi2";
import { MdOutlineWatchLater, MdOutlineKeyboardArrowUp } from "react-icons/md";
import { PiDetective } from "react-icons/pi";

import { LogOut } from "lucide-react";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import axios from "../../lib/axios.js";
import { toast } from "react-hot-toast";

// Import images
import pheart from "../../assets/HP.png";
import wwheart from "../../assets/HW.png";
import FP from "../../assets/FP.png";
import FW from "../../assets/FW.png";
import contactp from "../../assets/contactp.png";
import seen from "../../assets/seen.png";
import cursor from "../../assets/cursor.png";
import house from "../../assets/house.png";
import property from "../../assets/property.png";
import protection from "../../assets/protection.png";
import services from "../../assets/services.png";
import QR from "../../assets/QR.png";

const MobileMenu = ({
  isOpen,
  onClose,
  isAuthenticated,
  user,
  profileImage,
  handleLogout,
  seenCount,
}) => {
  const [isQuickSearchOpen, setIsQuickSearchOpen] = useState(false);
  const [isHousingOpen, setIsHousingOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isSavedPropertiesOpen, setIsSavedPropertiesOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Contacted");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [savedProperties, setSavedProperties] = useState([]);
  const [savedPropertiesLoading, setSavedPropertiesLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch saved properties
  const fetchSavedProperties = async () => {
    if (!isAuthenticated) return;

    try {
      setSavedPropertiesLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/properties/saved", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSavedProperties(response.data || []);
    } catch (error) {
      console.error("Error fetching saved properties:", error);
      toast.error("Failed to load saved properties");
    } finally {
      setSavedPropertiesLoading(false);
    }
  };

  // Handle unsave property
  const handleUnsaveProperty = async (propertyId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/properties/save/${propertyId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Remove from local state
      setSavedProperties((prev) =>
        prev.filter((prop) => prop._id !== propertyId)
      );
      toast.success("Property removed from saved list");
      // Dispatch event so other components (navbar, etc.) update
      window.dispatchEvent(new Event("savedPropertyUpdated"));
    } catch (error) {
      console.error("Error unsaving property:", error);
      toast.error("Failed to remove property from saved list");
    }
  };

  // Fetch saved properties when menu opens and user is authenticated
  useEffect(() => {
    if (isOpen && isAuthenticated) {
      fetchSavedProperties();
    }
  }, [isOpen, isAuthenticated]);

  // Listen for savedPropertyUpdated event (for cross-component sync)
  useEffect(() => {
    const handleSavedPropertyUpdate = () => {
      fetchSavedProperties();
    };
    window.addEventListener("savedPropertyUpdated", handleSavedPropertyUpdate);
    return () => {
      window.removeEventListener(
        "savedPropertyUpdated",
        handleSavedPropertyUpdate
      );
    };
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle ESC key to close auth modal
  useEffect(() => {
    function handleEscKey(event) {
      if (event.key === "Escape" && isAuthModalOpen) {
        setIsAuthModalOpen(false);
      }
    }

    if (isAuthModalOpen) {
      document.addEventListener("keydown", handleEscKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isAuthModalOpen]);

  useEffect(() => {
    const handlePropertySaved = () => {
      fetchSavedProperties();
    };
    window.addEventListener("propertySaved", handlePropertySaved);
    return () => {
      window.removeEventListener("propertySaved", handlePropertySaved);
    };
  }, []);

  const handleMenuClick = (e) => {
    e.stopPropagation();
    onClose();
  };

  // Helper function to get media URL
  const getMediaUrl = (mediaItem) => {
    if (!mediaItem) return null;
    if (typeof mediaItem === "string") return mediaItem;
    if (mediaItem.url) return mediaItem.url;
    return null;
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-[2000]"
          onClick={onClose}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 left-0 w-screen h-screen bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-[3000] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
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
              <Link
                to="/PayRent"
                onClick={handleMenuClick}
                className="flex items-center p-3 rounded-lg hover:bg-indigo-50 transition-colors"
              >
                <FaDownload size={20} className="text-indigo-600 mr-3" />
                <span className="text-gray-800 font-medium">Download APP</span>
              </Link>

              <div className="flex items-center p-3 rounded-lg hover:bg-indigo-50 transition-colors">
                <FaRegFileAlt size={20} className="text-indigo-600 mr-3" />
                <Link
                  to="/add-property"
                  onClick={handleMenuClick}
                  className="text-black font-medium"
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
                      <p className="font-semibold text-gray-800">
                        {user?.name || localStorage.getItem("name")}
                      </p>
                      <p className="text-sm text-gray-500">
                        {user?.email || localStorage.getItem("email")}
                      </p>
                    </div>
                  </div>

                  {/* Profile Actions */}
                  <Link
                    to="/profile"
                    onClick={handleMenuClick}
                    className="flex items-center p-3 rounded-lg hover:bg-indigo-50 transition-colors"
                  >
                    <FaUser size={20} className="text-indigo-600 mr-3" />
                    <span className="text-gray-800 font-medium">My Profile</span>
                  </Link>

                  {/* Saved Properties */}
                  <div className="space-y-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsSavedPropertiesOpen(!isSavedPropertiesOpen);
                      }}
                      className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-indigo-50 transition-colors"
                    >
                      <div className="flex items-center">
                        <FiHeart size={20} className="text-indigo-600 mr-3" />
                        <span className="text-gray-800 font-medium">Saved Properties</span>
                        {savedProperties.length > 0 && (
                          <span className="ml-2 bg-indigo-600 text-white text-xs rounded-full px-2 py-1">
                            {savedProperties.length}
                          </span>
                        )}
                      </div>
                      <MdOutlineKeyboardArrowUp
                        size={16}
                        className={`text-indigo-600 transition-transform ${isSavedPropertiesOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    {isSavedPropertiesOpen && (
                      <div className="ml-6 space-y-2">
                        {savedPropertiesLoading ? (
                          <div className="flex items-center justify-center p-4">
                            <div className="w-6 h-6 border-2 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                          </div>
                        ) : savedProperties.length === 0 ? (
                          <div className="p-4 text-center text-gray-500">
                            <FiHeart
                              size={24}
                              className="mx-auto mb-2 text-gray-300"
                            />
                            <p className="text-sm">No saved properties yet</p>
                          </div>
                        ) : (
                          savedProperties.slice(0, 5).map((property) => (
                            <div
                              key={property._id}
                              className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm"
                            >
                              <div className="flex items-start space-x-3">
                                <img
                                  src={
                                    getMediaUrl(property.images?.[0]) ||
                                    "https://via.placeholder.com/60x60?text=No+Image"
                                  }
                                  alt={property.title}
                                  className="w-12 h-12 rounded object-cover flex-shrink-0"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src =
                                      "https://via.placeholder.com/60x60?text=Image+Not+Available";
                                  }}
                                />
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-sm font-medium text-gray-800 truncate">
                                    {property.title}
                                  </h4>
                                  <p className="text-xs text-gray-500">
                                    {property.city}, {property.state}
                                  </p>
                                  <p className="text-sm font-semibold text-purple-600">
                                    ₹{property.monthlyRent?.toLocaleString()}/mo
                                  </p>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleUnsaveProperty(property._id);
                                  }}
                                  className="text-red-500 hover:text-red-700 p-1"
                                  title="Remove from saved"
                                >
                                  <X size={16} />
                                </button>
                              </div>
                              <div className="mt-2 flex space-x-2">
                                {/* Saved Properties "View Details" button */}
                                <button
                                  onClick={() => {
                                    navigate(`/property/${property._id}`);
                                    onClose();
                                  }}
                                  className="flex-1 bg-indigo-600 text-white text-xs py-1 px-2 rounded hover:bg-indigo-700 transition-colors"
                                >
                                  View Details
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                        {savedProperties.length > 5 && (
                          <Link
                            to="/profile?tab=savedProperties"
                            onClick={handleMenuClick}
                            className="block text-center text-indigo-600 text-sm py-2 hover:text-indigo-700"
                          >
                            View All Saved Properties ({savedProperties.length})
                          </Link>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Quick Links */}
                  <div className="space-y-2">
                    {/* Quick Links Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsQuickSearchOpen(!isQuickSearchOpen);
                      }}
                      className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-indigo-50 transition-colors"
                    >
                      <div className="flex items-center">
                        <FaRegLightbulb size={20} className="text-indigo-600 mr-3" />
                        <span className="text-gray-800 font-medium">Quick Links</span>
                      </div>
                      <MdOutlineKeyboardArrowUp
                        size={16}
                        className={`text-indigo-600 transition-transform ${isQuickSearchOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    {isQuickSearchOpen && (
                      <div className="ml-6 space-y-2">
                        <Link
                          to="/"
                          onClick={handleMenuClick}
                          className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <img
                            src={house}
                            alt="Home"
                            className="w-5 h-5 mr-3"
                          />
                          <span className="text-gray-700">Home</span>
                        </Link>
                        <Link
                          to="/add-property"
                          onClick={handleMenuClick}
                          className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <img
                            src={property}
                            alt="Post Properties"
                            className="w-5 h-5 mr-3"
                          />
                          <span className="text-gray-700">Post Properties</span>
                        </Link>
                        <Link
                          to="/News"
                          onClick={handleMenuClick}
                          className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <HiOutlineNewspaper
                            size={18}
                            className="text-gray-600 mr-3"
                          />
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
                          <img
                            src={protection}
                            alt="Housing Protect"
                            className="w-5 h-5 mr-3"
                          />
                          <span className="text-gray-700">Housing Protect</span>
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Services */}
                  <div className="space-y-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsServicesOpen(!isServicesOpen);
                      }}
                      className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center">
                        <IoDiamondOutline size={20} className="text-indigo-600 mr-3" />
                        <span className="text-gray-800 font-medium">Services</span>
                      </div>
                      <MdOutlineKeyboardArrowUp
                        size={16}
                        className={`text-indigo-600 transition-transform ${isServicesOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    {isServicesOpen && (
                      <div className="ml-6 space-y-2">
                        <Link
                          to="/properties"
                          onClick={handleMenuClick}
                          className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <IoHomeOutline
                            size={18}
                            className="text-gray-600 mr-3"
                          />
                          <span className="text-gray-700">Home Rent</span>
                        </Link>
                        <Link
                          to="/add-property"
                          onClick={handleMenuClick}
                          className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <IoBusinessOutline
                            size={18}
                            className="text-gray-600 mr-3"
                          />
                          <span className="text-gray-700">Post Properties</span>
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Other Menu Items */}
                  <Link
                    to="/Fraud"
                    onClick={handleMenuClick}
                    className="flex items-center p-3 rounded-lg hover:bg-indigo-50 transition-colors"
                  >
                    <PiDetective size={20} className="text-indigo-600 mr-3" />
                    <span className="text-gray-800 font-medium">Report a Fraud</span>
                  </Link>

                  {/* Logout */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLogout();
                      handleMenuClick();
                    }}
                    className="flex items-center w-full p-3 rounded-lg hover:bg-indigo-50 transition-colors text-indigo-600"
                  >
                    <LogOut size={20} className="mr-3" />
                    <span className="font-medium text-black">Logout</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {!isAuthenticated && (
                    <>
                      <Link
                        to="/signup"
                        onClick={handleMenuClick}
                        className="flex items-center w-full p-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                      >
                        <FaUserPlus size={20} className="mr-3" />
                        <span className="font-medium">Create Account</span>
                      </Link>
                      <Link
                        to="/login"
                        onClick={handleMenuClick}
                        className="flex items-center w-full p-3 rounded-lg border border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition-colors"
                      >
                        <FaSignInAlt size={20} className="mr-3" />
                        <span className="font-medium">Login</span>
                      </Link>
                    </>
                  )}
                </div>
              )}

              {/* Divider */}
              <div className="border-t border-gray-200 my-4" />

              {/* Social Links */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-600">Follow Us</h3>
                <div className="flex space-x-4">
                  <a
                    href="https://www.instagram.com/v_i_n_e_e_t_9630?igsh=MXR3cTFnMWllMXh0Yg=="
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaInstagram className="text-2xl text-[#E4405F] hover:text-[#C13584] cursor-pointer" />
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaLinkedin className="text-2xl text-[#0077B5] hover:text-[#005983] cursor-pointer" />
                  </a>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaTwitter className="text-2xl text-[#1DA1F2] hover:text-[#0d8ddb] cursor-pointer" />
                  </a>
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaYoutube className="text-2xl text-[#FF0000] hover:text-[#b80000] cursor-pointer" />
                  </a>
                </div>
              </div>

              {/* App Download Section */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-800 mb-2">
                  Download App
                </h3>
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
              <h2 className="text-2xl font-bold text-gray-800">
                Welcome to 'Room Milega'
              </h2>
              <button
                onClick={() => setIsAuthModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              {/* Auth Modal Buttons */}
              <Link
                to="/signup"
                onClick={() => {
                  setIsAuthModalOpen(false);
                  onClose();
                }}
                className="block w-full bg-indigo-600 text-white text-center py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
              >
                Create Account
              </Link>

              <Link
                to="/login"
                onClick={() => {
                  setIsAuthModalOpen(false);
                  onClose();
                }}
                className="block w-full bg-white text-indigo-600 text-center py-3 px-4 rounded-lg border-2 border-indigo-600 hover:bg-indigo-50 transition-colors font-semibold"
              >
                Login
              </Link>
            </div>

            <div className="mt-6 text-center text-gray-600 text-sm">
              <p>
                By continuing, you agree to our Terms of Service and Privacy
                Policy
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileMenu;