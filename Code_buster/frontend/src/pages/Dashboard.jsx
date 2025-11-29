import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  RefreshCw
} from 'lucide-react';
import { complaintService, handleApiError } from '../services/api';
import ComplaintHeatmap from '../components/ComplaintHeatmap';



// StatsBox component
const StatsBox = ({ icon, title, value, description, className = '' }) => (
  <div className={`bg-white rounded-lg shadow p-4 border-l-4 ${className}`}>
    <div className="flex items-center space-x-3">
      <div className="p-2 rounded-full bg-gray-100">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
    {description && <p className="mt-2 text-xs text-gray-500">{description}</p>}
  </div>
);

// ComplaintCard component
const ComplaintCard = ({ complaint }) => {
  // Format the date
  const formattedDate = new Date(complaint.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Status colors
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-blue-100 text-blue-800',
    resolved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800'
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-gray-900">{complaint.title}</h3>
            <div className="mt-1 flex items-center">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[complaint.status] || 'bg-gray-100 text-gray-800'}`}>
                {complaint.status.replace('_', ' ')}
              </span>
              {complaint.priority && (
                <span className="ml-2 px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                  {complaint.priority} priority
                </span>
              )}
            </div>
          </div>
        </div>

        <p className="mt-2 text-sm text-gray-600 line-clamp-2">
          {complaint.description}
        </p>

        <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
          <span>{formattedDate}</span>
          <span className="truncate max-w-[150px]">{complaint.location}</span>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  // State for complaints and UI
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Fetch complaints from API
  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const data = await complaintService.getComplaints();
      setComplaints(data);
      setError('');
    } catch (err) {
      console.error('Error loading complaints:', err);
      const apiError = handleApiError(err);
      setError(apiError.message || 'Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  // Load complaints on component mount
  useEffect(() => {
    fetchComplaints();

    // Check for success message from navigation state
    if (location.state?.showSuccess) {
      setShowSuccess(true);
      const timer = setTimeout(() => setShowSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [location]);

  // Calculate summary from actual complaints
  const summary = {
    totalComplaints: complaints.length,
    pendingComplaints: complaints.filter(c => c.status === 'pending').length,
    inProgressComplaints: complaints.filter(c => c.status === 'in_progress').length,
    resolvedComplaints: complaints.filter(c => c.status === 'resolved').length,
    rejectedComplaints: complaints.filter(c => c.status === 'rejected').length,
    statusDistribution: {
      pending: complaints.filter(c => c.status === 'pending').length,
      in_progress: complaints.filter(c => c.status === 'in_progress').length,
      resolved: complaints.filter(c => c.status === 'resolved').length,
      rejected: complaints.filter(c => c.status === 'rejected').length
    }
  };

  // Get recent complaints (sorted by date, most recent first)
  const recentComplaints = [...complaints]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 6);

  // Categories and statuses
  const categories = ['all', 'road', 'water', 'electricity', 'garbage', 'safety', 'health'];
  const statuses = ['all', 'pending', 'in_progress', 'resolved', 'rejected'];

  // Filter complaints
  const filteredComplaints = complaints.filter(complaint =>
    (selectedCategory === 'all' || complaint.category === selectedCategory) &&
    (selectedStatus === 'all' || complaint.status === selectedStatus)
  );

  // Handle refresh
  const handleRefresh = () => {
    setLoading(true);
    fetchComplaints();
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-green-600 text-white px-4 py-2 rounded shadow">
            Dashboard refreshed successfully!
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <button
            onClick={handleRefresh}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <RefreshCw size={18} />
            <span>Refresh Data</span>
          </button>
        </div>

        {/* Success Message */}
        {showSuccess && location.state?.message && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <span className="text-green-700">{location.state.message}</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatsBox
            icon={<BarChart3 className="h-5 w-5 text-blue-500" />}
            title="Total Complaints"
            value={summary.totalComplaints}
          />
          <StatsBox
            icon={<AlertCircle className="h-5 w-5 text-yellow-500" />}
            title="Pending"
            value={summary.pendingComplaints}
            className="border-yellow-400"
          />
          <StatsBox
            icon={<Clock className="h-5 w-5 text-blue-400" />}
            title="In Progress"
            value={summary.inProgressComplaints}
            className="border-blue-400"
          />
          <StatsBox
            icon={<CheckCircle className="h-5 w-5 text-green-500" />}
            title="Resolved"
            value={summary.resolvedComplaints}
            className="border-green-400"
          />
        </div>

        {/* Heatmap Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Complaint Distribution</h2>
          <ComplaintHeatmap complaints={filteredComplaints} />
        </div>

        {/* Recent Complaints */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Recent Complaints</h2>
            <button
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
              onClick={handleRefresh}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>

          {filteredComplaints.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No complaints found. Submit a new complaint to see it here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredComplaints.map(complaint => (
                <ComplaintCard key={complaint.id} complaint={complaint} />
              ))}
            </div>
          )}
        </div>

        {/* Recent Complaints */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Recent Complaints</h3>
            <div className="flex space-x-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="text-sm border rounded px-2 py-1"
              >
                <option value="all">All Categories</option>
                {categories.filter(c => c !== 'all').map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="text-sm border rounded px-2 py-1"
              >
                <option value="all">All Statuses</option>
                {statuses.filter(s => s !== 'all').map(status => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {recentComplaints
              .filter(complaint =>
                (selectedCategory === 'all' || complaint.category === selectedCategory) &&
                (selectedStatus === 'all' || complaint.status === selectedStatus)
              )
              .map(complaint => (
                <ComplaintCard
                  key={complaint.id}
                  complaint={complaint}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
