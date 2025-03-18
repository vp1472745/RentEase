import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import searchicon from "../assets/grow.png";
import popularLocalitiesData from "../data/popularLocalities.json";

const PopularLocalities = ({ selectedCity, onSelect }) => {
  const scrollRef = useRef(null);
  const [localities, setLocalities] = useState([]);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);

  useEffect(() => {
    if (selectedCity) {
      console.log("Fetching localities for city:", selectedCity);
      
      // Fetch localities from JSON data
      const localitiesFromJson = popularLocalitiesData[selectedCity] || [];
      setLocalities([...new Set(localitiesFromJson)]);
    }
  }, [selectedCity]);

  useEffect(() => {
    if (localities.length > 0 && localities[0]) {
      console.log("Auto-selecting locality:", localities[0]);
      onSelect(localities[0]);
    }
  }, [localities, onSelect]);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        setShowLeftButton(scrollLeft > 0);
        setShowRightButton(scrollLeft + clientWidth < scrollWidth);
      }
    };

    if (scrollRef.current) {
      scrollRef.current.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (scrollRef.current) {
        scrollRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth / 2;
      scrollRef.current.scrollTo({
        left:
          direction === "left"
            ? scrollLeft - scrollAmount
            : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <div className="flex">
        <div className="w-40 mt-8">
          <div className="flex">
            <img src={searchicon} className="w-6 h-6 mt-1" alt="search icon" />
            <span className="text-white font-semibold text-1xl ml-1 mt-1">
              Popular Localities
            </span>
          </div>
        </div>
        <div className="relative max-w-140 mt-4 flex items-center overflow-hidden bg-gradient-to-r p-3 rounded-lg">
          {showLeftButton && (
            <button
              onClick={() => scroll("left")}
              className="absolute left-1 bg-gray-900 text-white p-2 rounded-full shadow-md hover:bg-gray-700 transition top-1/2 transform -translate-y-1/2"
            >
              <ChevronLeft size={24} />
            </button>
          )}

          <div
            ref={scrollRef}
            className="flex items-center overflow-x-auto scrollbar-hide scroll-smooth px-4 space-x-3"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              whiteSpace: "nowrap",
            }}
          >
            {localities.length > 0 ? (
              localities.map((locality, index) => (
                <button
                  key={index}
                  onClick={() => onSelect(locality)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center font-medium hover:bg-blue-300 transition whitespace-nowrap cursor-pointer"
                >
                  {locality} <ChevronRight size={18} className="ml-2" />
                </button>
              ))
            ) : (
              <span className="text-white">No Localities Found</span>
            )}
          </div>

          {showRightButton && (
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 bg-gray-900 text-white p-2 rounded-full shadow-md hover:bg-gray-700 transition top-1/2 transform -translate-y-1/2"
            >
              <ChevronRight size={24} />
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
};

export default PopularLocalities;