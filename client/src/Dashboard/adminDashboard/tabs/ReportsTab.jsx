import React, { useState, useEffect, useCallback } from 'react';
import API from '../../../lib/axios';
import { FiFileText, FiSearch, FiUser, FiCalendar, FiAlertTriangle, FiTrash2, FiEye, FiMonitor, FiX } from 'react-icons/fi';

const ReportsTab = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedReport, setSelectedReport] = useState(null);
    const [searchLogs, setSearchLogs] = useState([]);
    const [loadingLogs, setLoadingLogs] = useState(true);
    const [errorLogs, setErrorLogs] = useState(null);

    const fetchReports = useCallback(async () => {
        try {
            setLoading(true);
            const response = await API.get('/api/fraud/reports', { withCredentials: true });
            setReports(response.data.data || []);
        } catch (err) {
            console.error('Error fetching reports:', err);
            setError('Failed to fetch fraud reports. Please check the API endpoint and try again.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchReports();
    }, [fetchReports]);

    useEffect(() => {
        const fetchSearchLogs = async () => {
            try {
                setLoadingLogs(true);
                const response = await API.get('/api/admin/search-logs', { withCredentials: true });
                setSearchLogs(response.data || []);
            } catch (err) {
                setErrorLogs('Failed to fetch search analytics.');
            } finally {
                setLoadingLogs(false);
            }
        };
        fetchSearchLogs();
    }, []);

    const filteredReports = reports.filter(report => {
        const reporterName = report.name?.toLowerCase() || '';
        const reporterEmail = report.email?.toLowerCase() || '';
        const reason = report.category?.toLowerCase() || '';
        const description = report.details?.toLowerCase() || '';
        const search = searchTerm.toLowerCase();

        return reporterName.includes(search) ||
               reporterEmail.includes(search) ||
               reason.includes(search) ||
               description.includes(search);
    });
    
    const handleViewReport = (report) => {
        setSelectedReport(report);
    };

    const handleDeleteReport = async (reportId) => {
        if (window.confirm('Are you sure you want to delete this report?')) {
            try {
                // Fixed endpoint to match backend route
                await API.delete(`/api/fraud/report/${reportId}`, { withCredentials: true });
                fetchReports(); // Refresh the list
            } catch (err) {
                console.error('Error deleting report:', err);
                alert('Failed to delete report');
            }
        }
    };


    if (loading) {
        return (
            <div className="flex items-center justify-center h-64 bg-[#0F172A]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3B82F6]"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-[#FACC15]/10 border-l-4 border-[#FACC15] text-[#FACC15] p-4 rounded-lg">
                <p className="font-bold">Error</p>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-80px)] scrollbar-thin scrollbar-thumb-[#334155] scrollbar-track-[#1E293B] bg-[#0F172A] px-2 py-4">
            <h2 className="text-3xl font-bold text-[#F8FAFC]">Fraud Reports</h2>
            
            {/* Search Bar */}
            <div className="bg-[#1E293B] p-4 rounded-xl shadow-sm border border-[#334155]">
                <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#94A3B8]" />
                    <input
                        type="text"
                        placeholder="Search reports by user, reason, or description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-[#334155] rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent bg-[#1E293B] text-[#F8FAFC] placeholder-[#94A3B8]"
                    />
                </div>
            </div>

            {/* Reports Table */}
            <div className="bg-[#1E293B] rounded-xl shadow-sm overflow-hidden border border-[#334155]">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-[#334155]">
                        <thead className="bg-[#1E293B] sticky top-0 z-10">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#94A3B8] uppercase tracking-wider">Reporter</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#94A3B8] uppercase tracking-wider">Reason</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#94A3B8] uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-[#1E293B] divide-y divide-[#334155]">
                            {filteredReports.length > 0 ? filteredReports.map((report) => (
                                <tr key={report._id} className="hover:bg-[#334155]">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10 bg-[#334155] rounded-full flex items-center justify-center">
                                                <FiUser className="h-6 w-6 text-[#3B82F6]" />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-[#F8FAFC]">{report.name || 'N/A'}</div>
                                                <div className="text-sm text-[#94A3B8]">{report.email || 'No email'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-[#F8FAFC]">{report.category}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center space-x-3">
                                            <button onClick={() => handleViewReport(report)} className="text-[#3B82F6] hover:text-[#2563EB] p-1" title="View Details">
                                                <FiEye size={18} />
                                            </button>
                                            <button onClick={() => handleDeleteReport(report._id)} className="text-[#FACC15] hover:text-[#F59E42] p-1" title="Delete Report">
                                                <FiTrash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-[#94A3B8]">
                                        <FiFileText className="mx-auto h-10 w-10 text-[#3B82F6] mb-2" />
                                        No reports found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Report Detail Modal */}
            {selectedReport && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#1E293B] rounded-xl shadow-2xl max-w-lg w-full border border-[#334155]">
                        <div className="p-6 border-b border-[#334155] flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-[#F8FAFC]">Report Details</h3>
                            <button onClick={() => setSelectedReport(null)} className="text-[#94A3B8] hover:text-[#F8FAFC] p-2">
                                <FiX className="text-xl" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <h4 className="text-sm font-medium text-[#94A3B8]">Reporter</h4>
                                <p className="mt-1 text-[#F8FAFC]">{selectedReport.name} ({selectedReport.email})</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-[#94A3B8]">Reason</h4>
                                <p className="mt-1 text-[#F8FAFC]">{selectedReport.category}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-[#94A3B8]">Description</h4>
                                <p className="mt-1 text-[#F8FAFC] bg-[#334155] p-3 rounded-lg">{selectedReport.details}</p>
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-[#334155] text-right">
                            <button onClick={() => setSelectedReport(null)} className="px-4 py-2 bg-[#3B82F6] text-[#F8FAFC] text-sm font-medium rounded-lg hover:bg-[#2563EB]">Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReportsTab;