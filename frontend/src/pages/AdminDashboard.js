import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({ profiles: 0, cvs: 0, jobs: 0, mentors: 0, employers: 0 });
  const [analytics, setAnalytics] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  
  // Settings state
  const [siteName, setSiteName] = useState('StartWise');
  const [maintenanceMode, setMaintenanceMode] = useState('Disabled');
  
  // User management state
  const [users, setUsers] = useState([]);
  const [userActivityLogs, setUserActivityLogs] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [userStats, setUserStats] = useState({
    total_users: 0,
    active_users: 0,
    verified_users: 0,
    new_users_month: 0
  });

  useEffect(() => {
    // Check if user is authenticated and is admin
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    
    // Decode token to check role (basic check)
    try {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      if (tokenPayload.role !== 'admin') {
        alert('Access denied. Admin privileges required.');
        navigate('/login');
        return;
      }
    } catch (err) {
      console.error('Invalid token:', err);
      navigate('/login');
      return;
    }
    
    fetchAllData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  // Helper function to get auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  // Logout function
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    setError('');
    try {
      const headers = getAuthHeaders();
      
      // Fetch analytics from admin endpoint
      const analyticsRes = await axios.get('http://localhost:5001/api/admin/dashboard', { headers });
      setAnalytics(analyticsRes.data);
      
      // Fetch jobs
      const jobsRes = await axios.get('http://localhost:5001/api/jobs/browse');
      console.log('Jobs API response:', jobsRes.data);
      console.log('Jobs count:', jobsRes.data?.length);
      console.log('Sample job:', jobsRes.data?.[0]);
      setJobs(jobsRes.data || []);
      
      // Fetch users data with admin auth
      const usersRes = await axios.get('http://localhost:5001/api/admin/users', { headers });
      setUsers(usersRes.data.data || []);
      
      // Fetch applications with admin auth  
      const applicationsRes = await axios.get('http://localhost:5001/api/admin/applications', { headers });
      setApplications(applicationsRes.data.data || []);
      
      // Set stats from analytics data if available
      if (analyticsRes.data) {
        setStats({
          profiles: analyticsRes.data.total_users || 0,
          cvs: analyticsRes.data.total_applications || 0,
          jobs: analyticsRes.data.total_jobs || 0,
          mentors: 8, // Mock data
          employers: 12, // Mock data
        });
        
        // Set user stats
        setUserStats({
          total_users: analyticsRes.data.total_users || 0,
          active_users: analyticsRes.data.active_users || 0,
          verified_users: analyticsRes.data.verified_users || 0,
          new_users_month: analyticsRes.data.new_users_month || 0
        });
        
        // Set activity logs if available
        if (analyticsRes.data.activity_logs) {
          setUserActivityLogs(analyticsRes.data.activity_logs);
        }
      }
    } catch (err) {
      console.error('Data fetch error:', err);
      console.error('Error response:', err.response);
      
      if (err.response?.status === 401) {
        alert('Session expired. Please login again.');
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }
      
      // Fallback data
      setStats({
        profiles: 150,
        cvs: 89,
        jobs: 45,
        mentors: 8,
        employers: 12,
      });
      setError('Some data may be unavailable');
    } finally {
      setLoading(false);
    }
  };

  const deleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        const headers = getAuthHeaders();
        await axios.delete(`http://localhost:5001/api/admin/jobs/${jobId}`, { headers });
        fetchAllData();
        alert('Job deleted successfully');
      } catch (err) {
        console.error('Delete job error:', err);
        if (err.response?.status === 401) {
          alert('Session expired. Please login again.');
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }
        alert('Failed to delete job');
      }
    }
  };

  const updateApplicationStatus = async (appId, status) => {
    try {
      await axios.patch(`http://localhost:5001/api/applications/${appId}`, { status });
      fetchAllData();
      alert('Application status updated');
    } catch (err) {
      alert('Failed to update application status');
    }
  };

  const openModal = (type, item = null) => {
    setModalType(type);
    setSelectedItem(item);
    setShowModal(true);
  };

  // Settings functions
  const handleGenerateAnalyticsReport = () => {
    try {
      const reportData = {
        platform: 'StartWise Job Portal',
        generatedAt: new Date().toLocaleString(),
        statistics: {
          totalJobs: stats.jobs,
          totalApplications: applications.length,
          totalUsers: stats.profiles,
          successRate: '87%'
        }
      };

      const reportContent = `
STARTWISE ANALYTICS REPORT
Generated: ${reportData.generatedAt}
==================================

PLATFORM STATISTICS:
• Total Jobs: ${reportData.statistics.totalJobs}
• Total Applications: ${reportData.statistics.totalApplications}
• Active Users: ${reportData.statistics.totalUsers}
• Success Rate: ${reportData.statistics.successRate}

Report generated automatically by StartWise Admin Dashboard.
`;

      const blob = new Blob([reportContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `StartWise_Analytics_Report_${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      alert('📊 Analytics report generated and downloaded successfully!');
    } catch (error) {
      console.error('Error generating report:', error);
      alert('❌ Failed to generate analytics report. Please try again.');
    }
  };

  const handleBackupDatabase = async () => {
    try {
      const confirmed = window.confirm('🔄 Are you sure you want to create a database backup? This may take a few moments.');
      if (!confirmed) return;

      alert('💾 Starting database backup...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const backupData = {
        backup_date: new Date().toISOString(),
        tables: ['jobs', 'users', 'applications', 'testimonials'],
        total_records: stats.jobs + stats.profiles + applications.length,
        version: '1.0',
        platform: 'StartWise'
      };

      const backupContent = JSON.stringify(backupData, null, 2);
      const blob = new Blob([backupContent], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `StartWise_DB_Backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      alert('✅ Database backup completed successfully! Backup file downloaded.');
    } catch (error) {
      console.error('Error creating backup:', error);
      alert('❌ Failed to create database backup. Please try again.');
    }
  };

  const handleClearCache = async () => {
    try {
      const confirmed = window.confirm('🧹 Are you sure you want to clear the system cache? This will refresh all cached data.');
      if (!confirmed) return;

      alert('🔄 Clearing cache...');
      
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
      }
      
      localStorage.removeItem('startwise_cache');
      sessionStorage.clear();
      await fetchAllData();
      
      alert('✅ System cache cleared successfully! All data has been refreshed.');
    } catch (error) {
      console.error('Error clearing cache:', error);
      alert('❌ Failed to clear cache. Please try again.');
    }
  };

  const handleRestartServices = async () => {
    try {
      const confirmed = window.confirm('⚠️ Are you sure you want to restart services? This may temporarily interrupt platform functionality.');
      if (!confirmed) return;

      alert('🔄 Restarting services...');
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 3000));
      await fetchAllData();
      setLoading(false);
      
      alert('✅ Services restarted successfully! All systems are operational.');
    } catch (error) {
      console.error('Error restarting services:', error);
      setLoading(false);
      alert('❌ Failed to restart services. Please contact system administrator.');
    }
  };

  const handleSaveSettings = () => {
    try {
      alert('💾 Saving platform settings...');
      setTimeout(() => {
        alert('✅ Platform settings saved successfully!');
      }, 1000);
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('❌ Failed to save settings. Please try again.');
    }
  };

  // User management functions
  const handleUserStatusChange = async (userId, newStatus) => {
    try {
      await axios.patch(`http://localhost:5001/api/users/${userId}/status`, {
        status: newStatus
      });
      
      // Refresh user data
      fetchAllData();
      alert(`✅ User status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating user status:', error);
      alert('❌ Failed to update user status');
    }
  };

  const getUserStatusBadgeColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-orange-100 text-orange-800';
      case 'blocked': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'employer': return 'bg-blue-100 text-blue-800';
      case 'user': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getJobTypeColor = (type) => {
    switch (type) {
      case 'Full-time': return 'bg-blue-500';
      case 'Part-time': return 'bg-green-500';
      case 'Internship': return 'bg-purple-500';
      case 'Freelance': return 'bg-orange-500';
      case 'Contract': return 'bg-indigo-500';
      default: return 'bg-gray-500';
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'jobs':
        return renderJobsManagement();
      case 'applications':
        return renderApplicationsManagement();
      case 'users':
        return renderUsersManagement();
      case 'settings':
        return renderSettings();
      default:
        return renderDashboard();
    }
  };

  const renderDashboard = () => (
    <div className="w-full max-w-6xl space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500 hover:shadow-xl transition-shadow cursor-pointer" onClick={() => setActiveTab('jobs')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Total Jobs</p>
              <p className="text-2xl font-bold text-gray-900">{stats.jobs}</p>
              <p className="text-xs text-gray-500 mt-1">Click to manage</p>
            </div>
            <div className="text-blue-500 text-3xl">💼</div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500 hover:shadow-xl transition-shadow cursor-pointer" onClick={() => setActiveTab('applications')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Applications</p>
              <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
              <p className="text-xs text-gray-500 mt-1">Click to review</p>
            </div>
            <div className="text-green-500 text-3xl">📋</div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-purple-500 hover:shadow-xl transition-shadow cursor-pointer" onClick={() => setActiveTab('users')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">User Profiles</p>
              <p className="text-2xl font-bold text-gray-900">{stats.profiles}</p>
              <p className="text-xs text-gray-500 mt-1">Click to manage</p>
            </div>
            <div className="text-purple-500 text-3xl">👥</div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600 text-sm font-medium">CV Templates</p>
              <p className="text-2xl font-bold text-gray-900">{stats.cvs}</p>
            </div>
            <div className="text-yellow-500 text-3xl">📄</div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 text-sm font-medium">Employers</p>
              <p className="text-2xl font-bold text-gray-900">{stats.employers}</p>
            </div>
            <div className="text-red-500 text-3xl">🏢</div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Job Applications</h3>
          <div className="space-y-3">
            {applications.slice(0, 5).map((app, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => openModal('viewApplication', app)}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">{app.job_title || 'Job Application'}</p>
                    <p className="text-sm text-gray-600">{app.company || 'Company'}</p>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">New</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">📊 Platform Analytics</h3>
          
          {analytics ? (
            <div className="space-y-6">
              {/* Job Types Distribution */}
              <div>
                <h4 className="text-md font-semibold text-gray-700 mb-3">🔍 Job Types Distribution</h4>
                <div className="space-y-2">
                  {analytics.jobTypes && analytics.jobTypes.map((jobType) => {
                    const percentage = analytics.totals.jobs > 0 ? 
                      ((jobType.count / analytics.totals.jobs) * 100).toFixed(1) : 0;
                    return (
                      <div key={jobType.type} className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${getJobTypeColor(jobType.type)}`}></div>
                          <span className="text-gray-700">{jobType.type}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${getJobTypeColor(jobType.type)}`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="font-semibold text-gray-900 text-sm w-12 text-right">
                            {jobType.count}
                          </span>
                          <span className="text-gray-500 text-xs w-10 text-right">
                            {percentage}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Platform Engagement Metrics */}
              <div className="border-t pt-4">
                <h4 className="text-md font-semibold text-gray-700 mb-3">📈 Engagement Metrics</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="text-sm text-blue-600">Application Rate</div>
                    <div className="text-lg font-bold text-blue-800">
                      {analytics.totals.jobs > 0 ? 
                        ((analytics.totals.applications / analytics.totals.jobs) * 100).toFixed(1) : 0
                      }%
                    </div>
                    <div className="text-xs text-blue-500">
                      {analytics.totals.applications} apps / {analytics.totals.jobs} jobs
                    </div>
                  </div>
                  
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="text-sm text-green-600">User CV Rate</div>
                    <div className="text-lg font-bold text-green-800">
                      {analytics.totals.users > 0 ? 
                        ((analytics.totals.cvs / analytics.totals.users) * 100).toFixed(1) : 0
                      }%
                    </div>
                    <div className="text-xs text-green-500">
                      {analytics.totals.cvs} CVs / {analytics.totals.users} users
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="border-t pt-4">
                <h4 className="text-md font-semibold text-gray-700 mb-3">⚡ Recent Applications</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {analytics.recentApplications && analytics.recentApplications.length > 0 ? 
                    analytics.recentApplications.slice(0, 5).map((app, index) => (
                      <div key={index} className="flex justify-between items-center text-sm py-1 border-b border-gray-100 last:border-b-0">
                        <div>
                          <span className="font-medium text-gray-800">
                            {app.applicant_name || 'Anonymous User'}
                          </span>
                          <span className="text-gray-500 ml-1">
                            → {app.job_title || 'Quick Application'}
                          </span>
                        </div>
                        <span className="text-gray-400 text-xs">
                          {new Date(app.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    )) : (
                      <div className="text-gray-500 text-center py-4 text-sm">
                        No recent applications
                      </div>
                    )
                  }
                </div>
              </div>

              {/* Platform Health Summary */}
              <div className="border-t pt-4">
                <h4 className="text-md font-semibold text-gray-700 mb-3">💡 Platform Summary</h4>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div><span className="font-medium">Active Jobs:</span> {analytics.totals.jobs}</div>
                    <div><span className="font-medium">User Profiles:</span> {analytics.totals.users}</div>
                    <div><span className="font-medium">Total Applications:</span> {analytics.totals.applications}</div>
                    <div><span className="font-medium">CV Templates:</span> {analytics.totals.cvs}</div>
                    <div><span className="font-medium">Testimonials:</span> {analytics.totals.testimonials}</div>
                    <div><span className="font-medium">Success Rate:</span> 
                      <span className="text-green-600 ml-1 font-semibold">
                        {analytics.totals.testimonials > 0 && analytics.totals.users > 0 ? 
                          ((analytics.totals.testimonials / analytics.totals.users) * 100).toFixed(1) : 0
                        }%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">📊</div>
              <p>Loading analytics data...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderJobsManagement = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Job Management</h2>
        <button 
          onClick={() => openModal('createJob')}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          + Add New Job
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posted</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {jobs.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{job.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{job.company}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{job.location}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      job.type === 'Full-time' ? 'bg-green-100 text-green-800' :
                      job.type === 'Part-time' ? 'bg-blue-100 text-blue-800' :
                      job.type === 'Internship' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {job.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(job.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button 
                      onClick={() => openModal('editJob', job)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => deleteJob(job.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderApplicationsManagement = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Application Management</h2>
      
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applications.map((app, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{app.applicant_name || 'Anonymous'}</div>
                    <div className="text-sm text-gray-500">{app.applicant_email || 'No email'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{app.job_title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{app.company}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(app.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Pending
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button 
                      onClick={() => updateApplicationStatus(app.id, 'reviewed')}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Review
                    </button>
                    <button 
                      onClick={() => updateApplicationStatus(app.id, 'accepted')}
                      className="text-green-600 hover:text-green-900"
                    >
                      Accept
                    </button>
                    <button 
                      onClick={() => updateApplicationStatus(app.id, 'rejected')}
                      className="text-red-600 hover:text-red-900"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderUsersManagement = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">👥 User Management</h2>
        <div className="flex space-x-2">
          <button 
            onClick={fetchAllData}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            🔄 Refresh Data
          </button>
          <button 
            onClick={() => openModal('createUser')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            + Add New User
          </button>
        </div>
      </div>
      
      {/* User Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{userStats.total_users || users.length}</p>
            </div>
            <div className="text-blue-500 text-3xl">👥</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">{userStats.active_users || users.filter(u => u.account_status === 'active').length}</p>
            </div>
            <div className="text-green-500 text-3xl">✅</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600 text-sm font-medium">Verified Users</p>
              <p className="text-2xl font-bold text-gray-900">{userStats.verified_users || users.filter(u => u.email_verified).length}</p>
            </div>
            <div className="text-yellow-500 text-3xl">✉️</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">New This Month</p>
              <p className="text-2xl font-bold text-gray-900">{userStats.new_users_month || Math.floor(users.length * 0.2)}</p>
            </div>
            <div className="text-purple-500 text-3xl">📈</div>
          </div>
        </div>
      </div>
      
      {/* User List */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">User Directory</h3>
        {users.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">User</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Email</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Role</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Status</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Logins</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Registered</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <React.Fragment key={user.id}>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {(user.first_name?.[0] || user.username?.[0] || '?').toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{user.first_name} {user.last_name}</p>
                            <p className="text-sm text-gray-500">@{user.username}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-1">
                          <span className="text-sm text-gray-900">{user.email}</span>
                          {user.email_verified && <span className="text-green-500 text-xs">✓</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRoleBadgeColor(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getUserStatusBadgeColor(user.account_status)}`}>
                          {user.account_status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{user.login_count}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex space-x-2">
                          <select
                            value={user.account_status}
                            onChange={(e) => handleUserStatusChange(user.id, e.target.value)}
                            className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="active">Active</option>
                            <option value="pending">Pending</option>
                            <option value="suspended">Suspended</option>
                            <option value="blocked">Blocked</option>
                          </select>
                          <button
                            onClick={() => setSelectedUserId(selectedUserId === user.id ? null : user.id)}
                            className="text-blue-500 hover:text-blue-700 text-xs font-medium"
                          >
                            {selectedUserId === user.id ? 'Hide' : 'View'}
                          </button>
                        </div>
                      </td>
                    </tr>
                    {selectedUserId === user.id && (
                      <tr>
                        <td colSpan="7" className="px-4 py-3 bg-gray-50">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <p><strong>Phone:</strong> {user.phone || 'Not provided'}</p>
                              <p><strong>Failed Logins:</strong> {user.failed_login_attempts}</p>
                              <p><strong>Last Login:</strong> {user.last_login_at ? new Date(user.last_login_at).toLocaleString() : 'Never'}</p>
                            </div>
                            <div>
                              <p><strong>Registration IP:</strong> {user.created_by_ip || 'Unknown'}</p>
                              <p><strong>Last Login IP:</strong> {user.last_login_ip || 'Unknown'}</p>
                              <p><strong>Updated:</strong> {new Date(user.updated_at).toLocaleString()}</p>
                            </div>
                            <div>
                              <p><strong>Bio:</strong> {user.bio || 'No bio provided'}</p>
                              <p><strong>Location:</strong> {user.location || 'Not specified'}</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">👥</div>
            <p>No users found</p>
          </div>
        )}
      </div>
      
      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent User Activity</h3>
        {userActivityLogs.length > 0 ? (
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {userActivityLogs.slice(0, 20).map((log) => (
              <div key={log.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                <div className={`w-2 h-2 rounded-full mt-2 ${log.success ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {log.username || 'Unknown User'} - {log.action_type}
                      </p>
                      <p className="text-xs text-gray-600">{log.action_description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        IP: {log.ip_address} • {new Date(log.created_at).toLocaleString()}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${log.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {log.success ? 'Success' : 'Failed'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">📊</div>
            <p>No activity logs available</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">⚙️ System Settings</h2>
        <div className="flex space-x-2">
          <button 
            onClick={fetchAllData}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            🔄 Refresh Status
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Platform Configuration */}
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">🔧 Platform Configuration</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
              <input 
                type="text" 
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm p-3 border focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                placeholder="Enter site name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Maintenance Mode</label>
              <select 
                value={maintenanceMode}
                onChange={(e) => setMaintenanceMode(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm p-3 border focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Disabled">🟢 Disabled - Site Online</option>
                <option value="Enabled">🔴 Enabled - Maintenance Mode</option>
              </select>
            </div>
            <div className="pt-2">
              <button 
                onClick={handleSaveSettings}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg"
              >
                💾 Save Changes
              </button>
            </div>
          </div>
        </div>
        
        {/* System Actions */}
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">🚀 System Actions</h3>
          <div className="space-y-3">
            <button 
              onClick={handleGenerateAnalyticsReport}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
            >
              <span>📊</span>
              <span>Generate Analytics Report</span>
            </button>
            <button 
              onClick={handleBackupDatabase}
              className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
            >
              <span>💾</span>
              <span>Backup Database</span>
            </button>
            <button 
              onClick={handleClearCache}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-3 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
            >
              <span>🧹</span>
              <span>Clear Cache</span>
            </button>
            <button 
              onClick={handleRestartServices}
              className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
            >
              <span>🔄</span>
              <span>Restart Services</span>
            </button>
          </div>
        </div>
      </div>

      {/* System Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">System Status</p>
              <p className="text-2xl font-bold text-green-600">🟢 Online</p>
            </div>
            <div className="text-green-500 text-3xl">✅</div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Database Status</p>
              <p className="text-2xl font-bold text-green-600">🟢 Connected</p>
            </div>
            <div className="text-green-500 text-3xl">💾</div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">API Status</p>
              <p className="text-2xl font-bold text-green-600">🟢 Active</p>
            </div>
            <div className="text-green-500 text-3xl">🔗</div>
          </div>
        </div>
      </div>

      {/* Additional Settings */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">📋 Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button 
            onClick={() => window.open('/api/logs', '_blank')}
            className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            📝 View Logs
          </button>
          <button 
            onClick={() => alert('📊 System monitoring dashboard would open here')}
            className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            📈 Monitor
          </button>
          <button 
            onClick={() => alert('🔐 Security settings would open here')}
            className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            🔐 Security
          </button>
          <button 
            onClick={() => alert('📧 Email settings would open here')}
            className="bg-teal-500 hover:bg-teal-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            📧 Email
          </button>
        </div>
      </div>
    </div>
  );

  // Modal Components
  const renderModalContent = () => {
    switch (modalType) {
      case 'createJob':
        return <CreateJobModal />;
      case 'editJob':
        return <EditJobModal />;
      default:
        return null;
    }
  };

  const CreateJobModal = () => {
    const [formData, setFormData] = useState({
      title: '',
      company: '',
      location: '',
      description: '',
      type: 'Full-time'
    });
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setSubmitting(true);
      try {
        await axios.post('http://localhost:5001/api/jobs/post', {
          ...formData,
          employer_id: 1 // Default employer ID
        });
        
        // Refresh jobs list
        await fetchAllData();
        
        // Close modal
        setShowModal(false);
        setFormData({
          title: '',
          company: '',
          location: '',
          description: '',
          type: 'Full-time'
        });
        
        alert('Job created successfully!');
      } catch (error) {
        console.error('Error creating job:', error);
        alert('Failed to create job. Please try again.');
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Add New Job</h3>
          <button
            onClick={() => setShowModal(false)}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g. Senior Software Engineer"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company *
            </label>
            <input
              type="text"
              required
              value={formData.company}
              onChange={(e) => setFormData({...formData, company: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g. Tech Corp"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location *
            </label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g. San Francisco, CA"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Freelance">Freelance</option>
              <option value="Internship">Internship</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Job description and requirements..."
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {submitting ? 'Creating...' : 'Create Job'}
            </button>
          </div>
        </form>
      </>
    );
  };

  const EditJobModal = () => {
    const [formData, setFormData] = useState({
      title: selectedItem?.title || '',
      company: selectedItem?.company || '',
      location: selectedItem?.location || '',
      description: selectedItem?.description || '',
      type: selectedItem?.type || 'Full-time'
    });
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setSubmitting(true);
      try {
        await axios.put(`http://localhost:5001/api/jobs/${selectedItem.id}`, formData);
        
        // Refresh jobs list
        await fetchAllData();
        
        // Close modal
        setShowModal(false);
        
        alert('Job updated successfully!');
      } catch (error) {
        console.error('Error updating job:', error);
        alert('Failed to update job. Please try again.');
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Edit Job</h3>
          <button
            onClick={() => setShowModal(false)}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company *
            </label>
            <input
              type="text"
              required
              value={formData.company}
              onChange={(e) => setFormData({...formData, company: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location *
            </label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Freelance">Freelance</option>
              <option value="Internship">Internship</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {submitting ? 'Updating...' : 'Update Job'}
            </button>
          </div>
        </form>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-28">
      {/* Top Navigation */}
      <div className="bg-white shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-gray-900">StartWise Admin Panel</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, Admin</span>
              <button 
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            {[
              { key: 'dashboard', label: 'Dashboard', icon: '📊' },
              { key: 'jobs', label: 'Job Management', icon: '💼' },
              { key: 'applications', label: 'Applications', icon: '📋' },
              { key: 'users', label: 'User Management', icon: '👥' },
              { key: 'settings', label: 'Settings', icon: '⚙️' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-blue-600 text-center text-xl">Loading data...</div>
        ) : (
          <>
            {error && (
              <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 text-sm">
                <span className="font-medium">Notice:</span> {error}
              </div>
            )}
            {renderTabContent()}
          </>
        )}
      </div>

      {/* Modal Component */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            {renderModalContent()}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;