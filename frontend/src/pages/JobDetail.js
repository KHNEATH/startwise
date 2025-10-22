import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchJobById, applyToJob } from '../api/jobApi';
import { saveJobApplication } from '../api/userApi';

const JobDetail = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    const loadJob = async () => {
      try {
        setLoading(true);
        // For recommendation jobs that don't exist in database, show mock data
        if (jobId.startsWith('rec-')) {
          setJob(getMockJobData(jobId));
        } else {
          // For demo jobs and real jobs, use fetchJobById
          const jobData = await fetchJobById(jobId);
          setJob(jobData);
        }
      } catch (error) {
        console.error('Error loading job:', error);
        setError('Job not found');
      } finally {
        setLoading(false);
      }
    };

    loadJob();
  }, [jobId]);

  const getMockJobData = (id) => {
    const mockJobs = {
      'rec-1': {
        id: 'rec-1',
        title: 'Part-time English Tutor',
        company: 'Phnom Penh Learning Center',
        location: 'Phnom Penh, Cambodia',
        type: 'Part-time',
        description: `We are looking for enthusiastic students to teach basic English to local community members. This is a perfect opportunity to earn money while making a difference in your community.

**What you'll do:**
• Teach basic conversational English
• Help students with pronunciation and grammar
• Create fun, interactive lessons
• Support students with homework and assignments

**Perfect for:**
• High school and university students
• No formal teaching experience required
• Native or fluent English speakers
• Those who enjoy helping others learn

**Benefits:**
• Flexible scheduling around your studies
• Competitive hourly rate ($8-12/hour)
• Teaching experience for your resume
• Training and materials provided
• Opportunity to improve communication skills

**Requirements:**
• Strong English communication skills
• Patient and friendly personality  
• Available 10-15 hours per week
• Reliable and punctual`,
        salary: '$8-12/hour',
        experience_level: 'Entry Level',
        posted_date: '2 days ago'
      },
      'rec-2': {
        id: 'rec-2',
        title: 'Social Media Assistant',
        company: 'Digital Cambodia',
        location: 'Siem Reap, Cambodia',
        type: 'Internship',
        description: `Join our dynamic digital marketing team as a Social Media Assistant! This internship is perfect for creative students interested in learning about digital marketing while earning experience and income.

**What you'll do:**
• Create engaging content for Instagram, Facebook, TikTok
• Help manage social media calendars and posts
• Assist with photo and video editing
• Monitor social media trends and engagement
• Support marketing campaigns and events

**Perfect for:**
• Students studying marketing, communications, or design
• Creative individuals with social media savvy
• Those interested in digital marketing careers
• No previous experience required - we'll train you!

**What we offer:**
• Internship stipend ($200-300/month)
• Learn professional social media tools (Canva, Adobe Creative Suite)
• Mentorship from experienced marketing professionals
• Flexible hours (20 hours/week)
• Certificate of completion
• Potential for full-time position after internship

**Requirements:**
• Active on social media platforms
• Basic English and Khmer language skills
• Creative mindset and attention to detail
• Own smartphone with good camera`,
        salary: '$200-300/month',
        experience_level: 'Entry Level',
        posted_date: '1 day ago'
      },
      'rec-3': {
        id: 'rec-3',
        title: 'Online Content Creator',
        company: 'Cambodia Student Network',
        location: 'Remote, Cambodia',
        type: 'Freelance',
        description: `Share your student experience and help other students succeed! We're looking for authentic student voices to create content about university life, study tips, and student experiences in Cambodia.

**Content Types:**
• Blog posts about student life and tips
• Social media content (Instagram, TikTok, Facebook)
• Video testimonials and study guides
• University and scholarship guides
• Career advice for fellow students

**What you'll earn:**
• $15-25 per blog post (500-800 words)
• $10-20 per social media post
• $30-50 per video content
• Bonus payments for viral content
• Flexible payment schedule

**Perfect for:**
• Currently enrolled students (high school or university)
• Good writing skills in English and/or Khmer
• Comfortable on camera (for video content)
• Passionate about helping other students
• Experience with social media

**Requirements:**
• Must be a current student in Cambodia
• Access to smartphone/laptop with internet
• Portfolio of previous content (can be personal social media)
• Reliable communication and meeting deadlines
• Original content only (no plagiarism)

**Benefits:**
• Build your personal brand and following
• Develop content creation skills
• Network with other student creators
• Add valuable experience to your resume
• Potential for ongoing partnership`,
        salary: '$15-50 per content piece',
        experience_level: 'Entry Level',
        posted_date: '3 days ago'
      },
      'rec-4': {
        id: 'rec-4',
        title: 'Online Translator',
        company: 'Translation Services Cambodia',
        location: 'Remote, Cambodia',
        type: 'Freelance',
        description: `Use your bilingual skills to help businesses and individuals communicate across languages! We need reliable translators for Khmer-English and English-Khmer translation projects.

**Translation Work:**
• Business documents and correspondence
• Website content and marketing materials
• Educational materials and guides
• Personal documents (certificates, letters)
• Social media content and posts

**What you'll earn:**
• $0.08-0.15 per word for document translation
• $20-40 per hour for live interpretation
• $50-100 for website translation projects
• Rush job bonuses (50% extra)
• Regular client bonuses for quality work

**Perfect for:**
• Bilingual students (Khmer-English fluency)
• Strong writing skills in both languages
• Detail-oriented and accurate work
• Flexible schedule around studies
• Interest in languages and communication

**Requirements:**
• Fluent in both Khmer and English (written and spoken)
• Strong grammar and vocabulary in both languages
• Access to computer and internet
• Ability to meet deadlines
• Previous translation experience preferred but not required

**We provide:**
• Translation tools and software training
• Style guides and reference materials
• Regular feedback and skill development
• Consistent work flow for reliable translators
• Professional certificates for completed training

**Benefits:**
• Work from anywhere with internet
• Choose your own hours and projects
• Build translation portfolio
• Develop professional language skills
• Network with international clients`,
        salary: '$0.08-0.15 per word',
        experience_level: 'Entry Level',
        posted_date: '1 week ago'
      }
    };
    return mockJobs[id] || null;
  };

  const handleApply = async () => {
    try {
      setApplying(true);
      
      // Prepare application data for tracking
      const applicationData = {
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        location: job.location,
        jobType: job.type,
        salary: job.salary || 'Not specified'
      };
      
      // For mock jobs, simulate application
      if (jobId.startsWith('rec-')) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Save application data for tracking
        saveJobApplication(applicationData);
        
        setApplied(true);
        setShowSuccessModal(true);
        setTimeout(() => setShowSuccessModal(false), 4000);
      } else {
        // Real job application
        await applyToJob(jobId, { 
          user_id: 1, 
          message: `Interested in applying for ${job?.title}` 
        });
        
        // Save application data for tracking
        saveJobApplication(applicationData);
        
        setApplied(true);
        setShowSuccessModal(true);
        setTimeout(() => setShowSuccessModal(false), 4000);
      }
    } catch (error) {
      console.error('Application error:', error);
      setError('Failed to submit application. Please try again.');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Job Not Found</h2>
          <p className="text-gray-600 mb-6">Sorry, we couldn't find the job you're looking for.</p>
          <button 
            onClick={() => navigate('/jobs')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            ← Back to Job Board
          </button>
        </div>
      </div>
    );
  }

  const isStudentFriendly = job.type === 'Part-time' || job.type === 'Internship' || 
                           job.description?.toLowerCase().includes('student') ||
                           job.title?.toLowerCase().includes('assistant');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8 pt-28">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <button 
          onClick={() => navigate('/jobs')}
          className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
          <span>←</span>
          <span>Back to Job Board</span>
        </button>

        {/* Job Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-800">{job.title}</h1>
                {isStudentFriendly && (
                  <span className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 px-3 py-1 rounded-full flex items-center gap-1">
                    <span className="text-xs text-green-700 font-semibold">Perfect for students</span>
                    <span className="text-sm">🎓</span>
                  </span>
                )}
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <span>🏢</span>
                  <span className="font-medium">{job.company}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>📍</span>
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>💼</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    job.type === 'Full-time' ? 'bg-blue-100 text-blue-700' :
                    job.type === 'Part-time' ? 'bg-green-100 text-green-700' :
                    job.type === 'Internship' ? 'bg-purple-100 text-purple-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>
                    {job.type}
                  </span>
                </div>
                {job.posted_date && (
                  <div className="flex items-center gap-1">
                    <span>🕐</span>
                    <span>Posted {job.posted_date}</span>
                  </div>
                )}
              </div>

              {job.salary && (
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">💰</span>
                    <div>
                      <p className="text-sm text-gray-600">Salary/Payment</p>
                      <p className="text-lg font-semibold text-gray-800">{job.salary}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Apply Button */}
            <div className="md:w-64 md:shrink-0">
              <button
                onClick={handleApply}
                disabled={applying || applied}
                className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 transform ${
                  applied 
                    ? 'bg-green-600 text-white cursor-not-allowed' 
                    : applying
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-xl hover:scale-105'
                }`}
              >
                {applied && (
                  <div className="flex items-center justify-center gap-2">
                    <span>✓</span>
                    <span>Applied Successfully</span>
                  </div>
                )}
                {applying && (
                  <div className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⏳</span>
                    <span>Submitting...</span>
                  </div>
                )}
                {!applying && !applied && (
                  <div className="flex items-center justify-center gap-2">
                    <span>Apply Now</span>
                    <span>→</span>
                  </div>
                )}
              </button>
              
              {isStudentFriendly && !applied && (
                <p className="text-center text-sm text-green-600 mt-3 font-medium">
                  🌟 Student-friendly position!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Job Description */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span>📝</span>
            Job Description
          </h2>
          
          <div className="prose max-w-none">
            <div className="text-gray-700 leading-relaxed whitespace-pre-line">
              {job.description}
            </div>
          </div>

          {job.experience_level && (
            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-blue-600">📊</span>
                <h3 className="font-semibold text-blue-800">Experience Level</h3>
              </div>
              <p className="text-blue-700">{job.experience_level}</p>
            </div>
          )}
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4 animate-fade-in transform scale-105">
            <div className="text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-xl font-bold text-green-800 mb-3">Application Submitted!</h3>
              <p className="text-gray-600 mb-6">
                Your application for <strong>{job.title}</strong> at <strong>{job.company}</strong> has been submitted successfully!
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <span className="animate-pulse">✓</span>
                <span>The employer will review your application and contact you soon.</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetail;