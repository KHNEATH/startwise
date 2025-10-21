import React, { useEffect, useState } from "react";
import { getToken, removeToken } from "../utils/auth";
import { getProfile } from "../api/userApi";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Calculate profile completion percentage
  const calculateCompletion = (profileData) => {
    if (!profileData) return 0;
    
    // Check if this is user-saved data or just demo fallback
    const savedProfile = localStorage.getItem('demoProfile');
    if (!savedProfile) {
      // No saved profile data = 0% completion
      return 0;
    }
    
    try {
      const userSavedData = JSON.parse(savedProfile);
      const requiredFields = ['name', 'education', 'skills', 'location', 'age'];
      const completedFields = requiredFields.filter(field => {
        const value = userSavedData[field];
        return value && String(value).trim() !== '';
      });
      
      return Math.round((completedFields.length / requiredFields.length) * 100);
    } catch (error) {
      console.error('Error parsing saved profile:', error);
      return 0;
    }
  };

  const completionPercentage = calculateCompletion(profile);

  const handleLogout = () => {
    removeToken();
    navigate('/');
  };

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError("");
      try {
        const token = getToken();
        console.log('Token from localStorage:', token ? `Token exists (${token.substring(0, 20)}...)` : 'No token found');
        if (!token) {
          setError("Please log in to view your profile");
          setLoading(false);
          return;
        }
        
        console.log('Fetching profile using getProfile API...');
        const profileData = await getProfile();
        console.log('Profile data received:', profileData);
        setProfile(profileData);
      } catch (err) {
        console.error('Profile fetch error:', err);
        if (err.response?.status === 401 || err.response?.status === 403) {
          // Token is invalid or expired, clear it and redirect to login
          removeToken();
          setError("Your session has expired. Please log in again.");
          setTimeout(() => navigate('/login'), 2000);
        } else if (err.response?.status === 404) {
          setError("Profile not found");
        } else if (err.code === 'ERR_NETWORK' || err.message.includes('localhost')) {
          // The getProfile function already handles demo fallbacks in production
          if (process.env.NODE_ENV === 'development') {
            setError("Cannot connect to server. Please make sure the backend is running.");
          } else {
            // This shouldn't happen since getProfile handles production fallbacks
            setError("Unable to load profile. Please try again.");
          }
        } else {
          setError(`Failed to fetch profile: ${err.response?.data?.error || err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 pt-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <div className="text-blue-600 text-lg font-medium">Loading profile...</div>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md">
              <div className={`mb-4 text-lg ${error.includes('Demo Mode') ? 'text-blue-600' : 'text-red-500'}`}>
                {error.includes('Demo Mode') && (
                  <div className="text-4xl mb-2">🎭</div>
                )}
                {error}
              </div>
              <button 
                onClick={() => navigate('/login')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {error.includes('Demo Mode') ? 'Continue with Demo' : 'Go to Login'}
              </button>
            </div>
          </div>
        ) : profile ? (
          <div className="space-y-6">
            {/* Header Section */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex items-center space-x-6">
                  {/* Avatar */}
                  <div className="h-20 w-20 lg:h-24 lg:w-24 rounded-full bg-white flex items-center justify-center shadow-lg flex-shrink-0">
                    <span className="text-2xl lg:text-3xl font-bold text-blue-600">
                      {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
                    </span>
                  </div>
                  {/* User Info */}
                  <div className="text-white min-w-0 flex-1">
                    <div className="flex items-center space-x-3 mb-1 lg:mb-2">
                      <h1 className="text-2xl lg:text-3xl font-bold truncate">{profile.name}</h1>
                      {profile.isDemo && (
                        <span className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-medium">
                          🎭 DEMO
                        </span>
                      )}
                    </div>
                    <p className="text-blue-100 text-base lg:text-lg capitalize">{profile.role}</p>
                    <p className="text-blue-200 mt-1 text-sm lg:text-base truncate">{profile.email}</p>
                    <div className="flex items-center mt-2 text-blue-200 text-xs lg:text-sm">
                      <svg className="w-3 h-3 lg:w-4 lg:h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      Member since {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center space-x-2 lg:space-x-3">
                  <button
                    onClick={() => navigate('/profile-builder')}
                    className="bg-white/10 hover:bg-white/20 text-white px-3 lg:px-4 py-2 rounded-lg transition-colors flex items-center space-x-1 lg:space-x-2 text-sm lg:text-base"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    <span className="hidden sm:inline">Edit Profile</span>
                    <span className="sm:hidden">Edit</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500/80 hover:bg-red-600 text-white px-3 lg:px-4 py-2 rounded-lg transition-colors flex items-center space-x-1 lg:space-x-2 text-sm lg:text-base"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                    </svg>
                    <span className="hidden sm:inline">Logout</span>
                    <span className="sm:hidden">Exit</span>
                  </button>
                </div>
              </div>
            </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Profile Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* About Section */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    About
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    Welcome to your profile! This is where you can manage your personal information and track your progress on StartWise.
                  </p>
                </div>

                {/* Stats Section */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                    </svg>
                    Your Statistics
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="text-2xl font-bold text-blue-600">0</div>
                      <div className="text-sm text-gray-600">Job Applications</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg border border-green-100">
                      <div className="text-2xl font-bold text-green-600">0</div>
                      <div className="text-sm text-gray-600">Profile Views</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-100">
                      <div className="text-2xl font-bold text-purple-600">0</div>
                      <div className="text-sm text-gray-600">Saved Jobs</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-100">
                      <div className="text-2xl font-bold text-orange-600">0</div>
                      <div className="text-sm text-gray-600">Interviews</div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    Recent Activity
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">Profile created</div>
                        <div className="text-xs text-gray-500">Welcome to StartWise!</div>
                      </div>
                      <div className="text-xs text-gray-400">Today</div>
                    </div>
                    <div className="text-center py-4 text-gray-500 text-sm">
                      Start applying to jobs to see your activity here
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Quick Actions & Info */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                    </svg>
                    Quick Actions
                  </h2>
                  <div className="space-y-3">
                    <button 
                      onClick={() => navigate('/profile-builder')}
                      className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group"
                    >
                      <div className="font-medium text-blue-700 group-hover:text-blue-800">Edit Profile</div>
                      <div className="text-sm text-blue-600">Update your information</div>
                    </button>
                    <button 
                      onClick={() => navigate('/cv-builder')}
                      className="w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors group"
                    >
                      <div className="font-medium text-green-700 group-hover:text-green-800">Build CV</div>
                      <div className="text-sm text-green-600">Create your resume</div>
                    </button>
                    <button 
                      onClick={() => navigate('/jobs')}
                      className="w-full text-left p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors group"
                    >
                      <div className="font-medium text-purple-700 group-hover:text-purple-800">Browse Jobs</div>
                      <div className="text-sm text-purple-600">Find opportunities</div>
                    </button>
                  </div>
                </div>

                {/* Profile Completion */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Profile Completion
                  </h2>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Basic Info</span>
                      <span className={`font-medium ${completionPercentage === 100 ? 'text-green-600' : 'text-yellow-600'}`}>
                        {completionPercentage === 100 ? 'Complete' : 'In Progress'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${completionPercentage === 100 ? 'bg-green-600' : 'bg-blue-600'}`}
                        style={{width: `${completionPercentage}%`}}
                      ></div>
                    </div>
                    <div className="text-sm text-gray-600">{completionPercentage}% Complete</div>
                    {completionPercentage < 100 && (
                      <button 
                        onClick={() => navigate('/profile-builder')}
                        className="w-full mt-3 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        Complete Your Profile
                      </button>
                    )}
                    {completionPercentage === 100 && (
                      <button 
                        onClick={() => navigate('/profile-builder')}
                        className="w-full mt-3 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                      >
                        ✅ Edit Your Profile
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="text-gray-500 text-lg">No profile data found.</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
