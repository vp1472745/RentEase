import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import SearchBar from "../pages/search.jsx";
import Navbar from "../component/navbar.jsx"; // ✅ Navbar added
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import banner from "../assets/banner.gif";
import one from "../assets/homebanner.jpg";
import second from "../assets/second.jpg";

function Properties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchProperties = async () => {
        try {
            setLoading(true);
            const searchParams = new URLSearchParams(location.search);
            const city = searchParams.get("city") || "";
            const locality = searchParams.get("locality") || "";
            const category = searchParams.get("category") || "";

            console.log("Query Params:", { city, locality, category });

            // Make API request with filters
            const res = await axios.get(`http://localhost:5000/api/properties`, {
                params: { city, locality, category },
            });

            console.log("API Response:", res.data);

            let fetchedProperties = res.data || [];

            // Filter the properties based on the params
            fetchedProperties = fetchedProperties.filter((property) =>
                (city ? property.city === city : true) &&
                (locality ? property.locality === locality : true) &&
                (category ? property.category === category : true)
            );

            console.log("Fetched Properties after filter:", fetchedProperties); // Added for debugging

            setProperties(fetchedProperties);
        } catch (error) {
            console.error("Error fetching properties:", error);
            setProperties([]);
        } finally {
            setLoading(false);
        }
    };

    fetchProperties();
}, [location.search]);

  return (
    <div>
      <Navbar /> {/* ✅ Navbar Added */}

      {/* ✅ Hero Section with Search Bar */}
      <div
        className="relative flex flex-col items-center justify-center bg-cover bg-center text-center text-white h-[80vh]"
        style={{ backgroundImage: `url(${banner})` }}
      >
        <h1 className="text-3xl md:text-5xl font-bold">Find Your Perfect Home</h1>
        <p className="mt-4 text-base md:text-lg">Rent hassle-free homes across the city.</p>
        <SearchBar />
      </div>

    
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Available Properties</h2>

      {/* ✅ Agar Loading Hai Toh Show Karo */}
      {loading ? (
        <p className="text-center text-gray-500">Loading properties...</p>
      ) : properties.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4 md:px-12">
          {properties.map((property) => (
            <div key={property._id} className="bg-white shadow-md p-4 rounded-lg">
              <img src={property.images[0]} alt={property.title} className="h-40 w-full object-cover rounded" />
              <h3 className="text-xl font-semibold mt-2">{property.title}</h3>
              <p>{property.city}, {property.state}</p>
              <p className="text-indigo-600 font-bold">₹{property.monthlyRent}/month</p>
              <button onClick={() => navigate(`/property/${property._id}`)} className="mt-2 bg-blue-600 text-white px-4 py-2 rounded">
                View Details
              </button>
            </div>
          ))}
        </div>
      ) : null} {/* ✅ Agar koi property nahi mili, to kuch bhi na dikhao */}
    </div>
  );
}

export default Properties;