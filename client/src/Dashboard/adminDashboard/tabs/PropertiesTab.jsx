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
        const matchesSearch = property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            property.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            property.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            property.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || property.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const handleViewProperty = (property) => {
        setSelectedProperty(property);
        setShowPropertyModal(true);
    };

    const handleEditProperty = (property) => {
        setEditForm({
            title: property.title || '',
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
        <div className="space-y-4 sm:space-y-6 overflow-y-auto max-h-[calc(100vh-120px)] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">Manage Properties</h2>
                    <p className="text-gray-600 mt-1">View and manage all listed properties</p>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="bg-white px-3 sm:px-4 py-2 rounded-lg shadow-sm border">
                        <span className="text-sm text-gray-600">Total Properties: </span>
                        <span className="font-semibold text-purple-600">{properties.length}</span>
                    </div>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search properties by title, location, or description..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <FiFilter className="text-gray-400" />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                    <div key={property._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
                        {/* Property Image */}
                        <div className="h-40 sm:h-48 bg-gray-200 relative">
                            {property.images && property.images.length > 0 ? (
                                <img 
                                    src={property.images[0].url} 
                                    alt={property.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <FiHome className="text-gray-400 text-3xl sm:text-4xl" />
                                </div>
                            )}
                            <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(property.status || 'available')}`}>
                                    {property.status || 'available'}
                                </span>
                            </div>
                        </div>

                        {/* Property Info */}
                        <div className="p-4 sm:p-6">
                            <div className="flex items-start justify-between mb-3">
                                <h3 className="font-semibold text-gray-800 text-base sm:text-lg flex-1 mr-2">{property.title}</h3>
                                <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                                    <button
                                        onClick={() => handleViewProperty(property)}
                                        className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="View Details"
                                    >
                                        <FiEye className="text-sm sm:text-lg" />
                                    </button>
                                    <button
                                        onClick={() => handleEditProperty(property)}
                                        className="p-1.5 sm:p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                        title="Edit Property"
                                    >
                                        <FiEdit className="text-sm sm:text-lg" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteProperty(property._id)}
                                        className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete Property"
                                    >
                                        <FiTrash2 className="text-sm sm:text-lg" />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2 sm:space-y-3">
                                <div className="flex items-center space-x-2 sm:space-x-3 text-sm">
                                    <FiMapPin className="text-gray-400 flex-shrink-0" />
                                    <span className="text-gray-600 truncate">{property.address}, {property.city}</span>
                                </div>
                                <div className="flex items-center space-x-2 sm:space-x-3 text-sm">
                                    <FiDollarSign className="text-gray-400 flex-shrink-0" />
                                    <span className="text-gray-600">₹{property.monthlyRent}/month</span>
                                </div>
                                <div className="flex items-center space-x-4 sm:space-x-6 text-sm">
                                    <div className="flex items-center space-x-1">
                                        <FiUsers className="text-gray-400" />
                                        <span className="text-gray-600">{property.bhkType?.[0] || 'N/A'} BHK</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <FiHome className="text-gray-400" />
                                        <span className="text-gray-600">{property.area} sq ft</span>
                                    </div>
                                </div>
                                {property.ownerName && (
                                    <div className="flex items-center space-x-2 sm:space-x-3 text-sm">
                                        <FiUser className="text-gray-400 flex-shrink-0" />
                                        <span className="text-gray-600 truncate">Owner: {property.ownerName}</span>
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
                    <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Property Details</h3>
                            <button
                                onClick={() => setShowPropertyModal(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors p-2"
                            >
                                <FiX className="text-xl" />
                            </button>
                        </div>
                        <div className="p-4 sm:p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Property Images */}
                                <div>
                                    <h4 className="font-medium text-gray-800 mb-4">Property Images</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        {selectedProperty.images && selectedProperty.images.length > 0 ? (
                                            selectedProperty.images.slice(0, 4).map((image, index) => (
                                                <div key={index} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                                                    <img 
                                                        src={image.url} 
                                                        alt={`Property ${index + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            ))
                                        ) : (
                                            <div className="col-span-2 aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                                                <FiHome className="text-gray-400 text-4xl" />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Property Information */}
                                <div className="space-y-6">
                                    {/* Basic Info */}
                                    <div>
                                        <h4 className="font-medium text-gray-800 mb-4">Basic Information</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm text-gray-500">Title</label>
                                                <p className="font-medium">{selectedProperty.title}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm text-gray-500">Monthly Rent</label>
                                                <p className="font-medium">₹{selectedProperty.monthlyRent}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm text-gray-500">Address</label>
                                                <p className="font-medium">{selectedProperty.address}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm text-gray-500">City</label>
                                                <p className="font-medium">{selectedProperty.city}</p>
                                            </div>
                                            {selectedProperty.popularLocality && (
                                                <div className="sm:col-span-2">
                                                    <label className="text-sm text-gray-500">Popular Locality</label>
                                                    <p className="font-medium">{selectedProperty.popularLocality}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Property Details */}
                                    <div>
                                        <h4 className="font-medium text-gray-800 mb-4">Property Details</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm text-gray-500">BHK Type</label>
                                                <p className="font-medium">{selectedProperty.bhkType?.[0] || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm text-gray-500">Property Type</label>
                                                <p className="font-medium">{selectedProperty.propertyType?.[0] || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm text-gray-500">Furnish Type</label>
                                                <p className="font-medium">{selectedProperty.furnishType?.[0] || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm text-gray-500">Area</label>
                                                <p className="font-medium">{selectedProperty.area} sq ft</p>
                                            </div>
                                            <div>
                                                <label className="text-sm text-gray-500">Floor Number</label>
                                                <p className="font-medium">{selectedProperty.floorNumber}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm text-gray-500">Total Floors</label>
                                                <p className="font-medium">{selectedProperty.totalFloors}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm text-gray-500">Age of Property</label>
                                                <p className="font-medium">{selectedProperty.ageOfProperty} years</p>
                                            </div>
                                            <div>
                                                <label className="text-sm text-gray-500">Facing Direction</label>
                                                <p className="font-medium">{selectedProperty.facingDirection}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Additional Details */}
                                    <div>
                                        <h4 className="font-medium text-gray-800 mb-4">Additional Details</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm text-gray-500">Maintenance Charges</label>
                                                <p className="font-medium">₹{selectedProperty.maintenanceCharges}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm text-gray-500">Security Deposit</label>
                                                <p className="font-medium">₹{selectedProperty.securityDeposit}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm text-gray-500">Available From</label>
                                                <p className="font-medium">{new Date(selectedProperty.availableFrom).toLocaleDateString()}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm text-gray-500">Status</label>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(selectedProperty.status || 'available')}`}>
                                                    {selectedProperty.status || 'available'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Facilities */}
                                    <div>
                                        <h4 className="font-medium text-gray-800 mb-4">Facilities</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="flex items-center space-x-2">
                                                <span className={`w-3 h-3 rounded-full ${selectedProperty.balcony ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                                <span className="text-sm">Balcony</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <span className={`w-3 h-3 rounded-full ${selectedProperty.petsAllowed ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                                <span className="text-sm">Pets Allowed</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <span className={`w-3 h-3 rounded-full ${selectedProperty.nonVegAllowed ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                                <span className="text-sm">Non-Veg Allowed</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <span className={`w-3 h-3 rounded-full ${selectedProperty.smokingAllowed ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                                <span className="text-sm">Smoking Allowed</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <span className={`w-3 h-3 rounded-full ${selectedProperty.bachelorAllowed ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                                <span className="text-sm">Bachelor Allowed</span>
                                            </div>
                                            <div>
                                                <label className="text-sm text-gray-500">Parking</label>
                                                <p className="font-medium">{selectedProperty.parking}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm text-gray-500">Water Supply</label>
                                                <p className="font-medium">{selectedProperty.waterSupply}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm text-gray-500">Electricity Backup</label>
                                                <p className="font-medium">{selectedProperty.electricityBackup}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Property Modal */}
            {showEditModal && selectedProperty && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Edit Property</h3>
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors p-2"
                            >
                                <FiX className="text-xl" />
                            </button>
                        </div>
                        <div className="p-4 sm:p-6">
                            <form onSubmit={(e) => { e.preventDefault(); handleUpdateProperty(); }} className="space-y-6">
                                {/* Basic Information */}
                                <div>
                                    <h4 className="font-medium text-gray-800 mb-4">Basic Information</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                            <input
                                                type="text"
                                                value={editForm.title}
                                                onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Rent</label>
                                            <input
                                                type="number"
                                                value={editForm.monthlyRent}
                                                onChange={(e) => setEditForm({...editForm, monthlyRent: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                            <textarea
                                                value={editForm.description}
                                                onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                                                rows={3}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Location Information */}
                                <div>
                                    <h4 className="font-medium text-gray-800 mb-4">Location Information</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                            <input
                                                type="text"
                                                value={editForm.address}
                                                onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                            <input
                                                type="text"
                                                value={editForm.city}
                                                onChange={(e) => setEditForm({...editForm, city: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                                            <input
                                                type="text"
                                                value={editForm.state}
                                                onChange={(e) => setEditForm({...editForm, state: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Popular Locality</label>
                                            <input
                                                type="text"
                                                value={editForm.popularLocality}
                                                onChange={(e) => setEditForm({...editForm, popularLocality: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Property Details */}
                                <div>
                                    <h4 className="font-medium text-gray-800 mb-4">Property Details</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">BHK Type</label>
                                            <select
                                                value={editForm.bhkType?.[0] || ''}
                                                onChange={(e) => setEditForm({...editForm, bhkType: [e.target.value]})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            >
                                                <option value="">Select BHK Type</option>
                                                <option value="1 BHK">1 BHK</option>
                                                <option value="2 BHK">2 BHK</option>
                                                <option value="3 BHK">3 BHK</option>
                                                <option value="4 BHK">4 BHK</option>
                                                <option value="5+ BHK">5+ BHK</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                                            <select
                                                value={editForm.propertyType?.[0] || ''}
                                                onChange={(e) => setEditForm({...editForm, propertyType: [e.target.value]})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            >
                                                <option value="">Select Property Type</option>
                                                <option value="apartment">Apartment</option>
                                                <option value="house">House</option>
                                                <option value="villa">Villa</option>
                                                <option value="pg">PG</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Furnish Type</label>
                                            <select
                                                value={editForm.furnishType?.[0] || ''}
                                                onChange={(e) => setEditForm({...editForm, furnishType: [e.target.value]})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            >
                                                <option value="">Select Furnish Type</option>
                                                <option value="fully furnished">Fully Furnished</option>
                                                <option value="semi furnished">Semi Furnished</option>
                                                <option value="unfurnished">Unfurnished</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Area (sq ft)</label>
                                            <input
                                                type="number"
                                                value={editForm.area}
                                                onChange={(e) => setEditForm({...editForm, area: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Additional Details */}
                                <div>
                                    <h4 className="font-medium text-gray-800 mb-4">Additional Details</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Floor Number</label>
                                            <input
                                                type="number"
                                                value={editForm.floorNumber}
                                                onChange={(e) => setEditForm({...editForm, floorNumber: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Total Floors</label>
                                            <input
                                                type="number"
                                                value={editForm.totalFloors}
                                                onChange={(e) => setEditForm({...editForm, totalFloors: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Age of Property</label>
                                            <input
                                                type="number"
                                                value={editForm.ageOfProperty}
                                                onChange={(e) => setEditForm({...editForm, ageOfProperty: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Facing Direction</label>
                                            <select
                                                value={editForm.facingDirection}
                                                onChange={(e) => setEditForm({...editForm, facingDirection: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            >
                                                <option value="">Select Direction</option>
                                                <option value="North">North</option>
                                                <option value="South">South</option>
                                                <option value="East">East</option>
                                                <option value="West">West</option>
                                                <option value="North-East">North-East</option>
                                                <option value="North-West">North-West</option>
                                                <option value="South-East">South-East</option>
                                                <option value="South-West">South-West</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Owner Information */}
                                <div>
                                    <h4 className="font-medium text-gray-800 mb-4">Owner Information</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Owner Name</label>
                                            <input
                                                type="text"
                                                value={editForm.ownerName}
                                                onChange={(e) => setEditForm({...editForm, ownerName: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Owner Phone</label>
                                            <input
                                                type="text"
                                                value={editForm.ownerphone}
                                                onChange={(e) => setEditForm({...editForm, ownerphone: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Rent & Availability */}
                                <div>
                                    <h4 className="font-medium text-gray-800 mb-4">Rent & Availability</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Security Deposit</label>
                                            <input
                                                type="number"
                                                value={editForm.securityDeposit}
                                                onChange={(e) => setEditForm({...editForm, securityDeposit: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Available From</label>
                                            <input
                                                type="date"
                                                value={editForm.availableFrom}
                                                onChange={(e) => setEditForm({...editForm, availableFrom: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Gender Preferences */}
                                <div>
                                    <h4 className="font-medium text-gray-800 mb-4">Gender Preferences</h4>
                                    <div className="flex flex-wrap gap-4">
                                        {['Couple Friendly', 'Family', 'Student', 'Working professional', 'Single'].map(option => (
                                            <label key={option} className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={editForm.Gender?.includes(option) || false}
                                                    onChange={e => {
                                                        let newGender = editForm.Gender ? [...editForm.Gender] : [];
                                                        if (e.target.checked) {
                                                            newGender.push(option);
                                                        } else {
                                                            newGender = newGender.filter(g => g !== option);
                                                        }
                                                        setEditForm({...editForm, Gender: newGender});
                                                    }}
                                                />
                                                <span>{option}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Facilities (Multi-select) */}
                                <div>
                                    <h4 className="font-medium text-gray-800 mb-4">Facilities</h4>
                                    <div className="flex flex-wrap gap-4">
                                        {['electricity', 'wifi', 'water supply', 'parking', 'security', 'lift', 'gym', 'swimming pool'].map(option => (
                                            <label key={option} className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={editForm.facilities?.includes(option) || false}
                                                    onChange={e => {
                                                        let newFacilities = editForm.facilities ? [...editForm.facilities] : [];
                                                        if (e.target.checked) {
                                                            newFacilities.push(option);
                                                        } else {
                                                            newFacilities = newFacilities.filter(f => f !== option);
                                                        }
                                                        setEditForm({...editForm, facilities: newFacilities});
                                                    }}
                                                />
                                                <span>{option}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Form Actions */}
                                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                                    >
                                        Update Property
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowEditModal(false)}
                                        className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PropertiesTab; 