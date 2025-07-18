import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../lib/axios.js';
import { FaGooglePlay, FaApple } from "react-icons/fa";
import { FaRupeeSign } from "react-icons/fa";
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
  const [favorites, setFavorites] = useState(() => {
    const saved = JSON.parse(localStorage.getItem('savedProperties') || '{}');
    return saved;
  });
  const [activeTab, setActiveTab] = useState('overview');
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(3600);
  const videoRefs = useRef([]);
  const [showSignupPopup, setShowSignupPopup] = useState(false);

  const isValidId = (id) => {
    return id && id !== 'undefined' && /^[0-9a-fA-F]{24}$/.test(id);
  };

  useEffect(() => {
    const fetchProperty = async () => {
      if (!isValidId(id)) {
        setError("Invalid property ID");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem('token');
        const config = token ? {
          headers: {
            Authorization: `Bearer ${token}`
          }
        } : {};

        const [propertyRes, savedRes] = await Promise.all([
          axios.get(`/api/properties/${id}`, config),
          token ? axios.get(`/api/properties/saved/${id}`, config).catch(() => ({ data: { isSaved: false } })) : Promise.resolve({ data: { isSaved: false } })
        ]);

        const propertyData = propertyRes.data;
        
        setProperty({
          ...propertyData,
          media: [...(propertyData.images || []), ...(propertyData.videos || [])],
          videos: propertyData.videos || [],
          images: propertyData.images || [],
        });

        setFavorites(prev => {
          const saved = JSON.parse(localStorage.getItem('savedProperties') || '{}');
          return { ...prev, ...saved };
        });

        const seenProperties = JSON.parse(localStorage.getItem("seenProperties") || "[]");
        if (!seenProperties.includes(id)) {
          const updatedSeenProperties = [id, ...seenProperties.slice(0, 49)];
          localStorage.setItem("seenProperties", JSON.stringify(updatedSeenProperties));
        }

      } catch (error) {
        console.error("Error fetching property:", error);
        if (error.response?.status === 404) {
          setError("Property not found");
        } else {
          setError(error.response?.data?.message || "Failed to load property");
        }
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
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to save properties');
      navigate('/login');
      return;
    }
    try {
      let updated;
      if (!favorites[id]) {
        await axios.post(`/api/properties/save/${id}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        updated = { ...favorites, [id]: true };
        toast.success('Property saved successfully');
      } else {
        try {
          await axios.delete(`/api/properties/save/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          updated = { ...favorites };
          delete updated[id];
          toast.info('Property removed from saved');
        } catch (error) {
          if (error.response?.status === 404) {
            updated = { ...favorites };
            delete updated[id];
            toast.info('Property was not in your saved list');
          } else {
            throw error;
          }
        }
      }
      setFavorites(updated);
      localStorage.setItem('savedProperties', JSON.stringify(updated));
      window.dispatchEvent(new Event('savedPropertyUpdated'));
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        navigate('/login');
      } else {
        toast.error(error.response?.data?.message || 'Failed to update saved property');
      }
    }
  };

  const shareOnWhatsApp = () => {
    if (!property) return;
    
    const message =
      `Check out this property: ${property.title}\n\n` +
      `📍 Location: ${property.address}, ${property.city}, ${property.state}\n` +
      `🏠 Type: ${property.propertyType?.join(', ') || 'N/A'} | ${property.bhkType?.join(', ') || 'N/A'}\n` +
      `📏 Area: ${property.area || '0'} sq.ft\n` +
      `💰 Price: ₹${property.monthlyRent || '0'}/month (Deposit: ₹${property.securityDeposit || '0'})\n` +
      `📅 Available from: ${property.availableFrom ? new Date(property.availableFrom).toLocaleDateString() : 'N/A'}\n` +
      `⏳ Minimum stay: ${property.rentalDurationMonths || '0'} months\n` +
      `🛠️ Maintenance: ₹${property.maintenanceCharges || '0'}/month\n` +
      `👤 Owner: ${property.ownerName || 'N/A'} (${property.ownerphone || 'N/A'})\n` +
      `More details: ${window.location.href}`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, "_blank");
  };

  const contactOwner = () => {
    if (!property?.ownerphone) {
      toast.error('Owner phone number not available');
      return;
    }
    const userRole = localStorage.getItem('role');
    if (userRole === 'tenant') {
      window.open(`tel:${property.ownerphone}`);
    } else {
      setShowSignupPopup(true);
    }
  };

  const isVideo = (mediaItem) => {
    if (!mediaItem) return false;
    
    const url = typeof mediaItem === 'string' ? mediaItem : mediaItem.url;
    if (!url) return false;
    
    if (url.match(/\.(mp4|mov|webm|avi|m3u8|mkv)$/i)) return true;
    
    if (url.includes('res.cloudinary.com') && 
        (url.includes('/video/upload/') || url.includes('.mp4') || url.includes('.mov'))) {
      return true;
    }
    
    if (typeof mediaItem === 'object' && mediaItem.mimeType) {
      return mediaItem.mimeType.startsWith('video/');
    }
    
    return false;
  };

  const getMediaUrl = (mediaItem) => {
    if (!mediaItem) return '';
    return typeof mediaItem === 'string' ? mediaItem : mediaItem.url;
  };

  const openImageModal = (index) => {
    setModalImageIndex(index);
    setIsImageModalOpen(true);
    document.body.style.overflow = 'hidden';
    videoRefs.current.forEach(video => {
      if (video) video.pause();
    });
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
    document.body.style.overflow = 'auto';
    videoRefs.current.forEach(video => {
      if (video) video.pause();
    });
  };

  const goToPrevImage = () => {
    videoRefs.current.forEach(video => {
      if (video) video.pause();
    });
    
    setModalImageIndex(prev => 
      prev === 0 ? property.media.length - 1 : prev - 1
    );
  };

  const goToNextImage = () => {
    videoRefs.current.forEach(video => {
      if (video) video.pause();
    });
    
    setModalImageIndex(prev => 
      prev === property.media.length - 1 ? 0 : prev + 1
    );
  };

  const handleVideoPlay = (index) => (e) => {
    videoRefs.current.forEach((video, i) => {
      if (video && i !== index) video.pause();
    });
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
  }, [isImageModalOpen, modalImageIndex, property?.media]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-lg text-slate-700">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Property</h2>
          <p className="text-slate-700 mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
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
          <h2 className="text-xl font-semibold text-slate-800 mb-2">Property Not Found</h2>
          <p className="text-slate-700 mb-4">The property you're looking for doesn't exist or may have been removed.</p>
          <button
            onClick={() => navigate('/properties')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Browse Properties
          </button>
        </div>
      </div>
    );
  }

  const VideoPlayer = ({ src, className, onClick, thumbnail = false }) => {
    return (
      <div className={`relative ${className}`}>
        <video
          className="w-full h-full object-cover rounded-lg"
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
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-lg">
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
    <>
      <div className='bg-indigo-700 h-18 w-full'></div>
      <div className="min-h-screen bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* Back button */}
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-indigo-700 mb-6 hover:text-indigo-900 transition text-base sm:text-lg"
          >
            <FiChevronLeft className="mr-1" /> Back to Properties
          </button>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Left Column - Property Images and Details */}
            <div className="lg:col-span-2">
              {/* Image Gallery with Slider */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6 border border-slate-200 relative">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                  {/* Left Side - Main Image */}
                  <div className="col-span-1 relative">
                    {property.media?.[0] ? (
                      isVideo(property.media[0]) ? (
                        <VideoPlayer
                          src={getMediaUrl(property.media[0])}
                          className="w-full h-96 cursor-pointer"
                          onClick={() => openImageModal(0)}
                          thumbnail
                        />
                      ) : (
                        <img
                          src={getMediaUrl(property.media[0]) || 'https://via.placeholder.com/800x600?text=Image+Not+Available'}
                          alt={property.title || 'Property Image'}
                          className="w-full h-96 object-cover cursor-pointer rounded-lg"
                          onClick={() => openImageModal(0)}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/800x600?text=Image+Not+Available';
                          }}
                        />
                      )
                    ) : (
                      <div className="w-full h-96 bg-slate-200 flex items-center justify-center rounded-lg">
                        <span className="text-slate-500">No media available</span>
                      </div>
                    )}
                    
                    {/* Room Type Overlay */}
                    {property.media?.[0]?.type && (
                      <div className="absolute bottom-4 left-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm">
                        {property.media[0].type}
                      </div>
                    )}
                  </div>
                  
                  {/* Right Side - Secondary Images */}
                  <div className="col-span-1 grid grid-rows-2 gap-1">
                    {/* Top Right Image */}
                    <div className="relative">
                      {property.media?.[1] ? (
                        isVideo(property.media[1]) ? (
                          <VideoPlayer
                            src={getMediaUrl(property.media[1])}
                            className="w-full h-48 cursor-pointer"
                            onClick={() => openImageModal(1)}
                            thumbnail
                          />
                        ) : (
                          <img
                            src={getMediaUrl(property.media[1]) || 'https://via.placeholder.com/800x600?text=Image+Not+Available'}
                            alt={property.title || 'Property Image'}
                            className="w-full h-48 object-cover cursor-pointer rounded-lg"
                            onClick={() => openImageModal(1)}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/800x600?text=Image+Not+Available';
                            }}
                          />
                        )
                      ) : (
                        <div className="w-full h-48 bg-slate-200 flex items-center justify-center rounded-lg">
                          <span className="text-slate-500">No media available</span>
                        </div>
                      )}
                      
                      {/* Room Type Overlay */}
                      {property.media?.[1]?.type && (
                        <div className="absolute bottom-4 left-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm">
                          {property.media[1].type}
                        </div>
                      )}
                    </div>
                    
                    {/* Bottom Right Image */}
                    <div className="relative">
                      {property.media?.[2] ? (
                        isVideo(property.media[2]) ? (
                          <VideoPlayer
                            src={getMediaUrl(property.media[2])}
                            className="w-full h-48 cursor-pointer"
                            onClick={() => openImageModal(2)}
                            thumbnail
                          />
                        ) : (
                          <img
                            src={getMediaUrl(property.media[2]) || 'https://via.placeholder.com/800x600?text=Image+Not+Available'}
                            alt={property.title || 'Property Image'}
                            className="w-full h-48 object-cover cursor-pointer rounded-lg"
                            onClick={() => openImageModal(2)}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/800x600?text=Image+Not+Available';
                            }}
                          />
                        )
                      ) : (
                        <div className="w-full h-48 bg-slate-200 flex items-center justify-center rounded-lg">
                          <span className="text-slate-500">No media available</span>
                        </div>
                      )}
                      
                      {/* Room Type Overlay */}
                      {property.media?.[2]?.type && (
                        <div className="absolute bottom-4 left-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm">
                          {property.media[2].type}
                        </div>
                      )}
                      
                      {/* Media Count Overlay */}
                      {property.media?.length > 2 && (
                        <div className="absolute bottom-4 right-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm">
                          +{property.media.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Top Right Buttons */}
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button
                    onClick={shareOnWhatsApp}
                    className="bg-white p-2 rounded-full shadow-md hover:bg-slate-100 transition cursor-pointer flex items-center"
                  >
                    <FiShare2 className="text-slate-700" />
                    <span className="ml-1 text-xs">SHARE</span>
                  </button>
                  
                  <button
                    onClick={toggleFavorite}
                    className={`p-2 rounded-full shadow-md transition cursor-pointer flex items-center ${
                      favorites[id] 
                        ? 'bg-red-500 text-white' 
                        : 'bg-white text-slate-700'
                    }`}
                  >
                    <FiHeart className={`${favorites[id] ? 'fill-current' : ''}`} />
                    <span className="ml-1 text-xs">SAVE</span>
                  </button>
                </div>
              </div>

              {/* Property Header */}
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6">
                  <div className="mb-4 md:mb-0">
                    <h1 className="text-2xl font-bold text-slate-800 mb-2">{property.title}</h1>
                    {/* Property Type Badge */}
                    {property.propertyType && (
                      <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-semibold px-2 py-1 rounded mr-2 mb-1">
                        Type: {property.propertyType
                          ? property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1)
                          : "Not specified"}
                      </span>
                    )}
                    {/* Subcategory Badge */}
                    {property.propertyType === 'room' && property.roomSubcategory && (
                      <span className="inline-block bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-1 rounded mr-2 mb-1">
                        Subcategory: {property.roomSubcategory}
                      </span>
                    )}
                    {property.propertyType === 'apartment' && property.apartmentSubcategory && (
                      <span className="inline-block bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-1 rounded mr-2 mb-1">
                        Subcategory: {property.apartmentSubcategory}
                      </span>
                    )}
                    {property.propertyType === 'pg' && property.pgSubcategory && (
                      <span className="inline-block bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-1 rounded mr-2 mb-1">
                        Subcategory: {property.pgSubcategory}
                      </span>
                    )}
                    {property.propertyType === 'other' && property.otherSubcategory && (
                      <span className="inline-block bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-1 rounded mr-2 mb-1">
                        Subcategory: {property.otherSubcategory}
                      </span>
                    )}
                    <div className="flex items-center text-indigo-700 font-semibold">
                      <FiMapPin className="mr-2 flex-shrink-0" />
                      <div className="break-words whitespace-normal text-sm sm:text-base w-full">
                        {property.address || ''}, {property.city || ''}, {property.state || ''}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-2xl font-bold text-indigo-700">₹{property.monthlyRent?.toLocaleString() || '0'}/month</p>
                    <p className="text-sm text-slate-600">Added on {property.createdAt ? new Date(property.createdAt).toLocaleDateString() : 'N/A'}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                    {property.furnishType?.join(', ') || 'Furnishing not specified'}
                  </span>
                  <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                    {property.area?.toLocaleString() || '0'} sq.ft
                  </span>
                  {property.bhkType?.map((bhk, index) => (
                    <span key={index} className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                      {bhk}
                    </span>
                  ))}
                </div>

                {/* Price Details Card */}
                <div className="bg-indigo-50 rounded-xl p-4 mb-6">
                  <h3 className="text-lg font-bold text-indigo-800 mb-3">Price Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <FaRupeeSign className="text-indigo-700 mr-2" />
                      <div>
                        <p className="text-sm text-slate-600">Monthly Rent</p>
                        <p className="font-bold text-indigo-800">₹{property.monthlyRent?.toLocaleString() || '0'}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FaRupeeSign className="text-indigo-700 mr-2" />
                      <div>
                        <p className="text-sm text-slate-600">Security Deposit</p>
                        <p className="font-bold text-indigo-800">₹{property.securityDeposit?.toLocaleString() || '0'}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FiTool className="text-indigo-700 mr-2" />
                      <div>
                        <p className="text-sm text-slate-600">Maintenance</p>
                        <p className="font-bold text-indigo-800">₹{property.maintenanceCharges?.toLocaleString() || '0'}/month</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FiClock className="text-indigo-700 mr-2" />
                      <div>
                        <p className="text-sm text-slate-600">Minimum Stay</p>
                        <p className="font-bold text-indigo-800">{property.rentalDurationMonths || '0'} months</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tab Navigation */}
                <div className="border-b border-slate-200 mb-6 overflow-x-auto">
                  <div className="flex space-x-4 min-w-max">
                    <button
                      onClick={() => setActiveTab('overview')}
                      className={`px-4 py-2 font-medium text-sm focus:outline-none whitespace-nowrap ${
                        activeTab === 'overview'
                          ? 'border-b-2 border-indigo-600 text-indigo-600 font-semibold'
                          : 'text-slate-600 hover:text-indigo-600'
                      }`}
                    >
                      <div className="flex items-center">
                        <FiHome className="mr-2" />
                        Overview
                      </div>
                    </button>
                    <button
                      onClick={() => setActiveTab('furnishings')}
                      className={`px-4 py-2 font-medium text-sm focus:outline-none whitespace-nowrap ${
                        activeTab === 'furnishings'
                          ? 'border-b-2 border-indigo-600 text-indigo-600 font-semibold'
                          : 'text-slate-600 hover:text-indigo-600'
                      }`}
                    >
                      <div className="flex items-center">
                        <FiTool className="mr-2" />
                        Furnishings
                      </div>
                    </button>
                    <button
                      onClick={() => setActiveTab('amenities')}
                      className={`px-4 py-2 font-medium text-sm focus:outline-none whitespace-nowrap ${
                        activeTab === 'amenities'
                          ? 'border-b-2 border-indigo-600 text-indigo-600 font-semibold'
                          : 'text-slate-600 hover:text-indigo-600'
                      }`}
                    >
                      <div className="flex items-center">
                        <FiCheck className="mr-2" />
                        Amenities
                      </div>
                    </button>
                  </div>
                </div>

                {/* Tab Content */}
                <div className="min-h-[300px]">
                  {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-bold mb-3 text-slate-800">Property Description</h3>
                        {property.description ? (
                          <div className="text-slate-700 space-y-2">
                            {property.description
                              .split('\n')
                              .reduce((acc, line) => {
                                const trimmed = line.trim();
                                if (!trimmed) return acc;
                                if (trimmed.endsWith(':')) {
                                  acc.push(<p key={acc.length} className="font-semibold mt-3">{trimmed}</p>);
                                } else {
                                  acc.push(
                                    <li key={acc.length} className="ml-5 list-disc">{trimmed}</li>
                                  );
                                }
                                return acc;
                              }, [])}
                          </div>
                        ) : (
                          <p className="text-slate-600">No description provided</p>
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-800 mb-3">Basic Information</h3>
                        <div className="space-y-3">
                          <div className="flex items-center">
                            <FiHome className="text-indigo-700 mr-2 flex-shrink-0" />
                            <span className='text-slate-700'>Type: {property.propertyType ? property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1) : 'Not specified'}</span>
                          </div>
                          {/* Subcategory Display */}
                          {property.propertyType === 'room' && property.roomSubcategory && (
                            <div className="flex items-center">
                              <FiLayers className="text-purple-700 mr-2 flex-shrink-0" />
                              <span className='text-slate-700'>Room Subcategory: {property.roomSubcategory}</span>
                            </div>
                          )}
                          {property.propertyType === 'apartment' && property.apartmentSubcategory && (
                            <div className="flex items-center">
                              <FiLayers className="text-purple-700 mr-2 flex-shrink-0" />
                              <span className='text-slate-700'>Apartment Subcategory: {property.apartmentSubcategory}</span>
                            </div>
                          )}
                          {property.propertyType === 'pg' && property.pgSubcategory && (
                            <div className="flex items-center">
                              <FiLayers className="text-purple-700 mr-2 flex-shrink-0" />
                              <span className='text-slate-700'>PG Subcategory: {property.pgSubcategory}</span>
                            </div>
                          )}
                          {property.propertyType === 'other' && property.otherSubcategory && (
                            <div className="flex items-center">
                              <FiLayers className="text-purple-700 mr-2 flex-shrink-0" />
                              <span className='text-slate-700'>Other Subcategory: {property.otherSubcategory}</span>
                            </div>
                          )}
                          <div className="flex items-center">
                            <FiUser className="text-indigo-700 mr-2 flex-shrink-0" />
                            <span className='text-slate-700'>BHK: {property.bhkType?.join(', ') || 'Not specified'}</span>
                          </div>
                          <div className="flex items-center">
                            <FiLayers className="text-indigo-700 mr-2 flex-shrink-0" />
                            <span className='text-slate-700'>Area: {property.area?.toLocaleString() || '0'} sq.ft</span>
                          </div>
                          <div className="flex items-center">
                            <FiCalendar className="text-indigo-700 mr-2 flex-shrink-0" />
                            <span className='text-slate-700'>Available: {property.availableFrom ? new Date(property.availableFrom).toLocaleDateString() : 'Not specified'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'furnishings' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-bold text-slate-800 mb-3">Furnishing Details</h3>
                        <p className="capitalize text-slate-700">
                          {property.furnishType?.join(', ') || 'Not specified'}
                        </p>
                        <div className="mt-4">
                          <h4 className="mb-2 text-slate-800 font-semibold">Additional Features</h4>
                          <div className="grid grid-cols-1 gap-2">
                            {[
                              { field: 'balcony', label: 'Balcony' },
                              { field: 'petsAllowed', label: 'Pets Allowed' },
                              { field: 'nonVegAllowed', label: 'Non-Veg Allowed' },
                              { field: 'smokingAllowed', label: 'Smoking Allowed' },
                              { field: 'bachelorAllowed', label: 'Bachelor Allowed' }
                            ].map(({ field, label }) => (
                              <div key={field} className="flex items-center">
                                <div className={`w-4 h-4 flex items-center justify-center rounded mr-2 text-xs border border-slate-300 bg-white`}>
                                  {property[field] ? (
                                    <span className="text-indigo-600">✔</span>
                                  ) : (
                                    <span className="text-slate-400">✖</span>
                                  )}
                                </div>
                                <span className="text-sm text-slate-700">{label}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold mb-3 text-slate-800">Property Structure</h3>
                        <div className="space-y-3">
                          <div>
                            <p className="text-slate-600 text-sm">Floor</p>
                            <p className='text-slate-700'>
                              {property.floorNumber ? 
                                `${property.floorNumber} of ${property.totalFloors || 'N/A'}` : 
                                'Not specified'}
                            </p>
                          </div>
                          <div>
                            <p className="text-slate-600 text-sm">Age of property</p>
                            <p className='text-slate-700'>
                              {property.ageOfProperty ? 
                                `${property.ageOfProperty} years` : 
                                'Not specified'}
                            </p>
                          </div>
                          <div>
                            <p className="text-slate-600 text-sm">Facing Direction</p>
                            <p className="capitalize text-slate-700">
                              {property.facingDirection || 'Not specified'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'amenities' && (
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 mb-4">Facilities & Amenities</h3>
                      <div className="flex flex-wrap gap-4 mb-6">
                        {property.facilities?.map((facility, index) => (
                          <div key={index} className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-indigo-600 mr-2"></div>
                            <span className="text-slate-700 text-sm capitalize">
                              {facility}
                            </span>
                          </div>
                        )) || <p className="text-slate-600">No amenities listed</p>}
                      </div>
                      
                      <h3 className="text-lg text-slate-800 font-bold mb-4">Utilities</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="flex items-center text-slate-700 mb-1">
                            <FiTool className="text-indigo-700 mr-2 flex-shrink-0" />
                            <span>Parking</span>
                          </div>
                          <p className="capitalize pl-6 text-slate-700">
                            {property.parking || 'Not specified'}
                          </p>
                        </div>
                        
                        <div>
                          <div className="flex items-center text-slate-700 mb-1">
                            <FiDroplet className="text-indigo-700 mr-2 flex-shrink-0" />
                            <span>Water Supply</span>
                          </div>
                          <p className="capitalize text-slate-700 pl-6">
                            {property.waterSupply || 'Not specified'}
                          </p>
                        </div>
                        
                        <div>
                          <div className="flex items-center text-slate-700 mb-1">
                            <FiZap className="text-indigo-700 mr-2 flex-shrink-0" />
                            <span>Electricity Backup</span>
                          </div>
                          <p className="capitalize text-slate-700 pl-6">
                            {property.electricityBackup || 'Not specified'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Owner Contact Card and Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
                <h2 className="text-xl font-bold mb-4 text-slate-800">Contact Owner</h2>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <FiUser className="text-indigo-700 mr-2 flex-shrink-0" />
                    <span className="font-semibold text-slate-800">{property.ownerName || 'Not specified'}</span>
                  </div>
                
                  <div>
                    <p className="text-slate-600">Preferred Tenant</p>
                    <p className="font-medium text-slate-800">{property.Gender?.join(', ') || 'Not specified'}</p>
                  </div>
                </div>

                {property.ownerphone && (
                  <button
                    onClick={contactOwner}
                    className="w-full mt-6 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg cursor-pointer transition"
                  >
                    <FiPhone /> Call Owner
                  </button>
                )}
                
                {!property.ownerphone && (
                  <button
                    className="w-full mt-6 flex items-center justify-center gap-2 bg-slate-400 text-white py-3 rounded-lg cursor-not-allowed"
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
                      <FaRupeeSign className="text-purple-800 mr-2 flex-shrink-0" />
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

         
            </div>
          </div>
        </div>
      </div>

      {/* Image/Video Slider Modal */}
{isImageModalOpen && (
  <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-1 sm:p-4 overflow-y-auto">
    <div className="relative w-full max-w-lg sm:max-w-3xl mx-auto flex flex-col max-h-[95vh]">
      {/* Modal Header */}
      <div className="flex justify-between items-center px-2 sm:px-4 py-2 sm:py-3 bg-black/50 rounded-t-lg">
        <h3 className="text-white font-medium">
          {modalImageIndex + 1} / {property.media?.length || 0} - 
          {property.media?.[modalImageIndex]?.type || 'Property Media'}
        </h3>
        <button 
          onClick={closeImageModal}
          className="text-white hover:text-gray-300 transition p-2 cursor-pointer"
          aria-label="Close modal"
        >
          <FiX size={32} />
        </button>
      </div>
      {/* Main Media Content */}
      <div className="relative flex-1 flex flex-col items-center justify-center min-h-[200px] sm:min-h-[400px]">
        <button
          onClick={goToPrevImage}
          className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 bg-black/70 text-white p-2 sm:p-4 rounded-full hover:bg-purple-700 transition z-10 cursor-pointer border-2 border-white shadow-lg"
          aria-label="Previous image"
          style={{ fontSize: '2rem', minWidth: '40px', minHeight: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <FiChevronLeft size={28} className="hidden sm:block" />
          <FiChevronLeft size={20} className="block sm:hidden" />
        </button>
        <div className="h-full w-full flex items-center justify-center">
          {property.media?.[modalImageIndex] ? (
            isVideo(property.media[modalImageIndex]) ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <video
                  ref={el => videoRefs.current[modalImageIndex] = el}
                  src={getMediaUrl(property.media[modalImageIndex])}
                  className="w-full max-h-[70vh] object-contain rounded-lg border border-white"
                  controls
                  autoPlay
                  onPlay={handleVideoPlay(modalImageIndex)}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <div className="text-white flex items-center justify-center">
                    <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                    <span>Video Tour</span>
                  </div>
                </div>
              </div>
            ) : (
              <img
                src={getMediaUrl(property.media[modalImageIndex]) || 'https://via.placeholder.com/800x600?text=Image+Not+Available'}
                alt={`Property Media ${modalImageIndex + 1}`}
                className="max-w-full max-h-[70vh] object-contain rounded-lg border border-white"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/800x600?text=Image+Not+Available';
                }}
              />
            )
          ) : (
            <div className="text-white">No media available</div>
          )}
        </div>
        <button
          onClick={goToNextImage}
          className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 bg-black/70 text-white p-2 sm:p-4 rounded-full hover:bg-purple-700 transition z-10 cursor-pointer border-2 border-white shadow-lg"
          aria-label="Next image"
          style={{ fontSize: '2rem', minWidth: '40px', minHeight: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <FiChevronRight size={28} className="hidden sm:block" />
          <FiChevronRight size={20} className="block sm:hidden" />
        </button>
      </div>
      {/* Thumbnail Navigation */}
      <div className="px-2 sm:px-4 py-2 sm:py-3 bg-black/50 rounded-b-lg">
        <div className="flex overflow-x-auto space-x-1 sm:space-x-2 justify-center py-1 sm:py-2">
          {property.media?.map((mediaItem, index) => (
            <button
              key={index}
              onClick={() => setModalImageIndex(index)}
              className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden transition-all ${
                index === modalImageIndex 
                  ? 'ring-2 ring-white scale-110' 
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              {isVideo(mediaItem) ? (
                <div className="relative w-full h-full">
                  <video
                    src={getMediaUrl(mediaItem)}
                    className="w-full h-full object-cover"
                    muted
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                  </div>
                </div>
              ) : (
                <img
                  src={getMediaUrl(mediaItem)}
                  alt={`Thumbnail ${index}`}
                  className="w-full h-full object-cover"
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  </div>
)}

      {showSignupPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-2 sm:p-0">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg text-center w-full max-w-xs sm:max-w-md">
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
    </>
  );
};

export default Viewdetails;