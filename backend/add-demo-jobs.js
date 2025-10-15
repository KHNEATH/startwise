const pool = require('./db');

const demoJobs = [
  {
    title: 'Senior Full Stack Developer',
    description: 'Join our innovative team to build cutting-edge web applications using React, Node.js, and cloud technologies. We are looking for someone with 5+ years of experience in full-stack development, strong problem-solving skills, and passion for creating exceptional user experiences. You will work on scalable applications that serve millions of users worldwide.',
    company: 'TechnoVision Corp',
    location: 'San Francisco, CA',
    type: 'Full-time'
  },
  {
    title: 'Product Manager',
    description: 'Drive product strategy and innovation for our flagship products. Work closely with engineering, design, and marketing teams to deliver exceptional user experiences. Experience with Agile methodologies, data-driven decision making, and user research is required. MBA preferred but not mandatory.',
    company: 'Innovation Labs',
    location: 'New York, NY',
    type: 'Full-time'
  },
  {
    title: 'UI/UX Designer',
    description: 'Create beautiful and intuitive user interfaces for our web and mobile applications. Strong portfolio demonstrating design skills and experience with tools like Figma, Sketch, or Adobe Creative Suite required. Knowledge of user research, prototyping, and accessibility standards is essential.',
    company: 'Design Studio Pro',
    location: 'Los Angeles, CA',
    type: 'Contract'
  },
  {
    title: 'Data Scientist',
    description: 'Analyze large datasets to extract meaningful insights and build predictive models. Strong background in Python, R, SQL, and machine learning algorithms required. Experience with TensorFlow, PyTorch, and cloud platforms like AWS or GCP preferred. PhD in Statistics, Computer Science, or related field preferred.',
    company: 'DataFlow Analytics',
    location: 'Seattle, WA',
    type: 'Full-time'
  },
  {
    title: 'DevOps Engineer',
    description: 'Manage and optimize our cloud infrastructure on AWS/Azure. Experience with Docker, Kubernetes, Jenkins, and Infrastructure as Code (Terraform) is essential. Help us scale our systems to handle millions of users. Experience with monitoring tools like Prometheus and Grafana is a plus.',
    company: 'CloudTech Solutions',
    location: 'Austin, TX',
    type: 'Full-time'
  },
  {
    title: 'Marketing Coordinator',
    description: 'Support our marketing team with campaign execution, content creation, and social media management. Great opportunity for someone looking to grow their career in digital marketing. Experience with Google Analytics, HubSpot, and social media advertising preferred.',
    company: 'Growth Marketing Inc',
    location: 'Chicago, IL',
    type: 'Part-time'
  },
  {
    title: 'Mobile App Developer',
    description: 'Develop native iOS and Android applications using Swift and Kotlin. Experience with cross-platform frameworks like React Native or Flutter is a plus. Join our mobile team to create apps used by millions of people worldwide. Strong understanding of mobile UI/UX principles required.',
    company: 'AppCraft Studios',
    location: 'Miami, FL',
    type: 'Full-time'
  },
  {
    title: 'Cybersecurity Analyst',
    description: 'Protect our organization from cyber threats by monitoring security systems, conducting risk assessments, and implementing security protocols. CISSP, CISM, or similar certification preferred. Experience with SIEM tools and incident response required.',
    company: 'SecureGuard Systems',
    location: 'Boston, MA',
    type: 'Full-time'
  },
  {
    title: 'Sales Representative',
    description: 'Drive revenue growth by identifying and closing new business opportunities. Strong communication skills and proven sales track record required. Experience in B2B software sales preferred. Competitive base salary plus commission structure with uncapped earning potential.',
    company: 'SalesForce Dynamics',
    location: 'Denver, CO',
    type: 'Full-time'
  },
  {
    title: 'Content Writer',
    description: 'Create engaging content for our blog, website, and marketing materials. Experience in SEO writing, content marketing strategies, and social media content creation required. Remote work available with flexible hours. Portfolio of published work required.',
    company: 'Content Creators LLC',
    location: 'Remote',
    type: 'Freelance'
  },
  {
    title: 'Business Analyst',
    description: 'Analyze business processes and requirements to help improve operational efficiency. Experience with SQL, Excel, Tableau, and business intelligence tools required. Strong analytical and communication skills essential for working with stakeholders across different departments.',
    company: 'Business Insights Co',
    location: 'Philadelphia, PA',
    type: 'Full-time'
  },
  {
    title: 'Quality Assurance Engineer',
    description: 'Ensure software quality through comprehensive testing strategies. Experience with automated testing tools like Selenium, Jest, Cypress, and performance testing preferred. Knowledge of CI/CD pipelines and API testing essential.',
    company: 'QualityFirst Tech',
    location: 'Portland, OR',
    type: 'Full-time'
  }
];

async function addDemoJobs() {
  try {
    // Clear existing jobs
    await pool.execute('DELETE FROM jobs WHERE employer_id = 1');
    console.log('Cleared existing demo jobs');
    
    // Add demo jobs
    for (const job of demoJobs) {
      await pool.execute(
        'INSERT INTO jobs (title, description, company, location, type, employer_id) VALUES (?, ?, ?, ?, ?, ?)',
        [job.title, job.description, job.company, job.location, job.type, 1]
      );
    }
    
    console.log(`Successfully added ${demoJobs.length} demo jobs!`);
    
    // Display added jobs
    const [jobs] = await pool.execute('SELECT id, title, company, location, type FROM jobs ORDER BY created_at DESC');
    console.log('\nJobs now in database:');
    jobs.forEach((job, index) => {
      console.log(`${index + 1}. ${job.title} at ${job.company} (${job.location}) - ${job.type}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error adding demo jobs:', error.message);
    process.exit(1);
  }
}

addDemoJobs();