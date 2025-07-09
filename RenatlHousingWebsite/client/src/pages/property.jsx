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
  FiMapPin,
  FiHome,
  FiLayers,
  FiUsers,
  FiDollarSign,
  FiCalendar,
  FiStar,
  FiEye,
  FiArrowRight
} from "react-icons/fi";
import { FaBed, FaBath, FaRulerCombined, FaWhatsapp } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

function Properties() {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentProperty, setCurrentProperty] = useState(null);
  const [favorites, setFavorites] = useState({});
  const [seenProperties, setSeenProperties] = useState([]);
  const [showSeenProperties, setShowSeenProperties] = useState(false);
  const [error, setError] = useState(null);
  const [showSignupPopup, setShowSignupPopup] = useState(false);

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

  const navigate = useNavigate();
  const location = useLocation();

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
    setBhkFilter(searchParams.get("bhk") || "");
    setTenantFilter(searchParams.get("tenant") || "");
    setCoupleFriendlyFilter(searchParams.get("coupleFriendly") || "");

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

        const hasSearchParams = Array.from(searchParams.keys()).some(key => 
            key !== "tab" && searchParams.get(key) !== "" && searchParams.get(key) !== "0"
        );

        let endpoint = '/api/properties/';
        let requestParams = {};

        if (hasSearchParams) {
          endpoint = '/api/properties/search';
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
          };
        } else {
          requestParams = {
            city: searchParams.get("city") || "",
            address: searchParams.get("locality") || "",
            propertyType: searchParams.get("category") || "",
            popularLocality: searchParams.get("popularLocality") || "",
          };
        }

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

        setProperties(propertiesData);

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
          // Handle 404 (no properties found) gracefully
          if (error.response.status === 404) {
            console.log("No properties found for the given filters");
            setProperties([]);
            setFilteredProperties([]);
            // Don't show error toast for no results - this is expected behavior
            return;
          }
          errorMessage = error.response.data.message || errorMessage;
        } else if (error.request) {
          errorMessage = "Server not responding. Please try again later.";
        } else {
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
  ]);

  const applyFilters = () => {
    let filtered = Array.isArray(properties) ? [...properties] : [];

    if (searchTerm.trim() !== "") {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((property) => {
        return (
          property.title?.toLowerCase().includes(searchLower) ||
          property.description?.toLowerCase().includes(searchLower)
        );
      });
    }

    if (cityFilter) {
      filtered = filtered.filter((property) =>
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
      filtered = filtered.filter((property) =>
        (property.popularLocality &&
          property.popularLocality.toLowerCase().includes(localityFilter.toLowerCase())) ||
        (property.address &&
          property.address.toLowerCase().includes(localityFilter.toLowerCase())) ||
        (property.city &&
          property.city.toLowerCase().includes(localityFilter.toLowerCase()))
      );
    }

    if (tenantFilter) {
      filtered = filtered.filter((property) => {
        if (!property.Gender) return false;
        const genderValues = Array.isArray(property.Gender) 
          ? property.Gender 
          : [property.Gender];
        return genderValues.some(gender => 
          gender.toLowerCase().includes(tenantFilter.toLowerCase())
        );
      });
    }

    if (coupleFriendlyFilter) {
      filtered = filtered.filter(
        (property) =>
          String(property.coupleFriendly || "").toLowerCase() === 
          coupleFriendlyFilter.toLowerCase()
      );
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
      return true;
    });

    setFilteredProperties(filtered);
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
      const token = localStorage.getItem("token");
      if (token) {
        await axios.post(
          `/api/properties/${propertyId}/view`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

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
        window.dispatchEvent(
          new CustomEvent("seenPropertyAdded", {
            detail: { count: updatedSeenProperties.length },
          })
        );
      }

      navigate(`/property/${propertyId}`);
    } catch (error) {
      console.error("Error recording view:", error);
      navigate(`/property/${propertyId}`);
    }
  };

  const toggleFavorite = async (propertyId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/signup');
        return;
      }

      const isCurrentlySaved = favorites[propertyId];
      
      if (isCurrentlySaved) {
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
        try {
          const response = await axios.post(`/api/properties/save/${propertyId}`, {}, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          setFavorites((prev) => ({
            ...prev,
            [propertyId]: true,
          }));
          
          if (response.data.alreadySaved) {
            toast.info('Property is already saved');
          } else {
            toast.success('Property saved successfully');
          }
        } catch (saveError) {
          if (saveError.response?.status === 400 && saveError.response?.data?.message === "Property already saved") {
            setFavorites((prev) => ({
              ...prev,
              [propertyId]: true,
            }));
            toast.info('Property is already saved');
          } else {
            throw saveError;
          }
        }
      }

      window.dispatchEvent(new Event('savedPropertyUpdated'));
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
      toast.error("Owner phone number not available");
      return;
    }
    const userRole = localStorage.getItem('role');
    if (userRole === 'tenant') {
      window.open(`tel:${phoneNumber}`);
    } else {
      setShowSignupPopup(true);
    }
  };

  const getMediaUrl = (mediaItem) => {
    if (!mediaItem) return null;
    if (typeof mediaItem === 'string') return mediaItem;
    if (mediaItem.url) return mediaItem.url;
    return null;
  };

  const isVideo = (mediaItem) => {
    if (!mediaItem) return false;
    if (typeof mediaItem === 'object' && mediaItem.type) {
      return mediaItem.type.toLowerCase() === 'video';
    }
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
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Header */}
      <div className="bg-slate-800 w-full h-19 shadow-md flex items-center justify-center">
      </div>

      {/* Main Content Container */}
      <div className="container mx-auto px-4 py-8">
        {/* Search Box Section */}
        {!showSeenProperties && (
          <div className="mb-8">
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
          </div>
        )}

        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {showSeenProperties ? "Recently Viewed" : "Available Properties"}
            <span className="ml-2 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
              {filteredProperties.length}
            </span>
          </h2>
          {filteredProperties.length > 0 && (
            <div className="flex items-center text-sm text-gray-500">
              <FiFilter className="mr-2" />
              <span>Sorted by: Newest</span>
            </div>
          )}
        </div>

        {/* Property Listings */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600 mb-4"></div>
              <p className="text-gray-600">Loading properties...</p>
            </div>
          </div>
        ) : filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
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
          <div className="flex flex-col items-center justify-center h-96 bg-white rounded-xl shadow-sm p-6">
            <FiHome className="text-5xl text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              {searchTerm ? "No matching properties found" : "No properties available"}
            </h3>
            <p className="text-gray-500 text-center max-w-md mb-4">
              {searchTerm
                ? "Try adjusting your search filters or search for a different location"
                : "Check back later or try a different location"}
            </p>
            <button 
              onClick={() => setShowFilters(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <FiFilter className="inline mr-2" />
              Adjust Filters
            </button>
          </div>
        )}
      </div>

      {/* Gallery Modal */}
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

      {/* Signup Popup */}
      {showSignupPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-lg font-bold mb-4 text-purple-800">Sign Up Required</h2>
            <p className="mb-6">Please sign up from <span className="font-semibold text-purple-700">'Rent a Property'</span> before calling the owner.</p>
            <button
              onClick={() => {
                setShowSignupPopup(false);
                navigate('/signup');
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Enhanced Property Card Component
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
  const firstMedia = property.media?.[0] || property.images?.[0];
  const mediaUrl = getMediaUrl(firstMedia);
  const isVideoMedia = isVideo(firstMedia);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100">
      {/* Media Section with Badges */}
      <div className="relative h-56 w-full">
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
        
        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(property._id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full shadow-md ${
            favorites[property._id] 
              ? "bg-red-500 text-white" 
              : "bg-white text-gray-400 hover:text-red-500"
          } transition-colors`}
        >
          <FiHeart size={18} fill={favorites[property._id] ? "currentColor" : "none"} />
        </button>
        
        {/* Price Badge */}
        <div className="absolute bottom-3 left-3 bg-purple-600 text-white px-3 py-1 rounded-lg text-sm font-semibold shadow-md">
          ₹{property.monthlyRent}/mo
        </div>
      </div>

      {/* Details Section */}
      <div className="p-5">
        {/* Title and Location */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">{property.title}</h3>
          <div className="flex items-center text-gray-600 text-sm">
            <FiMapPin className="mr-1 text-purple-600" size={14} />
            <span className="truncate">{property.address}, {property.city}</span>
          </div>
        </div>
        
        {/* Key Features Grid */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg border border-gray-100">
            <FaBed className="text-purple-600 mb-1" size={16} />
            <span className="text-xs font-medium text-gray-700">{property.bhkType || "N/A"}</span>
            <span className="text-xs text-gray-500">BHK</span>
          </div>
      
          <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg border border-gray-100">
            <FaRulerCombined className="text-purple-600 mb-1" size={16} />
            <span className="text-xs font-medium text-gray-700">{property.area || "N/A"}</span>
            <span className="text-xs text-gray-500">sq.ft</span>
          </div>
        </div>
        
        {/* Divider */}
        <div className="border-t border-gray-100 my-3"></div>
        
        {/* Additional Info */}
        <div className="grid grid-cols-2 gap-3 text-sm mb-5">
          <div className="flex items-center text-gray-600">
            <FiLayers className="mr-2 text-purple-600" size={14} />
            <span className="truncate">{property.propertyType || "N/A"}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <FiUsers className="mr-2 text-purple-600" size={14} />
            <span className="truncate">
              {Array.isArray(property.Gender) 
                ? property.Gender.join(", ") 
                : property.Gender || "Any"}
            </span>
          </div>
          <div className="flex items-center text-gray-600">
            <FiDollarSign className="mr-2 text-purple-600" size={14} />
            <span className="truncate">₹{property.securityDeposit || "N/A"}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <FiCalendar className="mr-2 text-purple-600" size={14} />
            <span className="truncate">
              {new Date(property.availableFrom).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-between space-x-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              shareOnWhatsApp(property);
            }}
            className="flex-1 flex items-center justify-center p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors border border-green-100"
            title="Share on WhatsApp"
          >
            <FaWhatsapp size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              contactOwner(property);
            }}
            className="flex-1 flex items-center justify-center p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors border border-blue-100"
            title="Contact Owner"
          >
            <FiPhone size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleViewDetails(property._id);
            }}
            className="flex-1 flex items-center justify-center p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <span className="text-sm">View</span>
            <FiArrowRight className="ml-2" size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

// Enhanced Gallery Modal Component
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
    <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-4 bg-black bg-opacity-50">
        <h3 className="text-white text-lg font-medium truncate max-w-[70%]">
          {currentProperty.title}
        </h3>
        <button
          onClick={closeGallery}
          className="text-white hover:text-gray-300 transition-colors"
        >
          <IoMdClose size={28} />
        </button>
      </div>

      {/* Main Media Display */}
      <div className="relative w-full max-w-5xl h-[70vh] flex items-center justify-center mt-12 mb-4">
        <button
          onClick={goToPrevImage}
          className="absolute left-4 z-10 p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
        >
          <FiChevronLeft size={24} />
        </button>

        {isVideo(currentProperty.media[currentImageIndex]) ? (
          <div className="w-full h-full flex items-center justify-center">
            <video
              className="max-w-full max-h-full rounded-lg shadow-xl"
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
            className="max-w-full max-h-full object-contain rounded-lg shadow-xl"
            alt={`Property media ${currentImageIndex + 1}`}
          />
        )}

        <button
          onClick={goToNextImage}
          className="absolute right-4 z-10 p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
        >
          <FiChevronRight size={24} />
        </button>
      </div>

      {/* Counter */}
      <div className="text-white text-sm mb-4 bg-black/50 px-3 py-1 rounded-full">
        <span className="font-medium">{currentImageIndex + 1}</span>
        <span className="mx-1">/</span>
        <span>{currentProperty.media.length}</span>
      </div>

      {/* Thumbnail Navigation */}
      <div className="flex gap-2 overflow-x-auto max-w-full px-4 py-2">
        {currentProperty.media.map((item, index) => {
          const mediaUrl = getMediaUrl(item);
          const isVideoItem = isVideo(item);

          return (
            <div
              key={index}
              className={`flex-shrink-0 cursor-pointer transition-all duration-200 ${
                currentImageIndex === index 
                  ? "ring-2 ring-purple-500 rounded transform scale-105" 
                  : "opacity-70 hover:opacity-100"
              }`}
              onClick={() => setCurrentImageIndex(index)}
            >
              {isVideoItem ? (
                <div className="relative w-16 h-16 rounded overflow-hidden">
                  <video
                    className="w-full h-full object-cover"
                    playsInline
                    muted
                    preload="metadata"
                  >
                    <source src={mediaUrl} type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <svg
                      className="w-4 h-4 text-white"
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
                  className="w-16 h-16 object-cover rounded"
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

// Enhanced PropertySearchBox Component
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
    <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-100">
      <form onSubmit={handleSearch}>
        {/* Main Search Bar */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-10 py-3 text-base border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-800 outline-none transition-all"
            placeholder="Search properties, locations, amenities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-4 flex items-center"
              onClick={() => setSearchTerm("")}
            >
              <IoMdClose className="text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>

        {/* Expandable Advanced Filters */}
        <div className={`transition-all duration-300 overflow-hidden ${isExpanded ? "max-h-96" : "max-h-0"}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* City Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FiMapPin className="mr-2 text-purple-600" />
                City
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-800 outline-none transition-all"
                placeholder="Enter city"
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
              />
            </div>

            {/* Locality Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FiHome className="mr-2 text-purple-600" />
                Popular Localities
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-800 outline-none transition-all"
                placeholder="Enter locality"
                value={localityFilter}
                onChange={(e) => setLocalityFilter(e.target.value)}
              />
            </div>

            {/* BHK Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FaBed className="mr-2 text-purple-600" />
                BHK Type
              </label>
              <select
                className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-800 outline-none transition-all"
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
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FiLayers className="mr-2 text-purple-600" />
                Property Type
              </label>
              <select
                className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-800 outline-none transition-all"
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
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FiUsers className="mr-2 text-purple-600" />
                Tenant Preference
              </label>
              <select
                className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-800 outline-none transition-all"
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
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FiStar className="mr-2 text-purple-600" />
                Couple Friendly
              </label>
          
            </div>

            {/* Price Range */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FiDollarSign className="mr-2 text-purple-600" />
                Price Range (₹)
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="number"
                  className="flex-1 px-4 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-800 outline-none transition-all"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
                <span className="text-gray-400">to</span>
                <input
                  type="number"
                  className="flex-1 px-4 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-800 outline-none transition-all"
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
            className="flex items-center text-purple-700 text-sm font-medium hover:text-purple-800 transition-colors"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <FiFilter className="mr-2" />
            {isExpanded ? 'Hide Filters' : 'Advanced Filters'}
          </button>
          
          <div className="flex space-x-3">
            <button
              type="button"
              className="px-5 py-2 text-sm font-medium text-purple-700 border border-purple-700 rounded-lg hover:bg-purple-50 transition-colors"
              onClick={clearFilters}
            >
              Clear All
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-medium text-white bg-purple-700 rounded-lg hover:bg-purple-800 transition-colors flex items-center"
            >
              <FiSearch className="mr-2" />
              Search
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Properties;