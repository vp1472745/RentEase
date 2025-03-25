import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import hotel from "../assets/hotel.jpg";
import SearchBar from "../pages/search.jsx";
import {
  FiHeart,
  FiShare2,
  FiMapPin,
  FiChevronLeft,
  FiChevronRight,
  FiX,
} from "react-icons/fi";

function Properties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentProperty, setCurrentProperty] = useState(null);
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

        const res = await axios.get(
          `http://localhost:5000/api/properties/search`,
          {
            params: {
              city,
              address: locality,
              propertyType: category,
              popularLocality,

            },
          }
        );

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

  const openGallery = (property, index = 0) => {
    setCurrentProperty(property);
    setCurrentImageIndex(index);
    setIsGalleryOpen(true);
  };

  const closeGallery = () => {
    setIsGalleryOpen(false);
  };

  const goToPrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? currentProperty.images.length - 1 : prev - 1
    );
  };

  const goToNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === currentProperty.images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <div
        className="relative flex flex-col items-center justify-center bg-cover bg-center text-center text-white h-[90vh]"
        style={{ backgroundImage: `url(${hotel})` }}
      >
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Find Your Perfect Home
        </h1>
        <p className="text-lg md:text-2xl font-bold text-white mb-8">
          Rent hassle-free homes across the city.
        </p>
        <SearchBar />
      </div>

      {/* Property Listings */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-black mb-8 text-center">
          Available Properties
        </h2>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-center text-gray-600">Loading properties...</p>
          </div>
        ) : properties.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:gap-8 border w-[1200px]  ml-40" >
            {properties.map((property) => (
              <div
                key={property._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-[350px]"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Property Image */}
                  <div className="relative md:w-1/3 lg:w-2/5">
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-full h-64 md:h-full object-cover cursor-pointer"
                      onClick={() => openGallery(property, 0)}
                    />
                    <div className="absolute top-4 right-4 flex space-x-2">
                      <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition">
                        <FiHeart className="text-gray-700" />
                      </button>
                      <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition">
                        <FiShare2 className="text-gray-700" />
                      </button>
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="p-4 md:p-6 md:w-2/3 lg:w-3/5">
                    <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
                     Title : {property.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                    Description: {property.description}
                    </p>
                    <p className="text-gray-600 mb-4">
                     City : {property.city}, State :{property.state}
                    </p>
                    

                    {/* description */}
                    

                   
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                      <div className="flex items-center space-x-4">
                        <span className="text-xl font-bold text-indigo-700">
                          ₹{property.monthlyRent}/month
                        </span>
                        <span className="text-gray-600">{property.area} sq.ft</span>
                      </div>
                      {property.popularLocality && (
                        <span className="text-blue-600 font-semibold">
                          📍 {property.popularLocality}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 mt-6">
                      <button
                        onClick={() => navigate(`/property/${property._id}`)}
                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => openGallery(property, 0)}
                        className="flex-1 border border-gray-300 text-blue-600 px-4 py-2 rounded hover:bg-gray-50 transition"
                      >
                        View Photos
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center h-64">
            <p className="text-center text-gray-500">No properties found</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Properties;