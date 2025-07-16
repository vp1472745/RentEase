import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BiHomeSmile } from "react-icons/bi";
import axios from "../../../lib/axios.js";
import { toast } from "react-toastify";

const SavedProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchSavedProperties = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setProperties([]);
        setLoading(false);
        return;
      }
      const response = await axios.get("/api/properties/saved", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProperties(response.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch saved properties");
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedProperties();
    const handler = () => fetchSavedProperties();
    window.addEventListener("savedPropertyUpdated", handler);
    return () => window.removeEventListener("savedPropertyUpdated", handler);
  }, []);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Saved Properties</h1>
        <p className="text-slate-500">View and manage your favorite properties</p>
      </div>

      {/* Loading Spinner */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      ) : properties.length === 0 ? (
        // Empty State
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <BiHomeSmile className="text-4xl text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">No Saved Properties</h3>
          <p className="text-slate-500 mb-6 max-w-md mx-auto">
            You haven't saved any properties yet. Browse properties and click the save button to add them here.
          </p>
        </div>
      ) : (
        // Properties List
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {properties.map((property) => (
            <div
              key={property._id}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {/* Property Image */}
              <div className="relative h-48 bg-slate-100">
                {property.images?.length > 0 ? (
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

              {/* Property Details */}
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

                {/* View Details Button */}
                <div className="pt-2">
                  <button
                    onClick={() => navigate(`/property/${property._id}`)}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium transition"
                  >
                    View Details
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

export default SavedProperties;
