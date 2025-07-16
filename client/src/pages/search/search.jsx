import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { RiArrowDropDownLine } from "react-icons/ri";
import API from "../../lib/axios.js";

// Import all your images as before
import hyd_N from "../../assets/hyN.png";
import hyd_H from "../../assets/hyH.png";
import mum_N from "../../assets/MuN.png";
import mum_H from "../../assets/MuH.png";
import ban_N from "../../assets/banN.png";
import ban_H from "../../assets/banH.png";
import bhopal_N from "../../assets/bhopal_NB.png";
import bhopal_H from "../../assets/bhopal_HC.png";
import kol_N from "../../assets/kolkata_NB.png";
import kol_H from "../../assets/kolkata_HC.png";
import jai_N from "../../assets/jaipur_NB.png";
import jai_H from "../../assets/jaipur_HC.png";
import nod_N from "../../assets/nodia_NB.png";
import nod_H from "../../assets/nodia_HC.png";
import delhi_H from "../../assets/tajmahalH.png";
import delhi_N from "../../assets/taj-mahal.png";
import fari_N from "../../assets/faridabadN.png";
import fari_H from "../../assets/faridabadH.png";
import pune_N from "../../assets/puneN.png";
import pune_H from "../../assets/puneH.png";
import NM_N from "../../assets/navimumN.png";
import NM_H from "../../assets/navimumH.png";
import I_N from "../../assets/indoreN.png";
import I_H from "../../assets/indoreH.png";
import G_N from "../../assets/gaziyabadN.png";
import G_H from "../../assets/gaziyabadH.png";
import GN_N from "../../assets/GNN.png";
import GN_H from "../../assets/GNH.png";
import CN from "../../assets/CN.png";
import CH from "../../assets/CH.png";
import CHHIN_b from "../../assets/junnardeo1.png";
import CHHIN_w from "../../assets/junnardeo2.png";

import PopularLocalities from "../search/popularlocality.jsx";
import popularLocalitiesData from "../../data/popularLocalities.js";

const cities = [
  { name: "Bhopal", image_N: bhopal_N, image_H: bhopal_H },
  { name: "Mumbai", image_N: mum_N, image_H: mum_H },
  { name: "Bengaluru", image_N: ban_N, image_H: ban_H },
  { name: "Hyderabad", image_N: hyd_N, image_H: hyd_H },
  { name: "Kolkata", image_N: kol_N, image_H: kol_H },
  { name: "Jaipur", image_N: jai_N, image_H: jai_H },
  { name: "Noida", image_N: nod_N, image_H: nod_H },
  { name: "Delhi", image_N: delhi_N, image_H: delhi_H },
  { name: "Faridabad", image_N: fari_N, image_H: fari_H },
  { name: "Pune", image_N: pune_N, image_H: pune_H },
  { name: "NaviMumbai", image_N: NM_N, image_H: NM_H },
  { name: "Indore", image_N: I_N, image_H: I_H },
  { name: "Gaziyabad", image_N: G_N, image_H: G_H },
  { name: "GreaterNoida", image_N: GN_N, image_H: GN_H },
  { name: "Coimbatore", image_N: CN, image_H: CH },
  { name: "Chhindwara", image_N: CN, image_H: CH },
  { name: "Junnardeo", image_N: CHHIN_b, image_H: CHHIN_w },
  { name: "Seoni", image_N: CN, image_H: CH },
  { name: "Parasia", image_N: CN, image_H: CH },
];

const propertyTypeButtons = [
  { label: "Rooms", value: "room", icon: "🛏️" },
  { label: "Apartments", value: "apartment", icon: "🏢" },
  { label: "PG", value: "pg", icon: "🏠" },
  { label: "Other", value: "other", icon: "🔍" },
];

const SearchBar = () => {
  const [city, setCity] = useState("Bhopal");
  const [locality, setLocality] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTypeButton, setSelectedTypeButton] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hoveredCity, setHoveredCity] = useState(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const navigate = useNavigate();

  const logSearchActivity = (searchTerm) => {
    const name = localStorage.getItem("name");
    const email = localStorage.getItem("email");
    API.post("/api/user/search-log", {
      searchTerm: searchTerm,
      device: navigator.userAgent,
      name,
      email,
    })
      .then((res) => console.log("Search log response:", res.data))
      .catch((err) => console.error("Search log error:", err));
  };

  const handleCitySelect = (selectedCity) => {
    setCity(selectedCity);
    setIsModalOpen(false);
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (city) params.append("city", city);
    if (locality) {
      params.append("address", locality);
      params.append("nearby", locality);
      const localitiesForCity = popularLocalitiesData[city] || [];
      const matchedPopularLocality = localitiesForCity.find(
        (loc) => loc.toLowerCase() === locality.trim().toLowerCase()
      );
      if (matchedPopularLocality) {
        params.append("popularLocality", matchedPopularLocality);
      } else {
        params.append("popularLocality", locality);
      }
    }
    if (selectedTypeButton) params.append("propertyType", selectedTypeButton);
    else if (selectedCategory) params.append("propertyType", selectedCategory);
    navigate(`/properties?${params.toString()}`);
    logSearchActivity(locality || city);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    const params = new URLSearchParams();
    params.append("city", city);
    params.append("propertyType", category);
    if (locality) {
      params.append("address", locality);
      params.append("popularLocality", locality);
    }
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <div className="flex flex-col items-center w-full py-8 px-2 sm:py-12 sm:px-4 lg:px-12 rounded-4xl">
      {/* Hero Section with Search */}
      <div className="w-full max-w-5xl">
        {/* Button Group */}
        <div className="flex w-full items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl shadow-lg overflow-hidden">
          {propertyTypeButtons.map((btn, idx) => (
            <button
              key={btn.value}
              type="button"
              className={`
                flex items-center justify-center flex-1 min-w-0 px-1.5 py-2 sm:px-4 sm:py-3 font-medium text-xs sm:text-sm gap-1 sm:gap-2
                ${
                  selectedTypeButton === btn.value
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                    : "bg-transparent text-gray-700 hover:bg-white/50"
                }
                ${idx === 0 ? "rounded-tl-xl" : ""}
                ${idx === propertyTypeButtons.length - 1 ? "rounded-tr-xl" : ""}
                transition-all duration-200
              `}
              style={{
                borderRight: idx !== propertyTypeButtons.length - 1 ? "1px solid rgba(255,255,255,0.3)" : "none",
              }}
              aria-pressed={selectedTypeButton === btn.value}
              onClick={() =>
                setSelectedTypeButton(
                  selectedTypeButton === btn.value ? "" : btn.value
                )
              }
            >
              <span className="text-sm sm:text-lg" aria-hidden>{btn.icon}</span>
              <span className="text-center whitespace-nowrap">{btn.label}</span>
            </button>
          ))}
        </div>
        
        {/* Professional Search Box - Enhanced */}
        <div
          className={`flex flex-row items-center w-full bg-white shadow-xl rounded-b-xl p-2 transition-all duration-300 ${
            searchFocused
              ? "ring-4 ring-indigo-200/50 border-indigo-300"
              : "border-gray-200"
          }`}
        >
          {/* City Selector - Enhanced */}
          <div className="relative w-1/3 max-w-[120px] mr-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-between w-full px-2 py-2 text-xs sm:text-sm font-medium text-gray-800 bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 border border-indigo-100 shadow-sm"
              aria-haspopup="dialog"
              aria-expanded={isModalOpen}
              aria-label="Select city"
            >
              <div className="flex items-center">
                <span className="truncate">{city}</span>
              </div>
              <RiArrowDropDownLine className="h-5 w-5 text-indigo-600" />
            </button>
            {isModalOpen && (
              <div
                className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-start pt-24 z-50 p-4 animate-fadeIn"
                onClick={() => setIsModalOpen(false)}
              >
                <div
                  className="relative bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 w-full max-w-4xl max-h-[70vh] overflow-hidden shadow-2xl border border-indigo-100 animate-fadeInUp"
                  onClick={(e) => e.stopPropagation()}
                  role="dialog"
                  aria-modal="true"
                  aria-label="Select your city"
                >
                  <button
                    className="absolute top-4 right-4 text-indigo-600 hover:text-indigo-800 text-2xl font-bold focus:outline-none"
                    onClick={() => setIsModalOpen(false)}
                    aria-label="Close city selector"
                  >
                    ×
                  </button>
                  <h3 className="text-xl font-bold text-indigo-800 mb-4">
                    Select Your City
                  </h3>
                  <div className="max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-300 scrollbar-track-indigo-50 px-2">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {cities.map((item, index) => (
                        <div
                          key={index}
                          onClick={() => handleCitySelect(item.name)}
                          onMouseEnter={() => setHoveredCity(item.name)}
                          onMouseLeave={() => setHoveredCity(null)}
                          className={`flex flex-col items-center cursor-pointer p-3 rounded-xl transition-all duration-200 ${
                            city === item.name
                              ? "bg-gradient-to-br from-indigo-100 to-blue-100 shadow-md border border-indigo-200"
                              : "hover:bg-white/50 hover:shadow-sm border border-transparent hover:border-indigo-100"
                          }`}
                          tabIndex={0}
                          role="button"
                          aria-pressed={city === item.name}
                        >
                          <div className="relative h-14 w-14 mb-2">
                            <img
                              src={
                                hoveredCity === item.name || city === item.name
                                  ? item.image_H
                                  : item.image_N
                              }
                              alt={item.name}
                              className="h-full w-full object-contain transition-transform duration-300 hover:scale-110"
                            />
                          </div>
                          <span
                            className={`text-sm font-medium text-center ${
                              city === item.name
                                ? "text-indigo-700 font-semibold"
                                : "text-gray-700"
                            }`}
                          >
                            {item.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Divider - Enhanced */}
          <div className="hidden sm:block h-10 w-px bg-gradient-to-b from-transparent via-indigo-300 to-transparent mx-2" />
          
          {/* Locality Input - Enhanced */}
          <div className="flex-grow w-1/2 relative mx-1">
            <input
              type="text"
              className="w-full px-3 py-2 text-sm text-gray-800 bg-transparent border-none focus:outline-none placeholder-gray-500 font-medium"
              placeholder="Search by locality, landmark, or area..."
              value={locality}
              onChange={(e) => setLocality(e.target.value)}
              onKeyDown={handleKeyPress}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              aria-label="Search by locality, landmark, or area"
            />
            {locality && (
              <button
                onClick={() => setLocality("")}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-indigo-600 text-lg focus:outline-none"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
          
          {/* Search Button - Enhanced */}
          <button
            onClick={handleSearch}
            className="w-1/4 min-w-[80px] flex items-center justify-center gap-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold px-3 py-2 rounded-lg shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2 hover:shadow-lg active:scale-[0.98] text-sm"
            aria-label="Search properties"
          >
            <Search size={16} className="mr-1" />
            <span className="hidden sm:inline">Search</span>
          </button>
        </div>
        
        {/* Popular Localities - Enhanced */}
        <div className="w-full mt-6 sm:mt-8">
          <PopularLocalities
            selectedCity={city}
            onSelect={(loc) => {
              setLocality(loc);
              setTimeout(handleSearch, 300); // Auto-search after selection
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchBar;