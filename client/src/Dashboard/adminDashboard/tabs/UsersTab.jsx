import React, { useState, useEffect } from 'react';
import API from '../../../lib/axios';
import { FiUsers, FiSearch, FiFilter, FiEye, FiEdit, FiTrash2, FiUser, FiHome, FiMail, FiPhone, FiCalendar, FiMapPin, FiX } from 'react-icons/fi';

const UsersTab = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [selectedUser, setSelectedUser] = useState(null);
    const [showUserModal, setShowUserModal] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await API.get('/api/admin/getAllUsers', { withCredentials: true });
            setUsers(response.data.users || []);
        } catch (err) {
            console.error('Error fetching users:', err);
            setError('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.phone?.includes(searchTerm);
        const matchesRole = filterRole === 'all' || user.role === filterRole;
        return matchesSearch && matchesRole;
    });

    const handleViewUser = (user) => {
        setSelectedUser(user);
        setShowUserModal(true);
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await API.delete(`/api/admin/deleteUser/${userId}`, { withCredentials: true });
                fetchUsers(); // Refresh the list
            } catch (err) {
                console.error('Error deleting user:', err);
                alert('Failed to delete user');
            }
        }
    };

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case 'owner': return 'bg-blue-100 text-blue-800';
            case 'tenant': return 'bg-green-100 text-green-800';
    
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold text-gray-800">Manage Users</h2>
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
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">Manage Users</h2>
                    <p className="text-gray-600 mt-1">View and manage all registered users</p>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="bg-white px-3 sm:px-4 py-2 rounded-lg shadow-sm border">
                        <span className="text-sm text-gray-600">Total Users: </span>
                        <span className="font-semibold text-purple-600">{users.length}</span>
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
                            placeholder="Search users by name, email, or phone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <FiFilter className="text-gray-400" />
                        <select
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                            className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                            <option value="all">All Roles</option>
                            <option value="owner">Owners</option>
                            <option value="tenant">Tenants</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Users Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredUsers.map((user) => (
                    <div key={user._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                        <div className="p-4 sm:p-6">
                            {/* User Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center space-x-3 flex-1">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <FiUser className="text-purple-600 text-lg sm:text-xl" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h3 className="font-semibold text-gray-800 text-sm sm:text-base truncate">{user.name}</h3>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                                            {user.role}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                                    <button
                                        onClick={() => handleViewUser(user)}
                                        className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="View Details"
                                    >
                                        <FiEye className="text-sm sm:text-lg" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteUser(user._id)}
                                        className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete User"
                                    >
                                        <FiTrash2 className="text-sm sm:text-lg" />
                                    </button>
                                </div>
                            </div>

                            {/* User Info */}
                            <div className="space-y-2 sm:space-y-3">
                                <div className="flex items-center space-x-2 sm:space-x-3 text-sm">
                                    <FiMail className="text-gray-400 flex-shrink-0" />
                                    <span className="text-gray-600 truncate">{user.email}</span>
                                </div>
                                {user.phone && (
                                    <div className="flex items-center space-x-2 sm:space-x-3 text-sm">
                                        <FiPhone className="text-gray-400 flex-shrink-0" />
                                        <span className="text-gray-600">{user.phone}</span>
                                    </div>
                                )}
                                {user.location && (
                                    <div className="flex items-center space-x-2 sm:space-x-3 text-sm">
                                        <FiMapPin className="text-gray-400 flex-shrink-0" />
                                        <span className="text-gray-600 truncate">{user.location}</span>
                                    </div>
                                )}
                                <div className="flex items-center space-x-2 sm:space-x-3 text-sm">
                                    <FiCalendar className="text-gray-400 flex-shrink-0" />
                                    <span className="text-gray-600">
                                        Joined: {new Date(user.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>

                            {/* Status */}
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500">Status</span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                        {user.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* No Users Message */}
            {filteredUsers.length === 0 && !loading && (
                <div className="text-center py-12">
                    <FiUsers className="mx-auto text-gray-400 text-4xl mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">No users found</h3>
                    <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                </div>
            )}

            {/* View User Modal */}
            {showUserModal && selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-800">User Details</h3>
                            <button
                                onClick={() => setShowUserModal(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors p-2"
                            >
                                <FiX className="text-xl" />
                            </button>
                        </div>
                        <div className="p-4 sm:p-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-medium text-gray-800 mb-4">Personal Information</h4>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-sm text-gray-500">Name</label>
                                            <p className="font-medium">{selectedUser.name}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-500">Email</label>
                                            <p className="font-medium">{selectedUser.email}</p>
                                        </div>
                                        {selectedUser.phone && (
                                            <div>
                                                <label className="text-sm text-gray-500">Phone</label>
                                                <p className="font-medium">{selectedUser.phone}</p>
                                            </div>
                                        )}
                                        <div>
                                            <label className="text-sm text-gray-500">Role</label>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(selectedUser.role)}`}>
                                                {selectedUser.role}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-800 mb-4">Account Information</h4>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-sm text-gray-500">Status</label>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                selectedUser.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                                {selectedUser.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-500">Joined Date</label>
                                            <p className="font-medium">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        {selectedUser.location && (
                                            <div>
                                                <label className="text-sm text-gray-500">Location</label>
                                                <p className="font-medium">{selectedUser.location}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersTab; 