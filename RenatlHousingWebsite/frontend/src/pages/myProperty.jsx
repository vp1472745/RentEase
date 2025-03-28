import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FiHeart,
  FiShare2,
  FiMapPin,
  FiChevronLeft,
  FiChevronRight,
  FiPhone,
  FiHome,
  FiLayers,
  FiCalendar,
  FiDollarSign,
  FiUser,
  FiCheckCircle
} from "react-icons/fi";

const MyProperties = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAllFacilities, setShowAllFacilities] = useState(false);

  // Validate ID format
  const isValidId = (id) => {
    return id && id !== 'undefined' && /^[0-9a-fA-F]{24}$/.test(id);
  };

  // Fetch property details with enhanced error handling
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        setError(null);

        // Validate ID before making the request
        if (!isValidId(id)) {
          throw new Error("Invalid property ID format");
        }

        const res = await axios.get(`/api/properties/${id}`);
        
        if (!res.data) {
          throw new Error("Property not found");
        }

        setProperty(res.data);
      } catch (err) {
        let errorMessage = "Failed to load property details";
        
        if (err.response) {
          // Handle backend errors
          errorMessage = err.response.data?.message || errorMessage;
        } else if (err.request) {
          // No response received
          errorMessage = "No response from server";
        } else {
          // Other errors
          errorMessage = err.message || errorMessage;
        }

        setError(errorMessage);
        console.error("Property fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  // Early return for invalid ID
  if (!isValidId(id)) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center p-6 bg-red-50 rounded-lg max-w-md">
          <p className="text-red-600 font-medium">Invalid Property ID</p>
          <button 
            onClick={() => navigate('/properties')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Browse Properties
          </button>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading property details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center p-6 bg-red-50 rounded-lg max-w-md">
          <p className="text-red-600 font-medium">{error}</p>
          <button 
            onClick={() => navigate('/properties')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Browse Properties
          </button>
        </div>
      </div>
    );
  }

  // Property not found state
  if (!property) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <p className="text-gray-600">Property not found</p>
          <button 
            onClick={() => navigate('/properties')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Browse Properties
          </button>
        </div>
      </div>
    );
  }

  // Helper functions
  const shareProperty = () => {
    const message = `Check out this property: ${property.title}\n\n` +
      `📍 Location: ${property.city}, ${property.state}\n` +
      `💰 Rent: ₹${property.monthlyRent}/month\n` +
      `🔐 Deposit: ₹${property.securityDeposit}\n` +
      `🏠 ${property.bhkType} ${property.propertyType}\n` +
      `📏 Area: ${property.area} sq.ft\n` +
      `More details: ${window.location.href}`;
    
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };

  const contactOwner = () => {
    if (property.ownerphone) {
      window.open(`tel:${property.ownerphone}`);
    } else {
      alert("Owner phone number not available");
    }
  };

  const goToPrevImage = () => {
    setCurrentImageIndex(prev => 
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  const goToNextImage = () => {
    setCurrentImageIndex(prev => 
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  // Main render
  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <FiChevronLeft className="mr-1" /> Back to Properties
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Property Title and Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {property.title}
            </h1>
            <div className="flex items-center text-gray-600 mt-2">
              <FiMapPin className="mr-1" />
              <span>{property.address}, {property.city}, {property.state}</span>
            </div>
          </div>
          <div className="flex space-x-3 mt-4 md:mt-0">
            <button 
              onClick={() => setIsFavorite(!isFavorite)}
              className={`p-2 rounded-full ${isFavorite ? 'text-red-500 bg-red-50' : 'text-gray-500 bg-gray-100'} hover:bg-gray-200`}
            >
              <FiHeart className={isFavorite ? "fill-current" : ""} />
            </button>
            <button 
              onClick={shareProperty}
              className="p-2 rounded-full text-gray-500 bg-gray-100 hover:bg-gray-200"
            >
              <FiShare2 />
            </button>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="mb-8 bg-white rounded-xl shadow-md overflow-hidden">
          <div className="relative h-64 md:h-96 w-full">
            <img
              src={property.images[currentImageIndex]}
              alt={property.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = '/placeholder-property.jpg'; // Fallback image
              }}
            />
            {property.images.length > 1 && (
              <>
                <button 
                  onClick={goToPrevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                >
                  <FiChevronLeft size={24} />
                </button>
                <button 
                  onClick={goToNextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                >
                  <FiChevronRight size={24} />
                </button>
                <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                  <div className="bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} / {property.images.length}
                  </div>
                </div>
              </>
            )}
          </div>
          
          {/* Thumbnails */}
          {property.images.length > 1 && (
            <div className="p-4 flex space-x-2 overflow-x-auto">
              {property.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Thumbnail ${index}`}
                  className={`h-16 w-16 object-cover rounded cursor-pointer ${currentImageIndex === index ? 'ring-2 ring-blue-500' : 'opacity-70'}`}
                  onClick={() => setCurrentImageIndex(index)}
                  onError={(e) => {
                    e.target.src = '/placeholder-thumbnail.jpg'; // Fallback thumbnail
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Property Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2">
            {/* Key Features */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Key Features</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <FiHome className="text-blue-600 mr-2" />
                  <div>
                    <p className="text-gray-500 text-sm">Type</p>
                    <p className="font-medium">{property.propertyType?.join(", ") || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FiLayers className="text-blue-600 mr-2" />
                  <div>
                    <p className="text-gray-500 text-sm">BHK</p>
                    <p className="font-medium">{property.bhkType?.join(", ") || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FiDollarSign className="text-blue-600 mr-2" />
                  <div>
                    <p className="text-gray-500 text-sm">Rent</p>
                    <p className="font-medium">₹{property.monthlyRent || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FiDollarSign className="text-blue-600 mr-2" />
                  <div>
                    <p className="text-gray-500 text-sm">Deposit</p>
                    <p className="font-medium">₹{property.securityDeposit || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FiLayers className="text-blue-600 mr-2" />
                  <div>
                    <p className="text-gray-500 text-sm">Area</p>
                    <p className="font-medium">{property.area ? `${property.area} sq.ft` : "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FiCalendar className="text-blue-600 mr-2" />
                  <div>
                    <p className="text-gray-500 text-sm">Available</p>
                    <p className="font-medium">
                      {property.availableFrom ? new Date(property.availableFrom).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 whitespace-pre-line">
                {property.description || "No description available"}
              </p>
            </div>

            {/* Amenities */}
            {property.facilities?.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {property.facilities.slice(0, showAllFacilities ? property.facilities.length : 6).map((facility, index) => (
                    <div key={index} className="flex items-center">
                      <FiCheckCircle className="text-green-500 mr-2" />
                      <span className="capitalize">{facility}</span>
                    </div>
                  ))}
                </div>
                {property.facilities.length > 6 && (
                  <button
                    onClick={() => setShowAllFacilities(!showAllFacilities)}
                    className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    {showAllFacilities ? 'Show Less' : `Show All (${property.facilities.length})`}
                  </button>
                )}
              </div>
            )}

            {/* Property Rules */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Property Rules</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <span className={`inline-block w-4 h-4 rounded-full mr-2 ${property.petsAllowed ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  <span>Pets {property.petsAllowed ? 'Allowed' : 'Not Allowed'}</span>
                </div>
                <div className="flex items-center">
                  <span className={`inline-block w-4 h-4 rounded-full mr-2 ${property.smokingAllowed ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  <span>Smoking {property.smokingAllowed ? 'Allowed' : 'Not Allowed'}</span>
                </div>
                <div className="flex items-center">
                  <span className={`inline-block w-4 h-4 rounded-full mr-2 ${property.nonVegAllowed ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  <span>Non-Veg {property.nonVegAllowed ? 'Allowed' : 'Not Allowed'}</span>
                </div>
                <div className="flex items-center">
                  <span className={`inline-block w-4 h-4 rounded-full mr-2 ${property.bachelorAllowed ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  <span>Bachelors {property.bachelorAllowed ? 'Allowed' : 'Not Allowed'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Owner Info */}
          <div>
            {/* Owner Card */}
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Owner</h2>
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 text-blue-800 rounded-full w-12 h-12 flex items-center justify-center mr-3">
                  <FiUser size={20} />
                </div>
                <div>
                  <p className="font-medium">{property.ownerName || "Not specified"}</p>
                  <p className="text-gray-500 text-sm">Property Owner</p>
                </div>
              </div>
              <div className="space-y-3 mb-6">
                <div className="flex items-center">
                  <span className="text-gray-500 mr-2">Phone:</span>
                  <span className="font-medium">{property.ownerphone || "Not provided"}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-500 mr-2">Gender:</span>
                  <span className="font-medium">{property.Gender || 'Any'}</span>
                </div>
              </div>
              <button
                onClick={contactOwner}
                disabled={!property.ownerphone}
                className={`w-full py-3 rounded-lg flex items-center justify-center ${property.ownerphone ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
              >
                <FiPhone className="mr-2" /> 
                {property.ownerphone ? "Call Now" : "Phone Not Available"}
              </button>
            </div>

            {/* Additional Details */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Additional Details</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-500 text-sm">Floor</p>
                  <p className="font-medium">
                    {property.floorNumber ? `Floor ${property.floorNumber}` : 'Ground Floor'} of {property.totalFloors || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Property Age</p>
                  <p className="font-medium">
                    {property.ageOfProperty ? `${property.ageOfProperty} years` : 'New Construction'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Facing</p>
                  <p className="font-medium">
                    {property.facingDirection || 'Not specified'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Parking</p>
                  <p className="font-medium">
                    {property.parking || 'Not specified'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Water Supply</p>
                  <p className="font-medium">
                    {property.waterSupply || 'Not specified'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Electricity Backup</p>
                  <p className="font-medium">
                    {property.electricityBackup || 'Not specified'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProperties;