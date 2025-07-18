import React, { useState, useEffect } from 'react';
import API from '../../../lib/axios';
import { FiHome, FiSearch, FiFilter, FiEye, FiEdit, FiTrash2, FiMapPin, FiDollarSign, FiUsers, FiCalendar, FiX, FiSave, FiPlus, FiUser } from 'react-icons/fi';

const PropertiesTab = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [showPropertyModal, setShowPropertyModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editForm, setEditForm] = useState({});
    const [propertyTab, setPropertyTab] = useState('overview');
    const [editTab, setEditTab] = useState('overview');

    useEffect(() => {
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        try {
            setLoading(true);
            const response = await API.get('/api/admin/getAllProperty', { withCredentials: true });
            console.log('Properties response:', response.data); // Debug log
            setProperties(response.data.properties || []);
        } catch (err) {
            console.error('Error fetching properties:', err);
            setError('Failed to fetch properties');
        } finally {
            setLoading(false);
        }
    };

    const filteredProperties = properties.filter(property => {
        const matchesSearch =
                            property.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            property.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            property.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || property.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const handleViewProperty = (property) => {
        setSelectedProperty(property);
        setShowPropertyModal(true);
        setPropertyTab('overview');
    };

    const handleEditProperty = (property) => {
        setEditForm({
            description: property.description || '',
            monthlyRent: property.monthlyRent || '',
            address: property.address || '',
            city: property.city || '',
            state: property.state || '',
            popularLocality: property.popularLocality || '',
            bhkType: property.bhkType || [],
            propertyType: property.propertyType || [],
            furnishType: property.furnishType || [],
            Gender: property.Gender || [],
            ownerName: property.ownerName || '',
            ownerphone: property.ownerphone || '',
            area: property.area || '',
            floorNumber: property.floorNumber || '',
            totalFloors: property.totalFloors || '',
            ageOfProperty: property.ageOfProperty || '',
            facingDirection: property.facingDirection || '',
            balcony: property.balcony || false,
            petsAllowed: property.petsAllowed || false,
            nonVegAllowed: property.nonVegAllowed || false,
            smokingAllowed: property.smokingAllowed || false,
            bachelorAllowed: property.bachelorAllowed || false,
            parking: property.parking || '',
            waterSupply: property.waterSupply || '',
            electricityBackup: property.electricityBackup || '',
            maintenanceCharges: property.maintenanceCharges || '',
            securityDeposit: property.securityDeposit || '',
            rentalDurationMonths: property.rentalDurationMonths || '',
            availableFrom: property.availableFrom ? property.availableFrom.split('T')[0] : '',
            status: property.status || 'available'
        });
        setSelectedProperty(property);
        setEditTab('overview');
        setShowEditModal(true);
    };

    const handleUpdateProperty = async () => {
        try {
            await API.put(`/api/properties/${selectedProperty._id}`, editForm, { withCredentials: true });
            setShowEditModal(false);
            fetchProperties(); // Refresh the list
        } catch (err) {
            console.error('Error updating property:', err);
            alert('Failed to update property');
        }
    };

    const handleDeleteProperty = async (propertyId) => {
        if (window.confirm('Are you sure you want to delete this property?')) {
            try {
                await API.delete(`/api/properties/${propertyId}`, { withCredentials: true });
                fetchProperties(); // Refresh the list
            } catch (err) {
                console.error('Error deleting property:', err);
                alert('Failed to delete property');
            }
        }
    };

    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'available': return 'bg-green-100 text-green-800';
            case 'rented': return 'bg-red-100 text-red-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="space-y-6 not-first:">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold text-gray-800">Manage Properties</h2>
                    <div className="animate-pulse bg-gray-200 h-10 w-32 rounded"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="bg-white p-6 rounded-lg shadow-md animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4 sm:space-y-6 overflow-y-auto max-h-[calc(100vh-120px)] scrollbar-thin scrollbar-thumb-[#334155] scrollbar-track-[#1E293B] bg-[#0F172A] px-2 py-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#F8FAFC]">Manage Properties</h2>
                    <p className="text-[#94A3B8] mt-1">View and manage all listed properties</p>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="bg-[#1E293B] px-3 sm:px-4 py-2 rounded-lg shadow-sm border border-[#334155]">
                        <span className="text-sm text-[#94A3B8]">Total Properties: </span>
                        <span className="font-semibold text-[#3B82F6]">{properties.length}</span>
                    </div>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="bg-[#1E293B] p-4 sm:p-6 rounded-lg shadow-md border border-[#334155]">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#94A3B8]" />
                        <input
                            type="text"
                            placeholder="Search properties by title, location, or description..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-[#334155] rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent bg-[#1E293B] text-[#F8FAFC] placeholder-[#94A3B8]"
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <FiFilter className="text-[#94A3B8]" />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-3 sm:px-4 py-2 border border-[#334155] rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent bg-[#1E293B] text-[#F8FAFC]"
                        >
                            <option value="all">All Status</option>
                            <option value="available">Available</option>
                            <option value="rented">Rented</option>
                            <option value="pending">Pending</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Properties Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredProperties.map((property) => (
                    <div key={property._id} className="bg-[#1E293B] rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden border border-[#334155]">
                        {/* Property Image */}
                        <div className="h-40 sm:h-48 bg-[#334155] relative">
                            {property.images && property.images.length > 0 ? (
                                <img 
                                    src={property.images[0].url} 
                                    alt={property.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <FiHome className="text-[#94A3B8] text-3xl sm:text-4xl" />
                                </div>
                            )}
                            <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    property.status === 'available'
                                        ? 'bg-[#22C55E]/20 text-[#22C55E]'
                                        : property.status === 'rented'
                                        ? 'bg-[#FACC15]/20 text-[#FACC15]'
                                        : 'bg-[#3B82F6]/20 text-[#3B82F6]'
                                }`}>
                                    {property.status || 'available'}
                                </span>
                            </div>
                        </div>

                        {/* Property Info */}
                        <div className="p-4 sm:p-6">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                                    <button
                                        onClick={() => { setSelectedProperty(property); setShowPropertyModal(true); setPropertyTab('overview'); }}
                                        className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded bg-[#3B82F6]/20 text-[#3B82F6] hover:bg-[#3B82F6]/40 transition-colors mr-2"
                                    >
                                        <FiEye className="mr-1" /> View
                                    </button>
                                    <button
                                        onClick={() => handleEditProperty(property)}
                                        className="p-1.5 sm:p-2 text-[#22C55E] hover:bg-[#22C55E]/20 rounded-lg transition-colors"
                                        title="Edit Property"
                                    >
                                        <FiEdit className="text-sm sm:text-lg" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteProperty(property._id)}
                                        className="p-1.5 sm:p-2 text-[#FACC15] hover:bg-[#FACC15]/20 rounded-lg transition-colors"
                                        title="Delete Property"
                                    >
                                        <FiTrash2 className="text-sm sm:text-lg" />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2 sm:space-y-3">
                                <div className="flex items-center space-x-2 sm:space-x-3 text-sm">
                                    <FiMapPin className="text-[#94A3B8] flex-shrink-0" />
                                    <span className="text-[#F8FAFC] truncate">{property.address}, {property.city}</span>
                                </div>
                                <div className="flex items-center space-x-2 sm:space-x-3 text-sm">
                                    <FiDollarSign className="text-[#94A3B8] flex-shrink-0" />
                                    <span className="text-[#F8FAFC]">₹{property.monthlyRent}/month</span>
                                </div>
                                <div className="flex items-center space-x-4 sm:space-x-6 text-sm">
                                    <div className="flex items-center space-x-1">
                                        <FiUsers className="text-[#94A3B8]" />
                                        <span className="text-[#F8FAFC]">{property.bhkType?.[0] || 'N/A'} BHK</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <FiHome className="text-[#94A3B8]" />
                                        <span className="text-[#F8FAFC]">{property.area} sq ft</span>
                                    </div>
                                </div>
                                {property.ownerName && (
                                    <div className="flex items-center space-x-2 sm:space-x-3 text-sm">
                                        <FiUser className="text-[#94A3B8] flex-shrink-0" />
                                        <span className="text-[#F8FAFC] truncate">Owner: {property.ownerName}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* No Properties Message */}
            {filteredProperties.length === 0 && !loading && (
                <div className="text-center py-12">
                    <FiHome className="mx-auto text-gray-400 text-4xl mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">No properties found</h3>
                    <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                </div>
            )}

            {/* View Property Modal */}
            {showPropertyModal && selectedProperty && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#1E293B] rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto relative border border-[#334155]">
                        <div className="flex items-center justify-between p-4 border-b border-[#334155]">
                            <h3 className="text-lg font-semibold text-[#F8FAFC]">Property Details</h3>
                            <button
                                onClick={() => setShowPropertyModal(false)}
                                className="text-[#94A3B8] hover:text-[#F8FAFC] transition-colors p-2"
                            >
                                <FiX className="text-xl" />
                            </button>
                        </div>
                        {/* Tab Bar */}
                        <div className="flex border-b border-[#334155] bg-[#1E293B] px-4">
                            {['overview','owner','facilities','nearby','other'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setPropertyTab(tab)}
                                    className={`py-2 px-4 text-sm font-medium capitalize focus:outline-none transition-colors ${
                                        propertyTab === tab
                                            ? 'border-b-2 border-[#3B82F6] text-[#3B82F6] bg-[#1E293B]'
                                            : 'text-[#94A3B8] hover:text-[#3B82F6]'
                                    }`}
                                >
                                    {tab === 'overview' && 'Overview'}
                                    {tab === 'owner' && 'Owner Info'}
                                    {tab === 'facilities' && 'Facilities'}
                                    {tab === 'nearby' && 'Nearby'}
                                    {tab === 'other' && 'Other'}
                                </button>
                            ))}
                        </div>
                        <div className="p-4 space-y-4">
                            {/* Overview Tab */}
                            {propertyTab === 'overview' && (
                                <div className="space-y-3">
                                    <div className="w-full flex gap-2 overflow-x-auto py-2">
                                        {selectedProperty.images && selectedProperty.images.length > 0 ? (
                                            selectedProperty.images.map((img, idx) => (
                                                <img
                                                    key={idx}
                                                    src={img.url}
                                                    alt={`Property ${idx + 1}`}
                                                    className="h-40 w-60 object-cover rounded border border-[#334155]"
                                                />
                                            ))
                                        ) : (
                                            <div className="h-40 w-full flex items-center justify-center bg-[#334155] rounded">
                                                <FiHome className="text-4xl text-[#94A3B8]" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex gap-4 overflow-x-auto py-2">
                                        {selectedProperty.videos && selectedProperty.videos.length > 0 && (
                                            <div className="flex gap-4 overflow-x-auto py-2">
                                                {selectedProperty.videos.map((vid, idx) => (
                                                    <video
                                                        key={idx}
                                                        src={vid.url}
                                                        controls
                                                        className="h-40 w-60 rounded border border-[#334155]"
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      
                                        <div>
                                            <span className="text-xs text-[#94A3B8]">Monthly Rent</span>
                                            <p className="font-medium text-[#F8FAFC]">₹{selectedProperty.monthlyRent || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <span className="text-xs text-[#94A3B8]">Address</span>
                                            <p className="font-medium text-[#F8FAFC]">{selectedProperty.address}, {selectedProperty.city}, {selectedProperty.state}</p>
                                        </div>
                                        <div>
                                            <span className="text-xs text-[#94A3B8]">Popular Locality</span>
                                            <p className="font-medium text-[#F8FAFC]">{selectedProperty.popularLocality || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <span className="text-xs text-[#94A3B8]">BHK Type</span>
                                            <p className="font-medium text-[#F8FAFC]">{selectedProperty.bhkType?.join(', ') || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <span className="text-xs text-[#94A3B8]">Property Type</span>
                                            <p className="font-medium text-[#F8FAFC]">
                                                {Array.isArray(selectedProperty.propertyType)
                                                    ? selectedProperty.propertyType.join(', ')
                                                    : selectedProperty.propertyType || 'N/A'}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-xs text-[#94A3B8]">Furnish Type</span>
                                            <p className="font-medium text-[#F8FAFC]">{selectedProperty.furnishType?.join(', ') || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <span className="text-xs text-[#94A3B8]">Area</span>
                                            <p className="font-medium text-[#F8FAFC]">{selectedProperty.area} sq.ft</p>
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-xs text-[#94A3B8]">Description</span>
                                        <p className="text-sm text-[#F8FAFC]">{selectedProperty.description}</p>
                                    </div>
                                </div>
                            )}
                            {/* Owner Tab */}
                            {propertyTab === 'owner' && (
                                <div className="space-y-3">
                                    <div>
                                        <span className="text-xs text-[#94A3B8]">Owner Name</span>
                                        <p className="font-medium text-[#F8FAFC]">{selectedProperty.ownerName}</p>
                                    </div>
                                    <div>
                                        <span className="text-xs text-[#94A3B8]">Owner Phone</span>
                                        <p className="font-medium text-[#F8FAFC]">{selectedProperty.ownerphone}</p>
                                    </div>
                                    <div>
                                        <span className="text-xs text-[#94A3B8]">Gender Preferences</span>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {selectedProperty.Gender?.map((g, idx) => (
                                                <span key={idx} className="px-3 py-1 rounded-full bg-[#3B82F6]/20 text-[#3B82F6] text-xs font-medium">{g}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {/* Facilities Tab */}
                            {propertyTab === 'facilities' && (
                                <div className="space-y-3">
                                    <div>
                                        <span className="text-xs text-[#94A3B8]">Facilities</span>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {selectedProperty.facilities?.map((f, idx) => (
                                                <span key={idx} className="px-3 py-1 rounded-full bg-[#3B82F6]/20 text-[#3B82F6] text-xs font-medium">{f}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                                        <span className="flex items-center gap-2">
                                            <span className={`w-3 h-3 rounded-full ${selectedProperty.balcony ? 'bg-[#22C55E]' : 'bg-[#FACC15]'}`}></span>
                                            Balcony
                                        </span>
                                        <span className="flex items-center gap-2">
                                            <span className={`w-3 h-3 rounded-full ${selectedProperty.petsAllowed ? 'bg-[#22C55E]' : 'bg-[#FACC15]'}`}></span>
                                            Pets Allowed
                                        </span>
                                        <span className="flex items-center gap-2">
                                            <span className={`w-3 h-3 rounded-full ${selectedProperty.nonVegAllowed ? 'bg-[#22C55E]' : 'bg-[#FACC15]'}`}></span>
                                            Non-Veg Allowed
                                        </span>
                                        <span className="flex items-center gap-2">
                                            <span className={`w-3 h-3 rounded-full ${selectedProperty.smokingAllowed ? 'bg-[#22C55E]' : 'bg-[#FACC15]'}`}></span>
                                            Smoking Allowed
                                        </span>
                                        <span className="flex items-center gap-2">
                                            <span className={`w-3 h-3 rounded-full ${selectedProperty.bachelorAllowed ? 'bg-[#22C55E]' : 'bg-[#FACC15]'}`}></span>
                                            Bachelor Allowed
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                                        <span><span className="font-semibold text-[#F8FAFC]">Parking:</span> <span className="text-[#F8FAFC]">{selectedProperty.parking || 'N/A'}</span></span>
                                        <span><span className="font-semibold text-[#F8FAFC]">Water Supply:</span> <span className="text-[#F8FAFC]">{selectedProperty.waterSupply || 'N/A'}</span></span>
                                        <span><span className="font-semibold text-[#F8FAFC]">Electricity Backup:</span> <span className="text-[#F8FAFC]">{selectedProperty.electricityBackup || 'N/A'}</span></span>
                                        <span><span className="font-semibold text-[#F8FAFC]">Maintenance Charges:</span> <span className="text-[#F8FAFC]">₹{selectedProperty.maintenanceCharges || '0'}</span></span>
                                    </div>
                                </div>
                            )}
                            {/* Nearby Tab */}
                            {propertyTab === 'nearby' && (
                                <div className="space-y-3">
                                    {selectedProperty.nearby && selectedProperty.nearby.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {selectedProperty.nearby.map((place, idx) => (
                                                <span key={idx} className="px-3 py-1 rounded-full bg-[#3B82F6]/20 text-[#3B82F6] text-xs font-medium">
                                                    {place.name}
                                                    {place.distance && ` (${place.distance} ${place.unit})`}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-[#94A3B8] text-sm">No nearby places listed.</p>
                                    )}
                                </div>
                            )}
                            {/* Other Tab */}
                            {propertyTab === 'other' && (
                                <div className="space-y-3 text-xs text-[#94A3B8]">
                                    <span><span className="font-semibold text-[#F8FAFC]">Created:</span> {selectedProperty.createdAt ? new Date(selectedProperty.createdAt).toLocaleString() : 'N/A'}</span>
                                    <span><span className="font-semibold text-[#F8FAFC]">Updated:</span> {selectedProperty.updatedAt ? new Date(selectedProperty.updatedAt).toLocaleString() : 'N/A'}</span>
                                    <span><span className="font-semibold text-[#F8FAFC]">Status:</span> {selectedProperty.status || 'N/A'}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Property Modal */}
            {showEditModal && selectedProperty && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#1E293B] rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto relative border border-[#334155]">
                        <div className="flex items-center justify-between p-4 border-b border-[#334155]">
                            <h3 className="text-lg font-semibold text-[#F8FAFC]">Edit Property</h3>
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="text-[#94A3B8] hover:text-[#F8FAFC] transition-colors p-2"
                            >
                                <FiX className="text-xl" />
                            </button>
                        </div>
                        {/* Tab Bar */}
                        <div className="flex border-b border-[#334155] bg-[#1E293B] px-4">
                            {['overview','owner','facilities','nearby','other'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setEditTab(tab)}
                                    className={`py-2 px-4 text-sm font-medium capitalize focus:outline-none transition-colors ${
                                        editTab === tab
                                            ? 'border-b-2 border-[#3B82F6] text-[#3B82F6] bg-[#1E293B]'
                                            : 'text-[#94A3B8] hover:text-[#3B82F6]'
                                    }`}
                                >
                                    {tab === 'overview' && 'Overview'}
                                    {tab === 'owner' && 'Owner Info'}
                                    {tab === 'facilities' && 'Facilities'}
                                    {tab === 'nearby' && 'Nearby'}
                                    {tab === 'other' && 'Other'}
                                </button>
                            ))}
                        </div>
                        <form onSubmit={(e) => { e.preventDefault(); handleUpdateProperty(); }} className="p-4 space-y-4">
                            {/* Overview Tab */}
                            {editTab === 'overview' && (
                                <div className="space-y-3">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-[#F8FAFC] mb-1">Monthly Rent</label>
                                            <input
                                                type="number"
                                                value={editForm.monthlyRent}
                                                onChange={e => setEditForm({ ...editForm, monthlyRent: e.target.value })}
                                                className="w-full px-3 py-2 border border-[#334155] rounded-lg bg-[#1E293B] text-[#F8FAFC] placeholder-[#94A3B8] focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
                                                placeholder="Monthly Rent"
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-xs font-medium text-[#F8FAFC] mb-1">Description</label>
                                            <textarea
                                                value={editForm.description}
                                                onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                                                rows={2}
                                                className="w-full px-3 py-2 border border-[#334155] rounded-lg bg-[#1E293B] text-[#F8FAFC] placeholder-[#94A3B8] focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
                                                placeholder="Description"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-[#F8FAFC] mb-1">Address</label>
                                            <input type="text" value={editForm.address} onChange={e => setEditForm({ ...editForm, address: e.target.value })} className="w-full px-3 py-2 border border-[#334155] rounded-lg bg-[#1E293B] text-[#F8FAFC] placeholder-[#94A3B8] focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-[#F8FAFC] mb-1">City</label>
                                            <input type="text" value={editForm.city} onChange={e => setEditForm({ ...editForm, city: e.target.value })} className="w-full px-3 py-2 border border-[#334155] rounded-lg bg-[#1E293B] text-[#F8FAFC] placeholder-[#94A3B8] focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-[#F8FAFC] mb-1">State</label>
                                            <input type="text" value={editForm.state} onChange={e => setEditForm({ ...editForm, state: e.target.value })} className="w-full px-3 py-2 border border-[#334155] rounded-lg bg-[#1E293B] text-[#F8FAFC] placeholder-[#94A3B8] focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-[#F8FAFC] mb-1">Popular Locality</label>
                                            <input type="text" value={editForm.popularLocality} onChange={e => setEditForm({ ...editForm, popularLocality: e.target.value })} className="w-full px-3 py-2 border border-[#334155] rounded-lg bg-[#1E293B] text-[#F8FAFC] placeholder-[#94A3B8] focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-[#F8FAFC] mb-1">BHK Type</label>
                                            <input type="text" value={editForm.bhkType} onChange={e => setEditForm({ ...editForm, bhkType: e.target.value })} className="w-full px-3 py-2 border border-[#334155] rounded-lg bg-[#1E293B] text-[#F8FAFC] placeholder-[#94A3B8] focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-[#F8FAFC] mb-1">Property Type</label>
                                            <input type="text" value={editForm.propertyType} onChange={e => setEditForm({ ...editForm, propertyType: e.target.value })} className="w-full px-3 py-2 border border-[#334155] rounded-lg bg-[#1E293B] text-[#F8FAFC] placeholder-[#94A3B8] focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-[#F8FAFC] mb-1">Furnish Type</label>
                                            <input type="text" value={editForm.furnishType} onChange={e => setEditForm({ ...editForm, furnishType: e.target.value })} className="w-full px-3 py-2 border border-[#334155] rounded-lg bg-[#1E293B] text-[#F8FAFC] placeholder-[#94A3B8] focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-[#F8FAFC] mb-1">Area (sq.ft)</label>
                                            <input type="number" value={editForm.area} onChange={e => setEditForm({ ...editForm, area: e.target.value })} className="w-full px-3 py-2 border border-[#334155] rounded-lg bg-[#1E293B] text-[#F8FAFC] placeholder-[#94A3B8] focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent" />
                                        </div>
                                    </div>
                                </div>
                            )}
                            {/* Owner Tab */}
                            {editTab === 'owner' && (
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-xs font-medium text-[#F8FAFC] mb-1">Owner Name</label>
                                        <input type="text" value={editForm.ownerName} onChange={e => setEditForm({ ...editForm, ownerName: e.target.value })} className="w-full px-3 py-2 border border-[#334155] rounded-lg bg-[#1E293B] text-[#F8FAFC] placeholder-[#94A3B8] focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-[#F8FAFC] mb-1">Owner Phone</label>
                                        <input type="text" value={editForm.ownerphone} onChange={e => setEditForm({ ...editForm, ownerphone: e.target.value })} className="w-full px-3 py-2 border border-[#334155] rounded-lg bg-[#1E293B] text-[#F8FAFC] placeholder-[#94A3B8] focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-[#F8FAFC] mb-1">Gender Preferences</label>
                                        <input type="text" value={editForm.Gender} onChange={e => setEditForm({ ...editForm, Gender: e.target.value })} className="w-full px-3 py-2 border border-[#334155] rounded-lg bg-[#1E293B] text-[#F8FAFC] placeholder-[#94A3B8] focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent" />
                                    </div>
                                </div>
                            )}
                            {/* Facilities Tab */}
                            {editTab === 'facilities' && (
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-xs font-medium text-[#F8FAFC] mb-1">Facilities</label>
                                        <input type="text" value={editForm.facilities} onChange={e => setEditForm({ ...editForm, facilities: e.target.value })} className="w-full px-3 py-2 border border-[#334155] rounded-lg bg-[#1E293B] text-[#F8FAFC] placeholder-[#94A3B8] focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                                        <label className="flex items-center gap-2">
                                            <input type="checkbox" checked={editForm.balcony} onChange={e => setEditForm({ ...editForm, balcony: e.target.checked })} />
                                            Balcony
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <input type="checkbox" checked={editForm.petsAllowed} onChange={e => setEditForm({ ...editForm, petsAllowed: e.target.checked })} />
                                            Pets Allowed
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <input type="checkbox" checked={editForm.nonVegAllowed} onChange={e => setEditForm({ ...editForm, nonVegAllowed: e.target.checked })} />
                                            Non-Veg Allowed
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <input type="checkbox" checked={editForm.smokingAllowed} onChange={e => setEditForm({ ...editForm, smokingAllowed: e.target.checked })} />
                                            Smoking Allowed
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <input type="checkbox" checked={editForm.bachelorAllowed} onChange={e => setEditForm({ ...editForm, bachelorAllowed: e.target.checked })} />
                                            Bachelor Allowed
                                        </label>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                                        <label className="block text-xs font-medium text-[#F8FAFC] mb-1">Parking</label>
                                        <input type="text" value={editForm.parking} onChange={e => setEditForm({ ...editForm, parking: e.target.value })} className="w-full px-3 py-2 border border-[#334155] rounded-lg bg-[#1E293B] text-[#F8FAFC] placeholder-[#94A3B8] focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent" />
                                        <label className="block text-xs font-medium text-[#F8FAFC] mb-1">Water Supply</label>
                                        <input type="text" value={editForm.waterSupply} onChange={e => setEditForm({ ...editForm, waterSupply: e.target.value })} className="w-full px-3 py-2 border border-[#334155] rounded-lg bg-[#1E293B] text-[#F8FAFC] placeholder-[#94A3B8] focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent" />
                                        <label className="block text-xs font-medium text-[#F8FAFC] mb-1">Electricity Backup</label>
                                        <input type="text" value={editForm.electricityBackup} onChange={e => setEditForm({ ...editForm, electricityBackup: e.target.value })} className="w-full px-3 py-2 border border-[#334155] rounded-lg bg-[#1E293B] text-[#F8FAFC] placeholder-[#94A3B8] focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent" />
                                        <label className="block text-xs font-medium text-[#F8FAFC] mb-1">Maintenance Charges</label>
                                        <input type="number" value={editForm.maintenanceCharges} onChange={e => setEditForm({ ...editForm, maintenanceCharges: e.target.value })} className="w-full px-3 py-2 border border-[#334155] rounded-lg bg-[#1E293B] text-[#F8FAFC] placeholder-[#94A3B8] focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent" />
                                    </div>
                                </div>
                            )}
                            {/* Nearby Tab */}
                            {editTab === 'nearby' && (
                                <div className="space-y-3">
                                    <label className="block text-xs font-medium text-[#F8FAFC] mb-1">Nearby Places (comma separated)</label>
                                    <input type="text" value={editForm.nearby} onChange={e => setEditForm({ ...editForm, nearby: e.target.value })} className="w-full px-3 py-2 border border-[#334155] rounded-lg bg-[#1E293B] text-[#F8FAFC] placeholder-[#94A3B8] focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent" />
                                </div>
                            )}
                            {/* Other Tab */}
                            {editTab === 'other' && (
                                <div className="space-y-3 text-xs text-[#94A3B8]">
                                    <label className="block text-xs font-medium text-[#F8FAFC] mb-1">Security Deposit</label>
                                    <input type="number" value={editForm.securityDeposit} onChange={e => setEditForm({ ...editForm, securityDeposit: e.target.value })} className="w-full px-3 py-2 border border-[#334155] rounded-lg bg-[#1E293B] text-[#F8FAFC] placeholder-[#94A3B8] focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent" />
                                    <label className="block text-xs font-medium text-[#F8FAFC] mb-1">Available From</label>
                                    <input type="date" value={editForm.availableFrom} onChange={e => setEditForm({ ...editForm, availableFrom: e.target.value })} className="w-full px-3 py-2 border border-[#334155] rounded-lg bg-[#1E293B] text-[#F8FAFC] placeholder-[#94A3B8] focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent" />
                                    <label className="block text-xs font-medium text-[#F8FAFC] mb-1">Status</label>
                                    <input type="text" value={editForm.status} onChange={e => setEditForm({ ...editForm, status: e.target.value })} className="w-full px-3 py-2 border border-[#334155] rounded-lg bg-[#1E293B] text-[#F8FAFC] placeholder-[#94A3B8] focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent" />
                                </div>
                            )}
                            <div className="flex justify-end pt-4">
                                <button type="submit" className="bg-[#3B82F6] text-[#F8FAFC] py-2 px-6 rounded-lg hover:bg-[#2563EB] transition-colors font-medium">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PropertiesTab;