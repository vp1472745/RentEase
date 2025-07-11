import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, Home, Edit, Menu, X } from "lucide-react";
import { FiHeart } from "react-icons/fi";
import users from "../assets/users.png";
import { PiDetective } from "react-icons/pi";
import { HiOutlineQuestionMarkCircle } from "react-icons/hi2";
import { MdOutlineWatchLater } from "react-icons/md";
import FP from "../assets/FP.png";
import FW from "../assets/FW.png";
import { FaRegHeart } from "react-icons/fa";
import wwheart from "../assets/HW.png";
import news from "../assets/new.png";
import blackfree from "../assets/blackfree.png";
import wfree from "../assets/wfree.png";
import { IoHomeOutline, IoBusinessOutline } from "react-icons/io5";
import pheart from "../assets/HP.png";
import { CiBellOn } from "react-icons/ci";
import free from "../assets/free.png";
import house from "../assets/house.png";
import { HiOutlineNewspaper } from "react-icons/hi2";
import { MdOutlinePayment } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import love from "../assets/love.png";
import protection from "../assets/protection.png";
import { FaRegLightbulb } from "react-icons/fa";
import useri from "../assets/user.png";
import cursor from "../assets/cursor.png";
import { SlStar } from "react-icons/sl";
import services from "../assets/services.png";
import seen from "../assets/seen.png";
import property from "../assets/property.png";
import {
  FaHome,
  FaKey,
  FaNewspaper,
  FaSearch,
  FaCreditCard,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaYoutube,
  FaUser,
  FaDownload,
  FaBriefcase,
} from "react-icons/fa";
import { IoReceiptOutline } from "react-icons/io5";
import Premium from "../pages/Premium.jsx";
import { Heart } from "lucide-react";
import { BiHomeSmile } from "react-icons/bi";
import QR from "../assets/QR.png";
import contactp from "../assets/contactp.png";
import { FaRegFileAlt } from "react-icons/fa";
import { MdOutlineKeyboardArrowUp } from "react-icons/md";
import { IoDiamondOutline } from "react-icons/io5";
import { RiArrowRightSLine } from "react-icons/ri";
import pfree from "../assets/pfree.png";
import axios from "../lib/axios.js";
import MobileMenu from "./MobileMenu.jsx";
import { Eye, EyeOff } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaMapMarkerAlt,
  FaRupeeSign,
  FaBed,
  FaRulerCombined,
} from "react-icons/fa";

function Navbar({ isAuthenticated, setIsAuthenticated, user, setUser }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAuthMenuOpen, setIsAuthMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState("welcome"); // 'welcome', 'login', 'signup'
  const [isHousingEdgeOpen, setIsHousingEdgeOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMainMenuOpen, setIsMainMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const profileRef = useRef(null);
  const authMenuRef = useRef(null);
  const mainMenuRef = useRef(null);
  const navigate = useNavigate();
  const [isCardOpen, setIsCardOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const [selectedTab, setSelectedTab] = useState("Contacted");
  const [isQuickSearchOpen, setIsQuickSearchOpen] = useState(false);
  const [isHousingOpen, setIsHousingOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [seenCount, setSeenCount] = useState(0);
  const [profileImage, setProfileImage] = useState(useri);
  const [seenProperties, setSeenProperties] = useState([]);

  // Saved Properties State
  const [savedProperties, setSavedProperties] = useState([]);
  const [isSavedPropertiesOpen, setIsSavedPropertiesOpen] = useState(false);
  const [savedPropertiesLoading, setSavedPropertiesLoading] = useState(false);

  // Form states for login
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Form states for signup
  const [signupForm, setSignupForm] = useState({
    email: "",
    name: "",
    password: "",
    phone: "",
    role: "user",
  });
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [signupError, setSignupError] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Function to get the user's initial for avatar
  const getInitial = () => {
    const name =
      user?.name ||
      localStorage.getItem("name") ||
      user?.email ||
      localStorage.getItem("email") ||
      "";
    return name.charAt(0).toUpperCase();
  };

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
      console.error("Error fetching saved properties:",);
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
    } catch (error) {
      console.error("Error unsaving property:", error);
      toast.error("Failed to remove property from saved list");
    }
  };

  // Fetch profile data (including image) when component mounts
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("/api/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.data) {
          // Update profile image from response
          if (response.data.profileImage) {
            setProfileImage(response.data.profileImage);
            localStorage.setItem("profileImage", response.data.profileImage);
          }
          // Update other user data if needed
          if (response.data.name) {
            localStorage.setItem("name", response.data.name);
          }
          if (response.data.email) {
            localStorage.setItem("email", response.data.email);
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    if (isAuthenticated) {
      fetchProfile();
      fetchSavedProperties();
    }
  }, [isAuthenticated]);

  // Initialize profile image from localStorage if available
  useEffect(() => {
    const storedImage = localStorage.getItem("profileImage");
    if (storedImage) {
      setProfileImage(storedImage);
    }
  }, []);

  // Fetch seen properties count
  useEffect(() => {
    const fetchSeenProperties = async () => {
      try {
        const token = localStorage.getItem("token");
        const seenProperties = JSON.parse(
          localStorage.getItem("seenProperties") || "[]"
        );

        // If no token, just use localStorage data
        if (!token) {
          if (seenProperties.length > 0) {
            setSeenCount(seenProperties.length);
            // Don't fetch from API, just use the IDs we have
            setSeenProperties(seenProperties.map((id) => ({ _id: id })));
          }
          return;
        }

        if (!seenProperties.length) {
          setSeenCount(0);
          setSeenProperties([]);
          return;
        }



        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            ids: JSON.stringify(seenProperties),
          },
        };

        const response = await axios.get("/api/properties/viewed", config);
   

        if (response.data && Array.isArray(response.data)) {
          setSeenProperties(response.data);
          setSeenCount(response.data.length);
        } else {
          setSeenCount(0);
          setSeenProperties([]);
        }
      } catch (error) {
        console.error("Error fetching seen properties:", error);
        setSeenCount(0);
        setSeenProperties([]);
      }
    };

    fetchSeenProperties();

    // Listen for updates from PropertyCard component
    const handleSeenPropertyAdded = (e) => {
      const seenProperties = JSON.parse(
        localStorage.getItem("seenProperties") || "[]"
      );
      setSeenCount(seenProperties.length);
    };

    // Listen for saved property updates
    const handleSavedPropertyUpdate = () => {
      fetchSavedProperties();
    };

    window.addEventListener("seenPropertyAdded", handleSeenPropertyAdded);
    window.addEventListener("savedPropertyUpdated", handleSavedPropertyUpdate);

    return () => {
      window.removeEventListener("seenPropertyAdded", handleSeenPropertyAdded);
      window.removeEventListener(
        "savedPropertyUpdated",
        handleSavedPropertyUpdate
      );
    };
  }, [isAuthenticated, refresh]);

  // Close Auth & Profile Menu on Click Outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        authMenuRef.current &&
        !authMenuRef.current.contains(event.target) &&
        isAuthMenuOpen
      ) {
        setIsAuthMenuOpen(false);
      }

      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target) &&
        isProfileOpen
      ) {
        setIsProfileOpen(false);
      }
    }

    if (isAuthMenuOpen || isProfileOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isAuthMenuOpen, isProfileOpen]);

  // Close main menu on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        mainMenuRef.current &&
        !mainMenuRef.current.contains(event.target) &&
        isMainMenuOpen
      ) {
        setIsMainMenuOpen(false);
      }
    }

    if (isMainMenuOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isMainMenuOpen]);

  // Close main menu on route change
  useEffect(() => {
    setIsMainMenuOpen(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("profileImage");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    setIsAuthenticated(false);
    setUser(null);
    navigate("/");
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleDropdown = (key) => {
    setDropdowns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleHomeClick = (e) => {
    e.preventDefault();
    window.location.href = '/';
  };

  const toggleMainMenu = () => {
    setIsMainMenuOpen(!isMainMenuOpen);
  };

  const toggleMobileMenu = () => {
    console.log("Mobile menu toggle clicked"); // Debug log
    console.log("Current isMobileMenuOpen state:", isMobileMenuOpen); // Debug log
    const newState = !isMobileMenuOpen;
    console.log("Setting isMobileMenuOpen to:", newState); // Debug log
    setIsMobileMenuOpen(newState);
  };

  useEffect(() => {
    // Listen for session expiration event (dispatched from axios interceptor)
    const handleSessionExpired = () => {
      setIsAuthenticated(false);
      setUser(null);
    };
    window.addEventListener('sessionExpired', handleSessionExpired);
    return () => {
      window.removeEventListener('sessionExpired', handleSessionExpired);
    };
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full px-6 py-4 flex justify-between items-center z-40 transition-all duration-500 ease-in-out ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg h-19 border-b border-gray-100"
          : " h-19"
      }`}
    >
      <Link
        to="/"
        onClick={handleHomeClick}
        className={`text-2xl font-mono flex items-center transition-all duration-300 ${
          isScrolled
            ? "text-purple-900 hover:text-purple-600"
            : "text-white hover:text-purple-200"
        }`}
      >
        <Home size={28} className="mr-3" />
        <span className="font-extrabold tracking-wide">RoomMilega</span>
      </Link>
      <div className="hidden md:flex items-center space-x-20">
        <Link
          to="/PayRent"
          className={`text-lg font-mono flex items-center transition-all duration-300 ${
            isScrolled
              ? "text-purple-900 hover:text-purple-600"
              : "text-white hover:text-purple-200"
          }`}
        >
          <span className="relative font-extrabold tracking-wide text-[1.3rem]">
            Download APP
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 transition-all duration-300 group-hover:w-full"></span>
          </span>
        </Link>

        <div className="flex items-center space-x-2 ">
          <img
            src={isScrolled ? FP : FW}
            className="w-6 h-6 font-mono object-contain transition-all duration-300 "
            alt="Save"
          />
          <Link
            to="/add-property"
            className={`text-lg font-mono flex items-center transition-all duration-300  ${
              isScrolled
                ? "text-purple-900 hover:text-purple-600"
                : "text-white font-bold hover:text-purple-200"
            }`}
          >
            <span className="font-extrabold text-[1.3rem]">List Property</span>
          </Link>
        </div>

        {isAuthenticated && user ? (
          <div className="relative" ref={profileRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsProfileOpen(!isProfileOpen);
              }}
              className="relative w-12 h-12 cursor-pointer flex items-center justify-center rounded-full overflow-hidden border-2 border-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              {profileImage && profileImage !== useri ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-purple-800 text-white font-bold text-xl border shadow-inner">
                  {getInitial()}
                </div>
              )}
            </button>
            {isProfileOpen && (
              <div
                className="absolute right-0 mt-3 w-96 bg-white shadow-2xl rounded-2xl py-4 overflow-y-auto max-h-[600px] custom-scrollbar border border-gray-100"
                onClick={(e) => {
                  if (e.target === e.currentTarget) {
                    setIsProfileOpen(false);
                  }
                }}
              >
                <div
                  className="px-6 py-4 flex items-center border-b border-gray-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  {profileImage && profileImage !== useri ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-14 h-14 rounded-full object-cover border-2 border-gray-200 shadow-md"
                    />
                  ) : (
                    <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-purple-800 text-white font-bold text-2xl border-2 border-gray-200 shadow-md">
                      {getInitial()}
                    </div>
                  )}
                  <div className="ml-4 flex-1">
                    <p className="font-bold text-lg text-gray-900 flex items-center">
                      {user?.name || localStorage.getItem("name")}
                      <FaBriefcase className="ml-2 text-purple-600" size={16} />
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                      {user?.email || localStorage.getItem("email")}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/profile");
                      setIsProfileOpen(false);
                    }}
                    className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-all duration-300"
                  >
                    <Edit size={20} className="cursor-pointer" />
                  </button>
                </div>
                <div className="border-t border-gray-100 my-3"></div>

                <div className="my-3"></div>

                {/* Quick Search Section */}
                <div
                  className={`transition-all duration-700 ${
                    isQuickSearchOpen ? "mb-24" : "mb-0"
                  }`}
                >
                  <div
                    className="relative hover:bg-purple-50 rounded-lg transition-all duration-300"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsQuickSearchOpen(!isQuickSearchOpen);
                      }}
                      className="w-full text-left px-4 py-3 transition-all duration-300 flex items-center justify-between text-gray-700 hover:text-purple-600 cursor-pointer font-medium"
                    >
                      <div className="flex items-center">
                        <img src={cursor} alt="" className="w-5 h-5 mr-3" />
                        <span className="text-base font-semibold">
                          Quick Link
                        </span>
                      </div>
                      <MdOutlineKeyboardArrowUp
                        size={18}
                        className={`${
                          isQuickSearchOpen ? "rotate-180" : ""
                        } transition-transform duration-300 text-gray-400`}
                      />
                    </button>
                  </div>

                  {isQuickSearchOpen && (
                    <div
                      className="mt-3 px-4 py-3 flex flex-wrap gap-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Link
                        to="/"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsProfileOpen(false);
                        }}
                        className="flex flex-col items-center p-3 hover:bg-purple-50 rounded-xl border border-gray-200 hover:border-purple-300 transition-all duration-300 min-w-[80px]"
                      >
                        <img src={house} className="w-6 h-6 mr-2" alt="" />
                        <span className="text-sm text-center w-15 mt-3 text-black-800">
                          Home
                        </span>
                      </Link>
                      <Link
                        to="/add-property"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsProfileOpen(false);
                        }}
                        className="flex flex-col items-center p-3 hover:bg-purple-50 rounded-xl border border-gray-200 hover:border-purple-300 transition-all duration-300 min-w-[80px]"
                      >
                        <img src={property} className="w-6 h-6 mr-2" alt="" />
                        <span className="text-sm text-center flex-col text-black-800 mt-2">
                          Post Properties
                        </span>
                      </Link>
                      <Link
                        to="/News"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsProfileOpen(false);
                        }}
                        className="flex flex-col items-center p-3 hover:bg-purple-50 rounded-xl border border-gray-200 hover:border-purple-300 transition-all duration-300 min-w-[80px]"
                      >
                        <HiOutlineNewspaper size={32} />
                        <span className="text-sm text-center text-black-800 mt-2">
                          News
                        </span>
                      </Link>
                      <Link
                        to="/ReportResearch"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsProfileOpen(false);
                        }}
                        className="flex flex-col items-center p-3 hover:bg-purple-50 rounded-xl border border-gray-200 hover:border-purple-300 transition-all duration-300 min-w-[80px]"
                      >
                        <IoSearch size={24} />
                        <span className="text-sm text-center text-black-800 mt-2">
                          Research
                        </span>
                      </Link>
                    </div>
                  )}
                </div>

                {/* Saved Properties Section */}
                <div
                  className={`transition-all duration-700 ${
                    isSavedPropertiesOpen ? "mb-2" : "mb-0"
                  }`}
                >
                  <div
                    className="relative hover:bg-purple-300 rounded-md"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsSavedPropertiesOpen(!isSavedPropertiesOpen);
                        if (!isSavedPropertiesOpen) {
                          fetchSavedProperties();
                        }
                      }}
                      className="text-lg mt-2 transition flex items-center w-83 ml-2 text-black-800 hover:border-purple-800 hover:bg-purple-300 cursor-pointer rounded-md"
                    >
                      <FaRegHeart className="w-6 h-6 ml-1" />
                      <span className="px-4 text-[16px] py-2 mr-auto text-purple-800 hover:text-black">
                        Saved Properties ({savedProperties.length})
                      </span>
                      <MdOutlineKeyboardArrowUp
                        size={16}
                        className={`mr-2 ${
                          isSavedPropertiesOpen ? "rotate-180" : ""
                        } transition-transform ml-2`}
                      />
                    </button>
                  </div>

                  {isSavedPropertiesOpen && (
                    <div
                      className="mt-2 w-80 rounded-md py-2 max-h-96 overflow-y-auto"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {savedPropertiesLoading ? (
                        <div className="flex justify-center items-center py-4">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                        </div>
                      ) : savedProperties.length > 0 ? (
                        <div className="space-y-3">
                          {savedProperties.map((property) => (
                            <div
                              key={property._id}
                              className="flex items-center p-3 hover:bg-purple-50 rounded-lg cursor-pointer border border-gray-200 shadow-sm transition-all duration-200 hover:shadow-md"
                              onClick={() => {
                                navigate(`/property/${property._id}`);
                                setIsProfileOpen(false);
                                setIsSavedPropertiesOpen(false);
                              }}
                            >
                              <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                                {property.media && property.media.length > 0 ? (
                                  <img
                                    src={
                                      typeof property.media[0] === "string"
                                        ? property.media[0]
                                        : property.media[0].url
                                    }
                                    alt={property.address}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.target.style.display = "none";
                                      e.target.nextSibling.style.display =
                                        "flex";
                                    }}
                                  />
                                ) : null}
                                <div
                                  className="w-full h-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center"
                                  style={{
                                    display:
                                      property.media &&
                                      property.media.length > 0
                                        ? "none"
                                        : "flex",
                                  }}
                                >
                                  <FaHome
                                    className="text-purple-500"
                                    size={20}
                                  />
                                </div>
                              </div>
                              <div className="ml-3 flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <p className="font-semibold text-sm text-gray-900 truncate">
                                    {property.address}
                                  </p>
                                  <div className="flex items-center space-x-1">
                                    <FaRegHeart
                                      className="text-red-400"
                                      size={12}
                                    />
                                    <span className="text-xs text-gray-500">
                                      Saved
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center mt-1">
                                  <FaMapMarkerAlt
                                    className="text-gray-400 mr-1"
                                    size={10}
                                  />
                                  <p className="text-xs text-gray-500 truncate">
                                    {property.city}, {property.state}
                                  </p>
                                </div>
                                <div className="flex items-center justify-between mt-2">
                                  <div className="flex items-center space-x-2">
                                    <FaRupeeSign
                                      className="text-green-600"
                                      size={12}
                                    />
                                    <p className="text-sm font-bold text-green-600">
                                      {property.monthlyRent?.toLocaleString()}
                                      /month
                                    </p>
                                  </div>
                                  {property.bhkType && (
                                    <div className="flex items-center bg-purple-100 px-2 py-1 rounded-full">
                                      <FaBed
                                        className="text-purple-600 mr-1"
                                        size={10}
                                      />
                                      <span className="text-xs font-medium text-purple-700">
                                        {Array.isArray(property.bhkType)
                                          ? property.bhkType[0]
                                          : property.bhkType}
                                      </span>
                                    </div>
                                  )}
                                </div>
                                {property.area && (
                                  <div className="flex items-center mt-1">
                                    <FaRulerCombined
                                      className="text-gray-400 mr-1"
                                      size={10}
                                    />
                                    <p className="text-xs text-gray-500">
                                      {property.area} sq.ft
                                    </p>
                                  </div>
                                )}
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUnsaveProperty(property._id);
                                }}
                                className="ml-2 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                                title="Remove from saved"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
                            <FaRegHeart className="text-purple-400" size={24} />
                          </div>
                          <p className="text-sm font-medium text-gray-700 mb-1">
                            No saved properties yet
                          </p>
                          <p className="text-xs text-gray-500">
                            Save properties to see them here
                          </p>
                          <button
                            onClick={() => {
                              navigate("/properties");
                              setIsProfileOpen(false);
                              setIsSavedPropertiesOpen(false);
                            }}
                            className="mt-3 px-4 py-2 bg-purple-600 text-white text-xs rounded-lg hover:bg-purple-700 transition-colors"
                          >
                            Browse Properties
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Services Section */}
                <div
                  className={`transition-all duration-700 ${
                    isServicesOpen ? "mb-2" : "mb-0"
                  }`}
                >
                  <div
                    className="relative hover:bg-purple-300 rounded-md"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsServicesOpen(!isServicesOpen);
                      }}
                      className="text-lg mt-2 transition flex items-center w-83 ml-2 text-black-800 hover:border-purple-800 hover:bg-purple-300 cursor-pointer rounded-md"
                    >
                      <img src={services} className="w-6 h-6 ml-1" alt="" />
                      <span className="px-4 text-[16px] py-2 mr-auto text-purple-800 hover:text-black">
                        Services
                      </span>
                      <MdOutlineKeyboardArrowUp
                        size={16}
                        className={`mr-2 ${
                          isServicesOpen ? "rotate-180" : ""
                        } transition-transform ml-2`}
                      />
                    </button>
                  </div>

                  {isServicesOpen && (
                    <div
                      className="mt-2 w-80 rounded-md py-2 flex flex-wrap gap-2 p-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Link
                        to="/properties"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsProfileOpen(false);
                        }}
                        className="flex flex-col items-center p-2 hover:border-purple-800 border-3 hover:bg-purple-50 rounded h-20 w-20"
                      >
                        <IoHomeOutline size={24} />
                        <span className="text-sm text-center text-black-800">
                          Home <br /> Rent
                        </span>
                      </Link>
                      <Link
                        to="/add-property"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsProfileOpen(false);
                        }}
                        className="flex flex-col items-center p-2 hover:border-purple-800 border-3 hover:bg-purple-50 rounded h-20 w-22"
                      >
                        <IoBusinessOutline size={22} />
                        <span className="text-sm text-center text-black-800 text-[13px]">
                          Post properties
                        </span>
                      </Link>
                    </div>
                  )}
                </div>

                <Link
                  to="/Fraud"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsProfileOpen(false);
                  }}
                  className="w-85 rounded-md text-left px-3 py-2 text-black hover:bg-purple-300 flex items-center cursor-pointer"
                >
                  <PiDetective size={20} className="ml-1" />
                  <span className="text-purple-800 hover:text-black px-4">
                    Report a Fraud
                  </span>
                </Link>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLogout();
                    setIsProfileOpen(false);
                  }}
                  className="w-80 ml-3 rounded-md text-left px-4 py-2 mt-3 text-purple-800 hover:text-black hover:border-purple-800 hover:bg-purple-300 flex items-center cursor-pointer border"
                >
                  <LogOut size={16} className="mr-2 text-purple-800" /> Logout
                  <RiArrowRightSLine className="mr-1 ml-48" size={19} />
                </button>

                {/* App Download Section */}
                <div
                  className="bg-white p-4 md:p-6 rounded-xl w-full max-w-md mx-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-[15px] font-semibold mb-2 text-gray-800">
                        Download Housing App
                      </h2>
                      <div className="flex space-x-2">
                        <img
                          src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                          alt="App Store"
                          className="w-20"
                        />
                        <img
                          src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                          alt="Google Play"
                          className="w-20"
                        />
                      </div>
                    </div>
                    <img
                      src={QR}
                      alt="QR Code"
                      className="w-15 h-15 object-cover mr-10"
                    />
                  </div>

                  <div className="mt-4 border-t pt-3 flex">
                    <h3 className="text-gray-600 text-sm mt-2">Follow on</h3>
                    <div className="flex space-x-7 mt-2 text-gray-600 ml-3">
                      <FaFacebook className="text-xl hover:text-blue-600 cursor-pointer" />
                      <Link to="https://www.instagram.com/rentease_1611/">
                        <FaInstagram className="text-xl hover:text-pink-600 cursor-pointer" />
                      </Link>

                      <FaLinkedin className="text-xl hover:text-blue-700 cursor-pointer" />
                      <FaTwitter className="text-xl hover:text-blue-400 cursor-pointer" />
                      <FaYoutube className="text-xl hover:text-red-600 cursor-pointer" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="relative" ref={authMenuRef}>
            <button
              onClick={() => navigate("/signup")}
              className={`px-6 py-2.5 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 ${
                isScrolled
                  ? "bg-gradient-to-r from-purple-600 to-pink-500 hover:from-pink-500 hover:to-purple-600 mt-1 font-mono"
                  : "bg-gradient-to-r from-purple-600 to-pink-500 hover:from-pink-500 hover:to-purple-600 font-mono"
              }`}
            >
              Create Account
            </button>
          </div>
        )}
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button
          onClick={toggleMobileMenu}
          className={`p-3 rounded-xl transition-all duration-300 ${
            isScrolled
              ? "text-gray-700 hover:bg-gray-100 hover:text-purple-600"
              : "text-white hover:bg-white/20"
          }`}
          aria-label="Toggle mobile menu"
        >
          <Menu size={24} className="transition-transform duration-300" />
        </button>
      </div>

      {/* Mobile Menu Component */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        isAuthenticated={isAuthenticated}
        user={user}
        profileImage={profileImage}
        handleLogout={handleLogout}
        seenCount={seenCount}
      />
    </nav>
  );
}

export default Navbar;
