import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../lib/axios";
import { toast } from 'react-toastify';
import {
  FiChevronLeft,
  FiChevronRight,
  FiMapPin,
  FiDollarSign,
  FiHome,
  FiCheckCircle,
  FiEdit,
  FiTrash2,
  FiX
} from "react-icons/fi";
import { FaBuilding, FaBed, FaBath, FaRulerCombined, FaCouch, FaCalendarAlt } from "react-icons/fa";

const MyProperties = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("You must be logged in to view your properties.");
          setLoading(false);
          return;
        }

        const res = await axios.get(`http://localhost:5000/api/properties/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.owner.toString() !== JSON.parse(atob(token.split('.')[1]))._id) {
          setError("You are not authorized to view this property.");
          setProperty(null);
        } else {
          setProperty(res.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load property details.");
        console.error("Property fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const handleDelete = async () => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("You need to be logged in to delete a property.");
            return;
        }
        await axios.delete(`http://localhost:5000/api/properties/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Property deleted successfully");
        navigate('/profile?tab=myProperties');
    } catch (err) {
        toast.error(err.response?.data?.message || "Failed to delete property");
        console.error("Delete error:", err);
    } finally {
        setShowDeleteConfirm(false);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <p className="text-red-600 font-semibold text-lg">{error}</p>
          <button
            onClick={() => navigate('/profile?tab=myProperties')}
            className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            Go to My Properties
          </button>
        </div>
      </div>
    );
  }

  if (!property) {
    return null; // Or a 'property not found' message
  }
  
  const facilities = property.facilities || [];

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Back Button */}
        <button
          onClick={() => navigate('/profile?tab=myProperties')}
          className="flex items-center text-purple-600 hover:text-purple-800 font-medium mb-6"
        >
          <FiChevronLeft className="mr-1" /> Back to My Properties
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column (Main Content) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="relative h-96 w-full">
                <img
                  src={property.images[currentImageIndex]}
                  alt={property.title || 'Property Image'}
                  className="w-full h-full object-cover"
                />
                {property.images.length > 1 && (
                  <>
                    <button onClick={goToPrevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition">
                      <FiChevronLeft size={24} />
                    </button>
                    <button onClick={goToNextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition">
                      <FiChevronRight size={24} />
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                      {currentImageIndex + 1} / {property.images.length}
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {/* Property Details Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{`${property.bhkType} ${property.propertyType}`}</h1>
              <div className="flex items-center text-gray-500 mb-6">
                <FiMapPin className="mr-2 text-purple-500" />
                <span>{property.address}, {property.city}, {property.state}</span>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 text-center">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <FiDollarSign className="mx-auto text-3xl text-purple-600 mb-2" />
                  <p className="font-semibold text-gray-700">Rent</p>
                  <p className="text-gray-500">₹{property.monthlyRent}/mo</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <FaRulerCombined className="mx-auto text-3xl text-purple-600 mb-2" />
                  <p className="font-semibold text-gray-700">Area</p>
                  <p className="text-gray-500">{property.area} sq.ft</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <FaCouch className="mx-auto text-3xl text-purple-600 mb-2" />
                  <p className="font-semibold text-gray-700">Furnishing</p>
                  <p className="text-gray-500 capitalize">{property.furnishType}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <FaCalendarAlt className="mx-auto text-3xl text-purple-600 mb-2" />
                  <p className="font-semibold text-gray-700">Available From</p>
                  <p className="text-gray-500">{new Date(property.availableFrom).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Description Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-3">About this property</h2>
              <p className="text-gray-600 leading-relaxed">{property.description}</p>
            </div>
            
            {/* Facilities Card */}
            {facilities.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Amenities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {facilities.map((facility, index) => (
                    <div key={index} className="flex items-center">
                      <FiCheckCircle className="text-green-500 mr-2" />
                      <span className="text-gray-700 capitalize">{facility}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Right Column (Sticky Sidebar) */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-8">
              {/* Actions Card */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Manage Property</h2>
                <div className="space-y-3">
                  <button
                    onClick={() => navigate(`/UpdateProperty/${id}`)}
                    className="w-full flex items-center justify-center px-4 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition"
                  >
                    <FiEdit className="mr-2" /> Edit Property
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-full flex items-center justify-center px-4 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
                  >
                    <FiTrash2 className="mr-2" /> Delete Property
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-sm w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Confirm Deletion</h3>
              <button onClick={() => setShowDeleteConfirm(false)} className="text-gray-500 hover:text-gray-800">
                <FiX size={24} />
              </button>
            </div>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this property? This action cannot be undone.</p>
            <div className="flex justify-end space-x-4">
              <button onClick={() => setShowDeleteConfirm(false)} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
                Cancel
              </button>
              <button onClick={handleDelete} className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProperties;