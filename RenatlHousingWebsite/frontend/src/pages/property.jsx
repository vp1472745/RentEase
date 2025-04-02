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
              images: property.images.map(img => 
                typeof img === 'string' ? { url: img, type: 'image' } : img
              ),
              videos: property.videos || [] // Ensure videos array exists
            }))
          : [];
          
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
    const mediaItems = [...currentProperty.images, ...currentProperty.videos];
    setCurrentImageIndex((prev) =>
      prev === 0 ? mediaItems.length - 1 : prev - 1
    );
  };

  const goToNextImage = () => {
    const mediaItems = [...currentProperty.images, ...currentProperty.videos];
    setCurrentImageIndex((prev) =>
      prev === mediaItems.length - 1 ? 0 : prev + 1
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

  // Combine images and videos for display
  const getMediaItems = (property) => {
    return [
      ...(property.images || []),
      ...(property.videos || []).map(video => ({
        url: video,
        type: 'video'
      }))
    ];
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
              const mediaItems = getMediaItems(property);
              return (
                <div
                  key={property._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Property Image/Video */}
                    <div className="relative md:w-2/5">
                      {mediaItems[0]?.type === 'video' ? (
                        <video
                          src={mediaItems[0].url}
                          className="w-full h-48 md:h-full object-cover cursor-pointer"
                          onClick={() => openGallery(property, 0)}
                          controls
                        />
                      ) : (
                        <img
                          src={mediaItems[0]?.url}
                          alt={property.title}
                          className="w-full h-48 md:h-full object-cover cursor-pointer"
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
                          onClick={() => navigate(`/property/${property._id}`)}
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

      {/* Media Gallery Modal */}
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
                {currentImageIndex + 1} of {[...currentProperty.images, ...currentProperty.videos].length}
              </p>
            </div>
            
            <div className="relative w-full h-full flex items-center justify-center">
              <button
                onClick={goToPrevImage}
                className="absolute left-2 md:left-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 z-10"
              >
                <FiChevronLeft size={24} />
              </button>

              {[...currentProperty.images, ...currentProperty.videos].map((item, index) => {
                const isVideo = index >= currentProperty.images.length;
                const url = isVideo ? currentProperty.videos[index - currentProperty.images.length] : item.url;
                
                return (
                  <div 
                    key={index}
                    className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                      index === currentImageIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                  >
                    {isVideo ? (
                      <video
                        src={url}
                        className="max-w-full max-h-full object-contain rounded-lg"
                        controls
                        autoPlay={index === currentImageIndex}
                      />
                    ) : (
                      <img
                        src={url}
                        alt={`Property media ${index + 1}`}
                        className="max-w-full max-h-full object-contain rounded-lg"
                      />
                    )}
                  </div>
                );
              })}

              <button
                onClick={goToNextImage}
                className="absolute right-2 md:right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 z-10"
              >
                <FiChevronRight size={24} />
              </button>
            </div>
          </div>

          {/* Thumbnail navigation */}
          <div className="flex gap-2 overflow-x-auto max-w-full px-4 py-2">
            {[...currentProperty.images, ...currentProperty.videos].map((item, index) => {
              const isVideo = index >= currentProperty.images.length;
              const url = isVideo ? currentProperty.videos[index - currentProperty.images.length] : item.url;
              
              return (
                <div key={index} className="flex flex-col items-center">
                  {isVideo ? (
                    <video
                      src={url}
                      className={`w-12 h-12 object-cover rounded cursor-pointer ${
                        currentImageIndex === index
                          ? "ring-2 ring-blue-500"
                          : "opacity-70"
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ) : (
                    <img
                      src={url}
                      alt={`Thumbnail ${index + 1}`}
                      className={`w-12 h-12 object-cover rounded cursor-pointer ${
                        currentImageIndex === index
                          ? "ring-2 ring-blue-500"
                          : "opacity-70"
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  )}
                  <span className="text-white text-xs mt-1">
                    {isVideo ? "Video" : "Image"}
                  </span>
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