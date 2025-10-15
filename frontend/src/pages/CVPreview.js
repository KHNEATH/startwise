import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const CVPreview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [cvData, setCvData] = useState(null);

  useEffect(() => {
    if (location.state && location.state.cvData) {
      setCvData(location.state.cvData);
    } else {
      // Redirect back to CV builder if no data
      navigate('/cv-builder');
    }
  }, [location.state, navigate]);

  useEffect(() => {
    // Add print styles
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
        
        .cv-print-content,
        .cv-print-content * {
          visibility: visible;
        }
        
        .cv-print-content {
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
        
        .cv-print-content h1 {
          font-size: 24px !important;
          margin-bottom: 8px !important;
          color: #000 !important;
        }
        
        .cv-print-content h2 {
          font-size: 16px !important;
          margin-bottom: 8px !important;
          margin-top: 12px !important;
          color: #000 !important;
        }
        
        .cv-print-content h3 {
          font-size: 14px !important;
          margin-bottom: 4px !important;
          color: #000 !important;
        }
        
        .cv-print-content p,
        .cv-print-content span,
        .cv-print-content li,
        .cv-print-content div {
          color: #000 !important;
          font-size: 11px !important;
          line-height: 1.3 !important;
        }
        
        .cv-print-content .bg-gradient-to-r {
          background: white !important;
          border: 1px solid #d1d5db !important;
          margin-bottom: 8px !important;
          padding: 8px !important;
        }
        
        .cv-print-content .text-blue-600,
        .cv-print-content .text-green-600,
        .cv-print-content .text-purple-600,
        .cv-print-content .text-orange-600,
        .cv-print-content .text-indigo-600 {
          color: #374151 !important;
        }
        
        .cv-print-content .bg-blue-600,
        .cv-print-content .bg-green-600,
        .cv-print-content .bg-purple-600,
        .cv-print-content .bg-orange-600,
        .cv-print-content .bg-indigo-600 {
          background-color: #f3f4f6 !important;
          color: #000 !important;
          border: 1px solid #d1d5db !important;
        }
        
        .cv-print-content .bg-blue-100,
        .cv-print-content .bg-green-100,
        .cv-print-content .bg-purple-100,
        .cv-print-content .bg-indigo-100 {
          background: white !important;
          color: #000 !important;
          border: 1px solid #d1d5db !important;
          padding: 2px 6px !important;
          margin: 2px !important;
          display: inline-block !important;
        }
        
        .cv-print-content .rounded-full {
          background: #f9fafb !important;
          color: #000 !important;
          border: 1px solid #d1d5db !important;
          padding: 2px 8px !important;
          margin: 1px !important;
          font-size: 10px !important;
        }
        
        .cv-print-content .absolute {
          display: none !important;
        }
        
        .cv-print-content .space-y-6 > * + * {
          margin-top: 8px !important;
        }
        
        .cv-print-content .space-y-4 > * + * {
          margin-top: 6px !important;
        }
        
        .cv-print-content .mb-8 {
          margin-bottom: 10px !important;
        }
        
        .cv-print-content .mb-6 {
          margin-bottom: 8px !important;
        }
        
        .cv-print-content .mb-4 {
          margin-bottom: 6px !important;
        }
        
        .cv-print-content > div {
          page-break-inside: avoid;
          break-inside: avoid;
        }
        
        @page {
          margin: 0.3in;
          size: A4;
        }
        
        .cv-print-content img,
        .cv-print-content .w-32.h-32 {
          display: none !important;
        }
        
        .cv-print-content .flex.items-center.space-x-8 {
          display: block !important;
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  if (!cvData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your CV...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      {/* Header */}
      <div className="print-hide bg-white shadow-sm border-b mb-8">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/cv-builder')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Editor
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Your Professional CV</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zM5 14H4v-3h1v3zm1 0v2h8v-2H6zm9 0h1v-3h-1v3z" clipRule="evenodd" />
                </svg>
                Print CV
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CV Content */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="cv-print-content bg-white shadow-lg rounded-lg p-8" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
          
          {/* Header */}
          <div className="border-b-2 border-gray-300 pb-6 mb-6">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {cvData.name || 'Your Name'}
              </h1>
              <p className="text-xl text-gray-600 mb-4">
                {cvData.summary || 'Professional Summary'}
              </p>
              
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                {cvData.email && (
                  <div className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    {cvData.email}
                  </div>
                )}
                
                {cvData.phone && (
                  <div className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    {cvData.phone}
                  </div>
                )}
                
                {cvData.location && (
                  <div className="flex items-center bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    {cvData.location}
                  </div>
                )}
                
                {cvData.linkedin && (
                  <div className="flex items-center bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                    </svg>
                    {cvData.linkedin}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Professional Summary */}
          {cvData.summary && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">
                Professional Summary
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {cvData.summary}
              </p>
            </div>
          )}

          {/* Work Experience */}
          {!cvData.noWorkExperience && cvData.experiences && cvData.experiences.length > 0 && cvData.experiences[0].company && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">
                Professional Experience
              </h2>
              <div className="space-y-4">
                {cvData.experiences.map((exp, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{exp.position}</h3>
                        <p className="text-blue-600 font-medium">{exp.company}</p>
                      </div>
                      <div className="text-gray-500 text-sm">
                        {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                      </div>
                    </div>
                    {exp.description && (
                      <p className="text-gray-700 text-sm leading-relaxed mt-2">{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {cvData.education && cvData.education.length > 0 && cvData.education[0].school && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">
                Education
              </h2>
              <div className="space-y-3">
                {cvData.education.map((edu, index) => (
                  <div key={index} className="border-l-4 border-green-500 pl-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{edu.school}</h3>
                        <p className="text-green-600 font-medium">
                          {edu.degree} {edu.field && `in ${edu.field}`}
                        </p>
                        {edu.gpa && <p className="text-gray-600 text-sm">GPA: {edu.gpa}</p>}
                      </div>
                      <div className="text-gray-500 text-sm">
                        {edu.startDate} - {edu.endDate}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {((cvData.technicalSkills && cvData.technicalSkills.length > 0) || (cvData.softSkills && cvData.softSkills.length > 0)) && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">
                Skills
              </h2>
              
              {cvData.technicalSkills && cvData.technicalSkills.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-base font-semibold text-gray-800 mb-2">Technical Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {cvData.technicalSkills.map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {cvData.softSkills && cvData.softSkills.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-base font-semibold text-gray-800 mb-2">Soft Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {cvData.softSkills.map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Languages */}
          {cvData.languages && cvData.languages.length > 0 && cvData.languages[0].name && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">
                Languages
              </h2>
              <div className="flex flex-wrap gap-2">
                {cvData.languages.map((lang, index) => (
                  <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                    {lang.name} ({lang.proficiency})
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Additional Information */}
          {(cvData.hobbies || cvData.references) && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">
                Additional Information
              </h2>
              
              {cvData.hobbies && (
                <div className="mb-3">
                  <h3 className="text-base font-semibold text-gray-800 mb-1">Hobbies & Interests</h3>
                  <p className="text-gray-700 text-sm">{cvData.hobbies}</p>
                </div>
              )}
              
              {cvData.references && (
                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-1">References</h3>
                  <p className="text-gray-700 text-sm">{cvData.references}</p>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CVPreview;