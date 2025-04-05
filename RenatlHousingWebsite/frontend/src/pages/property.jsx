import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../axios";
import {
  FiHeart,
  FiShare2,
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiPhone,
  FiSearch,
  FiFilter,
} from "react-icons/fi";

function Properties() {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentProperty, setCurrentProperty] = useState(null);
  const [favorites, setFavorites] = useState({});
  const [seenProperties, setSeenProperties] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  // Search filters
  const [searchTerm, setSearchTerm] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [bhkFilter, setBhkFilter] = useState("");
  const [propertyTypeFilter, setPropertyTypeFilter] = useState("");
  const [localityFilter, setLocalityFilter] = useState("");
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [showFilters, setShowFilters] = useState(false);

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
            popularLocality: searchParams.get("popularLocality") || "",
          },
        });
        
        const propertiesData = Array.isArray(res?.data) 
          ? res.data.map(property => ({
              ...property,
              media: [...(property.images || []), ...(property.videos || [])],
              videos: property.videos || [],
              images: property.images || []
            }))
          : [];
          
        setProperties(propertiesData);
        setFilteredProperties(propertiesData);
        
        // Load seen properties from localStorage
        const savedSeenProperties = localStorage.getItem('seenProperties');
        if (savedSeenProperties) {
          setSeenProperties(JSON.parse(savedSeenProperties));
        }
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
  }, [
    searchTerm,
    cityFilter,
    bhkFilter,
    propertyTypeFilter,
    localityFilter,
    priceRange,
    properties,
  ]);

  const applyFilters = () => {
    let filtered = Array.isArray(properties) ? [...properties] : [];

    if (searchTerm.trim() !== "") {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((property) => {
        return (
          (property.title?.toLowerCase().includes(searchLower)) ||
          (property.description?.toLowerCase().includes(searchLower))
        );
      });
    }

    if (cityFilter) {
      filtered = filtered.filter(
        (property) =>
          property.city?.toLowerCase().includes(cityFilter.toLowerCase())
      );
    }

    if (bhkFilter) {
      filtered = filtered.filter(
        (property) =>
          property.bhkType?.toString().toLowerCase() === bhkFilter.toLowerCase()
      );
    }

    if (propertyTypeFilter) {
      filtered = filtered.filter(
        (property) =>
          property.propertyType?.toString().toLowerCase() ===
            propertyTypeFilter.toLowerCase()
      );
    }

    if (localityFilter) {
      filtered = filtered.filter(
        (property) =>
          property.popularLocality?.toLowerCase().includes(localityFilter.toLowerCase())
      );
    }

    filtered = filtered.filter(
      (property) =>
        property.monthlyRent >= priceRange[0] &&
        property.monthlyRent <= priceRange[1]
    );

    setFilteredProperties(filtered);
  };

  const handleViewDetails = (propertyId) => {
    // Add property to seen properties if not already there
    const seenProperties = JSON.parse(localStorage.getItem('seenProperties') || '[]');
    if (!seenProperties.includes(propertyId)) {
      const updatedSeenProperties = [...seenProperties, propertyId];
      localStorage.setItem('seenProperties', JSON.stringify(updatedSeenProperties));
      
      // Dispatch event to notify MyActivity component
      window.dispatchEvent(new CustomEvent('seenPropertyAdded', {
        detail: { count: updatedSeenProperties.length }
      }));
    }
    navigate(`/property/${propertyId}`);
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
      prev === 0 ? currentProperty.media.length - 1 : prev - 1
    );
  };

  const goToNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === currentProperty.media.length - 1 ? 0 : prev + 1
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

  const isVideo = (mediaItem) => {
    if (!mediaItem) return false;
    
    const url = typeof mediaItem === 'string' ? mediaItem : mediaItem.url;
    if (!url) return false;
    
    // Check for video extensions
    if (url.match(/\.(mp4|mov|webm|avi|m3u8|mkv)$/i)) return true;
    
    // Check for Cloudinary video URLs
    if (url.includes('res.cloudinary.com') && 
        (url.includes('/video/upload/') || url.includes('.mp4') || url.includes('.mov'))) {
      return true;
    }
    
    // Check for MIME type if available
    if (typeof mediaItem === 'object' && mediaItem.mimeType) {
      return mediaItem.mimeType.startsWith('video/');
    }
    
    return false;
  };

  const getMediaUrl = (mediaItem) => {
    if (!mediaItem) return '';
    return typeof mediaItem === 'string' ? mediaItem : mediaItem.url;
  };

  const VideoPlayer = ({ src, className, onClick, thumbnail = false }) => {
    return (
      <div className={`relative ${className}`}>
        <video
          className="w-full h-full object-cover"
          onClick={onClick}
          playsInline
          loop={!thumbnail}
          controls={!thumbnail}
          autoPlay={!thumbnail}
          preload={thumbnail ? "metadata" : "auto"}
        >
          <source src={src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {thumbnail && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
            <svg 
              className="w-8 h-8 text-white opacity-80" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path d="M6.3 2.8L14.8 10l-8.5 7.2V2.8z"/>
            </svg>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-purple-800 w-full h-15"></div>

      {/* Search and Filters Section */}
      <div className="container mx-auto px-4 py-4 bg-white shadow-sm rounded-lg">
        {/* Mobile Filter Toggle */}
        <div className="md:hidden flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-purple-800">
            Properties ({filteredProperties.length})
          </h2>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 bg-purple-100 text-purple-800 px-3 py-2 rounded-lg"
          >
            <FiFilter /> Filters
          </button>
        </div>

        {/* Search and Filters - Desktop */}
        <div className={`${showFilters ? 'block' : 'hidden'} md:block`}>
          {/* Search Row */}
          <div className="flex flex-col md:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-500" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500 text-purple-800 font-bold outline-none"
                placeholder="Search properties, nearby or owners..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex-1">
              <input
                type="text"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500 text-purple-800 font-bold outline-none"
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
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500 text-purple-800 font-bold outline-none appearance-none"
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
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {/* Property Type Filter */}
            <div className="relative">
              <select
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500 text-purple-800 font-bold outline-none appearance-none"
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
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="col-span-2">
              <div className="flex items-center space-x-2 bg-gray-50 p-1.5 rounded-lg border border-gray-200 focus-within:bg-white focus-within:ring-1 focus-within:ring-purple-500 focus-within:border-purple-500">
                <span className="text-purple-800 font-bold text-sm whitespace-nowrap">
                  💰 Price:
                </span>
                <div className="flex-1 flex items-center space-x-1">
                  <input
                    type="number"
                    className="w-full px-2 py-1 text-sm border-0 bg-transparent focus:ring-0 text-purple-800 font-bold outline-none"
                    placeholder="Min"
                    value={priceRange[0] === 0 ? "" : priceRange[0]}
                    onChange={(e) =>
                      setPriceRange([
                        e.target.value ? Number(e.target.value) : 0,
                        priceRange[1],
                      ])
                    }
                    min="0"
                  />
                  <span className="text-gray-400">-</span>
                  <input
                    type="number"
                    className="w-full px-2 py-1 text-sm border-0 bg-transparent focus:ring-0 text-purple-800 font-bold outline-none"
                    placeholder="Max"
                    value={priceRange[1] === 100000 ? "" : priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([
                        priceRange[0],
                        e.target.value ? Number(e.target.value) : 100000,
                      ])
                    }
                    min="0"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Property Listings */}
      <div className="container mx-auto px-4 py-4">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse text-center text-gray-600">
              Loading properties...
            </div>
          </div>
        ) : filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 max-w-5xl mx-auto pb-20">
            {filteredProperties.map((property) => {
              const firstMedia = property.media?.[0];
              const mediaUrl = getMediaUrl(firstMedia);
              const isVideoMedia = isVideo(firstMedia);

              return (
                <div
                  key={property._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Property Image/Video */}
                    <div className="relative md:w-2/5 h-48 md:h-auto">
                      {isVideoMedia ? (
                        <VideoPlayer
                          src={mediaUrl}
                          className="w-full h-full cursor-pointer"
                          onClick={() => openGallery(property, 0)}
                          thumbnail
                        />
                      ) : (
                        <img
                          src={mediaUrl || "https://via.placeholder.com/400x300"}
                          alt={property.title}
                          className="w-full h-full object-cover cursor-pointer"
                          onClick={() => openGallery(property, 0)}
                        />
                      )}
                      <div className="absolute top-4 right-4 flex space-x-2">
                        <button
                          className={`p-2 rounded-full shadow-md transition ${
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
                          className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition"
                          onClick={(e) => {
                            e.stopPropagation();
                            shareOnWhatsApp(property);
                          }}
                        >
                          <FiShare2 />
                        </button>
                      </div>
                    </div>

                    {/* Property Details */}
                    <div className="p-4 md:p-6 md:w-3/5">
                      <h3 className="text-lg font-semibold text-purple-800 mb-2">
                        {property.bhkType} {property.propertyType} in {property.popularLocality}
                      </h3>

                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-gray-600">City</p>
                          <p className="font-semibold">{property.city}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Nearby</p>
                          <p className="font-semibold whitespace-pre-line">
                            {String(property.nearby || "").replace(/,/g, "\n")}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Rent</p>
                          <p className="font-semibold">₹{property.monthlyRent}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Deposit</p>
                          <p className="font-semibold">₹{property.securityDeposit}</p>
                        </div>
                      </div>

                      <div className="mb-3">
                        <p className="text-sm text-gray-600">Furnishing</p>
                        <p className="font-semibold">{property.furnishType}</p>
                      </div>

                      {property.facilities && (
                        <div className="mb-3">
                          <p className="text-sm text-gray-600">Facilities</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {Array.isArray(property.facilities) ? (
                              property.facilities.slice(0, 3).map((facility, index) => (
                                <span
                                  key={index}
                                  className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs"
                                >
                                  {facility}
                                </span>
                              ))
                            ) : (
                              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                                {property.facilities}
                              </span>
                            )}
                            {property.facilities.length > 3 && (
                              <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
                                +{property.facilities.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row gap-3 mt-4">
                        <button
                          onClick={() => handleViewDetails(property._id)}
                          className="flex-1 bg-purple-800 text-white py-2 rounded-lg hover:bg-purple-900 transition"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => contactOwner(property.ownerphone)}
                          className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                        >
                          <FiPhone /> Contact
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex justify-center items-center h-64">
            <p className="text-center text-purple-800">
              {searchTerm
                ? "No properties match your search"
                : "No properties found"}
            </p>
          </div>
        )}
      </div>

      {/* Image/Video Gallery Modal */}
      {isGalleryOpen && currentProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col items-center justify-center p-4">
          <button
            onClick={closeGallery}
            className="absolute top-4 right-4 text-white text-3xl hover:text-gray-300"
          >
            <FiX size={32} />
          </button>

          <div className="relative w-full max-w-4xl h-full max-h-[70vh] flex flex-col items-center justify-center">
            <div className="w-full text-center mb-4">
              <p className="text-white text-lg font-bold">
                {currentProperty.title}
              </p>
            </div>
            
            <div className="relative w-full h-full flex items-center justify-center">
              <button
                onClick={goToPrevImage}
                className="absolute left-2 md:left-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 z-10"
              >
                <FiChevronLeft size={24} />
              </button>

              {isVideo(currentProperty.media[currentImageIndex]) ? (
                <div className="w-full h-full flex items-center justify-center">
                  <video
                    className="max-w-full max-h-[70vh]"
                    controls
                    autoPlay
                    playsInline
                  >
                    <source src={getMediaUrl(currentProperty.media[currentImageIndex])} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              ) : (
                <img
                  src={getMediaUrl(currentProperty.media[currentImageIndex])}
                  className="max-w-full max-h-[70vh] object-contain"
                  alt={`Property media ${currentImageIndex + 1}`}
                />
              )}

              <button
                onClick={goToNextImage}
                className="absolute right-2 md:right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 z-10"
              >
                <FiChevronRight size={24} />
              </button>
            </div>
          </div>

          <div className="mt-4 text-white text-center">
            <p className="text-lg">
              {currentImageIndex + 1} / {currentProperty.media.length}
            </p>
          </div>

          {/* Thumbnail navigation */}
          <div className="flex gap-2 overflow-x-auto max-w-full px-4 py-2">
            {currentProperty.media.map((item, index) => {
              const mediaUrl = getMediaUrl(item);
              const isVideoItem = isVideo(item);

              return (
                <div 
                  key={index} 
                  className={`flex-shrink-0 cursor-pointer ${currentImageIndex === index ? 'ring-2 ring-purple-500' : ''}`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  {isVideoItem ? (
                    <div className="relative w-16 h-16">
                      <VideoPlayer
                        src={mediaUrl}
                        className="w-full h-full"
                        thumbnail
                      />
                    </div>
                  ) : (
                    <img
                      src={mediaUrl}
                      className="w-16 h-16 object-cover"
                      alt={`Thumbnail ${index + 1}`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default Properties;