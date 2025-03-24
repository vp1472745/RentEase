import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom"; // ✅ Navigation के लिए Import
import { VscGoToSearch } from "react-icons/vsc";
import popularLocalitiesData from "../data/popularLocalities.js"; // ✅ JSON File Import

const PopularLocalities = ({ selectedCity }) => {
  const scrollRef = useRef(null);
  const [localities, setLocalities] = useState([]);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);
  const navigate = useNavigate(); // ✅ Navigation Hook

  useEffect(() => {
    if (selectedCity) {
      console.log("Fetching localities for city:", selectedCity);
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
    const params = new URLSearchParams();
    params.set("popularLocality", locality); // ✅ Popular Locality को URL में भेजो
    navigate(`/properties?${params.toString()}`); // ✅ Navigate to `/properties` with Query Params
  };

  return (
    <div className="flex items-center mt-4 w-full">
      <div className="flex items-center w-40 mt-3">
        <VscGoToSearch className="w-5 h-5 text-white stroke-[0.5]" />
        <h2 className="ml-1 font-bold text-white text-[16px]">
          Popular Localities
        </h2>
      </div>

      <div className="relative w-150 max-w-3xl mt-4 flex items-center overflow-hidden px-4">
        {showLeftButton && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 bg-gray-900 text-white p-2 rounded-full shadow-md hover:bg-gray-700 transition top-1/2 transform -translate-y-1/2"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        <div
          ref={scrollRef}
          className="flex items-center overflow-x-auto scrollbar-hide px-4 space-x-3"
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
                onClick={() => handleLocalityClick(locality)} // ✅ Navigate on Click
                className="bg-purple-800 text-white px-4 py-2 rounded-lg flex items-center font-medium hover:bg-purple-300 hover:text-black transition whitespace-nowrap cursor-pointer"
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
  );
};

export default PopularLocalities;
