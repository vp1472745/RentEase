import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../axios";
import { FaGooglePlay, FaApple } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import QR from "../assets/QR.png"
import {
  FiHeart,
  FiShare2,
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiPhone,
  FiSearch
} from "react-icons/fi";

function Properties() {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentProperty, setCurrentProperty] = useState(null);
  const [favorites, setFavorites] = useState({});
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(215);
  const location = useLocation();
  
  // Search filters
  const [searchTerm, setSearchTerm] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [bhkFilter, setBhkFilter] = useState("");
  const [propertyTypeFilter, setPropertyTypeFilter] = useState("");
  const [localityFilter, setLocalityFilter] = useState("");
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [nearbyFilter, setNearbyFilter] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m : ${secs}s`;
  };

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const searchParams = new URLSearchParams(location.search);
        const res = await axios.get(`http://localhost:5000/api/properties`, {
          params: {
            city: searchParams.get("city") || "",
            address: searchParams.get("locality") || "",
            propertyType: searchParams.get("category") || "",
            popularLocality: searchParams.get("popularLocality") || ""
          }
        });
        const propertiesData = Array.isArray(res?.data) ? res.data : [];
        setProperties(propertiesData);
        setFilteredProperties(propertiesData);
      } catch (error) {
        console.error("Error fetching properties:", error);
        setProperties([]);
        setFilteredProperties([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, [location.search]);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, cityFilter, bhkFilter, propertyTypeFilter, localityFilter, priceRange, nearbyFilter, properties]);

  const applyFilters = () => {
    let filtered = Array.isArray(properties) ? [...properties] : [];

    if (searchTerm.trim() !== "") {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((property) => {
        return (
          (property.title && typeof property.title === 'string' && property.title.toLowerCase().includes(searchLower)) ||
          (property.description && typeof property.description === 'string' && property.description.toLowerCase().includes(searchLower))
        );
      });
    }

    if (cityFilter) {
      filtered = filtered.filter(property => 
        property.city && typeof property.city === 'string' && 
        property.city.toLowerCase().includes(cityFilter.toLowerCase())
      );
    }

    if (bhkFilter) {
      filtered = filtered.filter(property => 
        property.bhkType && property.bhkType.toString().toLowerCase() === bhkFilter.toLowerCase()
      );
    }

    if (propertyTypeFilter) {
      filtered = filtered.filter(property => 
        property.propertyType && property.propertyType.toString().toLowerCase() === propertyTypeFilter.toLowerCase()
      );
    }

    if (localityFilter) {
      filtered = filtered.filter(property => 
        property.popularLocality && typeof property.popularLocality === 'string' && 
        property.popularLocality.toLowerCase().includes(localityFilter.toLowerCase())
      );
    }

    filtered = filtered.filter(property => 
      property.monthlyRent >= priceRange[0] && property.monthlyRent <= priceRange[1]
    );

    if (nearbyFilter) {
      filtered = filtered.filter(property => 
        property.nearby && typeof property.nearby === 'string' && 
        property.nearby.toLowerCase().includes(nearbyFilter.toLowerCase())
      );
    }

    setFilteredProperties(filtered);
  };

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
      <div className="bg-purple-800 w-[100%] h-15"></div>

      {/* Search Filters */}
      <div className="container px-3 py-4 bg-white shadow-sm rounded-lg h-30 ">
        {/* Main Search Row */}
        <div className="flex flex-col md:flex-row gap-3 mb-4 ">
          {/* General Search */}
          <div className="relative flex-1 w-10">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ">
              <FiSearch className="text-gray-500 text-sm" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500 text-purple-800 font-bold outline-none cursor-pointer"
              placeholder="Search properties, nearby or owners..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Location Search */}
          <div className="flex-1">
            <input
              type="text"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500 text-purple-800 font-bold outline-none cursor-pointer"
              placeholder="📍 Popular locality"
              value={localityFilter}
              onChange={(e) => setLocalityFilter(e.target.value)}
            />
          </div>
        </div>

        {/* Filter Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {/* BHK Filter */}
          <div className="relative">
            <select
              className="w-full px-3 py-2 text-sm appearance-none border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500 text-purple-800 font-bold outline-none cursor-pointer"
              value={bhkFilter}
              onChange={(e) => setBhkFilter(e.target.value)}
            >
              <option value="">🏠 BHK Type</option>
              <option value="1">1 BHK</option>
              <option value="2">2 BHK</option>
              <option value="3">3 BHK</option>
              <option value="4">4+ BHK</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Property Type Filter */}
          <div className="relative">
            <select
              className="w-full px-3 py-2 text-sm appearance-none border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500 text-purple-800 font-bold outline-none cursor-pointer"
              value={propertyTypeFilter}
              onChange={(e) => setPropertyTypeFilter(e.target.value)}
            >
              <option value="">🏘️ Property Type</option>
              <option value="Apartment">Apartment</option>
              <option value="House">House</option>
              <option value="Villa">Villa</option>
              <option value="PG">PG/Hostel</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg className="w-4 h-4 text-purple-800 font-bold outline-none cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="col-span-2">
            <div className="flex items-center space-x-2 bg-gray-50 p-1.5 rounded-lg border border-gray-200 focus-within:bg-white focus-within:ring-1 focus-within:ring-purple-500 focus-within:border-purple-500">
              <span className="text-purple-800 font-bold outline-none  text-sm whitespace-nowrap">💰 Price:</span>
              <div className="flex-1 flex items-center space-x-1">
                <input
                  type="number"
                  className="w-full px-2 py-1 text-sm border-0 bg-transparent focus:ring-0 text-purple-800 font-bold outline-none cursor-pointer" 
                  placeholder="Min"
                  value={priceRange[0] === 0 ? "" : priceRange[0]}
                  onChange={(e) => setPriceRange([
                    e.target.value ? Number(e.target.value) : 0,
                    priceRange[1]
                  ])}
                  min="0"
                />
                <span className="text-gray-400">-</span>
                <input
                  type="number"
                  className="w-full px-2 py-1 text-sm border-0   bg-transparent focus:ring-0 text-purple-800 font-bold outline-none cursor-pointer"
                  placeholder="Max"
                  value={priceRange[1] === 100000 ? "" : priceRange[1]}
                  onChange={(e) => setPriceRange([
                    priceRange[0],
                    e.target.value ? Number(e.target.value) : 100000
                  ])}
                  min="0"
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-md font-bold text-purple-800 mb-2 text-center">
            Available Properties
            <span className="text-md font-bold text-purple-800 ml-2">
              ({filteredProperties.length} results)
            </span>
          </h2>
        </div>
      </div>

      {/* Property Listings */}
      <div className="container mx-auto px-4 py-2 overflow-auto h-[calc(100vh-200px)]">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-center text-gray-600">Loading properties...</p>
          </div>
        ) : Array.isArray(filteredProperties) && filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:gap-8 max-w-5xl mx-auto mb-15">
            {filteredProperties.map((property) => (
              <div
                key={property._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Property Image */}
                  <div className="relative md:w-1/2 lg:w-2/5 ">
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
                    <h3 className="text-lg md:text-xl font-semibold text-purple-800 mb-2">
                      <span className="font-bold text-purple-800">
                        {property.bhkType} {property.propertyType}
                      </span>{" "}
                      for rent in {property.popularLocality}
                    </h3>

                    <div className="flex flex-wrap gap-4 mb-3">
                      <div className="min-w-[120px]">
                        <p className="text-purple-800 text-sm font-bold">City</p>
                        <p className="text-purple-800 font-semibold">
                          {property.city}
                        </p>
                      </div>
                      <div className="min-w-[120px]">
                        <p className="text-purple-800 text-sm font-bold">Nearby</p>
                        <div className="text-purple-800 font-semibold whitespace-pre-line">
                          {String(property.nearby || '').replace(/,/g, '\n')}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 mb-3">
                      <div className="min-w-[120px]">
                        <p className="text-purple-800 text-sm font-bold">Rent</p>
                        <p className="text-purple-800 font-semibold">
                          ₹{property.monthlyRent}
                        </p>
                      </div>
                      <div className="min-w-[120px]">
                        <p className="text-purple-800 text-sm font-bold">
                          Deposit
                        </p>
                        <p className="text-purple-800 font-semibold">
                          ₹{property.securityDeposit}
                        </p>
                      </div>
                      <div className="min-w-[120px]">
                        <p className="text-purple-800 text-sm font-bold">Size</p>
                        <p className="text-purple-800 font-semibold">
                          {property.area} sq.ft
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 mb-3">
                      <div className="min-w-[120px]">
                        <p className="text-purple-800 text-sm font-bold">
                          Furnishing
                        </p>
                        <p className="text-purple-800 font-semibold">
                          {property.furnishType}
                        </p>
                      </div>
                      <div className="min-w-[120px]">
                        <p className="text-purple-800 text-sm font-bold">
                          Tenant Preference
                        </p>
                        <p className="text-purple-800 font-semibold">
                          {property.Gender || "Any"}
                          {property.coupleFriendly && property.coupleFriendly === "Yes" && (
                            <span className="block text-sm text-green-600">Couple Friendly</span>
                          )}
                        </p>
                      </div>
                    </div>

                    {property.facilities && (
                      <div className="mb-3">
                        <p className="text-purple-800 text-sm mb-1 font-bold">
                          Facilities
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {Array.isArray(property.facilities) ? (
                            property.facilities.map((facility, index) => (
                              <span
                                key={index}
                                className="text-purple-800 bg-purple-200 px-3 py-1 rounded-full text-sm whitespace-nowrap font-semibold"
                              >
                                {facility}
                              </span>
                            ))
                          ) : (
                            <span className="text-purple-800 bg-purple-200 px-3 py-1 rounded-full text-sm">
                              {property.facilities}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="mb-3">
                      <p className="text-purple-800 font-bold inline">Owner: </p>
                      <span className="text-purple-800 font-semibold">
                        {property.ownerName}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 mt-4">
                      <button
                        onClick={() => navigate(`/property/${property._id}`)}
                        className="w-full bg-purple-800 text-white py-2 rounded-lg hover:bg-purple-900 transition cursor-pointer"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => contactOwner(property.ownerphone)}
                        className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-2 rounded-[10px] hover:bg-green-700 transition text-sm md:text-base cursor-pointer"
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
            <p className="text-center text-purple-800">
              {searchTerm ? "No properties match your search" : "No properties found"}
            </p>
          </div>
        )}
      </div>

      {/* App Download Section (Fixed to bottom right) */}
      {/* <div className="fixed bottom-4 right-4 w-80 bg-white p-4 rounded-lg shadow-lg">
        <div className="bg-purple-200 p-2 rounded-lg text-center mb-4">
          <p className="text-purple-800 font-semibold">Get Zero Brokerage properties with <span className="text-pink-600 font-bold">💎 Premium</span></p>
          <p className="text-purple-800">50% Off expiring in <span className="bg-purple-300 px-2 py-1 rounded text-sm font-bold">{formatTime(timeLeft)}</span></p>
        </div>
        
        <h2 className="text-lg font-bold text-purple-800 mb-2">Get our Free App</h2>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-purple-800 font-semibold text-sm">⭐ 4.6 (200 downloads)</p>
            <div className="my-2">
              <img src={QR} alt="QR Code" className="w-24 h-24" />
            </div>
            <p className="text-purple-800 text-xs">Scan to download</p>
          </div>
          <div className="flex flex-col space-y-2">
            <button className="flex items-center space-x-2 bg-purple-800 text-white px-3 py-2 rounded-lg text-sm">
              <FaGooglePlay /> <span>Google Play</span>
            </button>
            <button className="flex items-center space-x-2 bg-purple-800 text-white px-3 py-2 rounded-lg text-sm">
              <FaApple /> <span>App Store</span>
            </button>
          </div>
        </div>
      </div> */}

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
              className="absolute right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 z-10 "
            >
              <FiChevronRight size={32} />
            </button>
          </div>

          <div className="mt-4 text-white text-center">
            <p className="text-lg">
              {currentImageIndex + 1} / {currentProperty.images.length}
            </p>
          </div>

          {/* Thumbnail navigation */}
          <div className="flex gap-2 overflow-x-auto max-w-full px-4 ">
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