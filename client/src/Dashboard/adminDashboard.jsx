import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../lib/axios.js';
import Sidebar from './adminDashboard/Sidebar';
import { FiMenu, FiX } from 'react-icons/fi';

// Import Tab Components
import DashboardTab from './adminDashboard/tabs/DashboardTab';
import UsersTab from './adminDashboard/tabs/UsersTab';
import PropertiesTab from './adminDashboard/tabs/PropertiesTab';
import ReportsTab from './adminDashboard/tabs/ReportsTab';
import SettingsTab from './adminDashboard/tabs/SettingsTab';
import AdminRegisterationTab from './adminDashboard/tabs/adminRegisterationTab';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();

    // Authentication Check
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await API.get('/api/admin/profile', { withCredentials: true });
                if (response.data.success) {
                    setIsAuthenticated(true);
                } else {
                    navigate('/admin/login');
                }
            } catch (error) {
                console.error('Authentication check failed:', error);
                navigate('/admin/login');
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, [navigate]);

    const renderTabContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <DashboardTab />;
            case 'users':
                return <UsersTab />;
            case 'properties':
                return <PropertiesTab />;
            case 'reports':
                return <ReportsTab />;
            case 'settings':
                return <SettingsTab />;
            case 'adminRegisteration':
                return <AdminRegisterationTab />;
            default:
                return <DashboardTab />;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3B82F6] mx-auto mb-4"></div>
                    <p className="text-[#F8FAFC]">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-[#0F172A] text-[#F8FAFC]">
            {/* Top Bar */}
            <div className='bg-[#1E293B] w-full h-16 fixed top-0 z-50 flex items-center justify-between px-4 lg:px-6 shadow-md border-b border-[#334155]'>
                <div className="flex items-center">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="lg:hidden text-[#F8FAFC] p-2 rounded-md hover:bg-[#334155] transition-colors"
                    >
                        {sidebarOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
                    </button>
                    <h1 className="text-[#3B82F6] text-lg font-semibold ml-2 lg:ml-0">Admin Panel</h1>
                </div>
            </div>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            <div className="flex pt-16">
                {/* Sidebar */}
                <div className={`fixed lg:static inset-y-0 left-0 z-50 transform ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
                    <Sidebar 
                        activeTab={activeTab} 
                        setActiveTab={setActiveTab} 
                        onClose={() => setSidebarOpen(false)}
                    />
                </div>
                
                {/* Main Content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full">
                    <div className="max-w-7xl mx-auto">
                        {renderTabContent()}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
