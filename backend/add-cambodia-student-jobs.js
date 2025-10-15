const pool = require('./db');

const cambodiaStudentJobs = [
  {
    title: 'Part-time English Tutor',
    description: 'Teach basic English to younger students or adults. No formal teaching experience required - just good English communication skills. Flexible hours that work around your school schedule. Perfect for high school students looking to earn extra income while helping others learn.',
    company: 'Phnom Penh Learning Center',
    location: 'Phnom Penh, Cambodia',
    type: 'Part-time'
  },
  {
    title: 'Social Media Assistant (Internship)',
    description: 'Help manage social media accounts for local businesses. Learn digital marketing skills while earning money. No experience needed - we will train you! Great opportunity for students interested in marketing and social media.',
    company: 'Digital Cambodia',
    location: 'Siem Reap, Cambodia',
    type: 'Internship'
  },
  {
    title: 'Data Entry Clerk',
    description: 'Enter customer information and sales data into computer systems. No experience required - just basic computer skills and attention to detail. Flexible part-time hours perfect for students. Training provided.',
    company: 'Cambodia Business Solutions',
    location: 'Phnom Penh, Cambodia',
    type: 'Part-time'
  },
  {
    title: 'Customer Service Representative',
    description: 'Assist customers with inquiries via phone and chat. No experience needed - we provide full training! Must speak Khmer and basic English. Evening shifts available to accommodate school schedules.',
    company: 'Cambodia Call Center',
    location: 'Phnom Penh, Cambodia',
    type: 'Part-time'
  },
  {
    title: 'Restaurant Server/Cashier',
    description: 'Serve customers and handle cash transactions at popular local restaurant. No experience required - we will train you! Flexible scheduling around school hours. Great way to develop customer service skills.',
    company: 'Angkor Restaurant Group',
    location: 'Siem Reap, Cambodia',
    type: 'Part-time'
  },
  {
    title: 'Online Content Creator (Student)',
    description: 'Create social media content about student life in Cambodia. Share your experiences through photos, videos, and posts. No experience needed - just creativity and a smartphone! Work from anywhere with internet.',
    company: 'Cambodia Student Network',
    location: 'Remote, Cambodia',
    type: 'Freelance'
  },
  {
    title: 'Delivery Assistant',
    description: 'Help with package delivery and logistics in the city. Perfect for students with motorbikes or bicycles. Flexible hours, work when you want! No experience required - just reliability and good time management.',
    company: 'Fast Delivery Cambodia',
    location: 'Phnom Penh, Cambodia',
    type: 'Part-time'
  },
  {
    title: 'Computer Skills Trainer',
    description: 'Teach basic computer skills to community members. Help people learn Microsoft Office, internet browsing, and email. No formal teaching experience needed - just good computer knowledge and patience.',
    company: 'Community Tech Center',
    location: 'Battambang, Cambodia',
    type: 'Part-time'
  },
  {
    title: 'Tour Guide Assistant (Internship)',
    description: 'Assist tour guides with groups visiting Angkor Wat and other attractions. Learn about tourism industry while earning money. No experience required - we will train you about history and customer service.',
    company: 'Cambodia Heritage Tours',
    location: 'Siem Reap, Cambodia',
    type: 'Internship'
  },
  {
    title: 'Market Research Assistant',
    description: 'Help conduct surveys and collect data from local communities. Learn research skills while supporting your studies. No experience needed - just good communication skills and willingness to learn.',
    company: 'Cambodia Research Institute',
    location: 'Phnom Penh, Cambodia',
    type: 'Part-time'
  },
  {
    title: 'Event Helper',
    description: 'Assist with setting up and managing local events, festivals, and conferences. Flexible work - only when events happen! No experience required, great way to meet people and learn event management.',
    company: 'Cambodia Events Co.',
    location: 'Phnom Penh, Cambodia',
    type: 'Part-time'
  },
  {
    title: 'Online Khmer-English Translator',
    description: 'Translate simple documents and conversations between Khmer and English. Perfect for bilingual students! Work from home with flexible hours. No formal translation experience required - just strong language skills.',
    company: 'Translation Services Cambodia',
    location: 'Remote, Cambodia',
    type: 'Freelance'
  },
  {
    title: 'Photography Assistant',
    description: 'Help photographers at weddings, events, and photoshoots. Learn photography skills while earning money! No experience needed - we will teach you about cameras, lighting, and editing. Great for creative students.',
    company: 'Cambodia Photo Studio',
    location: 'Phnom Penh, Cambodia',
    type: 'Part-time'
  },
  {
    title: 'Library Assistant',
    description: 'Help organize books, assist visitors, and maintain library facilities. Quiet environment perfect for students. No experience required - just love for books and helping others. Can study during quiet periods!',
    company: 'National Library of Cambodia',
    location: 'Phnom Penh, Cambodia',
    type: 'Part-time'
  },
  {
    title: 'Craft Workshop Teacher',
    description: 'Teach traditional Cambodian crafts to tourists and locals. Share your cultural knowledge while earning money! No formal teaching experience needed - just knowledge of traditional crafts and enthusiasm.',
    company: 'Artisan Cambodia',
    location: 'Siem Reap, Cambodia',
    type: 'Part-time'
  },
  {
    title: 'Mobile Repair Trainee',
    description: 'Learn to repair smartphones and tablets while working. No experience required - complete training provided! Great opportunity to develop technical skills that are in high demand.',
    company: 'Tech Repair Cambodia',
    location: 'Phnom Penh, Cambodia',
    type: 'Internship'
  }
];

async function addCambodiaStudentJobs() {
  try {
    console.log('Adding Cambodia student-friendly jobs...');
    
    // Add student jobs
    for (const job of cambodiaStudentJobs) {
      await pool.execute(
        'INSERT INTO jobs (title, description, company, location, type, employer_id) VALUES (?, ?, ?, ?, ?, ?)',
        [job.title, job.description, job.company, job.location, job.type, 1]
      );
    }
    
    console.log(`Successfully added ${cambodiaStudentJobs.length} student-friendly jobs in Cambodia!`);
    
    // Display added jobs
    const [jobs] = await pool.execute('SELECT id, title, company, location, type FROM jobs WHERE location LIKE "%Cambodia%" ORDER BY created_at DESC');
    console.log(`\nJobs in Cambodia (${jobs.length} total):`);
    jobs.forEach((job, index) => {
      console.log(`${index + 1}. ${job.title} at ${job.company} (${job.location}) - ${job.type}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error adding Cambodia student jobs:', error.message);
    process.exit(1);
  }
}

addCambodiaStudentJobs();