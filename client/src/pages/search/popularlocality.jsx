import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { VscGoToSearch } from "react-icons/vsc";
import popularLocalitiesData from "../../data/popularLocalities.js";
import API from '../../lib/axios.js';

const PopularLocalities = ({ selectedCity, onSelect }) => {
  const scrollRef = useRef(null);
  const [localities, setLocalities] = useState([]);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);
  const navigate = useNavigate();

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

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      if (direction === "left") {
        scrollRef.current.scrollLeft -= scrollAmount;
      } else {
        scrollRef.current.scrollLeft += scrollAmount;
      }
    }
  };

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
      handleScroll();
    }

    return () => {
      if (scrollElement) {
        scrollElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  const handleLocalityClick = (locality) => {
    logSearchActivity(locality);
    
    if (onSelect) {
      onSelect(locality);
    }
    
    const params = new URLSearchParams();
    params.set("popularLocality", locality);
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <div className="flex flex-col w-full px-4 sm:px-6 py-4 bg-gradient-to-r from-indigo-900/20 to-blue-900/20 rounded-xl backdrop-blur-sm border border-indigo-200/20 shadow-lg">
      {/* Header Section */}
      <div className="flex items-center mb-4">
        <div className="flex items-center bg-indigo-600/10 px-3 py-2 rounded-lg border border-indigo-400/30">
          <VscGoToSearch className="w-5 h-5 text-indigo-300" />
          <h2 className="ml-2 font-bold text-indigo-100 text-lg tracking-wide">
            Popular Localities
          </h2>
        </div>
        <div className="hidden sm:block flex-1 ml-4 h-px bg-gradient-to-r from-indigo-400/30 to-transparent"></div>
      </div>

      {/* Localities Scroll Container */}
      <div className="relative w-full">
        {/* Scroll Buttons */}
        {showLeftButton && (
          <button
            onClick={() => scroll("left")}
            className="hidden sm:flex absolute left-0 -ml-4 bg-indigo-700/90 hover:bg-indigo-600 text-white p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 top-1/2 transform -translate-y-1/2 z-10 border border-indigo-400/30 hover:scale-105"
            aria-label="Scroll left"
          >
            <ChevronLeft size={24} className="stroke-[1.5]" />
          </button>
        )}

        {showRightButton && (
          <button
            onClick={() => scroll("right")}
            className="hidden sm:flex absolute right-0 -mr-4 bg-indigo-700/90 hover:bg-indigo-600 text-white p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 top-1/2 transform -translate-y-1/2 z-10 border border-indigo-400/30 hover:scale-105"
            aria-label="Scroll right"
          >
            <ChevronRight size={24} className="stroke-[1.5]" />
          </button>
        )}

        {/* Localities List */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto scrollbar-hide space-x-3 py-2 px-1 w-full"
          style={{
            scrollBehavior: 'smooth',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {localities.length > 0 ? (
            localities.map((locality, index) => (
              <button
                key={index}
                onClick={() => handleLocalityClick(locality)}
                className="flex-shrink-0 bg-gradient-to-br from-indigo-600 to-blue-600 hover:from-blue-500 hover:to-indigo-500 text-white px-5 py-2.5 rounded-xl font-medium text-sm sm:text-base transition-all duration-200 shadow-md hover:shadow-lg hover:scale-[1.02] group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  {locality}
                  <ChevronRight 
                    size={18} 
                    className="ml-2 transition-all duration-300 group-hover:translate-x-1" 
                  />
                </span>
                <span className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </button>
            ))
          ) : (
            <div className="w-full text-center py-4">
              <span className="text-indigo-200/80 italic">
                No popular localities found for this city
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation Dots */}
      {localities.length > 0 && (
        <div className="sm:hidden flex justify-center mt-3 space-x-2">
          {localities.slice(0, 5).map((_, index) => (
            <div 
              key={index}
              className="w-2 h-2 rounded-full bg-indigo-400/30"
              aria-hidden="true"
            ></div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PopularLocalities;