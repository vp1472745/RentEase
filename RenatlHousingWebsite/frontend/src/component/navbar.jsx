import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, Home } from "lucide-react";
import free from "../assets/free.png"
function Navbar({ isAuthenticated, setIsAuthenticated, user, setUser }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAuthMenuOpen, setIsAuthMenuOpen] = useState(false);
  const profileRef = useRef(null);
  const authMenuRef = useRef(null);
  const navigate = useNavigate();

  // ✅ Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setIsAuthenticated(false);
    setUser(null);

    navigate("/login");
  };

  console.log(user);

  return (
    <nav className="fixed top-0 left-0 w-full bg-blue-600 p-4 flex justify-between items-center z-50 h-20">
      <Link to="/" className="text-white font-bold text-2xl flex items-center hover:text-gray-200">
        <Home size={24} className="mr-2" /> RentEase.com
      </Link>

      <div className="hidden md:flex space-x-8">
        <Link to="/pay-rent" className="text-white font-semibold text-[20px] hover:text-gray-300 transition">Pay Rent</Link>
        <Link to="/download" className="text-white font-semibold text-[20px] hover:text-gray-300 transition">Download App</Link>
        <Link to="/contact" className="text-white font-semibold text-[20px] hover:text-gray-300 transition">Contact Us</Link>
        <div className="flex h-10"> 
          {/* <Link to="/add-property" className="text-white font-semibold text-[20px] hover:text-gray-300 transition">Add Property </Link> */}
      
        {/* <div className="mt-2 bg-red-600 w-15 h-6 ml-2 text-center rounded-md"> */}
        {/* <span className="">Free</span> */}
          {/* <img src={free} className="w-10 h-15 mt-0" alt="" /> */}
        {/* </div> */}
        </div>
       

        {/* Add Property link - only visible for authenticated users */}
        {isAuthenticated && user && (
          <div className="flex">
          <Link to="/add-property" className="text-white font-semibold text-[20px] hover:text-gray-300 transition">
            Add Property
              {/* <img src={free} className="w-10 h-15 mt-0" alt="" /> */}
             
          </Link>
          <div className="mt-2 bg-red-600 w-15 h-6 ml-2 text-center rounded-md">
              <span className="">Free</span>
              </div>
          </div>
        )}

        {/* Profile Section */}
        {isAuthenticated && user ? (
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="relative w-12 h-12 flex items-center justify-center rounded-full overflow-hidden border-2 border-white "
            >
              <img
                src={user?.profileImage || "/default-avatar.png"}
                alt="Profile"
                className="w-full h-full object-cover "
              />
            </button>
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2">
                <div className="px-4 py-2 text-center">
                  <p className="font-semibold mt-2">{user?.name}</p>
                  <p className="text-gray-500 text-sm">{user?.email}</p>
                </div>
                <Link to="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                  View Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-200 flex items-center"
                >
                  <LogOut size={16} className="mr-2" /> Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="relative" ref={authMenuRef}>
            <button
              onClick={() => setIsAuthMenuOpen(!isAuthMenuOpen)}
              className="text-white font-semibold text-2xl"
            >
              Create Account
            </button>
            {isAuthMenuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md py-2">
                <Link to="/signup" className="block px-4 py-2 text-gray-800 hover:bg-gray-300">Sign Up</Link>
                <Link to="/login" className="block px-4 py-2 text-gray-800 hover:bg-gray-300">Login</Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile Menu (Hamburger) */}
      <div className="md:hidden flex items-center">
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        {isMenuOpen && (
          <div className="absolute top-16 left-0 w-full bg-blue-600 text-white p-4 flex flex-col space-y-4">
            <Link to="/pay-rent" className="text-lg font-semibold hover:opacity-75">Pay Rent</Link>
            <Link to="/download" className="text-lg font-semibold hover:text-gray-300">Download App</Link>
            <Link to="/contact" className="text-lg font-semibold hover:text-gray-300">Contact Us</Link>
            <Link to="/addproperty" className="text-lg font-semibold hover:text-gray-300">Add Property</Link>

            {/* Add Property link for mobile - only visible for authenticated users */}
            {isAuthenticated && user && (
              <Link to="/add-property" className="text-lg font-semibold hover:text-gray-300">
                Add Property
              </Link>
            )}

            {/* Profile Section for Mobile */}
            {isAuthenticated && user ? (
              <div className="relative mt-4" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="relative w-12 h-12 flex items-center justify-center rounded-full overflow-hidden border-2 border-white"
                >
                  <img
                    src={user?.profileImage || "/default-avatar.png"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </button>
                {isProfileOpen && (
                  <div className="mt-2 w-48 bg-white shadow-lg rounded-lg py-4">
                    <div className="px-4 py-2 text-center">
                      <p className="font-semibold text-lg">{user?.name}</p>
                      <p className="text-gray-500 text-sm">{user?.email}</p>
                    </div>
                    <Link to="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                      View Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-200 flex items-center"
                    >
                      <LogOut size={16} className="mr-2" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative" ref={authMenuRef}>
                <button
                  onClick={() => setIsAuthMenuOpen(!isAuthMenuOpen)}
                  className="text-white font-semibold text-2xl"
                >
                  Create Account
                </button>
                {isAuthMenuOpen && (
                  <div className="mt-2 w-40 bg-white shadow-lg rounded-md py-2">
                    <Link to="/signup" className="block px-4 py-2 text-gray-800 hover:bg-gray-300">Sign Up</Link>
                    <Link to="/login" className="block px-4 py-2 text-gray-800 hover:bg-gray-300">Login</Link>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
