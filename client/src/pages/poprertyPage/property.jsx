import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../../lib/axios.js";
import { FaRupeeSign, FaCat } from "react-icons/fa";
import loadingC from '../../assets/loadingCat.gif'
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
  FiArrowRight,
  FiUser
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
      const userRole = localStorage.getItem('role');
      // If not logged in or not tenant/owner, redirect to signup
      if (!token || !(userRole === 'tenant' || userRole === 'owner')) {
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
          // If session expired (401), redirect to signup
          if (saveError.response?.status === 401) {
            navigate('/signup');
            return;
          }
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
      // If session expired (401), redirect to signup
      if (error.response?.status === 401) {
        navigate('/signup');
        return;
      }
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
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');
    if (!token) {
      setShowSignupPopup(true);
      return;
    }
    if (userRole === 'tenant' || userRole === 'owner') {
      window.open(`tel:${phoneNumber}`);
    } else {
      toast.error("Only tenants or owners can contact property owners.");
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
    <div className="min-h-screen bg-slate-50">
      {/* Enhanced Header with gradient */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 w-full h-17 shadow-md"></div>

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
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-slate-800">
            {showSeenProperties ? "Recently Viewed" : "Available Properties"}
            <span className="ml-2 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
              {filteredProperties.length} properties
            </span>
          </h2>
       
        </div>

        {/* Property Listings */}
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="relative mb-4">
             
             <img src={loadingC} alt="" />
            </div>
            <p className="text-slate-600 font-semibold text-lg flex items-center gap-2">
              Searching properties...
            </p>
            <p className="text-slate-400 mt-2 text-sm">
              Please wait while we fetch the latest listings for you.
            </p>
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
          <div className="flex flex-col items-center justify-center h-96 bg-white rounded-xl shadow-sm p-6   border-slate-200">
            <FiHome className="text-5xl text-slate-300 mb-4" />
            <h3 className="text-xl font-medium text-slate-700 mb-2">
              {searchTerm ? "No matching properties found" : "No properties available"}
            </h3>
            <p className="text-slate-500 text-center max-w-md mb-4">
              {searchTerm
                ? "Try adjusting your search filters or search for a different location"
                : "Check back later or try a different location"}
            </p>
            <button 
              onClick={() => setShowFilters(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
            >
              <FiFilter className="mr-2" />
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
          <div className="bg-white p-6 rounded-xl shadow-xl text-center max-w-sm">
            <h2 className="text-xl font-bold mb-4 text-indigo-700">Sign Up Required</h2>
            <p className="mb-6 text-slate-600">Please sign up as a tenant to contact property owners</p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowSignupPopup(false)}
                className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowSignupPopup(false);
                  navigate('/signup');
                }}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Enhanced Property Card Component with new color scheme
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
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col">
      {/* Media Section */}
      <div className="relative h-48 sm:h-56 w-full">
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
              ? "bg-rose-500 text-white" 
              : "bg-white text-slate-400 hover:text-rose-500"
          } transition-colors`}
          title={favorites[property._id] ? "Saved" : "Save"}
        >
          <FiHeart size={20} />
        </button>

        {/* Price Badge */}
        <div className="absolute bottom-3 left-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-1 rounded-lg text-base font-bold shadow-md">
          <FaRupeeSign className="inline mr-1" />{property.monthlyRent?.toLocaleString()}/mo
        </div>
      </div>

      {/* Main Details Section */}
      <div className="p-4 flex flex-col gap-3">
        {/* Title & Address */}
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-800 truncate mb-1">{property.title}</h3>
          <div className="flex items-center gap-2">
            <FiMapPin className="text-indigo-600 text-base" />
            <span className="text-xs sm:text-sm text-slate-700 font-medium break-words">{property.address}{property.city && `, ${property.city}`}{property.state && `, ${property.state}`}</span>
          </div>
        </div>

        {/* Info Badges */}
        <div className="flex flex-wrap gap-2">
          <span className="flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-xs font-semibold">
            <FiHome className="text-indigo-500" />
            {property.propertyType?.charAt(0).toUpperCase() + property.propertyType?.slice(1) || "Type"}
          </span>
          {property.roomSubcategory && (
            <span className="flex items-center gap-1 bg-purple-50 text-purple-700 px-2 py-1 rounded text-xs font-semibold">
              <FiLayers className="text-purple-500" />
              {property.roomSubcategory}
            </span>
          )}
          {property.apartmentSubcategory && (
            <span className="flex items-center gap-1 bg-purple-50 text-purple-700 px-2 py-1 rounded text-xs font-semibold">
              <FiLayers className="text-purple-500" />
              {property.apartmentSubcategory}
            </span>
          )}
          {property.pgSubcategory && (
            <span className="flex items-center gap-1 bg-indigo-50 text-indigo-700  px-2 py-1 rounded text-xs font-semibold">
              <FiLayers className="text-indigo
              -500" />
              {property.pgSubcategory}
            </span>
          )}
          {property.otherSubcategory && (
            <span className="flex items-center gap-1 bg-indigo-50 text-indigo-700  px-2 py-1 rounded text-xs font-semibold">
              <FiLayers className="text-purple-500" />
              {property.otherSubcategory}
            </span>
          )}
          <span className="flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-xs font-semibold">
            <FaRulerCombined className="text-indigo-500" />
            {property.area?.toLocaleString() || '0'} sq.ft
          </span>
          <span className="flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-xs font-semibold">
            <FaBed className="text-indigo-500" />
            {property.bhkType || "N/A"} BHK
          </span>
          <span className="flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-xs font-semibold">
            <FiStar className="text-indigo-500" />
            {property.furnishType?.join(', ') || 'Unfurnished'}
          </span>
        </div>

        {/* Owner & Date */}
        <div className="flex justify-between items-center text-xs text-slate-600">
          <span className="flex items-center gap-1">
            <FiCalendar className="text-indigo-500" />
            {property.availableFrom ? new Date(property.availableFrom).toLocaleDateString() : "N/A"}
          </span>
          <span className="flex items-center gap-1">
            <FiUser className="text-indigo-500" />
            <span className="font-semibold">Owner:</span>
            <span className="font-medium">{property.ownerName}</span>
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-row justify-between gap-2 mt-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              shareOnWhatsApp(property);
            }}
            className="flex-1 flex items-center justify-center p-2 bg-emerald-500 text-white font-bold rounded-lg hover:bg-emerald-600 transition-colors shadow text-xs sm:text-sm"
            title="Share on WhatsApp"
          >
            <FaWhatsapp size={16} className="mr-1" /> WhatsApp
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              contactOwner(property.ownerphone);
            }}
            className="flex-1 flex items-center justify-center p-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition-colors shadow text-xs sm:text-sm"
            title="Contact Owner"
          >
            <FiPhone size={16} className="mr-1" /> Call
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleViewDetails(property._id);
            }}
            className="flex-1 flex items-center justify-center p-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-colors shadow text-xs sm:text-sm"
          >
            <FiEye size={16} className="mr-1" /> View
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
    <div className="fixed inset-0 bg-slate-900 bg-opacity-95 z-50 flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-4 bg-slate-900 bg-opacity-80">
        <h3 className="text-white text-lg font-medium truncate max-w-[70%]">
          {currentProperty.title}
        </h3>
        <button
          onClick={closeGallery}
          className="text-white hover:text-slate-300 transition-colors"
        >
          <IoMdClose size={28} />
        </button>
      </div>

      {/* Main Media Display */}
      <div className="relative w-full max-w-5xl h-[70vh] flex items-center justify-center mt-12 mb-4">
        <button
          onClick={goToPrevImage}
          className="absolute left-4 z-10 p-3 bg-slate-800/80 text-white rounded-full hover:bg-slate-700/90 transition-colors"
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
          className="absolute right-4 z-10 p-3 bg-slate-800/80 text-white rounded-full hover:bg-slate-700/90 transition-colors"
        >
          <FiChevronRight size={24} />
        </button>
      </div>

      {/* Counter */}
      <div className="text-white text-sm mb-4 bg-slate-800/80 px-3 py-1 rounded-full">
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
                  ? "ring-2 ring-indigo-500 rounded transform scale-105" 
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

// Enhanced PropertySearchBox Component with new color scheme
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
    <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-slate-200">
      <form onSubmit={handleSearch}>
        {/* Main Search Bar */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FiSearch className="text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-10 py-3 text-base border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 outline-none transition-all
            sm:text-base text-sm
            "
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
              <IoMdClose className="text-slate-400 hover:text-slate-600" />
            </button>
          )}
        </div>

        {/* Expandable Advanced Filters */}
        <div className={`transition-all duration-300 overflow-hidden ${isExpanded ? "max-h-96" : "max-h-0"}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* City Filter */}
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 flex items-center">
                <FiMapPin className="mr-2 text-indigo-600" />
                City
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 outline-none transition-all"
                placeholder="Enter city"
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
              />
            </div>

            {/* Locality Filter */}
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 flex items-center">
                <FiHome className="mr-2 text-indigo-600" />
                Popular Localities
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 outline-none transition-all"
                placeholder="Enter locality"
                value={localityFilter}
                onChange={(e) => setLocalityFilter(e.target.value)}
              />
            </div>

            {/* BHK Filter */}
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 flex items-center">
                <FaBed className="mr-2 text-indigo-600" />
                BHK Type
              </label>
              <select
                className="w-full px-4 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 outline-none transition-all"
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
              <label className="text-sm font-medium text-slate-700 mb-2 flex items-center">
                <FiLayers className="mr-2 text-indigo-600" />
                Property Type
              </label>
              <select
                className="w-full px-4 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 outline-none transition-all"
                value={propertyTypeFilter}
                onChange={(e) => setPropertyTypeFilter(e.target.value)}
              >
                <option value="">Any Type</option>
                <option value="room">Room</option>
                <option value="apartment">Apartment</option>
                <option value="pg">PG</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Tenant Preference Filter */}
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 flex items-center">
                <FiUsers className="mr-2 text-indigo-600" />
                Tenant Preference
              </label>
              <select
                className="w-full px-4 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 outline-none transition-all"
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

            {/* Price Range */}
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-slate-700 mb-2 flex items-center">
                <FiDollarSign className="mr-2 text-indigo-600" />
                Price Range (₹)
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="number"
                  className="flex-1 px-4 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 outline-none transition-all"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
                <span className="text-slate-400">to</span>
                <input
                  type="number"
                  className="flex-1 px-4 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 outline-none transition-all"
                  placeholder="Max"
                  value={Number.isFinite(Number(maxPrice)) ? maxPrice : ''}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-5">
          <button
            type="button"
            className="flex items-center text-indigo-600 text-sm font-medium hover:text-indigo-700 transition-colors"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <FiFilter className="mr-2" />
            {isExpanded ? 'Hide Filters' : 'Advanced Filters'}
          </button>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              type="button"
              className="px-5 py-2 text-sm font-medium text-indigo-700 border border-indigo-700 rounded-lg hover:bg-indigo-50 transition-colors w-full sm:w-auto"
              onClick={clearFilters}
            >
              Clear All
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-colors flex items-center w-full sm:w-auto"
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