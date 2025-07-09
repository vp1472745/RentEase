import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { RiArrowDropDownLine } from "react-icons/ri";
import API from '../lib/axios';

import hyd_N from "../assets/hyN.png";
import hyd_H from "../assets/hyH.png";
import mum_N from "../assets/MuN.png";
import mum_H from "../assets/MuH.png";
import ban_N from "../assets/banN.png";
import ban_H from "../assets/banH.png";
import bhopal_N from "../assets/bhopal_NB.png";
import bhopal_H from "../assets/bhopal_HC.png";
import kol_N from "../assets/kolkata_NB.png";
import kol_H from "../assets/kolkata_HC.png";
import jai_N from "../assets/jaipur_NB.png";
import jai_H from "../assets/jaipur_HC.png";
import nod_N from "../assets/nodia_NB.png";
import nod_H from "../assets/nodia_HC.png";
import delhi_H from "../assets/tajmahalH.png";
import delhi_N from "../assets/taj-mahal.png";
import fari_N from "../assets/faridabadN.png";
import fari_H from "../assets/faridabadH.png";
import pune_N from "../assets/puneN.png";
import pune_H from "../assets/puneH.png";
import NM_N from "../assets/navimumN.png";
import NM_H from "../assets/navimumH.png";
import I_N from "../assets/indoreN.png";
import I_H from "../assets/indoreH.png";
import G_N from "../assets/gaziyabadN.png";
import G_H from "../assets/gaziyabadH.png";
import GN_N from "../assets/GNN.png";
import GN_H from "../assets/GNH.png";
import CN from "../assets/CN.png";
import CH from "../assets/CH.png";
import CHHIN_b from "../assets/junnardeo1.png"
import CHHIN_w from "../assets/junnardeo2.png" 

import PopularLocalities from "../pages/popularlocality.jsx";
import popularLocalitiesData from "../data/popularLocalities.js";

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
  { name: "Junnardeo", image_N: CHHIN_b, image_H: CHHIN_w},
  { name: "Seoni", image_N: CN, image_H: CH },
  { name: "Parasia", image_N: CN, image_H: CH },
];



const SearchBar = () => {
  const [city, setCity] = useState("Bhopal");
  const [locality, setLocality] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hoveredCity, setHoveredCity] = useState(null);
  const navigate = useNavigate();

  // Function to log search activity
  const logSearchActivity = (searchTerm) => {
    const name = localStorage.getItem('name');
    const email = localStorage.getItem('email');
    API.post(
      "/api/user/search-log",
      {
        searchTerm: searchTerm,
        device: navigator.userAgent,
        name,
        email,
      }
    )
    .then(res => console.log('Search log response:', res.data))
    .catch(err => console.error('Search log error:', err));
  };

  // Function to handle city selection
  const handleCitySelect = (selectedCity) => {
    setCity(selectedCity);
    setIsModalOpen(false);
    // Remove automatic navigation and logging - let user click search button
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (city) params.append("city", city);
    if (locality) {
      params.append("address", locality);
      params.append("nearby", locality);
      // Check if the entered locality matches a popular locality for the selected city
      const localitiesForCity = popularLocalitiesData[city] || [];
      const matchedPopularLocality = localitiesForCity.find(
        (loc) => loc.toLowerCase() === locality.trim().toLowerCase()
      );
      if (matchedPopularLocality) {
        params.append("popularLocality", matchedPopularLocality);
      } else {
        params.append("popularLocality", locality); // still add for fuzzy match
      }
    }
    if (selectedCategory) params.append("propertyType", selectedCategory);
    navigate(`/properties?${params.toString()}`);

    // Log search activity
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

  useEffect(() => {
   
    // ...rest of your filter code
  }, [locality]);

  return (
    <div className="flex flex-col items-center w-full mt-8 py-8 px-4 sm:px-6 lg:px-8  min-h-[40vh]">
      {/* Professional Search Box */}
      <div className="flex flex-col sm:flex-row items-center w-full max-w-2xl bg-white/80 shadow-xl rounded-2xl px-4 py-4 border border-purple-100 backdrop-blur-md gap-x-4">
        {/* City Selector */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-500 hover:from-pink-500 hover:to-purple-600 transition px-4 py-2 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300 mb-3 sm:mb-0"
        >
          <span>{city}</span>
          <RiArrowDropDownLine className="h-7 w-7 text-purple-700" />
        </button>
        {/* Divider */}
        <div className="hidden sm:block h-10 w-px bg-purple-200" />
        {/* Locality Input */}
        <input
          type="text"
          className="flex-grow w-full px-2 py-3 ml-0 text-lg text-gray-800 bg-white rounded-xl border border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 shadow-sm transition placeholder-gray-400 outline-none"
          placeholder="Search Locality, Landmark, or Area..."
          value={locality}
          onChange={(e) => setLocality(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="mt-3 sm:mt-0 ml-0 flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-pink-500 hover:to-purple-600 text-white font-bold px-6  py-3 rounded-xl shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-300 text-lg"
        >
          <Search size={22} className="mr-1" />
          Search
        </button>
      </div>
      {/* City Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative bg-white rounded-2xl p-6 w-full max-w-[900px] max-h-[80vh] overflow-hidden shadow-2xl border border-purple-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-purple-100 scroll-smooth px-2">
              <div className="flex flex-wrap justify-center gap-6">
                {cities.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => handleCitySelect(item.name)}
                    onMouseEnter={() => setHoveredCity(item.name)}
                    onMouseLeave={() => setHoveredCity(null)}
                    className="flex flex-col items-center cursor-pointer w-28 p-3 rounded-xl hover:bg-purple-50 transition"
                  >
                    <img
                      src={hoveredCity === item.name ? item.image_H : item.image_N}
                      alt={item.name}
                      className="h-12 w-12 object-contain drop-shadow-md"
                    />
                    <span className="mt-3 text-base text-purple-800 font-semibold text-center">
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Popular Localities */}
      <div className="w-full max-w-2xl mt-8">
        <PopularLocalities selectedCity={city} onSelect={(loc) => setLocality(loc)} />
      </div>
    </div>
  );
};

export default SearchBar;
