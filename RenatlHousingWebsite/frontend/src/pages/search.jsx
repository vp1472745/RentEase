import React, { useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { RiArrowDropDownLine } from "react-icons/ri";
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
import PopularLocalities from "../pages/popularlocality.jsx"
const cities = [
  { name: "Mumbai", image_N: mum_N, image_H: mum_H },
  { name: "Bengaluru", image_N: ban_N, image_H: ban_H },
  { name: "Hyderabad", image_N: hyd_N, image_H: hyd_H },
  { name: "Kolkata", image_N: kol_N, image_H: kol_H },
  { name: "Bhopal", image_N: bhopal_N, image_H: bhopal_H },
  { name: "Jaipur", image_N: jai_N, image_H: jai_H },
  { name: "Noida", image_N: nod_N, image_H:  nod_H },
  { name: "Delhi", image_N: delhi_N, image_H:  delhi_H },
  { name: "Faridabad", image_N: fari_N, image_H:  fari_H },
  { name: "Pune", image_N: pune_N, image_H:  pune_H },
  { name: "NaviMumbai", image_N: NM_N, image_H: NM_H },
  { name: "Indore", image_N: I_N, image_H: I_H },
  { name: "Gaziyabad", image_N: G_N, image_H: G_H },
  { name: "GreaterNoida", image_N: GN_N, image_H: GN_H },
  { name: "Coimbatore", image_N: CN, image_H: CH },
  

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
  const [hoveredCity, setHoveredCity] = useState(null);
  const navigate = useNavigate();

  const handleSearch = () => {
    const params = new URLSearchParams();
  
    if (city) params.append("city", city);
    if (locality) params.append("address", locality);  // Address से भी search होगा
    if (selectedCategory) params.append("propertyType", selectedCategory); // Property Type भी add किया
  
    navigate(`/properties?${params.toString()}`);
  };
  
  return (
    <div className="flex flex-col items-center w-200 mt-3 h-30 rounded-t-2xl bg-blue-500 py-2">
      <div className="flex justify-center space-x-10 mb-10 ">
        {propertyCategories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={` font-medium transition cursor-pointer px-1  rounded-md text-lg mt-[20px] ${
              selectedCategory === category ? "hover:text-blue-400 text-white" : "text-white hover:text-blue-400"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="flex items-center  rounded-full shadow-md p-2 w-[800px] h-[250px] bg-white">
        <button onClick={() => setIsModalOpen(true)} className="bg-transparent text-black px-4 py-2 focus:outline-none">
          <div className="flex">
          <span className="text-lg font-medium cursor-pointer text-[16px] ">{city}</span>
          <RiArrowDropDownLine  className="h-8 w-8  text-gray-700 cursor-pointer"  />
          </div>
        </button>
        <div className="h-10 w-px bg-gray-300 mx-4 " />
        <input
          type="text"
          className="flex-grow px-4 py-3 text-black focus:outline-none text-[16px]"
          placeholder="Search Locality"
          // value={locality}
          onChange={(e) => setLocality(e.target.value)}
        />
        <button onClick={handleSearch} className="bg-blue-500 text-white px-6 py-2 rounded-full  flex items-center h-14 w-30  cursor-pointer text-lg">
          <Search size={15} className="mr-2" /> Search
        </button>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50"
          onClick={() => setIsModalOpen(false)} // Close the modal when clicking outside
        >
          <div
            className="relative bg-white rounded-xl p-5 w-[900px] max-h-[40vh] overflow-hidden mb-31"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
          >
            {/* <h2 className="text-2xl font-semibold  text-center">Select a City</h2> */}
            <div className="max-h-[200px] overflow-y-auto px-2 py-2 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200 scroll-smooth">
              <div className="flex flex-wrap justify-center">
                {cities.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setCity(item.name);
                      setIsModalOpen(false);
                    }}
                    onMouseEnter={() => setHoveredCity(item.name)}
                    onMouseLeave={() => setHoveredCity(null)}
                    className="flex flex-col items-center py-3 cursor-pointer group transition"
                  >
                    <div className="w-32 h-5 mb-1 mt-0 bg-white rounded-1xl flex items-center justify-center transition">
                      <img
                        src={hoveredCity === item.name ? item.image_H : item.image_N}
                        alt={item.name}
                        className="h-10 object-contain w-10 transition duration-300"
                      />
                    </div>
                    <span className="mt-3 text-center text-gray-700 group-hover:text-blue-600 font-medium mb-2">
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
<div>
     <PopularLocalities selectedCity={city} onSelect={(loc) => setLocality(loc)} />

</div>

    </div>


  );
};

export default SearchBar;
