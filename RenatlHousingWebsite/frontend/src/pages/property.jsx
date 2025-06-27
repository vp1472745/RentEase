import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../lib/axios";
import { toast } from 'react-toastify';
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
  const [tenantFilter, setTenantFilter] = useState("");
  const [coupleFriendlyFilter, setCoupleFriendlyFilter] = useState("");
  const [priceRange, setPriceRange] = useState(["", ""]);
  const [showFilters, setShowFilters] = useState(false);
  const [showSeenProperties, setShowSeenProperties] = useState(false);
  const [error, setError] = useState(null);

  // Load saved properties on component mount
  useEffect(() => {
    const loadSavedProperties = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await axios.get('/api/properties/saved', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const savedProperties = response.data;
        const savedIds = {};
        savedProperties.forEach(property => {
          savedIds[property._id] = true;
        });
        setFavorites(savedIds);
      } catch (error) {
        console.error('Error loading saved properties:', error);
      }
    };

    loadSavedProperties();
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get("tab");
    setShowSeenProperties(tab === "seenproperties");

    // Initialize filter states from URL parameters
    setSearchTerm(searchParams.get("searchTerm") || "");
    setCityFilter(searchParams.get("city") || "");
    setPropertyTypeFilter(searchParams.get("propertyType") || ""); 
    setLocalityFilter(searchParams.get("popularLocality") || searchParams.get("address") || "");
    setBhkFilter(searchParams.get("bhk") || ""); // Ensure bhkFilter is read from URL
    setTenantFilter(searchParams.get("tenant") || ""); // Ensure tenantFilter is read from URL
    setCoupleFriendlyFilter(searchParams.get("coupleFriendly") || ""); // Ensure coupleFriendlyFilter is read from URL

    const minPriceParam = searchParams.get("minPrice");
    const maxPriceParam = searchParams.get("maxPrice");

    setPriceRange([
      minPriceParam ? Number(minPriceParam) : "",
      maxPriceParam ? Number(maxPriceParam) : "" 
    ]);

    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem('token');
        const config = token ? {
          headers: {
            Authorization: `Bearer ${token}`
          }
        } : {};

        // Determine which endpoint to call based on active search parameters
        const hasSearchParams = Array.from(searchParams.keys()).some(key => 
            key !== "tab" && searchParams.get(key) !== "" && searchParams.get(key) !== "0"
        );

        let endpoint = '/api/properties/';
        let requestParams = {};

        if (hasSearchParams) {
          endpoint = '/api/properties/search';
          // Map frontend filter states to backend search parameters
          requestParams = {
            searchTerm: searchParams.get("searchTerm") || "",
            city: searchParams.get("city") || "",
            propertyType: searchParams.get("propertyType") || "",
            locality: searchParams.get("locality") || searchParams.get("address") || searchParams.get("popularLocality") || "",
            bhkType: searchParams.get("bhk") || "",
            tenant: searchParams.get("tenant") || "",
            coupleFriendly: searchParams.get("coupleFriendly") || "",
            minPrice: minPriceParam,
            maxPrice: maxPriceParam,
            // Add other parameters as needed by your backend /search route
          };
        } else {
          // If no specific search, just fetch all properties (or based on initial URL params)
          requestParams = {
            city: searchParams.get("city") || "",
            address: searchParams.get("locality") || "",
            propertyType: searchParams.get("category") || "",
            popularLocality: searchParams.get("popularLocality") || "",
          };
        }

        console.log(`📡 Fetching from: ${endpoint} with params:`, requestParams);

        const res = await axios.get(endpoint, {
          ...config,
          params: requestParams
        });

        if (!res.data) {
          throw new Error('No data received from server');
        }

        const propertiesData = Array.isArray(res.data) 
          ? res.data.map(property => ({
              ...property,
              media: [...(property.images || []), ...(property.videos || [])],
              videos: property.videos || [],
              images: property.images || [],
            }))
          : [];

        console.log('Fetched properties:', propertiesData);
        setProperties(propertiesData);

        // Load seen properties
        const savedSeenProperties = localStorage.getItem("seenProperties");
        if (savedSeenProperties) {
          const seenIds = JSON.parse(savedSeenProperties);
          setSeenProperties(seenIds);

          if (tab === "seenproperties") {
            const seenProps = propertiesData.filter(prop => seenIds.includes(prop._id));
            setFilteredProperties(seenProps);
          } else {
            setFilteredProperties(propertiesData);
          }
        } else {
          setFilteredProperties(propertiesData);
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
        let errorMessage = "Failed to load properties";
        
        if (error.response) {
          console.error("Error response:", error.response.data);
          errorMessage = error.response.data.message || errorMessage;
        } else if (error.request) {
          console.error("No response received:", error.request);
          errorMessage = "Server not responding. Please try again later.";
        } else {
          console.error("Error setting up request:", error.message);
          errorMessage = error.message || errorMessage;
        }
        
        toast.error(errorMessage);
        setProperties([]);
        setFilteredProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [location.search]);

  // This useEffect will run applyFilters when filter states or properties change
  useEffect(() => {
    if (!showSeenProperties) {
      applyFilters();
    }
  }, [
    searchTerm,
    cityFilter,
    bhkFilter,
    propertyTypeFilter,
    localityFilter,
    tenantFilter,
    coupleFriendlyFilter,
    priceRange,
    properties, 
    showSeenProperties,
    // Removed location.search as a direct dependency here. fetchProperties handles it.
  ]);

  const applyFilters = () => {
    console.log("=== Applying Filters ===");
    console.log("Initial properties for filtering:", properties);
    console.log("Current filter states:", {
      searchTerm,
      cityFilter,
      bhkFilter,
      propertyTypeFilter,
      localityFilter,
      tenantFilter,
      coupleFriendlyFilter,
      priceRange,
    });

    let filtered = Array.isArray(properties) ? [...properties] : [];
    console.log("After initial copy:", filtered.length, "properties");

    if (searchTerm.trim() !== "") {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((property) => {
        return (
          property.title?.toLowerCase().includes(searchLower) ||
          property.description?.toLowerCase().includes(searchLower)
        );
      });
      console.log("After searchTerm filter:", filtered.length, "properties");
    }

    if (cityFilter) {
      filtered = filtered.filter((property) =>
        property.city?.toLowerCase().includes(cityFilter.toLowerCase())
      );
      console.log("After cityFilter filter:", filtered.length, "properties");
    }

    if (bhkFilter) {
      filtered = filtered.filter(
        (property) =>
          property.bhkType?.toString().toLowerCase() === bhkFilter.toLowerCase()
      );
      console.log("After bhkFilter filter:", filtered.length, "properties");
    }

    if (propertyTypeFilter) {
      filtered = filtered.filter(
        (property) =>
          property.propertyType?.toString().toLowerCase() ===
          propertyTypeFilter.toLowerCase()
      );
      console.log("After propertyTypeFilter filter:", filtered.length, "properties");
    }

    if (localityFilter) {
      filtered = filtered.filter((property) =>
        (property.popularLocality &&
          property.popularLocality.toLowerCase().includes(localityFilter.toLowerCase())) ||
        (property.address &&
          property.address.toLowerCase().includes(localityFilter.toLowerCase())) ||
        (property.city &&
          property.city.toLowerCase().includes(localityFilter.toLowerCase()))
      );
      console.log("After localityFilter filter:", filtered.length, "properties");
    }

    if (tenantFilter) {
      filtered = filtered.filter((property) => {
        if (!property.Gender) return false;
        
        // Handle both array and string cases for Gender
        const genderValues = Array.isArray(property.Gender) 
          ? property.Gender 
          : [property.Gender];
          
        return genderValues.some(gender => 
          gender.toLowerCase().includes(tenantFilter.toLowerCase())
        );
      });
      console.log("After tenantFilter filter:", filtered.length, "properties");
    }

    if (coupleFriendlyFilter) {
      filtered = filtered.filter(
        (property) =>
          String(property.coupleFriendly || "").toLowerCase() === 
          coupleFriendlyFilter.toLowerCase()
      );
      console.log("After coupleFriendlyFilter filter:", filtered.length, "properties");
    }

    filtered = filtered.filter((property) => {
      const min = priceRange[0] !== "" ? Number(priceRange[0]) : null;
      const max = priceRange[1] !== "" ? Number(priceRange[1]) : null;
      if (min !== null && max !== null) {
        return property.monthlyRent >= min && property.monthlyRent <= max;
      } else if (min !== null) {
        return property.monthlyRent >= min;
      } else if (max !== null) {
        return property.monthlyRent <= max;
      }
      return true; // No price filter if both are empty
    });
    console.log("After priceRange filter:", filtered.length, "properties");

    setFilteredProperties(filtered);
    console.log("Final filtered properties set:", filtered.length, "properties");
  };

  const handleSearch = (searchParams) => {
    setSearchTerm(searchParams.searchTerm);
    setCityFilter(searchParams.cityFilter);
    setBhkFilter(searchParams.bhkFilter);
    setPropertyTypeFilter(searchParams.propertyTypeFilter);
    setLocalityFilter(searchParams.localityFilter);
    setTenantFilter(searchParams.tenantFilter);
    setCoupleFriendlyFilter(searchParams.coupleFriendlyFilter);
    setPriceRange(searchParams.priceRange);
  };

  const handleViewDetails = async (propertyId) => {
    try {
      // Record view in backend if user is authenticated
      const token = localStorage.getItem("token");
      if (token) {
        await axios.post(
          `http://localhost:5000/api/properties/${propertyId}/view`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      // Add to local storage for all users
      const seenProperties = JSON.parse(
        localStorage.getItem("seenProperties") || "[]"
      );
      if (!seenProperties.includes(propertyId)) {
        const updatedSeenProperties = [...seenProperties, propertyId];
        localStorage.setItem(
          "seenProperties",
          JSON.stringify(updatedSeenProperties)
        );
        setSeenProperties(updatedSeenProperties);

        // Notify Navbar of update
        window.dispatchEvent(
          new CustomEvent("seenPropertyAdded", {
            detail: { count: updatedSeenProperties.length },
          })
        );
      }

      navigate(`/property/${propertyId}`);
    } catch (error) {
      console.error("Error recording view:", error);
      // Still navigate even if tracking fails
      navigate(`/property/${propertyId}`);
    }
  };

  const toggleFavorite = async (propertyId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to save properties');
        return;
      }

      const isCurrentlySaved = favorites[propertyId];
      
      if (isCurrentlySaved) {
        // Unsave property
        await axios.delete(`/api/properties/save/${propertyId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setFavorites((prev) => ({
          ...prev,
          [propertyId]: false,
        }));
        
        toast.success('Property removed from saved');
      } else {
        // Save property
        await axios.post(`/api/properties/save/${propertyId}`, {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setFavorites((prev) => ({
          ...prev,
          [propertyId]: true,
        }));
        
        toast.success('Property saved successfully');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update saved property';
      toast.error(errorMessage);
    }
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

  const getMediaUrl = (mediaItem) => {
    if (!mediaItem) return null;
    
    // If mediaItem is a string (old format), return it directly
    if (typeof mediaItem === 'string') return mediaItem;
    
    // If mediaItem is an object with url property (new format), return the url
    if (mediaItem.url) return mediaItem.url;
    
    return null;
  };

  const isVideo = (mediaItem) => {
    if (!mediaItem) return false;
    
    // If mediaItem is an object with type property
    if (typeof mediaItem === 'object' && mediaItem.type) {
      return mediaItem.type.toLowerCase() === 'video';
    }
    
    // If mediaItem is a string, check if it ends with video extension
    if (typeof mediaItem === 'string') {
      return /\.(mp4|webm|ogg)$/i.test(mediaItem);
    }
    
    return false;
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
              <path d="M6.3 2.8L14.8 10l-8.5 7.2V2.8z" />
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

      {/* PropertySearchBox Component */}
      {!showSeenProperties && (
        <PropertySearchBox
          onSearch={handleSearch}
          initialSearchTerm={searchTerm}
          initialCity={cityFilter}
          initialBhk={bhkFilter}
          initialPropertyType={propertyTypeFilter}
          initialLocality={localityFilter}
          initialTenant={tenantFilter}
          initialCoupleFriendly={coupleFriendlyFilter}
          initialMinPrice={priceRange[0] !== "" ? Number(priceRange[0]) : 0}
          initialMaxPrice={priceRange[1] !== "" ? Number(priceRange[1]) : Infinity}
        />
      )}

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
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property._id}
                property={property}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
                openGallery={openGallery}
                shareOnWhatsApp={shareOnWhatsApp}
                contactOwner={contactOwner}
                handleViewDetails={handleViewDetails}
                isVideo={isVideo}
                getMediaUrl={getMediaUrl}
                VideoPlayer={VideoPlayer}
              />
            ))}
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
        <GalleryModal
          currentProperty={currentProperty}
          currentImageIndex={currentImageIndex}
          closeGallery={closeGallery}
          goToPrevImage={goToPrevImage}
          goToNextImage={goToNextImage}
          setCurrentImageIndex={setCurrentImageIndex}
          isVideo={isVideo}
          getMediaUrl={getMediaUrl}
        />
      )}
    </div>
  );
}

// Property Card Component
function PropertyCard({
  property,
  favorites,
  toggleFavorite,
  openGallery,
  shareOnWhatsApp,
  contactOwner,
  handleViewDetails,
  isVideo,
  getMediaUrl,
  VideoPlayer,
}) {
  // Get first media item (image or video)
  const firstMedia = property.media?.[0] || property.images?.[0];
  const mediaUrl = getMediaUrl(firstMedia);
  const isVideoMedia = isVideo(firstMedia);

  // Format Gender display
  const formatGenderDisplay = () => {
    if (!property.Gender) return "Any";
    return Array.isArray(property.Gender) ? property.Gender.join(", ") : property.Gender;
  };

  // Format BHK Type display
  const formatBhkDisplay = () => {
    if (!property.bhkType) return "";
    return Array.isArray(property.bhkType) ? property.bhkType.join(", ") : property.bhkType;
  };

  // Format Furnish Type display
  const formatFurnishDisplay = () => {
    if (!property.furnishType) return "";
    return Array.isArray(property.furnishType) ? property.furnishType.join(", ") : property.furnishType;
  };

  // Format Property Type display
  const formatPropertyTypeDisplay = () => {
    if (!property.propertyType) return "";
    return Array.isArray(property.propertyType) ? property.propertyType.join(", ") : property.propertyType;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
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
              src={mediaUrl || "https://via.placeholder.com/400x300?text=No+Image"}
              alt={property.title}
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => openGallery(property, 0)}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/400x300?text=Image+Not+Available";
              }}
            />
          )}
        </div>

        {/* Property Details */}
        <div className="p-4 md:w-3/5">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{property.title}</h3>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(property._id);
              }}
              className={`p-2 rounded-full ${
                favorites[property._id] ? "text-red-500" : "text-gray-400"
              } hover:text-red-500 transition-colors`}
            >
              <FiHeart size={24} />
            </button>
          </div>

          <div className="space-y-2">
            <p className="text-gray-600">
              <span className="font-medium">Location:</span> {property.address}, {property.city}, {property.state}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Property Type:</span> {formatPropertyTypeDisplay()}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">BHK Type:</span> {formatBhkDisplay()}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Furnishing:</span> {formatFurnishDisplay()}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Popular Locality:</span> {property.popularLocality}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Available From:</span>{" "}
              {new Date(property.availableFrom).toLocaleDateString()}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Gender:</span> {formatGenderDisplay()}
            </p>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <div>
              <p className="text-2xl font-bold text-purple-800">₹{property.monthlyRent}/month</p>
              <p className="text-sm text-gray-500">Security Deposit: ₹{property.securityDeposit}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  shareOnWhatsApp(property);
                }}
                className="p-2 text-gray-600 hover:text-green-600 transition-colors"
                title="Share on WhatsApp"
              >
                <FiShare2 size={20} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  contactOwner(property);
                }}
                className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                title="Contact Owner"
              >
                <FiPhone size={20} />
              </button>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleViewDetails(property._id);
            }}
            className="mt-4 w-full bg-purple-800 text-white py-2 rounded hover:bg-purple-700 transition-colors"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

// Gallery Modal Component
function GalleryModal({
  currentProperty,
  currentImageIndex,
  closeGallery,
  goToPrevImage,
  goToNextImage,
  setCurrentImageIndex,
  isVideo,
  getMediaUrl,
}) {
  return (
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
                <source
                  src={getMediaUrl(currentProperty.media[currentImageIndex])}
                  type="video/mp4"
                />
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
              className={`flex-shrink-0 cursor-pointer ${
                currentImageIndex === index ? "ring-2 ring-purple-500" : ""
              }`}
              onClick={() => setCurrentImageIndex(index)}
            >
              {isVideoItem ? (
                <div className="relative w-16 h-16">
                  <video
                    className="w-full h-full object-cover"
                    playsInline
                    muted
                    preload="metadata"
                  >
                    <source src={mediaUrl} type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                    <svg
                      className="w-4 h-4 text-white opacity-80"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M6.3 2.8L14.8 10l-8.5 7.2V2.8z" />
                    </svg>
                  </div>
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
  );
}

// PropertySearchBox Component
const PropertySearchBox = ({ 
  onSearch,
  initialSearchTerm = "",
  initialCity = "",
  initialBhk = "",
  initialPropertyType = "",
  initialLocality = "",
  initialTenant = "",
  initialCoupleFriendly = "",
  initialMinPrice = 0,
  initialMaxPrice = Infinity
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [cityFilter, setCityFilter] = useState(initialCity);
  const [bhkFilter, setBhkFilter] = useState(initialBhk);
  const [propertyTypeFilter, setPropertyTypeFilter] = useState(initialPropertyType);
  const [localityFilter, setLocalityFilter] = useState(initialLocality);
  const [tenantFilter, setTenantFilter] = useState(initialTenant);
  const [coupleFriendlyFilter, setCoupleFriendlyFilter] = useState(initialCoupleFriendly);
  const [minPrice, setMinPrice] = useState(initialMinPrice || "");
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice || "");

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch({
      searchTerm,
      cityFilter,
      bhkFilter,
      propertyTypeFilter,
      localityFilter,
      tenantFilter,
      coupleFriendlyFilter,
      priceRange: [minPrice, maxPrice]
    });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setCityFilter("");
    setBhkFilter("");
    setPropertyTypeFilter("");
    setLocalityFilter("");
    setTenantFilter("");
    setCoupleFriendlyFilter("");
    setMinPrice("");
    setMaxPrice("");
    onSearch({
      searchTerm: "",
      cityFilter: "",
      bhkFilter: "",
      propertyTypeFilter: "",
      localityFilter: "",
      tenantFilter: "",
      coupleFriendlyFilter: "",
      priceRange: ["", ""]
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <form onSubmit={handleSearch}>
        {/* Main Search Bar */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-500" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-10 py-3 text-base border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500 text-purple-800 outline-none"
            placeholder="Search properties, locations, amenities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setSearchTerm("")}
            >
              <FiX className="text-gray-500 hover:text-gray-700" />
            </button>
          )}
        </div>

        {/* Expandable Advanced Filters */}
        <div className={`transition-all duration-300 overflow-hidden ${isExpanded ? "max-h-96" : "max-h-0"}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* City Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input
                type="text"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500 text-purple-800 outline-none"
                placeholder="Enter city"
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
              />
            </div>

            {/* Locality Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Popular Localities</label>
              <input
                type="text"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500 text-purple-800 outline-none"
                placeholder="Enter locality"
                value={localityFilter}
                onChange={(e) => setLocalityFilter(e.target.value)}
              />
            </div>

            {/* BHK Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">BHK Type</label>
              <select
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500 text-purple-800 outline-none"
                value={bhkFilter}
                onChange={(e) => setBhkFilter(e.target.value)}
              >
                <option value="">Any BHK</option>
                <option value="1RK">1RK</option>
                <option value="1BHK">1BHK</option>
                <option value="2BHK">2BHK</option>
                <option value="3BHK">3BHK</option>
                <option value="4+BHK">4+BHK</option>
              </select>
            </div>

            {/* Property Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
              <select
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500 text-purple-800 outline-none"
                value={propertyTypeFilter}
                onChange={(e) => setPropertyTypeFilter(e.target.value)}
              >
                <option value="">Any Type</option>
                <option value="Apartment">Apartment</option>
                <option value="Independent Floor">Independent Floor</option>
                <option value="Independent House">Independent House</option>
                <option value="Farm House">Farm House</option>
              </select>
            </div>

            {/* Tenant Preference Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tenant Preference</label>
              <select
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500 text-purple-800 outline-none"
                value={tenantFilter}
                onChange={(e) => setTenantFilter(e.target.value)}
              >
                <option value="">Any Tenant</option>
                <option value="Couple Friendly">Couple Friendly</option>
                <option value="Family">Family</option>
                <option value="Student">Student</option>
                <option value="Working professional">Working Professional</option>
                <option value="Single">Single</option>
              </select>
            </div>

            {/* Couple Friendly Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Couple Friendly</label>
              <select
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500 text-purple-800 outline-none"
                value={coupleFriendlyFilter}
                onChange={(e) => setCoupleFriendlyFilter(e.target.value)}
              >
                <option value="">Any</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            {/* Price Range */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Price Range (₹)</label>
              <div className="flex items-center space-x-4">
                <input
                  type="number"
                  className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500 text-purple-800 outline-none"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
                <span className="text-gray-400">to</span>
                <input
                  type="number"
                  className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500 text-purple-800 outline-none"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  min="0"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <button
            type="button"
            className="text-purple-800 text-sm font-medium hover:text-purple-600"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Hide Filters' : 'Advanced Filters'}
          </button>
          
          <div className="flex space-x-2">
            <button
              type="button"
              className="px-4 py-2 text-sm text-purple-800 border border-purple-800 rounded-lg hover:bg-purple-50"
              onClick={clearFilters}
            >
              Clear
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm text-white bg-purple-800 rounded-lg hover:bg-purple-700"
            >
              Search
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Properties;