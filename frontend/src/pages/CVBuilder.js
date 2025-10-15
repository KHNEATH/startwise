

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveCV } from '../api/userApi';

const CVBuilder = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    // Personal Information
    name: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    profilePicture: null,
    
    // Professional Summary
    summary: '',
    
    // Experience
    experiences: [
      { company: '', position: '', startDate: '', endDate: '', description: '', current: false }
    ],
    noWorkExperience: false,
    
    // Education
    education: [
      { school: '', degree: '', field: '', startDate: '', endDate: '', gpa: '' }
    ],
    
    // Skills
    technicalSkills: [],
    softSkills: [],
    languages: [{ name: '', proficiency: 'Beginner' }],
    
    // Additional Sections
    projects: [{ name: '', description: '', technologies: '', link: '' }],
    certifications: [{ name: '', issuer: '', date: '', id: '' }],
    achievements: [''],
    skipAdditionalSections: false
  });
  const [profileImage, setProfileImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cvGenerated, setCvGenerated] = useState(false);
  const [apiError, setApiError] = useState('');
  const fileInputRef = useRef(null);

  // Add print styles when component mounts
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @media print {
        * {
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        
        body * {
          visibility: hidden;
        }
        
        .cv-preview-content,
        .cv-preview-content * {
          visibility: visible;
        }
        
        .cv-preview-content {
          position: absolute !important;
          left: 0 !important;
          top: 0 !important;
          width: 100% !important;
          height: auto !important;
          margin: 0 !important;
          padding: 0.3in !important;
          background: white !important;
          box-shadow: none !important;
          border: none !important;
          border-radius: 0 !important;
          font-size: 11px !important;
          line-height: 1.3 !important;
          overflow: visible !important;
        }
        
        .print-hide {
          display: none !important;
        }
        
        /* Typography adjustments for print */
        .cv-preview-content h1 {
          font-size: 24px !important;
          margin-bottom: 8px !important;
          color: #000 !important;
        }
        
        .cv-preview-content h2 {
          font-size: 16px !important;
          margin-bottom: 8px !important;
          margin-top: 12px !important;
          color: #000 !important;
        }
        
        .cv-preview-content h3 {
          font-size: 14px !important;
          margin-bottom: 4px !important;
          color: #000 !important;
        }
        
        .cv-preview-content p,
        .cv-preview-content span,
        .cv-preview-content li,
        .cv-preview-content div {
          color: #000 !important;
          font-size: 11px !important;
          line-height: 1.3 !important;
        }
        
        /* Remove gradients and use simple borders */
        .cv-preview-content .bg-gradient-to-r {
          background: white !important;
          border: 1px solid #d1d5db !important;
          margin-bottom: 8px !important;
          padding: 8px !important;
        }
        
        /* Simplify colored elements */
        .cv-preview-content .text-blue-600,
        .cv-preview-content .text-green-600,
        .cv-preview-content .text-purple-600,
        .cv-preview-content .text-orange-600,
        .cv-preview-content .text-indigo-600 {
          color: #374151 !important;
        }
        
        .cv-preview-content .bg-blue-600,
        .cv-preview-content .bg-green-600,
        .cv-preview-content .bg-purple-600,
        .cv-preview-content .bg-orange-600,
        .cv-preview-content .bg-indigo-600 {
          background-color: #f3f4f6 !important;
          color: #000 !important;
          border: 1px solid #d1d5db !important;
        }
        
        /* Contact badges - make them inline */
        .cv-preview-content .bg-blue-100,
        .cv-preview-content .bg-green-100,
        .cv-preview-content .bg-purple-100,
        .cv-preview-content .bg-indigo-100 {
          background: white !important;
          color: #000 !important;
          border: 1px solid #d1d5db !important;
          padding: 2px 6px !important;
          margin: 2px !important;
          display: inline-block !important;
        }
        
        /* Skill tags */
        .cv-preview-content .rounded-full {
          background: #f9fafb !important;
          color: #000 !important;
          border: 1px solid #d1d5db !important;
          padding: 2px 8px !important;
          margin: 1px !important;
          font-size: 10px !important;
        }
        
        /* Remove decorative elements */
        .cv-preview-content .absolute {
          display: none !important;
        }
        
        /* Compact spacing */
        .cv-preview-content .space-y-6 > * + * {
          margin-top: 8px !important;
        }
        
        .cv-preview-content .space-y-4 > * + * {
          margin-top: 6px !important;
        }
        
        .cv-preview-content .mb-8 {
          margin-bottom: 10px !important;
        }
        
        .cv-preview-content .mb-6 {
          margin-bottom: 8px !important;
        }
        
        .cv-preview-content .mb-4 {
          margin-bottom: 6px !important;
        }
        
        /* Page break handling */
        .cv-preview-content > div {
          page-break-inside: avoid;
          break-inside: avoid;
        }
        
        @page {
          margin: 0.3in;
          size: A4;
        }
        
        /* Hide profile image for more space */
        .cv-preview-content img,
        .cv-preview-content .w-32.h-32 {
          display: none !important;
        }
        
        /* Adjust header without image */
        .cv-preview-content .flex.items-center.space-x-8 {
          display: block !important;
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const steps = [
    { id: 1, title: 'Personal Info', icon: '👤', description: 'Basic information and photo' },
    { id: 2, title: 'Professional', icon: '💼', description: 'Summary and work experience' },
    { id: 3, title: 'Education', icon: '🎓', description: 'Academic background' },
    { id: 4, title: 'Skills', icon: '⚡', description: 'Technical and soft skills' },
    { id: 5, title: 'Additional', icon: '🏆', description: 'Projects and achievements' },
    { id: 6, title: 'Preview', icon: '👁️', description: 'Review and generate' }
  ];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) { // 5MB limit
        setErrors({ ...errors, profilePicture: 'Image size should be less than 5MB' });
        return;
      }
      if (!file.type.startsWith('image/')) {
        setErrors({ ...errors, profilePicture: 'Please upload a valid image file' });
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
        setForm({ ...form, profilePicture: e.target.result });
        setErrors({ ...errors, profilePicture: undefined });
      };
      reader.readAsDataURL(file);
    }
  };

  const addArrayItem = (field, newItem) => {
    setForm({
      ...form,
      [field]: [...form[field], newItem]
    });
  };

  const removeArrayItem = (field, index) => {
    setForm({
      ...form,
      [field]: form[field].filter((_, i) => i !== index)
    });
  };

  const updateArrayItem = (field, index, updates) => {
    setForm({
      ...form,
      [field]: form[field].map((item, i) => i === index ? { ...item, ...updates } : item)
    });
  };

  const addSkill = (type, skill) => {
    if (skill.trim() && !form[type].includes(skill.trim())) {
      setForm({
        ...form,
        [type]: [...form[type], skill.trim()]
      });
    }
  };

  const removeSkill = (type, index) => {
    setForm({
      ...form,
      [type]: form[type].filter((_, i) => i !== index)
    });
  };

  const validate = () => {
    const newErrors = {};
    if (step === 1) {
      if (!form.name.trim()) newErrors.name = 'Name is required';
      if (!form.email.trim()) newErrors.email = 'Email is required';
      if (!form.phone.trim()) newErrors.phone = 'Phone is required';
      if (!form.location.trim()) newErrors.location = 'Location is required';
    }
    if (step === 2) {
      if (!form.summary.trim()) newErrors.summary = 'Professional summary is required';
    }
    return newErrors;
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const handleNext = e => {
    e.preventDefault();
    const validation = validate();
    setErrors(validation);
    if (Object.keys(validation).length === 0) {
      // Reset CV generation state when entering step 6
      if (step + 1 === 6) {
        setCvGenerated(false);
      }
      setStep(step + 1);
    }
  };

  const handleBack = e => {
    e.preventDefault();
    // Reset CV generation state when going back from step 6
    if (step === 6) {
      setCvGenerated(false);
    }
    setStep(step - 1);
  };

  const handleGenerateCV = (e) => {
    e.preventDefault();
    setCvGenerated(true);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setApiError('');
    
    // Only validate required fields for final save, not all step validations
    const finalValidation = {};
    if (!form.name?.trim()) finalValidation.name = 'Name is required to save CV';
    if (!form.email?.trim()) finalValidation.email = 'Email is required to save CV';
    
    console.log('Final validation errors:', finalValidation);
    console.log('Form data being validated:', {
      name: form.name,
      email: form.email,
      hasName: !!form.name?.trim(),
      hasEmail: !!form.email?.trim()
    });
    
    setErrors(finalValidation);
    
    if (Object.keys(finalValidation).length === 0) {
      setLoading(true);
      try {
        console.log('Saving CV with data:', form);
        // TODO: Replace userId=1 with real user ID from auth
        const res = await saveCV({ userId: 1, cv: form });
        console.log('CV saved successfully:', res);
        setSubmitted(true);
        setApiError(''); // Clear any previous errors
        
        // Redirect to CV preview page
        navigate('/cv-preview', { 
          state: { 
            cvData: form,
            saved: true 
          } 
        });
      } catch (err) {
        console.error('CV save error:', err);
        console.error('Error response:', err?.response?.data);
        const errorMessage = err?.response?.data?.error || err?.message || 'Failed to save CV';
        setApiError(`Save failed: ${errorMessage}`);
        setSubmitted(false);
      } finally {
        setLoading(false);
      }
    } else {
      setSubmitted(false);
    }
  };

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      {/* Profile Picture Upload */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center border-4 border-white shadow-lg overflow-hidden">
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 shadow-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
        <p className="text-sm text-gray-500 mt-2">Upload your profile photo (max 5MB)</p>
        {errors.profilePicture && <p className="text-red-500 text-sm">{errors.profilePicture}</p>}
      </div>

      {/* Personal Information Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${errors.name ? 'border-red-300' : 'border-gray-300'}`}
            placeholder="John Doe"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${errors.email ? 'border-red-300' : 'border-gray-300'}`}
            placeholder="john.doe@email.com"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${errors.phone ? 'border-red-300' : 'border-gray-300'}`}
            placeholder="+1 (555) 123-4567"
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Location *</label>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${errors.location ? 'border-red-300' : 'border-gray-300'}`}
            placeholder="New York, NY"
          />
          {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Website</label>
          <input
            type="url"
            name="website"
            value={form.website}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            placeholder="https://yourwebsite.com"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">LinkedIn</label>
          <input
            type="url"
            name="linkedin"
            value={form.linkedin}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            placeholder="https://linkedin.com/in/johndoe"
          />
        </div>
      </div>
    </div>
  );

  const renderAdditional = () => (
    <div className="space-y-6">
      {/* Skip Additional Sections Option */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mb-6">
        <div className="flex items-start space-x-3">
          <svg className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div className="flex-1">
            <h4 className="text-lg font-semibold text-blue-900 mb-2">📚 For High School Students</h4>
            <p className="text-blue-800 text-sm mb-4">
              Don't worry if you don't have projects, certifications, or major achievements yet! 
              These sections are <strong>completely optional</strong> and perfect for university students or working professionals.
            </p>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={form.skipAdditionalSections}
                onChange={(e) => setForm({
                  ...form,
                  skipAdditionalSections: e.target.checked,
                  projects: e.target.checked ? [] : form.projects,
                  certifications: e.target.checked ? [] : form.certifications,
                  achievements: e.target.checked ? [''] : form.achievements
                })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-3"
              />
              <span className="text-sm font-medium text-blue-900">
                Skip additional sections - My CV is strong with just education and skills
              </span>
            </label>
          </div>
        </div>
      </div>

      {!form.skipAdditionalSections && (
        <>
          {/* Projects */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-semibold text-gray-700">Projects <span className="text-gray-500 font-normal">(Optional)</span></label>
          <button
            type="button"
            onClick={() => addArrayItem('projects', { name: '', description: '', technologies: '', link: '' })}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Project
          </button>
        </div>
        
        {form.projects.map((project, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Project Name"
                value={project.name}
                onChange={(e) => updateArrayItem('projects', index, { name: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Technologies Used (e.g., React, Python, MySQL)"
                value={project.technologies}
                onChange={(e) => updateArrayItem('projects', index, { technologies: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <input
              type="url"
              placeholder="Project Link (optional)"
              value={project.link}
              onChange={(e) => updateArrayItem('projects', index, { link: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
            />
            <textarea
              placeholder="Describe your project and what you accomplished..."
              rows={3}
              value={project.description}
              onChange={(e) => updateArrayItem('projects', index, { description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            {form.projects.length > 1 && (
              <button
                type="button"
                onClick={() => removeArrayItem('projects', index)}
                className="mt-2 text-red-600 hover:text-red-800 text-sm"
              >
                Remove Project
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Certifications */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-semibold text-gray-700">Certifications</label>
          <button
            type="button"
            onClick={() => addArrayItem('certifications', { name: '', issuer: '', date: '', id: '' })}
            className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Certification
          </button>
        </div>
        
        {form.certifications.map((cert, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Certification Name"
                value={cert.name}
                onChange={(e) => updateArrayItem('certifications', index, { name: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Issuing Organization"
                value={cert.issuer}
                onChange={(e) => updateArrayItem('certifications', index, { issuer: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="month"
                placeholder="Date Obtained"
                value={cert.date}
                onChange={(e) => updateArrayItem('certifications', index, { date: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Certification ID (optional)"
                value={cert.id}
                onChange={(e) => updateArrayItem('certifications', index, { id: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {form.certifications.length > 1 && (
              <button
                type="button"
                onClick={() => removeArrayItem('certifications', index)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Remove Certification
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Achievements */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-semibold text-gray-700">Achievements & Awards</label>
          <button
            type="button"
            onClick={() => addArrayItem('achievements', '')}
            className="text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Achievement
          </button>
        </div>
        
        {form.achievements.map((achievement, index) => (
          <div key={index} className="flex items-center space-x-3 mb-3">
            <input
              type="text"
              placeholder="Achievement or award description..."
              value={achievement}
              onChange={(e) => {
                const newAchievements = [...form.achievements];
                newAchievements[index] = e.target.value;
                setForm({ ...form, achievements: newAchievements });
              }}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {form.achievements.length > 1 && (
              <button
                type="button"
                onClick={() => removeArrayItem('achievements', index)}
                className="text-red-600 hover:text-red-800 text-sm px-2 py-1"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>

          {/* Additional Tips */}
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-lg p-4 mt-6">
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <h4 className="text-sm font-semibold text-orange-900 mb-2">💡 Additional Section Tips</h4>
                <div className="text-xs text-orange-800 space-y-1">
                  <p><strong>Projects:</strong> Include personal, school, or freelance projects that show your skills</p>
                  <p><strong>Certifications:</strong> Add relevant professional certifications or course completions</p>
                  <p><strong>Achievements:</strong> Include academic honors, competition wins, or notable accomplishments</p>
                  <p><strong>For Students:</strong> School projects, hackathons, volunteer work, and extracurricular activities count!</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderSkills = () => (
    <div className="space-y-6">
      {/* Technical Skills */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">Technical Skills</label>
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <input
              type="text"
              placeholder="Add a technical skill (e.g., JavaScript, Python, Adobe Photoshop)"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addSkill('technicalSkills', e.target.value);
                  e.target.value = '';
                }
              }}
            />
            <button
              type="button"
              onClick={(e) => {
                const input = e.target.parentElement.querySelector('input');
                addSkill('technicalSkills', input.value);
                input.value = '';
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.technicalSkills.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill('technicalSkills', index)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Soft Skills */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">Soft Skills</label>
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <input
              type="text"
              placeholder="Add a soft skill (e.g., Communication, Leadership, Problem-solving)"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addSkill('softSkills', e.target.value);
                  e.target.value = '';
                }
              }}
            />
            <button
              type="button"
              onClick={(e) => {
                const input = e.target.parentElement.querySelector('input');
                addSkill('softSkills', input.value);
                input.value = '';
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.softSkills.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill('softSkills', index)}
                  className="ml-2 text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Languages */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-semibold text-gray-700">Languages</label>
          <button
            type="button"
            onClick={() => addArrayItem('languages', { name: '', proficiency: 'Beginner' })}
            className="text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Language
          </button>
        </div>
        
        {form.languages.map((lang, index) => (
          <div key={index} className="flex items-center space-x-3 mb-3 p-3 border border-gray-200 rounded-lg">
            <input
              type="text"
              placeholder="Language (e.g., English, Spanish)"
              value={lang.name}
              onChange={(e) => updateArrayItem('languages', index, { name: e.target.value })}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={lang.proficiency}
              onChange={(e) => updateArrayItem('languages', index, { proficiency: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Native">Native</option>
              <option value="Fluent">Fluent</option>
            </select>
            {form.languages.length > 1 && (
              <button
                type="button"
                onClick={() => removeArrayItem('languages', index)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Skills Tips */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4 mt-6">
        <div className="flex items-start space-x-3">
          <svg className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className="text-sm font-semibold text-purple-900 mb-2">💡 Skills Tips</h4>
            <div className="text-xs text-purple-800 space-y-1">
              <p><strong>Technical Skills:</strong> Include programming languages, software, tools, frameworks</p>
              <p><strong>Soft Skills:</strong> Add communication, leadership, teamwork, problem-solving abilities</p>
              <p><strong>Languages:</strong> Be honest about your proficiency level</p>
              <p><strong>For Students:</strong> Include skills from coursework, personal projects, or hobbies</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEducation = () => (
    <div className="space-y-6">
      {/* Education Header */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-semibold text-gray-700">Education</label>
          <button
            type="button"
            onClick={() => addArrayItem('education', { school: '', degree: '', field: '', startDate: '', endDate: '', gpa: '' })}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Education
          </button>
        </div>
        
        {form.education.map((edu, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="School/Institution Name"
                value={edu.school}
                onChange={(e) => updateArrayItem('education', index, { school: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Degree (e.g., Bachelor's, Master's)"
                value={edu.degree}
                onChange={(e) => updateArrayItem('education', index, { degree: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Field of Study"
                value={edu.field}
                onChange={(e) => updateArrayItem('education', index, { field: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="GPA (optional)"
                value={edu.gpa}
                onChange={(e) => updateArrayItem('education', index, { gpa: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="month"
                placeholder="Start Date"
                value={edu.startDate}
                onChange={(e) => updateArrayItem('education', index, { startDate: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="month"
                placeholder="End Date (or Expected)"
                value={edu.endDate}
                onChange={(e) => updateArrayItem('education', index, { endDate: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {form.education.length > 1 && (
              <button
                type="button"
                onClick={() => removeArrayItem('education', index)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Remove Education
              </button>
            )}
          </div>
        ))}

        {/* Helpful Tips for Students */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4 mt-4">
          <div className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div>
              <h4 className="text-sm font-semibold text-green-900 mb-1">💡 Education Tips</h4>
              <ul className="text-xs text-green-800 space-y-1">
                <li>• Include your current or most recent education first</li>
                <li>• Add relevant coursework, honors, or academic achievements</li>
                <li>• For high school students: include your graduation year and any honors</li>
                <li>• GPA is optional - only include if 3.5 or higher</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProfessionalInfo = () => (
    <div className="space-y-6">
      {/* Professional Summary */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Professional Summary *</label>
        <textarea
          name="summary"
          rows={4}
          value={form.summary}
          onChange={handleChange}
          className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none ${errors.summary ? 'border-red-300' : 'border-gray-300'}`}
          placeholder={form.noWorkExperience 
            ? "Motivated student seeking to leverage my academic knowledge, skills, and passion for learning in an internship or entry-level position. Eager to contribute to a dynamic team while gaining valuable hands-on experience..."
            : "Write a compelling summary that highlights your key strengths and career objectives..."
          }
        />
        {errors.summary && <p className="text-red-500 text-sm mt-1">{errors.summary}</p>}
        <p className="text-xs text-gray-500 mt-1">
          {form.noWorkExperience 
            ? "2-3 sentences about your academic background, skills, and career aspirations"
            : "2-3 sentences about your professional background and goals"
          }
        </p>
      </div>

      {/* Work Experience */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-semibold text-gray-700">Work Experience</label>
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={form.noWorkExperience}
                onChange={(e) => {
                  setForm({
                    ...form,
                    noWorkExperience: e.target.checked,
                    experiences: e.target.checked ? [] : [{ company: '', position: '', startDate: '', endDate: '', description: '', current: false }]
                  });
                }}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">No work experience yet</span>
            </label>
            {!form.noWorkExperience && (
              <button
                type="button"
                onClick={() => addArrayItem('experiences', { company: '', position: '', startDate: '', endDate: '', description: '', current: false })}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Experience
              </button>
            )}
          </div>
        </div>
        
        {form.noWorkExperience ? (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mb-4">
            <div className="flex items-start space-x-3">
              <svg className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <h4 className="text-lg font-semibold text-blue-900 mb-2">Perfect for Students & New Graduates!</h4>
                <p className="text-blue-800 text-sm mb-3">
                  Don't worry about not having work experience yet. We'll help you highlight your:
                </p>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Education & Academic achievements
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Skills & Technical abilities
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Projects & Personal initiatives
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Volunteer work & Extracurricular activities
                  </li>
                </ul>
                <p className="text-blue-700 text-sm mt-3 font-medium">
                  💡 Continue to the next steps to build a strong CV that showcases your potential!
                </p>
              </div>
            </div>
          </div>
        ) : (
          form.experiences.map((exp, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Company Name"
                value={exp.company}
                onChange={(e) => updateArrayItem('experiences', index, { company: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Job Title"
                value={exp.position}
                onChange={(e) => updateArrayItem('experiences', index, { position: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="month"
                placeholder="Start Date"
                value={exp.startDate}
                onChange={(e) => updateArrayItem('experiences', index, { startDate: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex items-center space-x-2">
                <input
                  type="month"
                  placeholder="End Date"
                  value={exp.endDate}
                  onChange={(e) => updateArrayItem('experiences', index, { endDate: e.target.value })}
                  disabled={exp.current}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
                <label className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={exp.current}
                    onChange={(e) => updateArrayItem('experiences', index, { current: e.target.checked, endDate: e.target.checked ? '' : exp.endDate })}
                    className="mr-2"
                  />
                  Current
                </label>
              </div>
            </div>
            <textarea
              placeholder="Describe your responsibilities and achievements..."
              rows={3}
              value={exp.description}
              onChange={(e) => updateArrayItem('experiences', index, { description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            {form.experiences.length > 1 && (
              <button
                type="button"
                onClick={() => removeArrayItem('experiences', index)}
                className="mt-2 text-red-600 hover:text-red-800 text-sm"
              >
                Remove Experience
              </button>
            )}
          </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12 pt-4 pb-4 print-hide">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full mb-6 shadow-xl transform hover:scale-105 transition-transform duration-300">
            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="mb-6">
            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4 tracking-tight leading-tight">
              CV Builder
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full mb-6"></div>
          </div>
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-medium">
            Create a professional CV in minutes with our easy-to-use builder. 
            <span className="block mt-2 text-lg text-gray-600">
              Stand out from the crowd with a polished, ATS-friendly resume.
            </span>
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8 print-hide">
          <div className="flex items-center justify-center space-x-4 overflow-x-auto pb-4">
            {steps.map((s, index) => (
              <div key={s.id} className="flex items-center">
                <div className={`flex flex-col items-center min-w-0 ${index < steps.length - 1 ? 'mr-4' : ''}`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold mb-2 transition-colors ${
                    step === s.id 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : step > s.id 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step > s.id ? '✓' : s.icon}
                  </div>
                  <span className={`text-xs font-medium text-center ${step === s.id ? 'text-blue-600' : 'text-gray-500'}`}>
                    {s.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-0.5 w-8 mx-2 ${step > s.id ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
          {/* Form Section */}
          <div className="lg:col-span-2 print-hide">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  {steps.find(s => s.id === step)?.title}
                </h2>
                <p className="text-gray-600">
                  {steps.find(s => s.id === step)?.description}
                </p>
              </div>

              <form onSubmit={step === steps.length ? handleGenerateCV : handleNext}>
                {/* Global Messages */}
                {loading && (
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
                      <span className="text-blue-700">Generating your CV...</span>
                    </div>
                  </div>
                )}



                {/* Step Content */}
                {step === 1 && renderPersonalInfo()}
                {step === 2 && renderProfessionalInfo()}
                {step === 3 && renderEducation()}
                {step === 4 && renderSkills()}
                {step === 5 && renderAdditional()}
                
                {/* Preview & Completion Step */}
                {step === 6 && (
                  <div className="space-y-6">
                    {/* Status Messages */}
                    {(apiError || Object.keys(errors).length > 0) && (
                      <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
                        <div className="flex items-start">
                          <svg className="w-5 h-5 text-red-400 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          <div>
                            {apiError && <p className="text-red-700 font-medium mb-2">{apiError}</p>}
                            {Object.keys(errors).length > 0 && (
                              <div>
                                <p className="text-red-700 font-medium mb-1">Please fix these required fields:</p>
                                <ul className="text-red-600 text-sm space-y-1">
                                  {Object.entries(errors).map(([field, error]) => (
                                    <li key={field}>• {error}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Success Message */}
                    {submitted && !apiError && (
                      <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <p className="text-green-700 font-medium">🎉 CV saved successfully and ready to view!</p>
                        </div>
                      </div>
                    )}

                    {/* Completion Card */}
                    <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-8 text-center">
                      {!cvGenerated ? (
                        <>
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm3 2h10v11H4V4h3z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">Ready to Generate Your CV! 🚀</h3>
                          <p className="text-gray-600 mb-6">
                            Click "Generate CV" to create your professional CV and preview it below.
                          </p>
                        </>
                      ) : (
                        <>
                          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">🎉 Your CV is Complete!</h3>
                          <p className="text-gray-600 mb-6">
                            Great job! Your professional CV has been generated and is displayed below.
                          </p>
                        </>
                      )}

                      {/* CV Summary - Only show when generated */}
                      {cvGenerated && (
                        <>
                          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left max-w-md mx-auto">
                            <h4 className="font-semibold text-gray-900 mb-3 text-center">CV Summary</h4>
                            <div className="space-y-2 text-sm text-gray-700">
                              <div className="flex justify-between">
                                <span>Name:</span>
                                <span className="font-medium">{form.name || 'Not provided'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Email:</span>
                                <span className="font-medium">{form.email || 'Not provided'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Experience:</span>
                                <span className="font-medium">
                                  {form.noWorkExperience ? 'Student/Entry Level' : 
                                   form.experiences?.filter(exp => exp.company).length || 0} positions
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Education:</span>
                                <span className="font-medium">{form.education?.filter(edu => edu.school).length || 0} entries</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Skills:</span>
                                <span className="font-medium">{(form.technicalSkills?.length || 0) + (form.softSkills?.length || 0)} skills</span>
                              </div>
                            </div>
                          </div>

                          {/* Next Steps */}
                          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 text-sm text-gray-700">
                            <h4 className="font-semibold mb-2 text-gray-900">Ready to Launch Your Career?</h4>
                            <div className="text-left space-y-1">
                              <p>✓ <strong>Preview:</strong> Click "Preview CV" to see your complete resume</p>
                              <p>✓ <strong>Print:</strong> Use "Quick Print" for immediate printing</p>
                              <p>✓ <strong>Save:</strong> Click "Save & Preview" to store and view your CV</p>
                            </div>
                          </div>
                        </>
                      )}
                    </div>


                    {/* Action Buttons */}
                    <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8 mt-12 border border-gray-200 print-hide">
                      <div className="text-center mb-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to Launch Your Career? 🚀</h3>
                        <p className="text-gray-600">Save your professional CV and start applying to your dream jobs!</p>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row justify-center gap-3 max-w-2xl mx-auto">
                        <button
                          type="button"
                          onClick={() => navigate('/cv-preview', { state: { cvData: form } })}
                          className="group relative px-6 py-3 bg-white text-gray-700 rounded-lg border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 font-medium flex items-center justify-center shadow-md hover:shadow-lg"
                        >
                          <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          Preview CV
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => window.print()}
                          className="group relative px-6 py-3 bg-white text-gray-700 rounded-lg border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-300 font-medium flex items-center justify-center shadow-md hover:shadow-lg"
                        >
                          <svg className="w-5 h-5 mr-2 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zM5 14H4v-3h1v3zm1 0v2h8v-2H6zm9 0h1v-3h-1v3z" clipRule="evenodd" />
                          </svg>
                          Quick Print
                        </button>
                        
                        <button
                          type="button"
                          onClick={handleSubmit}
                          disabled={loading}
                          className="group relative px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 font-medium flex items-center justify-center shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                          {loading ? (
                            <>
                              <svg className="animate-spin w-5 h-5 mr-2 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Saving...
                            </>
                          ) : (
                            <>
                              <svg className="w-5 h-5 mr-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                              Save & Preview
                            </>
                          )}
                        </button>
                      </div>
                      
                      <div className="mt-6 text-center">
                        <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
                          <div className="flex items-center">
                            <svg className="w-4 h-4 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            ATS-Friendly Format
                          </div>
                          <div className="flex items-center">
                            <svg className="w-4 h-4 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Professional Design
                          </div>
                          <div className="flex items-center">
                            <svg className="w-4 h-4 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Instant Download
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center mt-12 pt-10 border-t border-gray-200 print-hide">
                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={step === 1}
                    className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                      step === 1 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Previous
                  </button>
                  
                  <div className="flex-1 mx-8"></div>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                      loading
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {step === steps.length ? 'Generate CV' : 'Next'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Preview Section */}
          <div className="lg:col-span-1 print-hide">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">CV Preview</h3>
              <div className="bg-gray-50 rounded-lg p-4 min-h-[400px] border-2 border-dashed border-gray-200">
                {/* Mini CV Preview */}
                <div className="text-center mb-4">
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="w-16 h-16 rounded-full mx-auto mb-2 object-cover" />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-200 mx-auto mb-2 flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                  <h4 className="font-semibold text-sm">{form.name || 'Your Name'}</h4>
                  <p className="text-xs text-gray-600">{form.email || 'your.email@example.com'}</p>
                  <p className="text-xs text-gray-600">{form.location || 'Your Location'}</p>
                </div>
                
                {form.summary && (
                  <div className="mb-4">
                    <h5 className="font-medium text-xs mb-1">Summary</h5>
                    <p className="text-xs text-gray-600 leading-relaxed">{form.summary.substring(0, 100)}...</p>
                  </div>
                )}

                {form.education && form.education.length > 0 && form.education[0].school && (
                  <div className="mb-4">
                    <h5 className="font-medium text-xs mb-1">Education</h5>
                    {form.education.slice(0, 2).map((edu, index) => (
                      <div key={index} className="mb-2">
                        <p className="text-xs font-medium text-gray-700">{edu.school}</p>
                        <p className="text-xs text-gray-600">{edu.degree} {edu.field && `in ${edu.field}`}</p>
                        {edu.gpa && <p className="text-xs text-gray-500">GPA: {edu.gpa}</p>}
                      </div>
                    ))}
                  </div>
                )}

                {!form.noWorkExperience && form.experiences && form.experiences.length > 0 && form.experiences[0].company && (
                  <div className="mb-4">
                    <h5 className="font-medium text-xs mb-1">Experience</h5>
                    {form.experiences.slice(0, 2).map((exp, index) => (
                      <div key={index} className="mb-2">
                        <p className="text-xs font-medium text-gray-700">{exp.position}</p>
                        <p className="text-xs text-gray-600">{exp.company}</p>
                      </div>
                    ))}
                  </div>
                )}

                {(form.technicalSkills.length > 0 || form.softSkills.length > 0) && (
                  <div className="mb-4">
                    <h5 className="font-medium text-xs mb-1">Skills</h5>
                    {form.technicalSkills.length > 0 && (
                      <div className="mb-2">
                        <p className="text-xs text-gray-600 mb-1">Technical:</p>
                        <div className="flex flex-wrap gap-1">
                          {form.technicalSkills.slice(0, 6).map((skill, index) => (
                            <span key={index} className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                              {skill}
                            </span>
                          ))}
                          {form.technicalSkills.length > 6 && (
                            <span className="text-xs text-gray-500">+{form.technicalSkills.length - 6} more</span>
                          )}
                        </div>
                      </div>
                    )}
                    {form.softSkills.length > 0 && (
                      <div className="mb-2">
                        <p className="text-xs text-gray-600 mb-1">Soft Skills:</p>
                        <div className="flex flex-wrap gap-1">
                          {form.softSkills.slice(0, 4).map((skill, index) => (
                            <span key={index} className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">
                              {skill}
                            </span>
                          ))}
                          {form.softSkills.length > 4 && (
                            <span className="text-xs text-gray-500">+{form.softSkills.length - 4} more</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {form.languages && form.languages.length > 0 && form.languages[0].name && (
                  <div className="mb-4">
                    <h5 className="font-medium text-xs mb-1">Languages</h5>
                    {form.languages.slice(0, 3).map((lang, index) => (
                      <div key={index} className="mb-1">
                        <p className="text-xs text-gray-700">{lang.name} - {lang.proficiency}</p>
                      </div>
                    ))}
                    {form.languages.length > 3 && (
                      <p className="text-xs text-gray-500">+{form.languages.length - 3} more languages</p>
                    )}
                  </div>
                )}

                {!form.skipAdditionalSections && form.projects && form.projects.length > 0 && form.projects[0].name && (
                  <div className="mb-4">
                    <h5 className="font-medium text-xs mb-1">Projects</h5>
                    {form.projects.slice(0, 2).map((project, index) => (
                      <div key={index} className="mb-2">
                        <p className="text-xs font-medium text-gray-700">{project.name}</p>
                        <p className="text-xs text-gray-600">{project.technologies}</p>
                      </div>
                    ))}
                    {form.projects.length > 2 && (
                      <p className="text-xs text-gray-500">+{form.projects.length - 2} more projects</p>
                    )}
                  </div>
                )}

                {!form.skipAdditionalSections && form.certifications && form.certifications.length > 0 && form.certifications[0].name && (
                  <div className="mb-4">
                    <h5 className="font-medium text-xs mb-1">Certifications</h5>
                    {form.certifications.slice(0, 2).map((cert, index) => (
                      <div key={index} className="mb-2">
                        <p className="text-xs font-medium text-gray-700">{cert.name}</p>
                        <p className="text-xs text-gray-600">{cert.issuer}</p>
                      </div>
                    ))}
                    {form.certifications.length > 2 && (
                      <p className="text-xs text-gray-500">+{form.certifications.length - 2} more certifications</p>
                    )}
                  </div>
                )}

                {!form.skipAdditionalSections && form.achievements && form.achievements.length > 0 && form.achievements[0] && (
                  <div className="mb-4">
                    <h5 className="font-medium text-xs mb-1">Achievements</h5>
                    {form.achievements.slice(0, 3).map((achievement, index) => (
                      <div key={index} className="mb-1">
                        <p className="text-xs text-gray-700">• {achievement}</p>
                      </div>
                    ))}
                    {form.achievements.length > 3 && (
                      <p className="text-xs text-gray-500">+{form.achievements.length - 3} more achievements</p>
                    )}
                  </div>
                )}
                
                <div className="text-xs text-gray-500 text-center mt-8">
                  {step === 6 ? 'Your complete CV is ready!' : 'Complete all steps to see your full CV preview'}
                </div>
              </div>
              
              <button
                type="button"
                className="w-full mt-8 bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium shadow-md hover:shadow-lg"
                onClick={() => {
                  setCvGenerated(false);
                  setStep(steps.length);
                }}
              >
                Skip to Preview
              </button>
            </div>
          </div>
        </div>

        {/* Hidden CV Content for Printing - Only show when generated */}
        <div className={`mt-10 cv-preview-content bg-white border border-gray-200 rounded-xl shadow-2xl p-6 max-w-4xl mx-auto relative overflow-hidden ${!cvGenerated || step !== 6 ? 'hidden' : ''}`} style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-full transform translate-x-32 -translate-y-32 opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-green-50 to-blue-50 rounded-full transform -translate-x-24 translate-y-24 opacity-50"></div>
          
          {/* Executive Header */}
          <div className="relative z-10 bg-gradient-to-r from-slate-800 to-slate-900 text-white -mx-6 -mt-6 px-8 py-8 mb-8">
            <div className="flex items-start space-x-8">
              <div className="relative flex-shrink-0">
                {profileImage ? (
                  <img 
                    src={profileImage} 
                    alt={form.name || 'Profile'} 
                    className="w-36 h-36 rounded-full object-cover border-4 border-white shadow-2xl"
                  />
                ) : (
                  <div className="w-36 h-36 rounded-full bg-gradient-to-br from-blue-500 to-indigo-700 flex items-center justify-center border-4 border-white shadow-2xl">
                    <svg className="w-18 h-18 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight leading-tight">
                  {form.name || 'John Doe'}
                </h1>
                <h2 className="text-xl md:text-2xl text-gray-300 mb-6 font-light">
                  Professional Summary
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {(form.email || !form.name) && (
                    <div className="flex items-center text-white bg-white bg-opacity-20 px-4 py-3 rounded-lg backdrop-blur-sm">
                      <svg className="w-5 h-5 mr-3 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      <span className="font-medium">{form.email || 'john.doe@email.com'}</span>
                    </div>
                  )}
                  
                  {(form.phone || !form.name) && (
                    <div className="flex items-center text-white bg-white bg-opacity-20 px-4 py-3 rounded-lg backdrop-blur-sm">
                      <svg className="w-5 h-5 mr-3 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      <span className="font-medium">{form.phone || '+1 (555) 123-4567'}</span>
                    </div>
                  )}
                  
                  {(form.location || !form.name) && (
                    <div className="flex items-center text-white bg-white bg-opacity-20 px-4 py-3 rounded-lg backdrop-blur-sm">
                      <svg className="w-5 h-5 mr-3 text-purple-300" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">{form.location || 'New York, NY'}</span>
                    </div>
                  )}
                  
                  {(form.linkedin || !form.name) && (
                    <div className="flex items-center text-white bg-white bg-opacity-20 px-4 py-3 rounded-lg backdrop-blur-sm">
                      <svg className="w-5 h-5 mr-3 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">{form.linkedin || 'linkedin.com/in/johndoe'}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Professional Summary */}
          {(form.summary || !form.name) && (
            <div className="mb-8">
              <div className="flex items-center mb-4 pb-2 border-b-2 border-blue-600">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-3">
                  <span className="text-sm font-bold">1</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-800 tracking-wide">
                  PROFESSIONAL SUMMARY
                </h2>
              </div>
              <div className="bg-slate-50 border-l-4 border-blue-600 pl-6 py-4">
                <p className="text-gray-800 leading-relaxed text-lg font-medium">
                  {form.summary || 'Dedicated and results-driven professional with a passion for innovation and excellence. Experienced in leading cross-functional teams and delivering high-quality solutions. Seeking to leverage my skills and experience to contribute to organizational success while continuing to grow professionally.'}
                </p>
              </div>
            </div>
          )}

          {/* Work Experience */}
          {((!form.noWorkExperience && form.experiences && form.experiences.length > 0 && form.experiences[0].company) || !form.name) && (
            <div className="mb-8">
              <div className="flex items-center mb-4 pb-2 border-b-2 border-green-600">
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center mr-3">
                  <span className="text-sm font-bold">2</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-800 tracking-wide">
                  PROFESSIONAL EXPERIENCE
                </h2>
              </div>
              
              <div className="space-y-3">
                {form.experiences && form.experiences.length > 0 && form.experiences[0].company ? 
                  form.experiences.map((exp, index) => (
                    <div key={index} className="bg-white bg-opacity-50 p-3 rounded-lg border-l-4 border-green-600">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-bold text-green-900">{exp.position}</h3>
                          <p className="text-green-700 font-semibold text-sm">{exp.company}</p>
                        </div>
                        <div className="text-green-600 font-medium text-sm">
                          {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                        </div>
                      </div>
                      {exp.description && (
                        <p className="text-gray-700 leading-relaxed text-sm">{exp.description}</p>
                      )}
                    </div>
                  )) : 
                  // Sample data for empty form
                  [
                    {
                      position: 'Software Developer',
                      company: 'Tech Innovations Inc.',
                      startDate: '2022',
                      endDate: 'Present',
                      current: true,
                      description: 'Developed and maintained web applications using React and Node.js. Collaborated with cross-functional teams to deliver high-quality software solutions. Implemented responsive designs and optimized application performance.'
                    },
                    {
                      position: 'Junior Developer',
                      company: 'StartUp Solutions',
                      startDate: '2021',
                      endDate: '2022',
                      current: false,
                      description: 'Assisted in building customer-facing applications. Participated in code reviews and followed best practices for software development. Gained experience in agile development methodologies.'
                    }
                  ].map((exp, index) => (
                    <div key={index} className="relative pl-8 pb-8 border-l-2 border-gray-300 last:border-l-0 last:pb-0">
                      <div className="absolute left-0 top-0 w-4 h-4 bg-green-600 rounded-full transform -translate-x-2"></div>
                      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-slate-800 mb-1">{exp.position}</h3>
                            <p className="text-green-600 font-semibold text-lg">{exp.company}</p>
                          </div>
                          <div className="text-right">
                            <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                              {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{exp.description}</p>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          )}

          {/* Student/No Experience Section */}
          {form.noWorkExperience && (
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 mb-4 border border-yellow-100">
              <h2 className="text-xl font-bold text-orange-900 mb-3 flex items-center">
                <span className="w-6 h-6 bg-orange-600 text-white rounded-lg flex items-center justify-center text-xs font-bold mr-2">2</span>
                Academic & Personal Projects
              </h2>
              <p className="text-orange-800 leading-relaxed bg-white bg-opacity-50 p-4 rounded-lg">
                As a dedicated student, I have focused on building strong foundational skills through coursework, personal projects, and extracurricular activities. I am eager to apply my knowledge and continue learning in a professional environment.
              </p>
            </div>
          )}

          {/* Education */}
          {((form.education && form.education.length > 0 && form.education[0].school) || !form.name) && (
            <div className="mb-8">
              <div className="flex items-center mb-4 pb-2 border-b-2 border-indigo-600">
                <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center mr-3">
                  <span className="text-sm font-bold">3</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-800 tracking-wide">
                  EDUCATION
                </h2>
              </div>
              
              <div className="space-y-4">
                {form.education && form.education.length > 0 && form.education[0].school ?
                  form.education.map((edu, index) => (
                    <div key={index} className="relative bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 rounded-l-lg"></div>
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-slate-800 mb-1">{edu.school}</h3>
                          <p className="text-slate-600 font-medium text-sm mb-1">
                            {edu.degree} {edu.field && `in ${edu.field}`}
                          </p>
                          {edu.gpa && (
                            <div className="inline-flex items-center px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md text-xs font-medium">
                              GPA: {edu.gpa}
                            </div>
                          )}
                        </div>
                        <div className="bg-slate-50 px-3 py-1 rounded-md border">
                          <span className="text-slate-600 font-medium text-sm">
                            {edu.startDate} - {edu.endDate}
                          </span>
                        </div>
                      </div>
                    </div>
                  )) :
                  // Sample data
                  [
                    {
                      school: 'University of Technology',
                      degree: 'Bachelor of Science',
                      field: 'Computer Science',
                      startDate: '2019',
                      endDate: '2023',
                      gpa: '3.8'
                    }
                  ].map((edu, index) => (
                    <div key={index} className="relative bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 rounded-l-lg"></div>
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-slate-800 mb-1">{edu.school}</h3>
                          <p className="text-slate-600 font-medium text-sm mb-1">
                            {edu.degree} {edu.field && `in ${edu.field}`}
                          </p>
                          {edu.gpa && (
                            <div className="inline-flex items-center px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md text-xs font-medium">
                              GPA: {edu.gpa}
                            </div>
                          )}
                        </div>
                        <div className="bg-slate-50 px-3 py-1 rounded-md border">
                          <span className="text-slate-600 font-medium text-sm">
                            {edu.startDate} - {edu.endDate}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          )}

          {/* Skills */}
          {(((form.technicalSkills && form.technicalSkills.length > 0) || (form.softSkills && form.softSkills.length > 0)) || !form.name) && (
            <div className="mb-8">
              <div className="flex items-center mb-4 pb-2 border-b-2 border-purple-600">
                <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center mr-3">
                  <span className="text-sm font-bold">4</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-800 tracking-wide">
                  SKILLS & EXPERTISE
                </h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {(form.technicalSkills.length > 0 || !form.name) && (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                    <div className="flex items-center mb-4">
                      <div className="w-3 h-3 bg-blue-600 rounded-full mr-3"></div>
                      <h3 className="text-lg font-bold text-slate-800">Technical Skills</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(form.technicalSkills.length > 0 ? form.technicalSkills : ['JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'Git']).map((skill, index) => (
                        <span key={index} className="px-3 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {(form.softSkills.length > 0 || !form.name) && (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                    <div className="flex items-center mb-4">
                      <div className="w-3 h-3 bg-green-600 rounded-full mr-3"></div>
                      <h3 className="text-lg font-bold text-slate-800">Soft Skills</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(form.softSkills.length > 0 ? form.softSkills : ['Communication', 'Leadership', 'Problem Solving', 'Team Collaboration', 'Time Management']).map((skill, index) => (
                        <span key={index} className="px-3 py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Additional Information */}
          {(form.languages.length > 0 || form.hobbies || form.references || !form.name) && (
            <div className="mb-8">
              <div className="flex items-center mb-6 pb-2 border-b-2 border-gray-600">
                <div className="w-8 h-8 bg-gray-600 text-white rounded-full flex items-center justify-center mr-3">
                  <span className="text-sm font-bold">5</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-800 tracking-wide">
                  ADDITIONAL INFORMATION
                </h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {(form.languages.length > 0 || !form.name) && (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                    <div className="flex items-center mb-4">
                      <div className="w-3 h-3 bg-indigo-600 rounded-full mr-3"></div>
                      <h3 className="text-lg font-bold text-slate-800">Languages</h3>
                    </div>
                    <div className="space-y-2">
                      {(form.languages.length > 0 ? form.languages : ['English (Native)', 'Spanish (Intermediate)', 'French (Beginner)']).map((lang, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded-md border">
                          <span className="text-slate-700 font-medium text-sm">
                            {typeof lang === 'string' ? lang : `${lang.name} (${lang.proficiency})`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {(form.hobbies || !form.name) && (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                    <div className="flex items-center mb-4">
                      <div className="w-3 h-3 bg-emerald-600 rounded-full mr-3"></div>
                      <h3 className="text-lg font-bold text-slate-800">Hobbies & Interests</h3>
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                      {form.hobbies || 'Photography, traveling, reading technology blogs, playing chess, volunteering at local community centers'}
                    </p>
                  </div>
                )}
              </div>
              
              {(form.references || !form.name) && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 mt-6">
                  <div className="flex items-center mb-4">
                    <div className="w-3 h-3 bg-amber-600 rounded-full mr-3"></div>
                    <h3 className="text-lg font-bold text-slate-800">References</h3>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    {form.references || 'Available upon request'}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CVBuilder;

