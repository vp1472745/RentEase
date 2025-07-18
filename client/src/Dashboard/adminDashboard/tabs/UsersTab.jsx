import React, { useState, useEffect } from 'react';
import API from '../../../lib/axios';
import { FiUsers, FiSearch, FiFilter, FiEye, FiTrash2, FiUser, FiMail, FiPhone, FiCalendar, FiMapPin, FiX } from 'react-icons/fi';

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
            case 'owner': return 'bg-[#3B82F6]/20 text-[#3B82F6]';
            case 'tenant': return 'bg-[#22C55E]/20 text-[#22C55E]';
            default: return 'bg-[#334155] text-[#F8FAFC]';
        }
    };

    if (loading) {
        return (
            <div className="space-y-6 bg-[#0F172A] min-h-[400px]">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold text-[#F8FAFC]">Manage Users</h2>
                    <div className="animate-pulse bg-[#334155] h-10 w-32 rounded"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="bg-[#1E293B] p-6 rounded-lg shadow-md animate-pulse">
                            <div className="h-4 bg-[#334155] rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-[#334155] rounded w-1/2"></div>
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
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#F8FAFC]">Manage Users</h2>
                    <p className="text-[#94A3B8] mt-1">View and manage all registered users</p>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="bg-[#1E293B] px-3 sm:px-4 py-2 rounded-lg shadow-sm border border-[#334155]">
                        <span className="text-sm text-[#94A3B8]">Total Users: </span>
                        <span className="font-semibold text-[#3B82F6]">{users.length}</span>
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
                            placeholder="Search users by name, email, or phone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-[#334155] rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent bg-[#1E293B] text-[#F8FAFC] placeholder-[#94A3B8]"
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <FiFilter className="text-[#94A3B8]" />
                        <select
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                            className="px-3 sm:px-4 py-2 border border-[#334155] rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent bg-[#1E293B] text-[#F8FAFC]"
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
                    <div key={user._id} className="bg-[#1E293B] rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-[#334155]">
                        <div className="p-4 sm:p-6">
                            {/* User Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center space-x-3 flex-1">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#334155] rounded-full flex items-center justify-center flex-shrink-0">
                                        <FiUser className="text-[#3B82F6] text-lg sm:text-xl" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h3 className="font-semibold text-[#F8FAFC] text-sm sm:text-base truncate">{user.name}</h3>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                                            {user.role}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                                    <button
                                        onClick={() => handleViewUser(user)}
                                        className="p-1.5 sm:p-2 text-[#3B82F6] hover:bg-[#334155] rounded-lg transition-colors"
                                        title="View Details"
                                    >
                                        <FiEye className="text-sm sm:text-lg" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteUser(user._id)}
                                        className="p-1.5 sm:p-2 text-[#FACC15] hover:bg-[#334155] rounded-lg transition-colors"
                                        title="Delete User"
                                    >
                                        <FiTrash2 className="text-sm sm:text-lg" />
                                    </button>
                                </div>
                            </div>

                            {/* User Info */}
                            <div className="space-y-2 sm:space-y-3">
                                <div className="flex items-center space-x-2 sm:space-x-3 text-sm">
                                    <FiMail className="text-[#94A3B8] flex-shrink-0" />
                                    <span className="text-[#F8FAFC] truncate">{user.email}</span>
                                </div>
                                {user.phone && (
                                    <div className="flex items-center space-x-2 sm:space-x-3 text-sm">
                                        <FiPhone className="text-[#94A3B8] flex-shrink-0" />
                                        <span className="text-[#F8FAFC]">{user.phone}</span>
                                    </div>
                                )}
                                {user.location && (
                                    <div className="flex items-center space-x-2 sm:space-x-3 text-sm">
                                        <FiMapPin className="text-[#94A3B8] flex-shrink-0" />
                                        <span className="text-[#F8FAFC] truncate">{user.location}</span>
                                    </div>
                                )}
                                <div className="flex items-center space-x-2 sm:space-x-3 text-sm">
                                    <FiCalendar className="text-[#94A3B8] flex-shrink-0" />
                                    <span className="text-[#F8FAFC]">
                                        Joined: {new Date(user.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>

                            {/* Status */}
                            <div className="mt-4 pt-4 border-t border-[#334155]">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-[#94A3B8]">Status</span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        user.isActive ? 'bg-[#22C55E]/20 text-[#22C55E]' : 'bg-[#FACC15]/20 text-[#FACC15]'
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
                    <FiUsers className="mx-auto text-[#334155] text-4xl mb-4" />
                    <h3 className="text-lg font-medium text-[#F8FAFC] mb-2">No users found</h3>
                    <p className="text-[#94A3B8]">Try adjusting your search or filter criteria</p>
                </div>
            )}

            {/* View User Modal */}
            {showUserModal && selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#1E293B] rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#334155]">
                        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[#334155]">
                            <h3 className="text-lg sm:text-xl font-semibold text-[#F8FAFC]">User Details</h3>
                            <button
                                onClick={() => setShowUserModal(false)}
                                className="text-[#94A3B8] hover:text-[#F8FAFC] transition-colors p-2"
                            >
                                <FiX className="text-xl" />
                            </button>
                        </div>
                        <div className="p-4 sm:p-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-medium text-[#F8FAFC] mb-4">Personal Information</h4>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-sm text-[#94A3B8]">Name</label>
                                            <p className="font-medium text-[#F8FAFC]">{selectedUser.name}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm text-[#94A3B8]">Email</label>
                                            <p className="font-medium text-[#F8FAFC]">{selectedUser.email}</p>
                                        </div>
                                        {selectedUser.phone && (
                                            <div>
                                                <label className="text-sm text-[#94A3B8]">Phone</label>
                                                <p className="font-medium text-[#F8FAFC]">{selectedUser.phone}</p>
                                            </div>
                                        )}
                                        <div>
                                            <label className="text-sm text-[#94A3B8]">Role</label>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(selectedUser.role)}`}>
                                                {selectedUser.role}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-medium text-[#F8FAFC] mb-4">Account Information</h4>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-sm text-[#94A3B8]">Status</label>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                selectedUser.isActive ? 'bg-[#22C55E]/20 text-[#22C55E]' : 'bg-[#FACC15]/20 text-[#FACC15]'
                                            }`}>
                                                {selectedUser.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                        <div>
                                            <label className="text-sm text-[#94A3B8]">Joined Date</label>
                                            <p className="font-medium text-[#F8FAFC]">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        {selectedUser.location && (
                                            <div>
                                                <label className="text-sm text-[#94A3B8]">Location</label>
                                                <p className="font-medium text-[#F8FAFC]">{selectedUser.location}</p>
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