import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LogOut,
  Home,
  Edit,
} from "lucide-react";
import { FiHeart } from 'react-icons/fi';
import users from "../assets/users.png";
import { PiDetective } from "react-icons/pi";
import { HiOutlineQuestionMarkCircle } from "react-icons/hi2";
import { MdOutlineWatchLater } from "react-icons/md";
import FP from "../assets/FP.png"
import FW from "../assets/FW.png"
import { FaRegHeart } from "react-icons/fa";
import wwheart from "../assets/HW.png"
import news from "../assets/new.png";
import blackfree from "../assets/blackfree.png"
import wfree from "../assets/wfree.png"
import {
  IoHomeOutline,
  IoBusinessOutline,
} from "react-icons/io5";
import pheart from "../assets/HP.png"
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
import seen from "../assets/seen.png"
import property from "../assets/property.png"
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
} from "react-icons/fa";
import { IoReceiptOutline } from "react-icons/io5";
import p from "../pages/Premium.jsx"
import { Heart } from "lucide-react";
import { BiHomeSmile } from "react-icons/bi";
import QR from "../assets/QR.png";
import contactp from "../assets/contactp.png"
import { FaRegFileAlt } from "react-icons/fa";
import { MdOutlineKeyboardArrowUp } from "react-icons/md";
import { IoDiamondOutline } from "react-icons/io5";
import { RiArrowRightSLine } from "react-icons/ri";
import pfree from "../assets/pfree.png"
import axios from "axios";

function Navbar({ isAuthenticated, setIsAuthenticated, user, setUser }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAuthMenuOpen, setIsAuthMenuOpen] = useState(false);
  const [isHousingEdgeOpen, setIsHousingEdgeOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const profileRef = useRef(null);
  const authMenuRef = useRef(null);
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

  // Fetch profile data (including image) when component mounts
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('/api/profile', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.data) {
          // Update profile image from response
          if (response.data.profileImage) {
            setProfileImage(response.data.profileImage);
            localStorage.setItem('profileImage', response.data.profileImage);
          }
          // Update other user data if needed
          if (response.data.name) {
            localStorage.setItem('name', response.data.name);
          }
          if (response.data.email) {
            localStorage.setItem('email', response.data.email);
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    if (isAuthenticated) {
      fetchProfile();
    }
  }, [isAuthenticated]);

  // Initialize profile image from localStorage if available
  useEffect(() => {
    const storedImage = localStorage.getItem('profileImage');
    if (storedImage) {
      setProfileImage(storedImage);
    }
  }, []);

  // Fetch seen properties count
  useEffect(() => {
    const fetchSeenProperties = async () => {
      try {
        const token = localStorage.getItem('token');
        let seenProperties = [];
        
        if (token) {
          // If authenticated, fetch from backend
          const response = await axios.get(`/api/properties/${propertyId}/view`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          seenProperties = response.data.seenProperties || [];
        } else {
          // If not authenticated, use local storage
          seenProperties = JSON.parse(localStorage.getItem('seenProperties') || '[]');
        }
        
        setSeenCount(seenProperties.length);
        localStorage.setItem('seenProperties', JSON.stringify(seenProperties));
      } catch (error) {
        console.error('Error fetching seen properties:', error);
        // Fallback to local storage if API fails
        const seenProperties = JSON.parse(localStorage.getItem('seenProperties') || '[]');
        setSeenCount(seenProperties.length);
      }
    };

    fetchSeenProperties();

    // Listen for updates from PropertyCard component
    const handleSeenPropertyAdded = (e) => {
      const seenProperties = JSON.parse(localStorage.getItem('seenProperties') || '[]');
      setSeenCount(seenProperties.length);
    };

    window.addEventListener('seenPropertyAdded', handleSeenPropertyAdded);

    return () => {
      window.removeEventListener('seenPropertyAdded', handleSeenPropertyAdded);
    };
  }, [isAuthenticated]);

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
    navigate("/", { replace: true });
    window.location.reload();
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full p-4 flex justify-between items-center z-50 h-15 transition-all duration-300 ${
        isScrolled
          ? "bg-white shadow-md h-16 rounded-br-4xl rounded-bl-4xl"
          : " "
      }`}
    >
      <Link
        to="/"
        onClick={handleHomeClick}
        className={` text-[20px] flex items-center transition ${
          isScrolled ? "text-purple-800 hover:text-purple-400" : " text-white font-bold hover:text-gray-200"
        }`}
      >
        <Home size={24} className="mr-2" /> RentEase.com
      </Link>
      <div className="hidden md:flex items-center space-x-20">
        <Link
          to="/premium"
          className={` text-[20px] flex items-center transition ${
            isScrolled ? "text-purple-800  hover:text-purple-400" : " text-white font-bold   hover:text-gray-200"
          }`}
        >
          Premium
        </Link>
        <Link
          to="/PayRent"
          className={` text-[20px] flex items-center hover:text-gray-200 transition ${
            isScrolled ? "text-purple-800 hover:text-purple-400" : " text-white font-bold"
          }`}
        >
          Download APP
        </Link>
        
        <div className="flex items-center">
          <img
            src={isScrolled ? pheart : wwheart}
            className="w-5 h-5 object-contain transition-all duration-300 mr-1 mt-[3px]"
            alt="Save"
          />
          <Link
            to="/profile?tab=myactivity"
            className={` text-[20px] flex items-center  transition cursor-pointer ${
              isScrolled ? "text-purple-800  hover:text-purple-400" : "text-white font-bold hover:text-gray-200"
            }`}
          >
            Save
          </Link>
        </div>
        
        <div className="flex items-center">
          <img
            src={isScrolled ? FP : FW}
            className="w-6 h-6 object-contain transition-all duration-300 mr-1 mt-[3px]"
            alt="Save"
          />
          <Link
            to="/add-property"
            className={` text-[20px] flex items-center  transition ${
              isScrolled ? "text-purple-800  hover:text-purple-400" : "text-white font-bold  hover:text-gray-200"
            }`}
          >
            List Property
          </Link>
        </div>
        
        {isAuthenticated && user ? (
          <div className="relative" ref={profileRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsProfileOpen(!isProfileOpen);
              }}
              className="relative w-10 cursor-pointer h-10 flex items-center justify-center rounded-full overflow-hidden border-2 border-white"
            >
              <img
                src={profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </button>
            {isProfileOpen && (
              <div 
                className="absolute right-0 mt-2 w-90 bg-white shadow-lg rounded-lg py-2 overflow-y-auto max-h-130 custom-scrollbar"
                onClick={(e) => {
                  if (e.target === e.currentTarget) {
                    setIsProfileOpen(false);
                  }
                }}
              >
                <div 
                  className="px-4 py-2 flex items-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-12 h-12 rounded-full object-cover border"
                  />
                  <div className="ml-3">
                    <p className="font-semibold mt-2 ">{user?.name || localStorage.getItem('name')}</p>
                    <p className="text-gray-500 text-sm">{user?.email || localStorage.getItem('email')}</p>
                    <Link to="/premium">
                      <div className="flex" onClick={(e) => e.stopPropagation()}>
                        <IoDiamondOutline className="mt-1" size={14} />
                        <span className="mt-1 ml-1 text-[12px]">
                          Upgrade to Premium{" "}
                        </span>
                        <RiArrowRightSLine className="mt-1 ml-1" size={19} />
                      </div>
                    </Link>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/profile");
                      setIsProfileOpen(false);
                    }}
                    className="mr-2 text-gray-600 hover:text-gray-900"
                  >
                    <Edit size={20} className="cursor-pointer mb-9 " />
                  </button>
                </div>
                <div className="border-t my-2"></div>

                {/* My Activity Section */}
                <div className="bg-white p-4 rounded-lg" onClick={(e) => e.stopPropagation()}>
                  <h2 className="font-semibold mb-4">My Activity</h2>
                  <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar text-[12px]">
                    {[
                      {
                        id: "Contacted",
                        label: "Contacted\nProperties",
                        icon: <img src={contactp} alt="Contacted" className="w-7 h-7 mt-2" />,
                        count: 4,
                      },
                      {
                        id: "Seen",
                        label: "Seen\nProperties",
                        icon: <img src={seen} alt="Contacted" className="w-6 h-6 mt-2" />,
                        count: seenCount,
                      },
                      {
                        id: "Saved",
                        label: "Saved\nProperties",
                        icon: <FiHeart size={26} className="mt-1"/>,
                        count: 0,
                      },
                      {
                        id: "Recent",
                        label: "Recent\nSearches",
                        icon: <MdOutlineWatchLater size={26} className="mt-1"/>,
                        count: 0,
                      },
                    ].map((tab) => (
                      <div
                        key={tab.id}
                        className={`flex flex-col items-center border-2 rounded-lg px-6 shadow-md w-[80px] h-[100px] relative cursor-pointer ${
                          selectedTab === tab.id
                            ? "bg-purple-50 border-purple-800 border-2 text-purple-800 hover:text-black"
                            : "bg-white shadow-lg hover:border-purple-800 border-3"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTab(tab.id);
                        }}
                      >
                        {tab.icon}
                        <p className="text-center whitespace-pre-line">
                          {tab.label}
                        </p>
                        <div className={`px-3 rounded-full text-sm mb-2 mt-[0.5] ${
                          selectedTab === tab.id
                            ? "bg-purple-50 text-purple-800"
                            : "bg-gray-200 text-purple-800"
                        }`}>
                          {tab.count.toString().padStart(2, "0")}
                        </div>
                        {selectedTab === tab.id && (
                          <div className="absolute bottom-[-6px] w-3 h-3 bg-purple-50 border-b-2 border-purple-800 rotate-45"></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="my-2"></div>
                
                {/* Menu Items */}
                <Link
                  to="/premium"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsProfileOpen(false);
                  }}
                  className="hover:bg-purple-300 flex rounded-md"
                >
                  <IoDiamondOutline className="mt-3 ml-3" size={20} />
                  <span className="block px-4 py-2 text-purple-800 hover:text-black">
                    Zero Brokerage properties
                  </span>
                </Link>

                <Link
                  to="/profile?tab=myTransactions"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsProfileOpen(false);
                  }}
                  className="hover:bg-purple-300 flex rounded-md"
                >
                  <FaRegFileAlt size={20} className="mt-3 ml-3" />
                  <span className="block px-5 py-2 text-purple-800 hover:text-black">
                    My Transactions
                  </span>
                </Link>

                <Link
                  to="/profile?tab=myReviews"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsProfileOpen(false);
                  }}
                  className="hover:bg-purple-300 flex rounded-md"
                >
                  <SlStar className="mt-3 ml-3" size={20} />
                  <span className="block px-4 py-2 text-purple-800 hover:text-black">
                    My Review
                  </span>
                  <img src={news} className="w-6 h-6 ml-2 mt-2" alt="" />
                </Link>

                {/* Quick Search Section */}
                <div className={`transition-all duration-300 ${
                  isQuickSearchOpen ? "mb-24" : "mb-0"
                }`}>
                  <div className="relative hover:bg-purple-300 rounded-md" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsQuickSearchOpen(!isQuickSearchOpen);
                      }}
                      className="text-lg mt-2 transition flex items-center w-83 ml-2 text-black-800 hover:text-black cursor-pointer"
                    >
                      <img src={cursor} alt="" className="w-6" />
                      <span className="px-4 py-2 text-[16px] mr-40 text-purple-800 hover:text-black">
                        Quick Link
                      </span>
                      <MdOutlineKeyboardArrowUp
                        size={16}
                        className={`${
                          isQuickSearchOpen ? "rotate-180" : ""
                        } transition-transform ml-5`}
                      />
                    </button>
                  </div>

                  {isQuickSearchOpen && (
                    <div className="mt-2 w-80 h-22 rounded-md py-2 flex flex-wrap gap-2 p-2" onClick={(e) => e.stopPropagation()}>
                      <Link
                        to="/"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsProfileOpen(false);
                        }}
                        className="flex flex-col h-18 items-center p-2 hover:border-purple-800 border-3 hover:bg-purple-50 rounded"
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
                        className="flex flex-col items-center p-2 h-17 rounded hover:border-purple-800 border-3 hover:bg-purple-50"
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
                        className="flex flex-col items-center p-2hover:border-purple-800 border-3 hover:bg-purple-50 hover:border-purple-800 rounded h-17 w-20"
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
                        className="flex flex-col items-center h-18 w-20 p-2 hover:border-purple-800 border-3 hover:bg-purple-50 rounded"
                      >
                        <IoSearch size={24} />
                        <span className="text-sm text-center text-black-800 mt-2">
                          Research
                        </span>
                      </Link>
                      <Link
                        to="/housingProtect"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsProfileOpen(false);
                        }}
                        className="flex flex-col items-center p-2 hover:border-purple-800 border-3 hover:bg-purple-50 rounded h-18 w-20"
                      >
                        <img src={protection} className="w-6 h-6" alt="" />
                        <span className="text-sm text-center text-black-800 text-[12px]">
                          Housing <br /> Protect
                        </span>
                      </Link>
                    </div>
                  )}
                </div>

                {/* Housing Edge Section */}
                <div className={`transition-all duration-300 ${
                  isHousingOpen ? "mb-24" : "mb-0"
                }`}>
                  <div className="relative hover:bg-purple-300 rounded-md" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsHousingOpen(!isHousingOpen);
                      }}
                      className="text-lg mt-2 transition flex items-center w-83 ml-2 text-black-800 hover:border-purple-800 hover:bg-purple-300 cursor-pointer"
                    >
                      <FaRegLightbulb size={20} className="ml-1" />
                      <span className="px-4 text-[16px] py-2 mr-auto text-purple-800 hover:text-black">
                        Housing Edge
                      </span>
                      <MdOutlineKeyboardArrowUp
                        size={16}
                        className={`mr-2${
                          isHousingOpen ? "rotate-180" : ""
                        } transition-transform ml-2`}
                      />
                    </button>
                  </div>

                  {isHousingOpen && (
                    <div className="mt-2 w-83 h-22 rounded-md py-2 flex flex-wrap p-2 gap-2" onClick={(e) => e.stopPropagation()}>
                      <Link
                        to="/pay-rent"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsProfileOpen(false);
                        }}
                        className="flex flex-col items-center p-2 hover:border-purple-800 border-3 hover:bg-purple-50 rounded h-18 w-20"
                      >
                        <img src={protection} className="w-5 h-5" alt="" />
                        <span className="text-sm text-center text-black-800">
                          Pay <br /> Rent
                        </span>
                      </Link>
                      <Link
                        to="/premium"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsProfileOpen(false);
                        }}
                        className="flex flex-col h-18 w-20 items-center p-2 hover:border-purple-800 border-3 hover:bg-purple-50 rounded"
                      >
                        <IoDiamondOutline size={22} />
                        <span className="text-sm text-center text-black-800">
                          Housing <br /> Premium
                        </span>
                      </Link>
                      <Link
                        to="/receipted"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsProfileOpen(false);
                        }}
                        className="flex flex-col items-center p-2 rounded hover:border-purple-800 border-3 hover:bg-purple-50 h-18 w-20"
                      >
                        <IoReceiptOutline size={22} />
                        <span className="text-sm text-center text-black-800">
                          Rent <br /> Receipted
                        </span>
                      </Link>
                
                      <Link
                          to="/housingProtect"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsProfileOpen(false);
                        }}
                        className="flex flex-col items-center p-2 hover:border-purple-800 border-3 hover:bg-purple-50 rounded h-18 w-20"
                      >
                        <img src={protection} className="w-6 h-6" alt="" />
                        <span className="text-sm text-center text-black-800 text-[12px]">
                          Housing <br /> Protect
                        </span>
                      </Link>
                    </div>
                  )}
                </div>

                {/* Services Section */}
                <div className={`transition-all duration-300 ${
                  isServicesOpen ? "mb-2" : "mb-0"
                }`}>
                  <div className="relative hover:bg-purple-300 rounded-md" onClick={(e) => e.stopPropagation()}>
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
                    <div className="mt-2 w-80 rounded-md py-2 flex flex-wrap gap-2 p-2" onClick={(e) => e.stopPropagation()}>
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

                {/* Other menu items */}
                <Link
                  to="/reviews"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsProfileOpen(false);
                  }}
                  className="flex hover:border-purple-800 hover:bg-purple-300 rounded-md"
                >
                  <CiBellOn className="mt-2 ml-3" size={20} />
                  <span className="block px-4 py-2 text-purple-800 hover:text-black">
                    Unsubscribe Alert
                  </span>
                </Link>

                <Link
                to="/Fraud"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsProfileOpen(false);
                  }}
                  className="block w-85 rounded-md text-left px-3 py-2 text-black hover:bg-purple-300 flex items-center cursor-pointer"
                >
                  <PiDetective size={20} className="ml-1" />
                  <span className="text-purple-800 hover:text-black px-4">
                    Report a Fraud
                  </span>
                </Link>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsProfileOpen(false);
                  }}
                  className="block w-80 ml-3 rounded-md text-left px-4 py-2 mt-3 text-black hover:border-purple-800 hover:bg-purple-300 flex items-center cursor-pointer border"
                >
                  <HiOutlineQuestionMarkCircle size={20} />
                  <span className="ml-2 text-purple-800 hover:text-black">
                    Visit Help Center
                  </span>
                  <RiArrowRightSLine className="mt-1 ml-30" size={19} />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLogout();
                    setIsProfileOpen(false);
                  }}
                  className="block w-80 ml-3 rounded-md text-left px-4 py-2 mt-3 text-purple-800 hover:text-black hover:border-purple-800 hover:bg-purple-300 flex items-center cursor-pointer border"
                >
                  <LogOut size={16} className="mr-2 text-purple-800" /> Logout
                  <RiArrowRightSLine className="mr-1 ml-48" size={19} />
                </button>

                {/* App Download Section */}
                <div className="bg-white p-4 md:p-6 rounded-xl w-full max-w-md mx-auto" onClick={(e) => e.stopPropagation()}>
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
                      <Link to="https://www.instagram.com/rentease_1611/"><FaInstagram className="text-xl hover:text-pink-600 cursor-pointer" /></Link>
                      
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
              onClick={(e) => {
                e.stopPropagation();
                setIsAuthMenuOpen(!isAuthMenuOpen);
              }}
              className={` text-[20px] flex items-center  transition cursor-pointer ${
                isScrolled ? "text-purple-800  hover:text-purple-400" : "text-white font-bold  hover:text-gray-200"
              }`}
            >
              Create Account
            </button>
            {isAuthMenuOpen && (
              <div 
                className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md py-2"
                onClick={(e) => {
                  if (e.target === e.currentTarget) {
                    setIsAuthMenuOpen(false);
                  }
                }}
              >
                <Link
                  to="/signup"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsAuthMenuOpen(false);
                  }}
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-300"
                >
                  Sign Up
                </Link>
                <Link
                  to="/login"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsAuthMenuOpen(false);
                  }}
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-300"
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;