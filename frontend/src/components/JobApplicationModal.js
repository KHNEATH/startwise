import React, { useState } from 'react';

const JobApplicationModal = ({ isOpen, onClose, job, onSubmit }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    coverLetter: '',
    cvFile: null,
    experienceLevel: 'entry',
    expectedSalary: '',
    availableStartDate: '',
    portfolioLink: ''
  });
  
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileUpload = (file) => {
    if (file && file.type === 'application/pdf') {
      if (file.size <= 5 * 1024 * 1024) { // 5MB limit
        setFormData(prev => ({ ...prev, cvFile: file }));
        setErrors(prev => ({ ...prev, cvFile: '' }));
      } else {
        setErrors(prev => ({ ...prev, cvFile: 'File size must be less than 5MB' }));
      }
    } else {
      setErrors(prev => ({ ...prev, cvFile: 'Please upload a PDF file' }));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    handleFileUpload(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    if (!formData.cvFile) {
      newErrors.cvFile = 'CV is required to apply for this position';
    }
    
    if (!formData.coverLetter.trim()) {
      newErrors.coverLetter = 'Please tell us why you\'re interested in this position';
    } else if (formData.coverLetter.trim().length < 50) {
      newErrors.coverLetter = 'Please provide more details (minimum 50 characters)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setSubmitting(true);
    
    try {
      // Create FormData for file upload
      const applicationData = new FormData();
      applicationData.append('jobId', job.id);
      applicationData.append('jobTitle', job.title);
      applicationData.append('company', job.company);
      applicationData.append('fullName', formData.fullName);
      applicationData.append('email', formData.email);
      applicationData.append('phone', formData.phone);
      applicationData.append('coverLetter', formData.coverLetter);
      applicationData.append('cvFile', formData.cvFile);
      applicationData.append('experienceLevel', formData.experienceLevel);
      applicationData.append('expectedSalary', formData.expectedSalary);
      applicationData.append('availableStartDate', formData.availableStartDate);
      applicationData.append('portfolioLink', formData.portfolioLink);
      
      await onSubmit(applicationData);
      onClose();
    } catch (error) {
      console.error('Application submission error:', error);
      setErrors({ submit: 'Failed to submit application. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Apply for Position</h2>
              <div className="text-gray-600">
                <p className="font-semibold">{job?.title}</p>
                <p>{job?.company} • {job?.location}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.fullName ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="your.email@example.com"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.phone ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="+855 12 345 678"
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience Level
                  </label>
                  <select
                    name="experienceLevel"
                    value={formData.experienceLevel}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="entry">Entry Level / Student</option>
                    <option value="junior">1-2 years experience</option>
                    <option value="mid">3-5 years experience</option>
                    <option value="senior">5+ years experience</option>
                  </select>
                </div>
              </div>
            </div>

            {/* CV Upload */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">CV/Resume *</h3>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center ${
                  dragActive ? 'border-blue-500 bg-blue-50' : 
                  errors.cvFile ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                {formData.cvFile ? (
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-2xl">📄</span>
                    <div>
                      <p className="text-green-600 font-medium">{formData.cvFile.name}</p>
                      <p className="text-sm text-gray-500">
                        {(formData.cvFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, cvFile: null }))}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    <span className="text-4xl mb-4 block">📎</span>
                    <p className="text-gray-600 mb-2">
                      Drag & drop your CV here, or{' '}
                      <label className="text-blue-600 hover:text-blue-800 cursor-pointer underline">
                        browse
                        <input
                          type="file"
                          accept=".pdf"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e.target.files[0])}
                        />
                      </label>
                    </p>
                    <p className="text-sm text-gray-500">PDF only, max 5MB</p>
                  </div>
                )}
              </div>
              {errors.cvFile && <p className="text-red-500 text-sm mt-1">{errors.cvFile}</p>}
            </div>

            {/* Cover Letter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Why are you interested in this position? *
              </label>
              <textarea
                name="coverLetter"
                value={formData.coverLetter}
                onChange={handleInputChange}
                rows={5}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.coverLetter ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Tell us about your interest in this role, relevant experience, and what you can bring to the team..."
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.coverLetter.length} characters (minimum 50)
              </p>
              {errors.coverLetter && <p className="text-red-500 text-sm mt-1">{errors.coverLetter}</p>}
            </div>

            {/* Additional Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Additional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expected Salary (Optional)
                  </label>
                  <input
                    type="text"
                    name="expectedSalary"
                    value={formData.expectedSalary}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., $800-1200/month"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Start Date
                  </label>
                  <input
                    type="date"
                    name="availableStartDate"
                    value={formData.availableStartDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Portfolio/LinkedIn (Optional)
                </label>
                <input
                  type="url"
                  name="portfolioLink"
                  value={formData.portfolioLink}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://your-portfolio.com or LinkedIn profile"
                />
              </div>
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{errors.submit}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={submitting}
              >
                {submitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⏳</span>
                    <span>Submitting...</span>
                  </div>
                ) : (
                  'Submit Application'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JobApplicationModal;