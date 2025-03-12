import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut, Home } from "lucide-react";

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAuthMenuOpen, setIsAuthMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);

    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/");
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full py-3 z-50 transition-all duration-300 ${
        isScrolled ? "bg-blue-600 bg-opacity-90 shadow-lg backdrop-blur-md" : "bg-blue-600"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-white font-bold text-2xl flex items-center">
          <Home size={24} className="mr-2" /> RentEase.com
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link to="/pay-rent" className="text-white text-lg hover:text-gray-300">Pay Rent</Link>
          <Link to="/download" className="text-white text-lg hover:text-gray-300">Download App</Link>
          <Link to="/contact" className="text-white text-lg hover:text-gray-300">Contact Us</Link>

          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="text-white text-lg flex items-center"
              >
                <User size={20} className="mr-2" /> Profile
              </button>
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md py-2">
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-red-500 hover:text-white flex items-center"
                  >
                    <LogOut size={16} className="mr-2" /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="relative">
              <button 
                onClick={() => setIsAuthMenuOpen(!isAuthMenuOpen)} 
                className="text-white text-lg flex items-center px-4 py-2 rounded-lg transition-all duration-300"
              >
                <User size={20} className="mr-2" /> Create Account
              </button>
              {isAuthMenuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md py-2">
                  <Link to="/signup" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Sign Up</Link>
                  <Link to="/login" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Login</Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-white">
          {isMenuOpen ? <X size={30} /> : <Menu size={30} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-blue-700 text-white py-3 space-y-3 px-4">
          <Link to="/pay-rent" className="block hover:text-gray-300">Pay Rent</Link>
          <Link to="/download" className="block hover:text-gray-300">Download App</Link>
          <Link to="/contact" className="block hover:text-gray-300">Contact Us</Link>

          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-full text-left px-4 py-2 flex items-center bg-gray-800 rounded-md hover:bg-gray-600"
              >
                <User size={20} className="mr-2" /> Profile
              </button>
              {isProfileOpen && (
                <div className="mt-2 bg-gray-900 rounded-md py-2">
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-white hover:bg-red-500 flex items-center"
                  >
                    <LogOut size={16} className="mr-2" /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={() => setIsAuthMenuOpen(!isAuthMenuOpen)}
                className="w-full text-left px-4 py-2 flex items-center bg-green-500 rounded-md hover:bg-green-700"
              >
                <User size={20} className="mr-2" /> Create Account
              </button>
              {isAuthMenuOpen && (
                <div className="mt-2 bg-gray-900 rounded-md py-2">
                  <Link to="/signup" className="block px-4 py-2 text-white hover:bg-gray-300">Sign Up</Link>
                  <Link to="/login" className="block px-4 py-2 text-white hover:bg-gray-300">Login</Link>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;