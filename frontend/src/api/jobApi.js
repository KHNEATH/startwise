import axios from 'axios';

// Helper function to save locally posted jobs
const saveLocallyPostedJob = (job) => {
  try {
    const existingJobs = JSON.parse(localStorage.getItem('localJobs') || '[]');
    existingJobs.push(job);
    localStorage.setItem('localJobs', JSON.stringify(existingJobs));
    console.log('💾 Job saved locally:', job.title);
  } catch (error) {
    console.error('❌ Failed to save job locally:', error);
  }
};

// Helper function to get locally posted jobs
const getLocallyPostedJobs = () => {
  try {
    return JSON.parse(localStorage.getItem('localJobs') || '[]');
  } catch (error) {
    console.error('❌ Failed to get local jobs:', error);
    return [];
  }
};

// Dynamic API URL configuration for different environments
const getApiBaseUrl = () => {
  // Check if we're in a browser environment (Vercel deployment)
  const isVercelDeployment = typeof window !== 'undefined' && 
    (window.location.hostname.includes('vercel.app') || 
     window.location.hostname !== 'localhost');
  
  // Force demo mode for Vercel deployments unless explicit backend URL is provided
  if (isVercelDeployment) {
    if (process.env.REACT_APP_API_URL && !process.env.REACT_APP_API_URL.includes('localhost')) {
      console.log('🌐 Using configured backend URL:', process.env.REACT_APP_API_URL);
      return process.env.REACT_APP_API_URL;
    }
    console.log('🎭 Vercel deployment detected: Using demo mode (no backend)');
    return null; // This will trigger demo mode in all API calls
  }
  
  // Production environment - check if backend is deployed
  if (process.env.NODE_ENV === 'production') {
    // If REACT_APP_API_URL is set, use it (for deployed backend)
    if (process.env.REACT_APP_API_URL && !process.env.REACT_APP_API_URL.includes('localhost')) {
      return process.env.REACT_APP_API_URL;
    }
    // Otherwise, use demo mode (no backend deployed)
    console.log('🎭 Production mode: No backend URL configured, using demo mode');
    return null; // This will trigger demo mode in all API calls
  }
  
  // Development environment - only use localhost if actually on localhost
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
  }
  
  // Fallback to demo mode for any other scenario
  console.log('🎭 Fallback: Using demo mode');
  return null;
};

const API_BASE_URL = getApiBaseUrl();

console.log('🌐 API Configuration:', {
  environment: process.env.NODE_ENV,
  apiUrl: API_BASE_URL,
  reactAppApiUrl: process.env.REACT_APP_API_URL
});


export const fetchJobs = async (filters = {}) => {
  try {
    // If no API_BASE_URL (production demo mode), return demo data immediately
    if (!API_BASE_URL) {
      console.log('🎭 Demo mode: No backend configured, returning demo jobs');
      const demoJobs = getDemoJobs(filters);
      const localJobs = getLocallyPostedJobs();
      const allJobs = [...localJobs, ...demoJobs];
      return applyFilters(allJobs, filters);
    }

    const params = {};
    if (filters.title) params.title = filters.title;
    if (filters.type) params.type = filters.type;
    if (filters.location) params.location = filters.location;
    
    const url = `${API_BASE_URL}/jobs/browse`;
    console.log('🌐 API Request URL:', url);
    console.log('📋 API Request params:', params);
    
    const response = await axios.get(url, { params });
    
    console.log('📡 API Response status:', response.status);
    console.log('📊 API Response data:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('🚨 API Error in fetchJobs:', error);
    console.error('📱 Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url
    });
    
    // If backend is unavailable in production, return demo data with any posted jobs
    if (process.env.NODE_ENV === 'production' || 
        error.code === 'NETWORK_ERROR' || 
        error.code === 'ERR_NETWORK' ||
        error.message.includes('Network Error') ||
        error.message.includes('ERR_NETWORK') ||
        !error.response) {
      console.log('🔄 Backend unavailable, returning demo data with local jobs...');
      
      // Get demo jobs
      const demoJobs = getDemoJobs(filters);
      
      // Get any locally posted jobs
      const localJobs = getLocallyPostedJobs();
      
      // Combine and return
      const allJobs = [...localJobs, ...demoJobs];
      return applyFilters(allJobs, filters);
    }
    
    throw error;
  }
};

// Demo data for when backend is unavailable
const getDemoJobs = (filters = {}) => {
  const demoJobs = [
    // Internships & Entry-Level (No Experience Required)
    {
      id: 'demo-1',
      title: 'Marketing Intern',
      company: 'Phnom Penh Digital Marketing',
      location: 'Phnom Penh, Cambodia',
      type: 'Internship',
      salary: '$150-200/month',
      created_at: new Date().toISOString(),
      requirements: 'No experience required, Basic computer skills, Good communication in English, Enthusiastic about learning',
      benefits: 'Training provided, Flexible schedule, Certificate of completion, Potential for full-time position',
      description: `Learn digital marketing, social media management, and content creation. No experience required! Perfect for students.

**What you'll do:**
• Create engaging social media content
• Learn Facebook and Instagram advertising
• Assist with email marketing campaigns
• Help with market research and analysis
• Support digital marketing projects

**Perfect for:**
• Students looking for practical experience
• Recent graduates wanting to learn digital marketing
• Anyone interested in social media and online marketing

Training provided - we'll teach you everything you need to know!`
    },
    {
      id: 'demo-2',
      title: 'Customer Service Representative',
      company: 'Cambodia Call Center',
      location: 'Phnom Penh, Cambodia',
      type: 'Full-time',
      salary: '$250-350/month',
      created_at: new Date().toISOString(),
      requirements: 'Good English communication, Basic computer skills, Patience and friendly attitude, No previous experience needed',
      benefits: 'Full training program, Health insurance, Performance bonuses, Career advancement opportunities',
      description: `Handle customer inquiries via phone and chat. No experience needed - full training provided. Fresh graduates welcome!

**What you'll do:**
• Answer customer phone calls and chats
• Help resolve customer issues and questions
• Process orders and handle complaints
• Maintain customer records in our system
• Work with team to improve customer satisfaction

**Training includes:**
• Customer service best practices
• Company products and services
• Computer systems and software
• Communication skills development

Great entry-level position with growth opportunities!`
    },
    {
      id: 'demo-3',
      title: 'English Tutor (Part-time)',
      company: 'Siem Reap Learning Center',
      location: 'Siem Reap, Cambodia',
      type: 'Part-time',
      salary: '$5-8/hour',
      description: 'Teach English to local students and tourists. No formal teaching experience required. Perfect for students or gap year candidates. Evening classes available.'
    },
    {
      id: 'demo-4',
      title: 'Social Media Assistant',
      company: 'Angkor Digital Agency',
      location: 'Siem Reap, Cambodia',
      type: 'Internship',
      salary: '$120-180/month',
      description: 'Create content, manage Instagram/Facebook accounts, learn digital marketing. No experience needed! Great for creative students who love social media.'
    },
    {
      id: 'demo-5',
      title: 'Data Entry Clerk',
      company: 'Battambang Business Solutions',
      location: 'Battambang, Cambodia',
      type: 'Part-time',
      salary: '$200-300/month',
      description: 'Enter data, organize files, basic computer work. No experience required - just need basic computer skills. Perfect for students needing flexible hours.'
    },
    {
      id: 'demo-6',
      title: 'Tour Guide Assistant',
      company: 'Cambodia Tourism Co.',
      location: 'Phnom Penh, Cambodia',
      type: 'Part-time',
      salary: '$6-10/hour + tips',
      description: 'Assist tour guides, interact with tourists, learn tourism industry. No experience required! Good English and friendly personality needed. Training provided.'
    },
    {
      id: 'demo-7',
      title: 'Online Content Creator',
      company: 'Cambodia Student Network',
      location: 'Remote',
      type: 'Freelance',
      salary: '$3-5/article',
      description: 'Write articles about student life in Cambodia, create social media content. No experience needed - just passion for writing! Work from anywhere.'
    },
    {
      id: 'demo-8',
      title: 'Restaurant Server',
      company: 'Riverside Restaurant Phnom Penh',
      location: 'Phnom Penh, Cambodia',
      type: 'Part-time',
      salary: '$180-250/month + tips',
      description: 'Serve customers, take orders, learn hospitality skills. No experience required! Evening and weekend shifts available. Great for students.'
    },
    {
      id: 'demo-9',
      title: 'Computer Skills Trainer',
      company: 'Kandal Digital Learning Center',
      location: 'Kandal, Cambodia',
      type: 'Part-time',
      salary: '$200-350/month',
      description: 'Teach basic computer skills to rural students. No formal teaching experience required - just good computer knowledge. Make a real impact!'
    },
    {
      id: 'demo-10',
      title: 'E-commerce Assistant',
      company: 'Cambodia Online Shop',
      location: 'Phnom Penh, Cambodia',
      type: 'Internship',
      salary: '$150-250/month',
      description: 'Help with online store management, product listings, customer service. No experience needed! Learn e-commerce and gain valuable skills.'
    },
    {
      id: 'demo-11',
      title: 'Translation Assistant (Khmer-English)',
      company: 'Language Services Cambodia',
      location: 'Remote',
      type: 'Freelance',
      salary: '$5-15/document',
      description: 'Translate simple documents, help with interpretation. No professional translation experience required - just fluent in both languages!'
    },
    {
      id: 'demo-12',
      title: 'Photography Assistant',
      company: 'Angkor Photography Studio',
      location: 'Siem Reap, Cambodia',
      type: 'Part-time',
      salary: '$4-7/hour',
      description: 'Assist photographers, learn photography skills, help with events. No experience required - just interest in photography! Equipment provided.'
    },
    {
      id: 'demo-13',
      title: 'Library Assistant',
      company: 'National University Library',
      location: 'Phnom Penh, Cambodia',
      type: 'Part-time',
      salary: '$150-200/month',
      description: 'Help students, organize books, maintain library. Perfect for students - study while working! No experience required. Quiet work environment.'
    },
    {
      id: 'demo-14',
      title: 'Event Setup Assistant',
      company: 'Cambodia Events Company',
      location: 'Phnom Penh, Cambodia',
      type: 'Part-time',
      salary: '$25-40/event',
      description: 'Help set up events, weddings, conferences. No experience needed! Weekend work available. Learn event management skills.'
    },
    {
      id: 'demo-15',
      title: 'Online English Conversation Partner',
      company: 'Global Language Exchange',
      location: 'Remote',
      type: 'Freelance',
      salary: '$4-8/hour',
      description: 'Practice English conversation with international students online. No teaching experience required - just be a native or fluent English speaker!'
    }
  ];
  
  // Apply basic filtering
  return demoJobs.filter(job => {
    if (filters.title && !job.title.toLowerCase().includes(filters.title.toLowerCase())) return false;
    if (filters.type && job.type !== filters.type) return false;
    if (filters.location && !job.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
    return true;
  });
};



// Helper function to apply filters to jobs array
const applyFilters = (jobs, filters) => {
  return jobs.filter(job => {
    if (filters.title && !job.title.toLowerCase().includes(filters.title.toLowerCase())) return false;
    if (filters.type && job.type !== filters.type) return false;
    if (filters.location && !job.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
    return true;
  });
};

export const postJob = async (jobData) => {
  try {
    // If no API_BASE_URL (production demo mode), simulate job posting immediately
    if (!API_BASE_URL) {
      console.log('🎭 Demo mode: No backend configured, simulating job post');
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newJob = { 
        ...jobData, 
        id: `demo-production-${Date.now()}`,
        created_at: new Date().toISOString(),
        status: 'active'
      };
      
      // Save locally for persistence
      saveLocallyPostedJob(newJob);
      
      return { 
        success: true,
        message: 'Job posted successfully (demo mode)',
        job: newJob,
        demo: true 
      };
    }

    console.log('🌐 Posting job to API:', `${API_BASE_URL}/jobs/post`);
    console.log('📋 Job data:', jobData);
    
    const response = await axios.post(`${API_BASE_URL}/jobs/post`, jobData);
    console.log('✅ API Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Job posting API error:', error);
    
    if (process.env.NODE_ENV === 'production' || 
        error.code === 'NETWORK_ERROR' || 
        error.code === 'ERR_NETWORK' ||
        error.message.includes('Network Error') ||
        error.message.includes('ERR_NETWORK') ||
        !error.response) {
      console.log('🔄 Demo mode: Job posting simulated (frontend fallback)');
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newJob = { 
        ...jobData, 
        id: `demo-frontend-${Date.now()}`,
        created_at: new Date().toISOString(),
        status: 'active'
      };
      
      // Save locally for persistence in demo mode
      saveLocallyPostedJob(newJob);
      
      return { 
        success: true,
        message: 'Job posted successfully (demo mode)',
        job: newJob,
        demo: true 
      };
    }
    throw error;
  }
};

export const updateJob = async (jobId, jobData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/jobs/${jobId}`, jobData);
    console.log('📝 Job updated:', response.data);
    return response.data;
  } catch (error) {
    console.error('🚨 Error updating job:', error);
    if (process.env.NODE_ENV === 'production' || 
        error.code === 'NETWORK_ERROR' || 
        error.code === 'ERR_NETWORK' ||
        error.message.includes('Network Error') ||
        !error.response) {
      console.log('🔄 Demo mode: Job update simulated');
      return { ...jobData, id: jobId, message: 'Job updated successfully (demo mode)' };
    }
    throw error;
  }
};

export const deleteJob = async (jobId) => {
  try {
    // If no API_BASE_URL (production demo mode), simulate deletion
    if (!API_BASE_URL) {
      console.log('🎭 Demo mode: Simulating job deletion');
      // Remove from localStorage if it exists
      const localJobs = getLocallyPostedJobs();
      const updatedJobs = localJobs.filter(job => job.id !== jobId);
      localStorage.setItem('localJobs', JSON.stringify(updatedJobs));
      return { message: 'Job deleted successfully (demo mode)', id: jobId };
    }

    const response = await axios.delete(`${API_BASE_URL}/jobs/${jobId}`);
    console.log('🗑️ Job deleted:', jobId);
    return response.data;
  } catch (error) {
    console.error('🚨 Error deleting job:', error);
    if (process.env.NODE_ENV === 'production' || 
        error.code === 'NETWORK_ERROR' || 
        error.code === 'ERR_NETWORK' ||
        error.message.includes('Network Error') ||
        !error.response) {
      console.log('🔄 Demo mode: Job deletion simulated');
      return { message: 'Job deleted successfully (demo mode)', id: jobId };
    }
    throw error;
  }
};

// Enhanced application submission with CV upload
export const submitJobApplication = async (applicationData) => {
  try {
    // If no API_BASE_URL (production demo mode), simulate application
    if (!API_BASE_URL) {
      console.log('🎭 Demo mode: Simulating job application with CV');
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Save application locally for tracking
      const applications = JSON.parse(localStorage.getItem('applications') || '[]');
      const newApplication = {
        id: `app-${Date.now()}`,
        jobId: applicationData.get('jobId'),
        jobTitle: applicationData.get('jobTitle'),
        company: applicationData.get('company'),
        fullName: applicationData.get('fullName'),
        email: applicationData.get('email'),
        phone: applicationData.get('phone'),
        coverLetter: applicationData.get('coverLetter'),
        cvFileName: applicationData.get('cvFile')?.name || 'cv.pdf',
        experienceLevel: applicationData.get('experienceLevel'),
        expectedSalary: applicationData.get('expectedSalary'),
        availableStartDate: applicationData.get('availableStartDate'),
        portfolioLink: applicationData.get('portfolioLink'),
        status: 'pending',
        appliedAt: new Date().toISOString(),
        contactResponse: 'The employer will review your application and contact you within 2-3 business days.'
      };
      
      applications.push(newApplication);
      localStorage.setItem('applications', JSON.stringify(applications));
      
      return { 
        success: true,
        message: 'Application submitted successfully! The employer will contact you soon.',
        application: newApplication
      };
    }

    const response = await axios.post(`${API_BASE_URL}/applications/submit`, applicationData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('❌ Error submitting application:', error);
    if (process.env.NODE_ENV === 'production' || 
        error.code === 'NETWORK_ERROR' || 
        error.code === 'ERR_NETWORK' ||
        error.message.includes('Network Error') ||
        !error.response) {
      console.log('🔄 Demo mode: Application submission simulated');
      return { 
        success: true,
        message: 'Application submitted successfully (demo mode)',
        demo: true 
      };
    }
    throw error;
  }
};

export const applyToJob = async (jobId, applicationData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/applications`, {
      job_id: jobId,
      ...applicationData
    });
    return response.data;
  } catch (error) {
    if (process.env.NODE_ENV === 'production' || 
        error.code === 'NETWORK_ERROR' || 
        error.code === 'ERR_NETWORK' ||
        error.message.includes('Network Error') ||
        !error.response) {
      console.log('🔄 Demo mode: Job application simulated');
      return { message: 'Application submitted successfully (demo mode)', job_id: jobId };
    }
    throw error;
  }
};

export const quickApply = async (applicationData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/applications/quick`, applicationData);
    return response.data;
  } catch (error) {
    if (process.env.NODE_ENV === 'production' || 
        error.code === 'NETWORK_ERROR' || 
        error.code === 'ERR_NETWORK' ||
        error.message.includes('Network Error') ||
        !error.response) {
      console.log('🔄 Demo mode: Quick application simulated');
      return { message: 'Quick application submitted successfully (demo mode)' };
    }
    throw error;
  }
};

export const fetchJobById = async (jobId) => {
  try {
    // If no API_BASE_URL (production demo mode), search in demo/local jobs
    if (!API_BASE_URL) {
      console.log('🎭 Demo mode: Searching for job ID:', jobId);
      
      const localJobs = getLocallyPostedJobs();
      const demoJobs = getDemoJobs();
      const allJobs = [...localJobs, ...demoJobs];
      
      const job = allJobs.find(j => j.id === jobId);
      if (job) {
        // Return the job directly to match what JobDetail component expects
        return job;
      } else {
        throw new Error(`Job with ID ${jobId} not found`);
      }
    }

    const response = await axios.get(`${API_BASE_URL}/jobs/${jobId}`);
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching job by ID:', error);
    throw error;
  }
};
