import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { BiHomeSmile } from "react-icons/bi";
import axios from "../../../lib/axios.js";
import { toast } from "react-toastify";

const MyProperties = ({ setEditingProperty }) => {
  const [properties, setProperties] = useState([]);
  const [propertiesLoading, setPropertiesLoading] = useState(true);
  const navigate = useNavigate();

  const fetchOwnerProperties = async () => {
    try {
      setPropertiesLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/properties/owner/my-properties", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data?.properties) {
        setProperties(response.data.properties);
      } else {
        throw new Error(response.data?.message || "No properties found");
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
      toast.error(
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch properties"
      );
    } finally {
      setPropertiesLoading(false);
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`/api/properties/${propertyId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Property deleted successfully");
        fetchOwnerProperties();
      } catch (error) {
        console.error("Error deleting property:", error);
        toast.error(error.response?.data?.error || "Failed to delete property");
      }
    }
  };

  useEffect(() => {
    fetchOwnerProperties();
  }, []);

  const handleAddProperty = () => {
    navigate("/add-property");
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">My Properties</h1>
          <p className="text-slate-500">
            Manage and track your property listings
          </p>
        </div>
        <button
          onClick={handleAddProperty}
          className="mt-4 sm:mt-0 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition duration-200 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add New Property
        </button>
      </div>

      {/* Loading / Empty / List */}
      {propertiesLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <BiHomeSmile className="text-4xl text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">No Properties Listed</h3>
          <p className="text-slate-500 mb-6 max-w-md mx-auto">
            You haven't listed any properties yet. Start by adding your
            first property to reach potential tenants.
          </p>
          <button
            onClick={handleAddProperty}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md font-medium"
          >
            List Your First Property
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {properties.map((property) => (
            <div
              key={property._id}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {/* Image */}
              <div className="relative h-48 bg-slate-100">
                {property.images && property.images.length > 0 ? (
                  <img
                    src={property.images[0].url}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BiHomeSmile className="text-4xl text-slate-400" />
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <span className="bg-indigo-600 text-white text-xs px-3 py-1 rounded-full font-medium capitalize">
                    {property.propertyType}
                  </span>
                </div>
              </div>

              {/* Details */}
              <div className="p-6 space-y-3">
                <div className="text-sm text-slate-600">
                  <span className="font-semibold">City:</span>{" "}
                  <span className="text-indigo-700 font-medium">{property.city}</span>
                </div>
                <div className="text-sm text-slate-600">
                  <span className="font-semibold">Address:</span>{" "}
                  <span className="text-indigo-700 font-medium">{property.address}</span>
                </div>
                <div className="text-xl font-bold text-indigo-600">
                  ₹{property.monthlyRent?.toLocaleString() || "0"}
                  <span className="text-sm font-normal text-slate-500"> /month</span>
                </div>

                {/* Actions */}
                <div className="flex space-x-3 pt-2">
                  <button
                    onClick={() => navigate(`/property/${property._id}`)}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium transition"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => setEditingProperty(property)}
                    className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                    title="Edit Property"
                  >
                    <CiEdit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteProperty(property._id)}
                    className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                    title="Delete Property"
                  >
                    <MdDeleteOutline className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProperties;
