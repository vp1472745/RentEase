import React, { useState } from "react";
import { Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import kolkata from "../assets/kolkata.png";
import banguluru from "../assets/banguluru.png";
import mumbai from "../assets/mumbai.png";
import hyderabad from "../assets/hyderabad.png";
import bhopal from "../assets/bhopal.png";

const cities = [
  { name: "Mumbai", image: mumbai },
  { name: "Bengaluru", image: banguluru },
  { name: "Hyderabad", image: hyderabad },
  { name: "Kolkata", image: kolkata },
  { name: "Bhopal", image: bhopal },
];

const propertyCategories = [
  "Apartment",
  "Independent Floor",
  "Independent House",
  "Farm House",
];

const SearchBar = () => {
  const [city, setCity] = useState("Mumbai");
  const [locality, setLocality] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = () => {
    const params = new URLSearchParams();
    
    if (city) params.append("city", city);
    if (locality) params.append("locality", locality); // Ensure locality is also added
    if (selectedCategory) params.append("propertyType", selectedCategory); // Pass the propertyType
    
    const queryString = params.toString();
    console.log("Navigating to:", `/properties?${queryString}`);
    
    navigate(`/properties?${queryString}`);
  };

  return (
    <div className="flex flex-col items-center w-250 mt-5 rounded-3xl bg-[#1A1A3D] py-8">
      {/* Property Categories */}
      <div className="flex justify-center space-x-10 mb-6">
        {propertyCategories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`text-lg font-medium transition cursor-pointer px-4 py-2 rounded-md
              ${selectedCategory === category ? "bg-blue-500 text-white" : "text-white hover:text-blue-400"}`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="flex items-center bg-white rounded-full shadow-md p-2 w-full max-w-4xl h-20">
        <button onClick={() => setIsModalOpen(true)} className="bg-transparent text-black px-4 py-2 focus:outline-none">
          <span className="text-lg font-medium cursor-pointer">{city}</span>
        </button>

        <div className="h-10 w-px bg-gray-300 mx-4" />

        <input
          type="text"
          className="flex-grow px-4 py-2 text-black focus:outline-none"
          placeholder="Search Locality"
          value={locality}
          onChange={(e) => setLocality(e.target.value)}
        />

        <button onClick={handleSearch} className="bg-blue-800 text-white px-6 py-2 rounded-full flex items-center h-16 w-45 text-lg cursor-pointer">
          <Search size={20} className="mr-2" /> Search
        </button>
      </div>

      {/* City Select Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="relative bg-white rounded-xl p-8 w-[1000px] max-h-[80vh] overflow-y-auto">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-red-600">
              <X size={28} className="cursor-pointer" />
            </button>
            <h2 className="text-2xl font-semibold mb-6 text-center">Select a City</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-6">
              {cities.map((item) => (
                <div key={item.name} onClick={() => { setCity(item.name); setIsModalOpen(false); }} className="flex flex-col items-center cursor-pointer group">
                  <div className="w-32 h-32 bg-white rounded-3xl flex items-center justify-center transition">
                    <img src={item.image} alt={item.name} className="h-24 object-contain w-24" />
                  </div>
                  <span className="mt-3 text-center text-gray-700 group-hover:text-blue-600 font-medium">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
