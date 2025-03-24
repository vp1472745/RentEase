import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import hotel from "../assets/hotel.jpg"
import SearchBar from "../pages/search.jsx";

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
        const popularLocality = searchParams.get("popularLocality") || "";

        console.log("Query Params Sent:", { city, locality, category, popularLocality });

        const res = await axios.get(`http://localhost:5000/api/properties/search`, {
          params: { city, address: locality, propertyType: category, popularLocality },
        });

        console.log("API Response:", res.data);
        setProperties(res.data || []);
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
    <div className=" min-h-screen bg-gray-100">
      {/* ✅ Header */}

      <div
        className="relative flex flex-col items-center justify-center bg-cover bg-center text-center text-white h-[90vh] "
        style={{ backgroundImage: `url(${hotel})` }}
      >
        <h1 className="text-10xl md:text-4xl  font-bold  text-white">Find Your Perfect Home</h1>
        <p className="mt-4 text-base md:text-2xl font-bold text-white">Rent hassle-free homes across the city.</p>
        <SearchBar />
      </div>
      
      <h2 className="text-3xl font-bold text-black mb-8 text-center  py-4">
        Available Properties
      </h2>

      {/* ✅ Loading Indicator */}
      {loading ? (
        <p className="text-center text-gray-600">Loading properties...</p>
      ) : properties.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4 md:px-12">
          {properties.map((property) => (
            <div
              key={property._id}
              className="bg-white shadow-lg p-4 rounded-lg hover:shadow-2xl transform hover:scale-105 transition-transform duration-300"
            >
              <img
                src={property.images[0]}
                alt={property.title}
                className="h-40 w-full object-cover rounded"
              />
              <h3 className="text-xl font-semibold mt-2 text-gray-900">{property.title}</h3>
              <p className="text-gray-700">{property.city}, {property.state}</p>
              <p className="text-indigo-700 font-bold">₹{property.monthlyRent}/month</p>

              {/* ✅ Popular Locality */}
              {property.popularLocality && (
                <p className="text-blue-600 font-semibold mt-1">
                  📍 Popular Locality: {property.popularLocality}
                </p>
              )}

              <button
                onClick={() => navigate(`/property/${property._id}`)}
                className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No properties found</p>
      )}
    </div>
  );
}

export default Properties;
