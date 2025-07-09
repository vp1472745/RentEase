import React, { useState, useEffect } from 'react';
import API from '../../../lib/axios';
import { FiUsers, FiHome, FiUserCheck, FiTrendingUp, FiActivity, FiUser } from 'react-icons/fi';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const monthLabels = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const DashboardTab = () => {
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchLogs, setSearchLogs] = useState([]);
  const [loadingSearchLogs, setLoadingSearchLogs] = useState(true);
  const [errorSearchLogs, setErrorSearchLogs] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [userRes, propRes, profileRes] = await Promise.all([
          API.get('/api/admin/getAllUsers', { withCredentials: true }),
          API.get('/api/admin/getAllProperty', { withCredentials: true }),
          API.get('/api/admin/profile', { withCredentials: true }),
        ]);
        setUsers(userRes.data.users || []);
        setProperties(propRes.data.properties || []);
        setProfile(profileRes.data.admin || { name: 'Admin', email: 'admin@example.com' });
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();

    // Fetch recent search logs
    const fetchSearchLogs = async () => {
      try {
        setLoadingSearchLogs(true);
        const res = await API.get('/api/admin/search-logs', { withCredentials: true });
        setSearchLogs((res.data || []).slice(-5).reverse()); // latest 5, newest first
      } catch (err) {
        setErrorSearchLogs('Failed to fetch search logs.');
      } finally {
        setLoadingSearchLogs(false);
      }
    };
    fetchSearchLogs();
  }, []);

  // Count totals
  const totalTenants = users.filter(u => u.role === 'tenant').length;
  const totalOwners = users.filter(u => u.role === 'owner').length;
  const totalProperties = properties.length;

  // Calculate monthly data with cumulative totals
  const currentYear = new Date().getFullYear();
  const monthlyTenants = Array(12).fill(0);
  const monthlyOwners = Array(12).fill(0);
  const monthlyProperties = Array(12).fill(0);

  users.forEach(u => {
    const date = new Date(u.createdAt);
    if (date.getFullYear() === currentYear) {
      const month = date.getMonth();
      if (u.role === 'tenant') monthlyTenants[month]++;
      if (u.role === 'owner') monthlyOwners[month]++;
    }
  });

  properties.forEach(p => {
    const date = new Date(p.createdAt);
    if (date.getFullYear() === currentYear) {
      const month = date.getMonth();
      monthlyProperties[month]++;
    }
  });

  // Calculate growth percentage safely
  const calculateGrowth = (monthlyData, total) => {
    if (total === 0) return 0;
    const yearlyTotal = monthlyData.reduce((a, b) => a + b, 0);
    return Math.round((yearlyTotal / total) * 100);
  };

  // Calculate cumulative data for line chart
  const cumulativeData = (data) => {
    let sum = 0;
    return data.map(value => {
      sum += value;
      return sum;
    });
  };

  const lineChartData = {
    labels: monthLabels,
    datasets: [
      {
        label: 'Tenants',
        data: cumulativeData(monthlyTenants),
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 2,
        tension: 0.3,
        fill: true,
        pointBackgroundColor: '#10B981',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Owners',
        data: cumulativeData(monthlyOwners),
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        tension: 0.3,
        fill: true,
        pointBackgroundColor: '#3B82F6',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Properties',
        data: cumulativeData(monthlyProperties),
        borderColor: '#8B5CF6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        borderWidth: 2,
        tension: 0.3,
        fill: true,
        pointBackgroundColor: '#8B5CF6',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
          }
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: '#1F2937',
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 12 },
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y;
            }
            return label;
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6B7280',
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(229, 231, 235, 0.5)',
          drawBorder: false,
        },
        ticks: {
          color: '#6B7280',
          stepSize: 5,
          callback: function(value) {
            if (value % 5 === 0) {
              return value;
            }
          }
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  const barChartData = {
    labels: monthLabels,
    datasets: [
      {
        label: 'New Tenants',
        data: monthlyTenants,
        backgroundColor: '#10B981',
        borderRadius: 6,
        borderSkipped: false,
      },
      {
        label: 'New Owners',
        data: monthlyOwners,
        backgroundColor: '#3B82F6',
        borderRadius: 6,
        borderSkipped: false,
      },
      {
        label: 'New Properties',
        data: monthlyProperties,
        backgroundColor: '#8B5CF6',
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
          }
        }
      },
      tooltip: {
        backgroundColor: '#1F2937',
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 12 },
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6B7280',
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(229, 231, 235, 0.5)',
          drawBorder: false,
        },
        ticks: {
          color: '#6B7280',
          stepSize: 1,
        }
      }
    },
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
        <p className="text-gray-500 text-lg">Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading dashboard</h3>
            <div className="mt-2 text-sm text-red-700">
              {error}. Please try again later.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 overflow-y-auto max-h-[calc(100vh-120px)] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
      {/* Header with Profile */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="mt-1 text-sm text-gray-500">Welcome back, {profile?.name || 'Admin'}. Here's what's happening with your platform.</p>
        </div>
        
        {/* Profile Card */}
        {profile && (
          <div className="flex items-center bg-white rounded-xl shadow-sm border border-gray-100 p-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3">
              <FiUser className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{profile.name || 'Admin'}</p>
              <p className="text-xs text-gray-500">{profile.email || 'admin@example.com'}</p>
            </div>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-2 sm:p-3 rounded-lg bg-green-50">
              <FiUsers className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
            </div>
            <div className="ml-3 sm:ml-5">
              <p className="text-sm font-medium text-gray-500 truncate">Total Tenants</p>
              <p className="mt-1 text-2xl sm:text-3xl font-semibold text-gray-900">{totalTenants}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline">
              <span className="text-green-600 text-sm font-medium">+{Math.round((monthlyTenants.reduce((a, b) => a + b, 0) / totalTenants * 100) || 0)}%</span>
              <span className="ml-1 text-gray-500 text-sm">this year</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-2 sm:p-3 rounded-lg bg-blue-50">
              <FiUserCheck className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            </div>
            <div className="ml-3 sm:ml-5">
              <p className="text-sm font-medium text-gray-500 truncate">Total Owners</p>
              <p className="mt-1 text-2xl sm:text-3xl font-semibold text-gray-900">{totalOwners}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline">
              <span className="text-blue-600 text-sm font-medium">+{Math.round((monthlyOwners.reduce((a, b) => a + b, 0) / totalOwners * 100) || 0)}%</span>
              <span className="ml-1 text-gray-500 text-sm">this year</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-1">
          <div className="flex items-center">
            <div className="p-2 sm:p-3 rounded-lg bg-purple-50">
              <FiHome className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
            </div>
            <div className="ml-3 sm:ml-5">
              <p className="text-sm font-medium text-gray-500 truncate">Total Properties</p>
              <p className="mt-1 text-2xl sm:text-3xl font-semibold text-gray-900">{totalProperties}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline">
              <span className="text-purple-600 text-sm font-medium">+{Math.round((monthlyProperties.reduce((a, b) => a + b, 0) / totalProperties * 100) || 0)}%</span>
              <span className="ml-1 text-gray-500 text-sm">this year</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Growth Trends</h3>
          <div className="h-64 sm:h-80">
            <Line data={lineChartData} options={lineChartOptions} />
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Activity</h3>
          <div className="h-64 sm:h-80">
            <Bar data={barChartData} options={barChartOptions} />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {users.slice(0, 5).map((user, index) => (
            <div key={user._id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <FiUser className="text-purple-600 text-sm" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                <p className="text-xs text-gray-500">{user.role} • {new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                user.role === 'tenant' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {user.role}
              </span>
            </div>
          ))}
        </div>
      </div>


    </div>
  );
};

export default DashboardTab;