import React, { useState, useEffect } from 'react';
import API from '../../../lib/axios';
import { FiMonitor, FiLogIn, FiLogOut, FiSearch, FiTrash2, FiCheckSquare, FiSquare } from 'react-icons/fi';

const SettingsTab = () => {
    const [sessionLogs, setSessionLogs] = useState([]);
    const [searchLogs, setSearchLogs] = useState([]);
    const [loadingLogs, setLoadingLogs] = useState(true);
    const [errorLogs, setErrorLogs] = useState(null);
    const [selectedSessionLogs, setSelectedSessionLogs] = useState([]);
    const [selectedSearchLogs, setSelectedSearchLogs] = useState([]);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                setLoadingLogs(true);
                const [sessionRes, searchRes] = await Promise.all([
                    API.get('/api/admin/session-logs', { withCredentials: true }),
                    API.get('/api/admin/search-logs', { withCredentials: true })
                ]);
                setSessionLogs(sessionRes.data || []);
                setSearchLogs(searchRes.data || []);
            } catch (err) {
                setErrorLogs('Failed to fetch analytics logs.');
            } finally {
                setLoadingLogs(false);
            }
        };
        fetchLogs();
    }, []);

    const handleSessionLogSelect = (logId) => {
        setSelectedSessionLogs(prev => 
            prev.includes(logId) 
                ? prev.filter(id => id !== logId)
                : [...prev, logId]
        );
    };

    const handleSearchLogSelect = (logId) => {
        setSelectedSearchLogs(prev => 
            prev.includes(logId) 
                ? prev.filter(id => id !== logId)
                : [...prev, logId]
        );
    };

    const handleSelectAllSessionLogs = () => {
        if (selectedSessionLogs.length === sessionLogs.length) {
            setSelectedSessionLogs([]);
        } else {
            setSelectedSessionLogs(sessionLogs.map(log => log._id));
        }
    };

    const handleSelectAllSearchLogs = () => {
        if (selectedSearchLogs.length === searchLogs.length) {
            setSelectedSearchLogs([]);
        } else {
            setSelectedSearchLogs(searchLogs.map(log => log._id));
        }
    };

    const deleteSessionLogs = async () => {
        if (selectedSessionLogs.length === 0) return;
        
        try {
            setDeleting(true);
            await API.delete('/api/admin/session-logs', {
                data: { logIds: selectedSessionLogs },
                withCredentials: true
            });
            setSessionLogs(prev => prev.filter(log => !selectedSessionLogs.includes(log._id)));
            setSelectedSessionLogs([]);
        } catch (error) {
            console.error('Failed to delete session logs:', error);
        } finally {
            setDeleting(false);
        }
    };

    const deleteSearchLogs = async () => {
        if (selectedSearchLogs.length === 0) return;
        
        try {
            setDeleting(true);
            await API.delete('/api/admin/search-logs', {
                data: { logIds: selectedSearchLogs },
                withCredentials: true
            });
            setSearchLogs(prev => prev.filter(log => !selectedSearchLogs.includes(log._id)));
            setSelectedSearchLogs([]);
        } catch (error) {
            console.error('Failed to delete search logs:', error);
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="overflow-y-auto max-h-[calc(100vh-80px)] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Admin Settings</h2>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <p>Here you can configure your admin account and application settings.</p>
            </div>
            
            {/* User Session Logs Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mt-10">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-2xl font-bold text-gray-800">User Login/Logout History</h2>
                    {selectedSessionLogs.length > 0 && (
                        <button
                            onClick={deleteSessionLogs}
                            disabled={deleting}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
                        >
                            <FiTrash2 />
                            {deleting ? 'Deleting...' : `Delete ${selectedSessionLogs.length} selected`}
                        </button>
                    )}
                </div>
                {loadingLogs ? (
                    <div className="flex items-center justify-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                    </div>
                ) : errorLogs ? (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg">{errorLogs}</div>
                ) : (
                    <div className="overflow-x-auto max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50 sticky top-0 z-10">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <button
                                            onClick={handleSelectAllSessionLogs}
                                            className="flex items-center"
                                        >
                                            {selectedSessionLogs.length === sessionLogs.length && sessionLogs.length > 0 ? (
                                                <FiCheckSquare className="text-blue-600" />
                                            ) : (
                                                <FiSquare className="text-gray-400" />
                                            )}
                                        </button>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {sessionLogs.length > 0 ? sessionLogs.map((log) => (
                                    <tr key={log._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => handleSessionLogSelect(log._id)}
                                                className="flex items-center"
                                            >
                                                {selectedSessionLogs.includes(log._id) ? (
                                                    <FiCheckSquare className="text-blue-600" />
                                                ) : (
                                                    <FiSquare className="text-gray-400" />
                                                )}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.userId?.email || 'Guest'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{log.userType || 'N/A'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 flex items-center">
                                            {log.eventType === 'login' ? <FiLogIn className="mr-1 text-green-600" /> : <FiLogOut className="mr-1 text-red-600" />}
                                            {log.eventType.charAt(0).toUpperCase() + log.eventType.slice(1)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"><span className="inline-flex items-center"><FiMonitor className="mr-2" />{log.device?.slice(0, 30)}...</span></td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.timestamp ? new Date(log.timestamp).toLocaleString() : ''}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                            No session logs found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* User Search Logs Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mt-10">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-2xl font-bold text-gray-800">User Search Activity</h2>
                    {selectedSearchLogs.length > 0 && (
                        <button
                            onClick={deleteSearchLogs}
                            disabled={deleting}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
                        >
                            <FiTrash2 />
                            {deleting ? 'Deleting...' : `Delete ${selectedSearchLogs.length} selected`}
                        </button>
                    )}
                </div>
                {loadingLogs ? (
                    <div className="flex items-center justify-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                    </div>
                ) : errorLogs ? (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg">{errorLogs}</div>
                ) : (
                    <div className="overflow-x-auto max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50 sticky top-0 z-10">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <button
                                            onClick={handleSelectAllSearchLogs}
                                            className="flex items-center"
                                        >
                                            {selectedSearchLogs.length === searchLogs.length && searchLogs.length > 0 ? (
                                                <FiCheckSquare className="text-blue-600" />
                                            ) : (
                                                <FiSquare className="text-gray-400" />
                                            )}
                                        </button>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Search Term</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {searchLogs.length > 0 ? searchLogs.map((log) => (
                                    <tr key={log._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => handleSearchLogSelect(log._id)}
                                                className="flex items-center"
                                            >
                                                {selectedSearchLogs.includes(log._id) ? (
                                                    <FiCheckSquare className="text-blue-600" />
                                                ) : (
                                                    <FiSquare className="text-gray-400" />
                                                )}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.userEmail || log.userId?.email || 'Guest'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{log.userType || log.userId?.role || 'N/A'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 flex items-center">{log.searchTerm}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"><span className="inline-flex items-center">{log.device?.slice(0, 30)}...</span></td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.timestamp ? new Date(log.timestamp).toLocaleString() : ''}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                                            No search logs found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SettingsTab; 