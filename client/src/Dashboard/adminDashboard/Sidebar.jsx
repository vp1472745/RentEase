import React from 'react';
import { FiGrid, FiUsers, FiHome, FiBarChart2, FiSettings, FiLogOut, FiUserPlus, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ activeTab, setActiveTab, onClose }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Here you would call your logout API endpoint
        console.log("Logging out...");
        navigate('/admin/login');
    };

    const handleTabClick = (tabId) => {
        setActiveTab(tabId);
        // Close sidebar on mobile after tab selection
        if (onClose) {
            onClose();
        }
    };

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: FiGrid },
        { id: 'users', label: 'Users', icon: FiUsers },
        { id: 'properties', label: 'Properties', icon: FiHome },
        { id: 'reports', label: 'Reports', icon: FiBarChart2 },
        { id: 'settings', label: 'Settings', icon: FiSettings },
        { id: 'adminRegisteration', label: 'Admin Registration', icon: FiUserPlus },
    ];

    return (
        <div className="w-64 lg:w-72 bg-[#1E293B] h-screen lg:h-auto flex flex-col shadow-lg border-r border-[#334155]">
            {/* Mobile Header */}
            <div className="lg:hidden flex items-center justify-between p-4 border-b border-[#334155] bg-[#1E293B]">
                <h1 className="text-xl font-bold text-[#3B82F6]">Admin Panel</h1>
                <button
                    onClick={onClose}
                    className="p-2 text-[#F8FAFC] hover:text-[#3B82F6] hover:bg-[#334155] rounded-lg transition-colors"
                >
                    <FiX className="h-5 w-5" />
                </button>
            </div>

            {/* Desktop Header */}
            <div className="hidden lg:block p-6 border-b border-[#334155]">
                <h1 className="text-2xl font-bold text-[#3B82F6]">Admin Panel</h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-[#334155] scrollbar-track-[#1E293B]">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => handleTabClick(item.id)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-left ${
                            activeTab === item.id
                                ? 'bg-[#3B82F6] text-[#F8FAFC] shadow-md'
                                : 'text-[#F8FAFC] hover:bg-[#334155] hover:text-[#3B82F6]'
                        }`}
                    >
                        <item.icon className={`text-xl flex-shrink-0 ${activeTab === item.id ? 'text-[#F8FAFC]' : 'text-[#3B82F6]'}`} />
                        <span className="font-medium truncate">{item.label}</span>
                    </button>
                ))}
            </nav>

            {/* Logout Button */}
            <div className="p-4 border-t border-[#334155] bg-[#1E293B]">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-[#FACC15] hover:bg-[#334155] transition-colors"
                >
                    <FiLogOut className="text-xl flex-shrink-0" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;