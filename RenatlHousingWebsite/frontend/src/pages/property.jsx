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
  FiPhone,
} from "react-icons/fi";

function Properties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentProperty, setCurrentProperty] = useState(null);
  const [favorites, setFavorites] = useState({});
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

  const toggleFavorite = (propertyId) => {
    setFavorites((prev) => ({
      ...prev,
      [propertyId]: !prev[propertyId],
    }));
  };

  const openGallery = (property, index = 0) => {
    setCurrentProperty(property);
    setCurrentImageIndex(index);
    setIsGalleryOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeGallery = () => {
    setIsGalleryOpen(false);
    document.body.style.overflow = "auto";
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

  const shareOnWhatsApp = (property) => {
    const message =
      `Check out this property: ${property.title}\n\n` +
      `📍 Location: ${property.city}, ${property.state}\n` +
      `Nearby : ${property.nearby}\n` +
      `💰 Price: ₹${property.monthlyRent}/month\n` +
      `Owner Name: ${property.ownerName}\n` +
      `Rent : ${property.monthlyRent}\n` +
      `Desposit: ${property.securityDeposit}\n` +
      ` Size: ${property.area} sq.ft\n` +
      `More details: ${window.location.origin}/property/${property._id}`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, "_blank");
  };

  const contactOwner = (phoneNumber) => {
    if (!phoneNumber) {
      alert("Owner phone number not available");
      return;
    }
    window.open(`tel:${phoneNumber}`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <div
        className="relative flex flex-col items-center justify-center bg-cover bg-center text-center text-white h-[90vh] px-4"
        style={{ backgroundImage: `url(${hotel})` }}
      >
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
          Find Your Perfect Home
        </h1>
        <p className="text-lg md:text-2xl font-bold text-white mb-8">
          Rent hassle-free homes across the city.
        </p>
        <SearchBar />
      </div>

      {/* Property Listings */}
      <div className="container mx-auto px-4 py-8 bg-white">
        <h2 className="text-2xl md:text-3xl font-bold text-black mb-8 text-center">
          Available Properties
        </h2>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-center text-gray-600">Loading properties...</p>
          </div>
        ) : properties.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:gap-8 mx-auto max-w-5xl">
            {properties.map((property) => (
              <div
                key={property._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Property Image */}
                  <div className="relative md:w-1/2 lg:w-2/5">
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-full h-64 md:h-full object-cover cursor-pointer"
                      onClick={() => openGallery(property, 0)}
                    />

                    {/* heart and share buttons */}
                    <div className="absolute top-4 right-4 flex space-x-2">
                      <button
                        className={`p-2 rounded-full shadow-md transition cursor-pointer ${
                          favorites[property._id]
                            ? "text-red-500 bg-white"
                            : "bg-white text-gray-700"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(property._id);
                        }}
                      >
                        <FiHeart
                          className={`${
                            favorites[property._id] ? "fill-current" : ""
                          }`}
                        />
                      </button>

                      <button
                        className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          shareOnWhatsApp(property);
                        }}
                      >
                        <FiShare2 className="text-gray-700" />
                      </button>
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="p-4 md:p-6 md:w-1/2 lg:w-3/5">
                    <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
                      <span className="font-bold">
                        {property.bhkType} {property.propertyType}
                      </span>{" "}
                      for rent in {property.popularLocality}
                    </h3>

                    <div className="flex flex-wrap gap-4 mb-3">
                      <div className="min-w-[120px]">
                        <p className="text-gray-600 text-sm font-bold">City</p>
                        <p className="text-black font-semibold">
                          {property.city}
                        </p>
                      </div>
                      <div className="min-w-[120px]">
                        <p className="text-gray-600 text-sm font-bold">
                          Nearby
                        </p>
                        <p className="text-black font-semibold">
                          {property.nearby}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 mb-3">
                      <div className="min-w-[120px]">
                        <p className="text-gray-600 text-sm font-bold">Rent</p>
                        <p className="text-black font-semibold">
                          ₹{property.monthlyRent}
                        </p>
                      </div>
                      <div className="min-w-[120px]">
                        <p className="text-gray-600 text-sm font-bold">
                          Deposit
                        </p>
                        <p className="text-black font-semibold">
                          ₹{property.securityDeposit}
                        </p>
                      </div>
                      <div className="min-w-[120px]">
                        <p className="text-gray-600 text-sm font-bold">Size</p>
                        <p className="text-black font-semibold">
                          {property.area} sq.ft
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 mb-3">
                      <div className="min-w-[120px]">
                        <p className="text-gray-600 text-sm font-bold">
                          Furnishing
                        </p>
                        <p className="text-black font-semibold">
                          {property.furnishType}
                        </p>
                      </div>
                      <div className="min-w-[120px]">
                        <p className="text-gray-600 text-sm font-bold">
                          Gender
                        </p>
                        <p className="text-black font-semibold">
                          {property.Gender || "Any"}
                        </p>
                      </div>
                    </div>

                    {property.facilities && (
                      <div className="mb-3">
                        <p className="text-gray-600 text-sm mb-1 font-bold">
                          Facilities
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {Array.isArray(property.facilities) ? (
                            property.facilities.map((facility, index) => (
                              <span
                                key={index}
                                className="text-black bg-gray-200 px-3 py-1 rounded-full text-sm whitespace-nowrap font-semibold"
                              >
                                {facility}
                              </span>
                            ))
                          ) : (
                            <span className="text-black bg-gray-200 px-3 py-1 rounded-full text-sm">
                              {property.facilities}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="mb-3">
                      <p className="text-gray-600 font-bold inline">Owner: </p>
                      <span className="text-black font-semibold">
                        {property.ownerName}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 mt-4">
  <button
    onClick={() => navigate(`/property/${property._id}`)}
    className="w-[400px] bg-blue-600 text-white py-2 rounded-[10px] hover:bg-blue-700 transition text-sm md:text-base cursor-pointer"
  >
    View Details
  </button>
  <button
    onClick={() => contactOwner(property.ownerphone)}
    className="w-[400px] flex items-center justify-center gap-2 bg-green-600 text-white py-2 rounded-[10px] hover:bg-green-700 transition text-sm md:text-base cursor-pointer"
  >
    <FiPhone /> Contact Owner
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

      {/* Image Gallery Modal */}
      {isGalleryOpen && currentProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col items-center justify-center p-4">
          <button
            onClick={closeGallery}
            className="absolute top-4 right-4 text-white text-3xl hover:text-gray-300"
          >
            <FiX size={32} />
          </button>

          <div className="relative w-full max-w-4xl h-full max-h-[80vh] flex items-center justify-center">
            <button
              onClick={goToPrevImage}
              className="absolute left-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 z-10"
            >
              <FiChevronLeft size={32} />
            </button>

            <img
              src={currentProperty.images[currentImageIndex]}
              alt={`Property ${currentImageIndex + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg"
            />

            <button
              onClick={goToNextImage}
              className="absolute right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 z-10"
            >
              <FiChevronRight size={32} />
            </button>
          </div>

          <div className="mt-4 text-white text-center">
            <p className="text-lg">
              {currentImageIndex + 1} / {currentProperty.images.length}
            </p>
            <p className="text-sm text-gray-300 mt-2">
              {currentProperty.title}
            </p>
          </div>

          {/* Thumbnail navigation */}
          <div className="flex gap-2 mt-4 overflow-x-auto max-w-full py-2 px-4">
            {currentProperty.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Thumbnail ${index + 1}`}
                className={`w-16 h-16 object-cover rounded cursor-pointer ${
                  currentImageIndex === index
                    ? "ring-2 ring-blue-500"
                    : "opacity-70"
                }`}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Properties;
