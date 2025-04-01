import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaGooglePlay, FaApple } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import {
  FiHeart,
  FiShare2,
  FiMapPin,
  FiChevronLeft,
  FiPhone,
  FiHome,
  FiLayers,
  FiCalendar,
  FiDollarSign,
  FiUser,
  FiTool,
  FiDroplet,
  FiZap,
  FiClock,
  FiCheck,
  FiStar,
  FiTrendingUp,
  FiCompass,
  FiX,
  FiChevronRight,
  FiChevronLeft as FiChevronLeftIcon
} from "react-icons/fi";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Viewdetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [favorites, setFavorites] = useState({});
  const [activeTab, setActiveTab] = useState('overview');
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour in seconds

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem('token');
        const config = token ? {
          headers: {
            Authorization: `Bearer ${token}`
          }
        } : {};
        
        const res = await axios.get(`http://localhost:5000/api/properties/${id}`, config);
        
        if (!res.data) {
          throw new Error('Property data not found');
        }
        
        setProperty(res.data);
      } catch (error) {
        console.error("Error fetching property:", error);
        setError(error.response?.data?.message || error.message || 'Failed to load property details');
        toast.error(error.response?.data?.message || 'Failed to load property details');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const toggleFavorite = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to add favorites');
        return navigate('/login');
      }
      
      const newFavoriteStatus = !favorites[id];
      setFavorites(prev => ({ ...prev, [id]: newFavoriteStatus }));
      
      await axios.post(
        `http://localhost:5000/api/properties/${id}/favorite`,
        { isFavorite: newFavoriteStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      toast.success(newFavoriteStatus ? 'Added to favorites' : 'Removed from favorites');
    } catch (error) {
      console.error("Error updating favorite:", error);
      toast.error(error.response?.data?.message || 'Failed to update favorite');
      setFavorites(prev => ({ ...prev, [id]: !prev[id] }));
    }
  };

  const shareOnWhatsApp = () => {
    if (!property) return;
    
    const message =
      `Check out this property: ${property.title}\n\n` +
      `📍 Location: ${property.address}, ${property.city}, ${property.state}\n` +
      `🏠 Type: ${property.propertyType.join(', ')} | ${property.bhkType.join(', ')}\n` +
      `📏 Area: ${property.area} sq.ft\n` +
      `💰 Price: ₹${property.monthlyRent}/month (Deposit: ₹${property.securityDeposit})\n` +
      `📅 Available from: ${new Date(property.availableFrom).toLocaleDateString()}\n` +
      `⏳ Minimum stay: ${property.rentalDurationMonths} months\n` +
      `🛠️ Maintenance: ₹${property.maintenanceCharges}/month\n` +
      `👤 Owner: ${property.ownerName} (${property.ownerphone})\n` +
      `More details: ${window.location.href}`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, "_blank");
  };

  const contactOwner = () => {
    if (!property?.ownerphone) {
      toast.error('Owner phone number not available');
      return;
    }
    window.open(`tel:${property.ownerphone}`);
  };

  const openImageModal = (index) => {
    setModalImageIndex(index);
    setIsImageModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
    document.body.style.overflow = 'auto';
  };

  const goToPrevImage = () => {
    setModalImageIndex(prev => 
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  const goToNextImage = () => {
    setModalImageIndex(prev => 
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isImageModalOpen) {
        if (e.key === 'Escape') {
          closeImageModal();
        } else if (e.key === 'ArrowLeft') {
          goToPrevImage();
        } else if (e.key === 'ArrowRight') {
          goToNextImage();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isImageModalOpen, modalImageIndex, property?.images]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Property</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md">
          <h2 className="text-xl font-semibold mb-2">Property Not Found</h2>
          <p className="text-gray-700 mb-4">The property you're looking for doesn't exist or may have been removed.</p>
          <button
            onClick={() => navigate('/properties')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Browse Properties
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className='bg-[#2a1035] h-16 w-full'></div>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Back button */}
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 mb-6 hover:text-blue-800 transition"
          >
            <FiChevronLeft className="mr-1" /> Back to Properties
          </button>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Property Images and Details */}
            <div className="lg:col-span-2">
              {/* Image Gallery with Slider */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6 border border-gray-200 relative">
                <div className="grid grid-cols-2 gap-1">
                  {/* Left Side - Main Image */}
                  <div className="col-span-1 relative">
                    <img
                      src={property.images?.[0]?.url || property.images?.[0] || 'https://via.placeholder.com/800x600?text=Image+Not+Available'}
                      alt={property.title || 'Property Image'}
                      className="w-full h-96 object-cover cursor-pointer"
                      onClick={() => openImageModal(0)}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/800x600?text=Image+Not+Available';
                      }}
                    />
                    
                    {/* Room Type Overlay */}
                    {property.images?.[0]?.type && (
                      <div className="absolute bottom-4 left-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm">
                        {property.images[0].type}
                      </div>
                    )}
                  </div>
                  
                  {/* Right Side - Secondary Images */}
                  <div className="col-span-1 grid grid-rows-2 gap-1">
                    {/* Top Right Image */}
                    <div className="relative">
                      <img
                        src={property.images?.[1]?.url || property.images?.[1] || 'https://via.placeholder.com/800x600?text=Image+Not+Available'}
                        alt={property.title || 'Property Image'}
                        className="w-full h-48 object-cover cursor-pointer"
                        onClick={() => openImageModal(1)}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/800x600?text=Image+Not+Available';
                        }}
                      />
                      
                      {/* Room Type Overlay */}
                      {property.images?.[1]?.type && (
                        <div className="absolute bottom-4 left-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm">
                          {property.images[1].type}
                        </div>
                      )}
                    </div>
                    
                    {/* Bottom Right Image */}
                    <div className="relative">
                      <img
                        src={property.images?.[2]?.url || property.images?.[2] || 'https://via.placeholder.com/800x600?text=Image+Not+Available'}
                        alt={property.title || 'Property Image'}
                        className="w-full h-48 object-cover cursor-pointer"
                        onClick={() => openImageModal(2)}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/800x600?text=Image+Not+Available';
                        }}
                      />
                      
                      {/* Room Type Overlay */}
                      {property.images?.[2]?.type && (
                        <div className="absolute bottom-4 left-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm">
                          {property.images[2].type}
                        </div>
                      )}
                      
                      {/* Image Count Overlay */}
                      {property.images?.length > 2 && (
                        <div className="absolute bottom-4 right-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm">
                          +{property.images.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Top Right Buttons */}
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button
                    onClick={shareOnWhatsApp}
                    className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition cursor-pointer flex items-center"
                  >
                    <FiShare2 className="text-gray-700" />
                    <span className="ml-1 text-xs">SHARE</span>
                  </button>
                  
                  <button
                    onClick={toggleFavorite}
                    className={`p-2 rounded-full shadow-md transition cursor-pointer flex items-center ${
                      favorites[id] 
                        ? 'bg-red-500 text-white' 
                        : 'bg-white text-gray-700'
                    }`}
                  >
                    <FiHeart className={`${favorites[id] ? 'fill-current' : ''}`} />
                    <span className="ml-1 text-xs">SAVE</span>
                  </button>
                </div>
              </div>

              {/* Property Header */}
              <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                  <div className="mb-4 md:mb-0">
                    <h1 className="text-2xl md:text-3xl font-bold text-purple-800 mb-2">
                      {property.title || 'Property Title'}
                    </h1>
                    <div className="flex items-center text-purple-800 font-semibold">
                      <FiMapPin className="mr-1 flex-shrink-0" />
                      <span className="truncate">{property.address || ''}, {property.city || ''}, {property.state || ''}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-purple-800">₹{property.monthlyRent?.toLocaleString() || '0'}</p>
                    <p className="text-sm text-purple-800 font-semibold">Added on {property.createdAt ? new Date(property.createdAt).toLocaleDateString() : 'N/A'}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="bg-purple-200 text-purple-800 font-semibold px-3 py-1 rounded-full text-sm">
                    {property.furnishType?.join(', ') || 'Furnishing not specified'}
                  </span>
                  <span className="bg-purple-200 text-purple-800 font-semibold px-3 py-1 rounded-full text-sm">
                    {property.area?.toLocaleString() || '0'} sq.ft
                  </span>
                  {property.bhkType?.map((bhk, index) => (
                    <span key={index} className="bg-purple-200 text-purple-800 font-semibold px-3 py-1 rounded-full text-sm">
                      {bhk}
                    </span>
                  ))}
                </div>

                {/* Tab Navigation */}
                <div className="border-b border-gray-200 mb-6 overflow-x-auto">
                  <div className="flex space-x-4 min-w-max">
                    <button
                      onClick={() => setActiveTab('overview')}
                      className={`px-4 py-2 font-medium text-sm focus:outline-none whitespace-nowrap ${
                        activeTab === 'overview'
                          ? 'border-b-2 border-purple-800 text-purple-800 font-bold'
                          : 'text-purple-800 font-bold'
                      }`}
                    >
                      <div className="flex items-center font-bold cursor-pointer">
                        <FiHome className="mr-2 font-bold" />
                        Overview
                      </div>
                    </button>
                    <button
                      onClick={() => setActiveTab('furnishings')}
                      className={`px-4 py-2 font-medium text-sm focus:outline-none whitespace-nowrap ${
                        activeTab === 'furnishings'
                          ? 'border-b-2 border-purple-800 text-purple-800 font-bold'
                          : 'text-purple-800 font-bold'
                      }`}
                    >
                      <div className="flex items-center cursor-pointer">
                        <FiTool className="mr-2" />
                        Furnishings
                      </div>
                    </button>
                    <button
                      onClick={() => setActiveTab('amenities')}
                      className={`px-4 py-2 font-medium text-sm focus:outline-none whitespace-nowrap ${
                        activeTab === 'amenities'
                          ? 'border-b-2 border-purple-800 text-purple-800 font-bold'
                          : 'text-purple-800 font-bold'
                      }`}
                    >
                      <div className="flex items-center cursor-pointer">
                        <FiCheck className="mr-2" />
                        Amenities
                      </div>
                    </button>
                    <button
                      onClick={() => setActiveTab('ratings')}
                      className={`px-4 py-2 font-medium text-sm focus:outline-none whitespace-nowrap ${
                        activeTab === 'ratings'
                          ? 'border-b-2 border-purple-800 text-purple-800 font-bold'
                          : 'text-purple-800 font-bold'
                      }`}
                    >
                      <div className="flex items-center cursor-pointer">
                        <FiStar className="mr-2" />
                        Ratings & Reviews
                      </div>
                    </button>
                  </div>
                </div>

                {/* Tab Content */}
                <div className="min-h-[300px]">
                  {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className='rounded-md'>
                        <h3 className="text-lg font-bold mb-3 text-purple-800">Property Description</h3>
                        <p className="text-purple-800 font-semibold">
                          {property.description || 'No description provided'}
                        </p>
                      </div>
                      <div className='rounded-md'>
                        <h3 className="text-lg font-bold text-purple-800 mb-3">Basic Information</h3>
                        <div className="space-y-3">
                          <div className="flex items-center">
                            <FiHome className="text-purple-800 mr-2 flex-shrink-0" />
                            <span className='text-purple-800 font-semibold'>Type: {property.propertyType?.join(', ') || 'Not specified'}</span>
                          </div>
                          <div className="flex items-center">
                            <FiUser className="text-purple-800 mr-2 flex-shrink-0" />
                            <span className='text-purple-800 font-semibold'>BHK: {property.bhkType?.join(', ') || 'Not specified'}</span>
                          </div>
                          <div className="flex items-center">
                            <FiLayers className="text-purple-800 mr-2 flex-shrink-0" />
                            <span className='text-purple-800 font-semibold'>Area: {property.area?.toLocaleString() || '0'} sq.ft</span>
                          </div>
                          <div className="flex items-center">
                            <FiCalendar className="text-purple-800 mr-2 flex-shrink-0" />
                            <span className='text-purple-800 font-semibold'>Available: {property.availableFrom ? new Date(property.availableFrom).toLocaleDateString() : 'Not specified'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'furnishings' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-bold text-purple-800 mb-3">Furnishing Details</h3>
                        <p className="capitalize text-purple-800 font-semibold">
                          {property.furnishType?.join(', ') || 'Not specified'}
                        </p>
                        <div className="mt-4">
                          <h4 className="mb-2 text-purple-800 font-bold">Additional Features</h4>
                          <div className="grid grid-cols-1 gap-2 text-purple-800 font-semibold">
                            {[
                              { field: 'balcony', label: 'Balcony' },
                              { field: 'petsAllowed', label: 'Pets Allowed' },
                              { field: 'nonVegAllowed', label: 'Non-Veg Allowed' },
                              { field: 'smokingAllowed', label: 'Smoking Allowed' },
                              { field: 'bachelorAllowed', label: 'Bachelor Allowed' }
                            ].map(({ field, label }) => (
                              <div key={field} className="flex items-center">
                                <div className={`w-3 h-3 rounded mr-2 ${
                                  property[field] ? 'bg-purple-800' : 'bg-gray-300'
                                }`}></div>
                                <span className="text-sm text-purple-800 font-semibold">{label}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold mb-3 text-purple-800">Property Structure</h3>
                        <div className="space-y-3">
                          <div>
                            <p className="text-purple-800 font-bold text-sm">Floor</p>
                            <p className='text-purple-800 font-semibold'>
                              {property.floorNumber ? 
                                `${property.floorNumber} of ${property.totalFloors || 'N/A'}` : 
                                'Not specified'}
                            </p>
                          </div>
                          <div>
                            <p className="text-purple-800 font-bold text-sm">Age of property</p>
                            <p className='text-purple-800 font-semibold'>
                              {property.ageOfProperty ? 
                                `${property.ageOfProperty} years` : 
                                'Not specified'}
                            </p>
                          </div>
                          <div>
                            <p className="text-purple-800 font-bold text-sm">Facing Direction</p>
                            <p className="capitalize text-purple-800 font-semibold">
                              {property.facingDirection || 'Not specified'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'amenities' && (
                    <div>
                      <h3 className="text-lg font-bold text-purple-800">Facilities & Amenities</h3>
                      <div className="flex flex-wrap gap-4 mb-6">
                        {property.facilities?.map((facility, index) => (
                          <div key={index} className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-purple-800 mr-2"></div>
                            <span className="text-purple-800 font-semibold text-sm capitalize">
                              {facility}
                            </span>
                          </div>
                        )) || <p className="text-purple-800 font-semibold">No amenities listed</p>}
                      </div>
                      
                      <h3 className="text-lg text-purple-800 font-bold mb-5">Utilities</h3>
                      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                        <div>
                          <div className="flex items-center text-purple-800 font-semibold mb-1">
                            <FiTool className="mr-2 flex-shrink-0" />
                            <span className='mr-5'>Parking</span>
                          </div>
                          <p className="capitalize px-6 text-purple-800 font-semibold">
                            {property.parking || 'Not specified'}
                          </p>
                        </div>
                        
                        <div>
                          <div className="flex items-center text-purple-800 font-bold mb-1">
                            <FiDroplet className="mr-2 flex-shrink-0 text-purple-800 font-semibold" />
                            <span>Water Supply</span>
                          </div>
                          <p className="capitalize text-purple-800 font-semibold px-6">
                            {property.waterSupply || 'Not specified'}
                          </p>
                        </div>
                        
                        <div>
                          <div className="flex items-center text-purple-800 font-bold mb-1">
                            <FiZap className="mr-2 flex-shrink-0" />
                            <span className='text-purple-800 font-bold'>Electricity Backup</span>
                          </div>
                          <p className="capitalize text-purple-800 font-semibold px-6">
                            {property.electricityBackup || 'Not specified'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'ratings' && (
                    <div className="text-center py-8">
                      <h3 className="text-lg font-semibold mb-2">Ratings & Reviews</h3>
                      <p className="text-gray-500">No reviews yet. Be the first to review!</p>
                      <button className="mt-4 px-4 py-2 bg-purple-800 cursor-pointer text-white rounded hover:bg-purple-700">
                        Write a Review
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Owner Contact Card and Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-xl shadow-md p-6 sticky top-6">
                <h2 className="text-xl font-bold mb-4 text-purple-800">Contact Owner</h2>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <FiUser className="text-purple-800 mr-2 flex-shrink-0" />
                    <span className="font-semibold text-purple-800">{property.ownerName || 'Not specified'}</span>
                  </div>
                  <div className="flex items-center">
                    <FiPhone className="text-purple-800 mr-2 flex-shrink-0" />
                    <span className="font-semibold text-purple-800">
                      {property.ownerphone ? (
                        <a href={`tel:${property.ownerphone}`} className="hover:underline">
                          {property.ownerphone}
                        </a>
                      ) : (
                        'Not specified'
                      )}
                    </span>
                  </div>
                  <div>
                    <p className="text-purple-800 font-bold">Preferred Tenant</p>
                    <p className="font-semibold text-purple-800">{property.Gender || 'Not specified'}</p>
                  </div>
                </div>

                {property.ownerphone && (
                  <button
                    onClick={contactOwner}
                    className="w-full mt-6 flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-md cursor-pointer transition"
                  >
                    <FiPhone /> Call Owner
                  </button>
                )}
                
                {!property.ownerphone && (
                  <button
                    className="w-full mt-6 flex items-center justify-center gap-2 bg-gray-400 text-white py-3 rounded-lg cursor-not-allowed"
                    disabled
                  >
                    <FiPhone /> Phone Not Available
                  </button>
                )}

                {/* Additional Info */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="font-bold mb-3 text-purple-800">Property Highlights</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <FiDollarSign className="text-purple-800 mr-2 flex-shrink-0" />
                      <span className='text-purple-800 font-semibold'>Deposit: ₹{property.securityDeposit?.toLocaleString() || '0'}</span>
                    </li>
                    <li className="flex items-center">
                      <FiClock className="text-purple-800 font-semibold mr-2 flex-shrink-0" />
                      <span className='text-purple-800 font-semibold'>Minimum Stay: {property.rentalDurationMonths || '0'} months</span>
                    </li>
                    <li className="flex items-center">
                      <FiCalendar className="text-purple-800 font-semibold mr-2 flex-shrink-0" />
                      <span className='text-purple-800 font-semibold'>Available from: {property.availableFrom ? new Date(property.availableFrom).toLocaleDateString() : 'Not specified'}</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Sidebar */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="bg-purple-200 p-4 rounded-lg text-center w-full mb-4">
                  <p className="text-purple-800 font-semibold">Get Zero Brokerage properties with <span className="text-pink-600 font-bold">💎 Premium</span></p>
                  <p className="text-purple-800">50% Off expiring in <span className="bg-purple-300 px-2 py-1 rounded text-sm font-bold">{formatTime(timeLeft)}</span></p>
                </div>
                
                <div className="w-full">
                  <h2 className="text-lg font-bold text-purple-800">Get our Free App  <br /><span className="text-green-500">⭐ 4.6</span> <span className="text-purple-800">200 downloads</span></h2>
                  <div className="my-4 flex justify-center">
                    <img src="/qr-code-placeholder.png" alt="QR Code" className="w-32 h-32" />
                  </div>
                  <p className="text-purple-800 font-semibold">Scan the QR code to Download the App</p>
                  <div className="mt-4">
                    <p className="text-purple-800 font-semibold">Get App Download Links via SMS</p>
                    <div className="flex items-center mt-2 border border-purple-800 rounded-lg overflow-hidden">
                      <input
                        type="text"
                        placeholder="Enter your Mobile Number"
                        className="flex-1 px-3 py-2 outline-none text-purple-800 font-semibold"
                      />
                      <button className="bg-purple-800 px-4 py-3 rounded-md">
                        <IoMdSend className="text-white" />
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-around mt-4">
                    <button className="flex items-center space-x-2 bg-purple-800 text-white px-4 py-2 rounded-lg">
                      <FaGooglePlay /> <span>Google Play</span>
                    </button>
                    <button className="flex items-center space-x-2 bg-purple-800 text-white px-4 py-2 rounded-lg">
                      <FaApple /> <span>App Store</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Slider Modal */}
      {isImageModalOpen && (
  <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
    <div className="relative w-full max-w-4xl h-full max-h-[80vh] flex flex-col">
      {/* Modal Header */}
      <div className="flex justify-between items-center px-4 py-3 bg-black/50 rounded-t-lg">
        <h3 className="text-white font-medium">
          {modalImageIndex + 1} / {property.images?.length || 0} - 
          {property.images?.[modalImageIndex]?.type || 'Property Image'}
        </h3>
        <button 
          onClick={closeImageModal}
          className="text-white hover:text-gray-300 transition p-2 cursor-pointer"
          aria-label="Close modal"
        >
          <FiX size={24} />
        </button>
      </div>

      {/* Main Image Content */}
      <div className="relative flex-1 flex flex-col items-center justify-center">
        <button
          onClick={goToPrevImage}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition z-10 cursor-pointer"
          aria-label="Previous image"
        >
          <FiChevronLeft size={24} />
        </button>

        <div className="h-full w-full flex items-center justify-center">
          <img
            src={property.images?.[modalImageIndex]?.url || property.images?.[modalImageIndex] || 'https://via.placeholder.com/800x600?text=Image+Not+Available'}
            alt={`Property Image ${modalImageIndex + 1}`}
            className="max-w-[80%] max-h-[70%] object-contain"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/800x600?text=Image+Not+Available';
            }}
          />
        </div>

        {/* Room Type Display */}
        <p className="text-white text-center mt-2 text-sm">
          {property.images?.[modalImageIndex]?.roomType || 'Room Type Not Available'}
        </p>

        <button
          onClick={goToNextImage}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition z-10 cursor-pointer"
          aria-label="Next image"
        >
          <FiChevronRight size={24} />
        </button>
      </div>

      {/* Thumbnail Navigation */}
      <div className="px-4 py-3 bg-black/50 rounded-b-lg">
        <div className="flex overflow-x-auto space-x-2 justify-center py-2">
          {property.images?.map((img, index) => (
            <button
              key={index}
              onClick={() => setModalImageIndex(index)}
              className={`flex-shrink-0 w-12 h-12 rounded-md overflow-hidden transition-all ${
                index === modalImageIndex 
                  ? 'ring-2 ring-white scale-110' 
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={img?.url || img}
                alt={`Thumbnail ${index}`}
                className="w-full h-full object-cover"
              />
              <div className="text-white text-xs text-center mt-1 truncate">
                {img?.type || "Image"}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  </div>
)}

    </>
  );
};

export default Viewdetails;