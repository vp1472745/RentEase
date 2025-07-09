import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom"; // ✅ Navigation के लिए Import
import { VscGoToSearch } from "react-icons/vsc";
import popularLocalitiesData from "../data/popularLocalities.js"; // ✅ JSON File Import
import API from '../lib/axios';

const PopularLocalities = ({ selectedCity, onSelect }) => {
  const scrollRef = useRef(null);
  const [localities, setLocalities] = useState([]);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);
  const navigate = useNavigate(); // ✅ Navigation Hook

  // Function to log search activity
  const logSearchActivity = (searchTerm) => {
    const name = localStorage.getItem('name');
    const email = localStorage.getItem('email');
    const token = localStorage.getItem('token');
    API.post(
      "/api/user/search-log",
      {
        searchTerm: searchTerm,
        device: navigator.userAgent,
        name,
        email,
      },
      token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
    )
    .then(res => console.log('Search log response:', res.data))
    .catch(err => console.error('Search log error:', err));
  };

  useEffect(() => {
    if (selectedCity) {
     
      const localitiesFromJson = popularLocalitiesData[selectedCity] || [];
      setLocalities([...new Set(localitiesFromJson)]);
    }
  }, [selectedCity]);

  // ✅ Scroll Function (Left / Right)
  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 150; // कितने pixels scroll होगा
      if (direction === "left") {
        scrollRef.current.scrollLeft -= scrollAmount;
      } else {
        scrollRef.current.scrollLeft += scrollAmount;
      }
    }
  };

  // ✅ Scroll Position चेक करके left और right button visibility अपडेट करो
  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        setShowLeftButton(scrollRef.current.scrollLeft > 0);
        setShowRightButton(
          scrollRef.current.scrollLeft + scrollRef.current.clientWidth <
            scrollRef.current.scrollWidth
        );
      }
    };

    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener("scroll", handleScroll);
      handleScroll(); // Initial check for visibility
    }

    return () => {
      if (scrollElement) {
        scrollElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  // ✅ जब कोई locality select हो, तो `/properties` Page पर Redirect करो
  const handleLocalityClick = (locality) => {
    // Log search activity
    logSearchActivity(locality);
    
    // Call parent callback if provided
    if (onSelect) {
      onSelect(locality);
    }
    
    const params = new URLSearchParams();
    params.set("popularLocality", locality); // ✅ Popular Locality को URL में भेजो
    navigate(`/properties?${params.toString()}`); // ✅ Navigate to `/properties` with Query Params
  };

  return (
    <div className="flex flex-col sm:flex-row items-center mt-4 w-full">
      <div className="flex items-center w-full sm:w-50 mt-3">
        <VscGoToSearch className="w-5 h-5 text-white stroke-[0.5]" />
        <h2 className="ml-1 font-bold text-white text-[16px] sm:text-[17px]">
          Popular Localities
        </h2>
      </div>

      <div className="relative w-full sm:w-[600px] max-w-full sm:max-w-3xl mt-4 flex items-center overflow-hidden px-2 sm:px-4">
        {/* Left Scroll Button - Hide on mobile */}
        <button
          onClick={() => scroll("left")}
          className="hidden sm:flex absolute left-0 bg-gray-900 text-white p-2 rounded-full shadow-md hover:bg-gray-700 transition top-1/2 transform -translate-y-1/2 z-10"
        >
          <ChevronLeft size={20} />
        </button>

        <div
          ref={scrollRef}
          className="flex items-center overflow-x-auto scrollbar-hide px-2 sm:px-4 space-x-2 sm:space-x-3 w-full"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            whiteSpace: "nowrap",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {localities.length > 0 ? (
            localities.map((locality, index) => (
              <button
                key={index}
                onClick={() => handleLocalityClick(locality)}
                className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-pink-500 hover:to-purple-600 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-lg flex items-center font-medium text-sm sm:text-base hover:bg-purple-300 hover:text-black transition whitespace-nowrap cursor-pointer"
              >
                {locality} <ChevronRight size={16} className="ml-1 sm:ml-2" />
              </button>
            ))
          ) : (
            <span className="text-white">No Localities Found</span>
          )}
        </div>

        {/* Right Scroll Button - Hide on mobile */}
        <button
          onClick={() => scroll("right")}
          className="hidden sm:flex absolute right-0 bg-gray-900 text-white p-2 rounded-full shadow-md hover:bg-gray-700 transition top-1/2 transform -translate-y-1/2 z-10"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default PopularLocalities;
