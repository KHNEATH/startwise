import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { fetchJobs, postJob, applyToJob, quickApply, updateJob, deleteJob } from '../api/jobApi';


const JobBoard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  // Placeholder state for jobs and filters
  const [jobs, setJobs] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [apiError, setApiError] = React.useState('');
  const [filters, setFilters] = React.useState({ title: '', type: '', location: '' });
  const [showPostForm, setShowPostForm] = React.useState(false);
  const [postForm, setPostForm] = React.useState({ title: '', company: '', location: '', type: '', description: '' });
  const [postErrors, setPostErrors] = React.useState({});
  const [postSuccess, setPostSuccess] = React.useState(false);
  const [applicationStatus, setApplicationStatus] = React.useState({});
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);
  const [editingJob, setEditingJob] = React.useState(null);
  const [editForm, setEditForm] = React.useState({ title: '', company: '', location: '', type: '', description: '' });
  const [editErrors, setEditErrors] = React.useState({});
  const [deleteConfirm, setDeleteConfirm] = React.useState(null);
  const [successMessage, setSuccessMessage] = React.useState('');

  // Handlers for filter form
  const handleFilterChange = e => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handlePostFormChange = e => {
    setPostForm({ ...postForm, [e.target.name]: e.target.value });
    setPostErrors({ ...postErrors, [e.target.name]: undefined });
  };

  // Application handlers
  const handleApplyNow = async (jobId, jobTitle) => {
    try {
      setApplicationStatus({ [jobId]: 'applying' });
      // TODO: Replace user_id=1 with real user ID from auth
      await applyToJob(jobId, { user_id: 1, message: `Interested in applying for ${jobTitle}` });
      setApplicationStatus({ [jobId]: 'applied' });
      setSuccessMessage(`Successfully applied to ${jobTitle}! The employer will contact you soon.`);
      setShowSuccessModal(true);
      setTimeout(() => setShowSuccessModal(false), 4000);
    } catch (error) {
      console.error('Application error:', error);
      setApplicationStatus({ [jobId]: 'error' });
      setApiError('Failed to submit application. Please try again.');
    }
  };

  const handleQuickApply = async (jobTitle, company) => {
    try {
      // TODO: Replace with real user data from auth
      await quickApply({ 
        job_title: jobTitle, 
        company: company, 
        user_id: 1,
        name: 'Student User', // This would come from user profile
        email: 'student@example.com' // This would come from user profile
      });
      setSuccessMessage(`Quick application submitted for ${jobTitle} at ${company}! No CV required.`);
      setShowSuccessModal(true);
      setTimeout(() => setShowSuccessModal(false), 4000);
    } catch (error) {
      console.error('Quick apply error:', error);
      setApiError('Failed to submit quick application. Please try again.');
    }
  };

  const handleViewDetails = (jobId, jobTitle) => {
    // Navigate to job detail page (we'll create this route)
    navigate(`/jobs/${jobId}`, { state: { jobTitle } });
  };

  const handlePostJob = async e => {
    e.preventDefault();
    setApiError('');
    // Simple validation
    const errors = {};
    if (!postForm.title.trim()) errors.title = t('jobBoard.titleRequired') || 'Title required';
    if (!postForm.company.trim()) errors.company = t('jobBoard.companyRequired') || 'Company required';
    if (!postForm.location.trim()) errors.location = t('jobBoard.locationRequired') || 'Location required';
    if (!postForm.type.trim()) errors.type = t('jobBoard.typeRequired') || 'Type required';
    if (!postForm.description.trim()) errors.description = t('jobBoard.descriptionRequired') || 'Description required';
    setPostErrors(errors);
    if (Object.keys(errors).length === 0) {
      setLoading(true);
      try {
        console.log('📤 Posting job:', postForm);
        const result = await postJob({ ...postForm, employer_id: 1 });
        console.log('✅ Job posted successfully:', result);
        
        // Clear form and show success
        setPostForm({ title: '', company: '', location: '', type: '', description: '' });
        setPostSuccess(true);
        
        // Show success message with demo mode indicator if applicable
        if (result.demo) {
          setApiError(''); // Clear any previous errors
          console.log('🎭 Demo mode job posting successful');
          
          // In demo mode, add the job directly to the jobs list for immediate display
          const newJob = result.job;
          setJobs(prevJobs => [newJob, ...prevJobs]);
        }
        
        setTimeout(() => setPostSuccess(false), 3000);
        setShowPostForm(false);
        await loadJobs();
      } catch (err) {
        console.error('❌ Job posting failed:', err);
        const errorMessage = err?.response?.data?.error || err.message || 'Failed to post job. Please try again.';
        setApiError(errorMessage);
      } finally {
        setLoading(false);
      }
    }
  };

  // Load jobs from backend
  const loadJobs = async () => {
    setLoading(true);
    setApiError('');
    try {
      console.log('🔍 Fetching jobs from:', process.env.REACT_APP_API_URL || 'http://localhost:5001/api');
      const data = await fetchJobs(filters);
      console.log('✅ Jobs received:', data);
      console.log('📊 Jobs type:', typeof data);
      console.log('📊 Is array:', Array.isArray(data));
      console.log('📊 Jobs length:', Array.isArray(data) ? data.length : 'N/A');
      
      // Ensure we always have an array
      if (Array.isArray(data)) {
        console.log('✅ Setting jobs array:', data.length, 'jobs');
        setJobs(data);
      } else if (data && data.jobs && Array.isArray(data.jobs)) {
        console.log('✅ Setting jobs from data.jobs:', data.jobs.length, 'jobs');
        setJobs(data.jobs);
      } else {
        console.warn('⚠️ Invalid data format, setting empty jobs array');
        console.log('Data received:', data);
        setJobs([]);
      }
    } catch (err) {
      console.error('❌ Job loading error:', err);
      console.error('Error response:', err?.response);
      
      // In any case of error, try to show demo jobs
      console.log('🔄 Attempting to load demo jobs as fallback...');
      try {
        // Try to get demo jobs from localStorage or use hardcoded ones
        const demoJobs = getLocalDemoJobs();
        console.log('🎭 Loading demo jobs:', demoJobs.length);
        setJobs(demoJobs);
        setApiError(''); // Clear error since we have demo jobs
      } catch (demoError) {
        console.error('❌ Demo jobs fallback failed:', demoError);
        setApiError(err?.response?.data?.error || err?.message || 'Failed to load jobs');
        setJobs([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get demo jobs as fallback
  const getLocalDemoJobs = () => {
    return [
      {
        id: 'demo-1',
        title: 'Frontend Developer',
        company: 'Tech Startup Cambodia',
        location: 'Phnom Penh, Cambodia',
        type: 'Full-time',
        description: 'Join our team to build amazing web applications using React and modern technologies.'
      },
      {
        id: 'demo-2', 
        title: 'Part-time English Tutor',
        company: 'Education Center',
        location: 'Siem Reap, Cambodia',
        type: 'Part-time',
        description: 'Teach English to local students. No experience required, training provided.'
      },
      {
        id: 'demo-3',
        title: 'Social Media Assistant',
        company: 'Digital Agency',
        location: 'Remote',
        type: 'Internship',
        description: 'Help manage social media accounts for various clients.'
      }
    ];
  };

  // Handle edit job
  const handleEditJob = (job) => {
    setEditingJob(job.id);
    setEditForm({
      title: job.title,
      company: job.company,
      location: job.location,
      type: job.type,
      description: job.description
    });
    setEditErrors({});
  };

  // Handle edit form change
  const handleEditFormChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  // Handle save edit
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setApiError('');
    
    // Validation
    const errors = {};
    if (!editForm.title.trim()) errors.title = 'Title required';
    if (!editForm.company.trim()) errors.company = 'Company required';
    if (!editForm.location.trim()) errors.location = 'Location required';
    if (!editForm.type.trim()) errors.type = 'Type required';
    if (!editForm.description.trim()) errors.description = 'Description required';
    
    setEditErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      setLoading(true);
      try {
        await updateJob(editingJob, editForm);
        setEditingJob(null);
        setEditForm({ title: '', company: '', location: '', type: '', description: '' });
        await loadJobs();
      } catch (err) {
        setApiError(err?.response?.data?.error || 'Failed to update job');
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingJob(null);
    setEditForm({ title: '', company: '', location: '', type: '', description: '' });
    setEditErrors({});
  };

  // Handle delete job
  const handleDeleteJob = async (jobId) => {
    if (deleteConfirm === jobId) {
      setLoading(true);
      try {
        await deleteJob(jobId);
        await loadJobs();
        setDeleteConfirm(null);
      } catch (err) {
        setApiError(err?.response?.data?.error || 'Failed to delete job');
      } finally {
        setLoading(false);
      }
    } else {
      setDeleteConfirm(jobId);
      // Auto-cancel confirmation after 5 seconds
      setTimeout(() => setDeleteConfirm(null), 5000);
    }
  };

  // Load jobs on mount and when filters change
  React.useEffect(() => {
    loadJobs();
    // eslint-disable-next-line
  }, [filters.title, filters.type, filters.location]);

  // Filtered jobs (placeholder logic)
  // Jobs are now filtered by backend
  const filteredJobs = jobs;

  return (
    <main className="flex flex-col items-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 py-8 px-2 pt-28">
      {/* Hero Header with Animation and Image */}
      <div className="w-full max-w-5xl bg-gradient-to-r from-blue-700 to-blue-500 rounded-2xl shadow-xl p-0 flex flex-col md:flex-row items-center mb-12 overflow-hidden animate-fade-in">
        <div className="flex-1 p-10 flex flex-col items-start justify-center">
          <h2 className="text-4xl font-extrabold text-white mb-4 tracking-tight animate-slide-in">{t('jobBoard.title') || 'Job Board'}</h2>
          <p className="text-blue-100 text-lg max-w-xl mb-6 animate-fade-in-delay">{t('jobBoard.subtitle') || 'Find your next opportunity or post a job to reach top talent.'}</p>
          <div className="flex gap-4 animate-fade-in-delay2">
            <button className="bg-white text-blue-700 font-bold px-6 py-2 rounded-full shadow hover:bg-blue-50 transition" onClick={() => {
              const section = document.getElementById('job-listings-section');
              if (section) section.scrollIntoView({ behavior: 'smooth' });
            }}>Browse Jobs</button>
            <button className="bg-blue-900 text-white font-bold px-6 py-2 rounded-full shadow hover:bg-blue-800 transition" onClick={() => setShowPostForm(true)}>Post a Job</button>
          </div>
        </div>
  <div className="hidden md:block flex-1 h-full relative">
          <img src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80" alt="Job Board" className="object-cover w-full h-full rounded-r-2xl shadow-lg" />
        </div>
      </div>
  <div id="job-listings-section" className="w-full max-w-4xl bg-white p-8 rounded-2xl shadow mb-10 animate-fade-in-delay3">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex-1" />
          <button className="bg-blue-700 text-white px-6 py-2 rounded-full font-bold shadow hover:bg-blue-800 transition" onClick={() => setShowPostForm(v => !v)}>
            {showPostForm ? t('jobBoard.cancelPost') || 'Cancel' : t('jobBoard.postJob') || 'Post a Job'}
          </button>
        </div>
        {showPostForm && (
          <form className="space-y-3 mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }} onSubmit={handlePostJob} noValidate>
            {loading && <div className="text-blue-500 text-center mb-2">{t('loading')}</div>}
            {apiError && <div className="text-red-500 text-center mb-2">{apiError}</div>}
            <div>
              <input name="title" value={postForm.title} onChange={handlePostFormChange} className={`w-full p-2 border rounded ${postErrors.title ? 'border-red-400' : ''}`} placeholder={t('jobBoard.jobTitle')} />
              {postErrors.title && <div className="text-red-500 text-sm">{postErrors.title}</div>}
            </div>
            <div>
              <input name="company" value={postForm.company} onChange={handlePostFormChange} className={`w-full p-2 border rounded ${postErrors.company ? 'border-red-400' : ''}`} placeholder={t('jobBoard.company')} />
              {postErrors.company && <div className="text-red-500 text-sm">{postErrors.company}</div>}
            </div>
            <div>
              <input name="location" value={postForm.location} onChange={handlePostFormChange} className={`w-full p-2 border rounded ${postErrors.location ? 'border-red-400' : ''}`} placeholder={t('jobBoard.location')} />
              {postErrors.location && <div className="text-red-500 text-sm">{postErrors.location}</div>}
            </div>
            <div>
              <select name="type" value={postForm.type} onChange={handlePostFormChange} className={`w-full p-2 border rounded ${postErrors.type ? 'border-red-400' : ''}`} >
                <option value="">{t('jobBoard.selectType') || 'Select type'}</option>
                <option value="full-time">{t('jobBoard.fullTime') || 'Full Time'}</option>
                <option value="part-time">{t('jobBoard.partTime') || 'Part Time'}</option>
                <option value="internship">{t('jobBoard.internship') || 'Internship'}</option>
                <option value="no-experience">{t('jobBoard.noExperience') || 'No Experience'}</option>
              </select>
              {postErrors.type && <div className="text-red-500 text-sm">{postErrors.type}</div>}
            </div>
            <div>
              <textarea name="description" value={postForm.description} onChange={handlePostFormChange} className={`w-full p-2 border rounded ${postErrors.description ? 'border-red-400' : ''}`} placeholder={t('jobBoard.description')} />
              {postErrors.description && <div className="text-red-500 text-sm">{postErrors.description}</div>}
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-400 transition-all duration-200" type="submit">{t('jobBoard.submitPost') || 'Post Job'}</button>
            {postSuccess && <div className="text-green-600 text-sm mt-2">{t('jobBoard.posted') || 'Job posted!'}</div>}
          </form>
        )}
        {/* Enhanced Search Filters */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-lg animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <h3 className="text-lg font-bold text-gray-700 mb-4">🔍 Find Your Perfect Job</h3>
          <form className="grid grid-cols-1 md:grid-cols-3 gap-4" onSubmit={e => e.preventDefault()}>
            <input 
              name="title" 
              value={filters.title} 
              onChange={handleFilterChange} 
              className="px-4 py-3 border-2 border-blue-100 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400 font-medium" 
              placeholder="Search jobs (e.g., English tutor, delivery, tech)" 
            />
            <select 
              name="type" 
              value={filters.type} 
              onChange={handleFilterChange} 
              className="px-4 py-3 border-2 border-blue-100 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 font-medium"
            >
              <option value="">All Job Types</option>
              <option value="Part-time">🕐 Part-time • Student Friendly</option>
              <option value="Internship">🎓 Internship • Learn & Earn</option>
              <option value="Freelance">💻 Freelance • Remote Work</option>
              <option value="Full-time">💼 Full-time • Career Growth</option>
            </select>
            <input 
              name="location" 
              value={filters.location || ''} 
              onChange={handleFilterChange} 
              className="px-4 py-3 border-2 border-blue-100 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400 font-medium" 
              placeholder="Location (e.g., Phnom Penh, Remote)" 
            />
          </form>
          
          {/* Quick Filter Buttons for Students */}
          <div className="mt-4 flex flex-wrap gap-2">
            <button 
              onClick={() => setFilters({...filters, type: 'Part-time', location: 'Cambodia'})}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors"
            >
              🏫 Student Jobs in Cambodia
            </button>
            <button 
              onClick={() => setFilters({...filters, type: 'Internship'})}
              className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium hover:bg-green-200 transition-colors"
            >
              🎓 Internships
            </button>
            <button 
              onClick={() => setFilters({...filters, location: 'Remote'})}
              className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium hover:bg-purple-200 transition-colors"
            >
              🏠 Work from Home
            </button>
            <button 
              onClick={() => setFilters({title: '', type: '', location: ''})}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              🔄 Clear Filters
            </button>
          </div>
        </div>
        <div>
          {loading ? (
            <div className="text-blue-500 text-center italic animate-fade-in">{t('loading')}</div>
          ) : apiError ? (
            <div className="text-red-500 text-center italic animate-fade-in">{apiError}</div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-gray-400 text-center italic animate-fade-in">
              {jobs.length === 0 ? (
                <div className="py-12">
                  <div className="text-6xl mb-4">📋</div>
                  <div className="text-xl font-semibold text-gray-600 mb-2">No jobs posted yet</div>
                  <div className="text-gray-500">Be the first to post a job opportunity!</div>
                  <button 
                    onClick={() => setShowPostForm(true)}
                    className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Post a Job
                  </button>
                </div>
              ) : (
                'No jobs match your filters. Try adjusting your search criteria.'
              )}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredJobs.map((job, idx) => {
                const isStudentFriendly = job.type === 'Part-time' || job.type === 'Internship' || job.type === 'Freelance' || 
                  job.description.toLowerCase().includes('no experience') || 
                  job.description.toLowerCase().includes('student') ||
                  job.location.includes('Cambodia');
                
                return (
                  <div key={job.id} className={`border rounded-2xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-jobcard ${
                    isStudentFriendly 
                      ? 'bg-gradient-to-br from-green-50 to-blue-50 border-green-200' 
                      : 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200'
                  }`} style={{ animationDelay: `${0.1 + 0.05 * idx}s` }} tabIndex={0}>
                    
                    {/* Student-Friendly Badge */}
                    {isStudentFriendly && (
                      <div className="mb-5 flex items-center gap-3 flex-wrap">
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-5 py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                          <span className="text-white text-base">🎓</span>
                          <span className="text-sm font-bold tracking-wide uppercase">Student Friendly</span>
                        </div>
                        {job.description.toLowerCase().includes('no experience') && (
                          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300">
                            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                            <span className="text-xs font-semibold tracking-wide">No Experience Needed</span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Job Header */}
                    <div className="flex items-start gap-3 mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-800 leading-tight mb-1">{job.title}</h3>
                        <div className="text-gray-600 text-sm font-medium">{job.company}</div>
                        <div className="text-gray-500 text-sm flex items-center gap-1">
                          📍 {job.location}
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        job.type === 'Part-time' ? 'bg-blue-100 text-blue-700' :
                        job.type === 'Internship' ? 'bg-purple-100 text-purple-700' :
                        job.type === 'Freelance' ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {job.type}
                      </span>
                    </div>
                    
                    {/* Job Description */}
                    <div className="text-gray-700 text-sm mb-4 line-clamp-3">
                      {job.description.length > 120 ? job.description.substring(0, 120) + '...' : job.description}
                    </div>
                    
                    {/* Apply Button and Student Badge */}
                    <div className="flex flex-col gap-4">
                      {/* Buttons Row */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <button 
                          onClick={() => handleApplyNow(job.id, job.title)}
                          disabled={applicationStatus[job.id] === 'applying' || applicationStatus[job.id] === 'applied'}
                          className={`px-4 py-2 rounded-xl font-semibold text-xs transition-all duration-200 flex items-center gap-2 shadow-md ${
                            applicationStatus[job.id] === 'applied' 
                              ? 'bg-green-600 text-white cursor-not-allowed shadow-green-200' 
                              : applicationStatus[job.id] === 'applying'
                              ? 'bg-gray-400 text-white cursor-not-allowed'
                              : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg hover:shadow-blue-200 transform hover:scale-105'
                          }`}
                        >
                          {applicationStatus[job.id] === 'applied' && <span className="text-green-100">✓</span>}
                          {applicationStatus[job.id] === 'applying' && <span className="animate-spin">⏳</span>}
                          <span>
                            {applicationStatus[job.id] === 'applied' 
                              ? 'Applied' 
                              : applicationStatus[job.id] === 'applying' 
                              ? 'Applying...' 
                              : 'Apply'}
                          </span>
                          {!applicationStatus[job.id] && <span>→</span>}
                        </button>
                        
                        <button 
                          onClick={() => handleViewDetails(job.id, job.title)}
                          className="px-3 py-2 border-2 border-blue-200 hover:border-blue-400 text-blue-600 hover:text-blue-800 text-xs font-semibold hover:bg-blue-50 transition-all duration-200 rounded-xl"
                        >
                          Details →
                        </button>
                        
                        {/* Edit Button */}
                        <button 
                          onClick={() => handleEditJob(job)}
                          className="px-3 py-2 border-2 border-yellow-200 hover:border-yellow-400 text-yellow-600 hover:text-yellow-800 text-xs font-semibold hover:bg-yellow-50 transition-all duration-200 rounded-xl"
                        >
                          ✏️ Edit
                        </button>
                        
                        {/* Delete Button */}
                        <button 
                          onClick={() => handleDeleteJob(job.id)}
                          className={`px-3 py-2 border-2 text-xs font-semibold transition-all duration-200 rounded-xl ${
                            deleteConfirm === job.id 
                              ? 'border-red-600 bg-red-600 text-white hover:bg-red-700' 
                              : 'border-red-200 hover:border-red-400 text-red-600 hover:text-red-800 hover:bg-red-50'
                          }`}
                        >
                          {deleteConfirm === job.id ? '🗑️ Confirm?' : '🗑️ Delete'}
                        </button>
                      </div>
                      
                      {/* Student Badge Row */}
                      {isStudentFriendly && (
                        <div className="flex justify-start">
                          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-100 to-teal-100 border border-emerald-300 px-4 py-2 rounded-full shadow-sm">
                            <div className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse"></div>
                            <span className="text-xs text-emerald-800 font-bold tracking-wider uppercase">Perfect for Students</span>
                            <span className="text-emerald-700 text-sm">🌟</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Edit Job Modal */}
      {editingJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-fade-in">
            <h3 className="text-xl font-bold text-gray-800 mb-4">✏️ Edit Job</h3>
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <input
                  name="title"
                  value={editForm.title}
                  onChange={handleEditFormChange}
                  className={`w-full p-3 border rounded-xl ${editErrors.title ? 'border-red-400' : 'border-gray-200'}`}
                  placeholder="Job Title"
                />
                {editErrors.title && <div className="text-red-500 text-sm mt-1">{editErrors.title}</div>}
              </div>
              
              <div>
                <input
                  name="company"
                  value={editForm.company}
                  onChange={handleEditFormChange}
                  className={`w-full p-3 border rounded-xl ${editErrors.company ? 'border-red-400' : 'border-gray-200'}`}
                  placeholder="Company"
                />
                {editErrors.company && <div className="text-red-500 text-sm mt-1">{editErrors.company}</div>}
              </div>
              
              <div>
                <input
                  name="location"
                  value={editForm.location}
                  onChange={handleEditFormChange}
                  className={`w-full p-3 border rounded-xl ${editErrors.location ? 'border-red-400' : 'border-gray-200'}`}
                  placeholder="Location"
                />
                {editErrors.location && <div className="text-red-500 text-sm mt-1">{editErrors.location}</div>}
              </div>
              
              <div>
                <select
                  name="type"
                  value={editForm.type}
                  onChange={handleEditFormChange}
                  className={`w-full p-3 border rounded-xl ${editErrors.type ? 'border-red-400' : 'border-gray-200'}`}
                >
                  <option value="">Select Type</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Internship">Internship</option>
                  <option value="Freelance">Freelance</option>
                </select>
                {editErrors.type && <div className="text-red-500 text-sm mt-1">{editErrors.type}</div>}
              </div>
              
              <div>
                <textarea
                  name="description"
                  value={editForm.description}
                  onChange={handleEditFormChange}
                  className={`w-full p-3 border rounded-xl h-24 resize-none ${editErrors.description ? 'border-red-400' : 'border-gray-200'}`}
                  placeholder="Job Description"
                />
                {editErrors.description && <div className="text-red-500 text-sm mt-1">{editErrors.description}</div>}
              </div>
              
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-xl font-semibold transition-colors disabled:opacity-50"
                >
                  {loading ? 'Saving...' : '💾 Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-3 rounded-xl font-semibold transition-colors"
                >
                  ❌ Cancel
                </button>
              </div>
            </form>
            
            {apiError && (
              <div className="mt-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-xl text-sm">
                {apiError}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recommendations Section */}
      <div className="w-full max-w-4xl bg-white p-8 rounded-2xl shadow animate-fade-in-delay4" style={{ animationDelay: '0.3s' }}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-extrabold text-blue-800 animate-slide-in flex items-center gap-3">
            <span className="text-3xl">🎯</span>
            {t('jobBoard.recommendations') || 'Recommended for you'}
          </h3>
          <span className="text-sm text-gray-500 bg-blue-50 px-3 py-1 rounded-full">
            Based on your interests
          </span>
        </div>

        {/* Recommendation Categories */}
        <div className="space-y-6">
          {/* Student-Friendly Jobs */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-100">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🎓</span>
              <h4 className="text-lg font-bold text-green-800">Perfect for Students</h4>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">High Match</span>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 border border-green-200 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h5 className="font-semibold text-gray-800">Part-time English Tutor</h5>
                    <p className="text-sm text-gray-600">Phnom Penh Learning Center</p>
                    <p className="text-xs text-green-600 font-medium">📍 Phnom Penh • 💰 Flexible hours</p>
                  </div>
                  <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">Part-time</span>
                </div>
                <p className="text-sm text-gray-700 mb-3">Teach basic English while earning money. No formal experience required!</p>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => handleApplyNow('rec-1', 'Part-time English Tutor')}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                  >
                    Apply Now
                  </button>
                  <button 
                    onClick={() => handleViewDetails('rec-1', 'Part-time English Tutor')}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline transition-colors"
                  >
                    View Details →
                  </button>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-blue-200 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h5 className="font-semibold text-gray-800">Social Media Assistant</h5>
                    <p className="text-sm text-gray-600">Digital Cambodia</p>
                    <p className="text-xs text-blue-600 font-medium">📍 Siem Reap • 🕐 Learn & Earn</p>
                  </div>
                  <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full">Internship</span>
                </div>
                <p className="text-sm text-gray-700 mb-3">Perfect for creative students interested in digital marketing!</p>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => handleApplyNow('rec-2', 'Social Media Assistant')}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                  >
                    Apply Now
                  </button>
                  <button 
                    onClick={() => handleViewDetails('rec-2', 'Social Media Assistant')}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline transition-colors"
                  >
                    View Details →
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Remote Work Opportunities */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">💻</span>
              <h4 className="text-lg font-bold text-purple-800">Work from Anywhere</h4>
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">Flexible</span>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 border border-purple-200 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h5 className="font-semibold text-gray-800">Online Content Creator</h5>
                    <p className="text-sm text-gray-600">Cambodia Student Network</p>
                    <p className="text-xs text-purple-600 font-medium">📍 Remote • 📱 Use your phone</p>
                  </div>
                  <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">Freelance</span>
                </div>
                <p className="text-sm text-gray-700 mb-3">Share your student experience through social media content!</p>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => handleApplyNow('rec-3', 'Online Content Creator')}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                  >
                    Apply Now
                  </button>
                  <button 
                    onClick={() => handleViewDetails('rec-3', 'Online Content Creator')}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline transition-colors"
                  >
                    View Details →
                  </button>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-orange-200 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h5 className="font-semibold text-gray-800">Online Translator</h5>
                    <p className="text-sm text-gray-600">Translation Services Cambodia</p>
                    <p className="text-xs text-orange-600 font-medium">📍 Remote • 🌍 Khmer-English</p>
                  </div>
                  <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">Freelance</span>
                </div>
                <p className="text-sm text-gray-700 mb-3">Use your bilingual skills to help translate documents!</p>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => handleApplyNow('rec-4', 'Online Translator')}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                  >
                    Apply Now
                  </button>
                  <button 
                    onClick={() => handleViewDetails('rec-4', 'Online Translator')}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline transition-colors"
                  >
                    View Details →
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Apply Section */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">⚡</span>
              <h4 className="text-lg font-bold text-blue-800">Quick Apply - No CV Required</h4>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Easy Start</span>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 border border-blue-200 hover:shadow-md transition-shadow text-center">
                <div className="text-2xl mb-2">🍽️</div>
                <h5 className="font-semibold text-gray-800 mb-1">Restaurant Server</h5>
                <p className="text-xs text-gray-600 mb-2">Angkor Restaurant Group</p>
                <p className="text-xs text-blue-600 font-medium mb-3">Training provided • Tips included</p>
                <button 
                  onClick={() => handleQuickApply('Restaurant Server', 'Angkor Restaurant Group')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 w-full flex items-center justify-center gap-2"
                >
                  <span>⚡</span>
                  <span>Quick Apply</span>
                </button>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-green-200 hover:shadow-md transition-shadow text-center">
                <div className="text-2xl mb-2">🚚</div>
                <h5 className="font-semibold text-gray-800 mb-1">Delivery Assistant</h5>
                <p className="text-xs text-gray-600 mb-2">Fast Delivery Cambodia</p>
                <p className="text-xs text-green-600 font-medium mb-3">Flexible schedule • Good pay</p>
                <button 
                  onClick={() => handleQuickApply('Delivery Assistant', 'Fast Delivery Cambodia')}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-all duration-200 transform hover:scale-105 w-full flex items-center justify-center gap-2"
                >
                  <span>⚡</span>
                  <span>Quick Apply</span>
                </button>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-purple-200 hover:shadow-md transition-shadow text-center">
                <div className="text-2xl mb-2">📚</div>
                <h5 className="font-semibold text-gray-800 mb-1">Library Assistant</h5>
                <p className="text-xs text-gray-600 mb-2">National Library of Cambodia</p>
                <p className="text-xs text-purple-600 font-medium mb-3">Study while working • Quiet environment</p>
                <button 
                  onClick={() => handleQuickApply('Library Assistant', 'National Library of Cambodia')}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-all duration-200 transform hover:scale-105 w-full flex items-center justify-center gap-2"
                >
                  <span>⚡</span>
                  <span>Quick Apply</span>
                </button>
              </div>
            </div>
          </div>

          {/* Career Path Suggestions */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-100">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🚀</span>
              <h4 className="text-lg font-bold text-orange-800">Build Your Career Path</h4>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h5 className="font-semibold text-gray-800 flex items-center gap-2">
                  <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                  Technology Track
                </h5>
                <div className="pl-5 space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">1. Computer Skills Trainer</span>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Start Here</span>
                  </div>
                  <div className="text-gray-600">2. → IT Support Assistant</div>
                  <div className="text-gray-500">3. → Software Developer</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h5 className="font-semibold text-gray-800 flex items-center gap-2">
                  <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                  Business Track
                </h5>
                <div className="pl-5 space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">1. Office Assistant</span>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Start Here</span>
                  </div>
                  <div className="text-gray-600">2. → Marketing Coordinator</div>
                  <div className="text-gray-500">3. → Business Manager</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Animations */}
        <style>{`
          @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
          @keyframes fade-in-delay { from { opacity: 0; transform: translateY(20px);} to { opacity: 1; transform: none; } }
          @keyframes fade-in-delay2 { from { opacity: 0; transform: translateY(40px);} to { opacity: 1; transform: none; } }
          @keyframes fade-in-delay3 { from { opacity: 0; transform: translateY(60px);} to { opacity: 1; transform: none; } }
          @keyframes fade-in-delay4 { from { opacity: 0; transform: translateY(80px);} to { opacity: 1; transform: none; } }
          @keyframes slide-in { from { opacity: 0; transform: translateX(-40px);} to { opacity: 1; transform: none; } }
          @keyframes float { 0% { transform: translateY(0); } 50% { transform: translateY(-10px);} 100% { transform: translateY(0); } }
          .animate-fade-in { animation: fade-in 0.7s both; }
          .animate-fade-in-delay { animation: fade-in-delay 0.9s both; }
          .animate-fade-in-delay2 { animation: fade-in-delay2 1.1s both; }
          .animate-fade-in-delay3 { animation: fade-in-delay3 1.3s both; }
          .animate-fade-in-delay4 { animation: fade-in-delay4 1.5s both; }
          .animate-slide-in { animation: slide-in 0.8s both; }
          .animate-float { animation: float 3s ease-in-out infinite; }
          .animate-jobcard { animation: fade-in-delay 1s both; }
        `}</style>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4 animate-fade-in-delay transform scale-105">
            <div className="text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-xl font-bold text-green-800 mb-3">Application Submitted!</h3>
              <p className="text-gray-600 mb-6">{successMessage}</p>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <span className="animate-pulse">✓</span>
                <span>Employer will review your application</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default JobBoard;
