const pool = require('./db');

const phnomPenhJobs = [
  // Restaurant & Hospitality Jobs
  {
    title: 'Waiter/Waitress at Hotel Restaurant',
    description: 'Serve guests at a popular hotel restaurant in central Phnom Penh. No experience required - we provide full training on service standards and menu knowledge. Flexible shifts available including evenings and weekends. Great tips and opportunity to practice English with international guests.',
    company: 'Phnom Penh Grand Hotel',
    location: 'Phnom Penh, Cambodia',
    type: 'Part-time'
  },
  {
    title: 'Kitchen Assistant',
    description: 'Help prepare food in busy restaurant kitchen. Learn cooking skills while earning money. No experience needed - we will teach you food preparation, hygiene standards, and kitchen safety. Good opportunity for students interested in culinary arts.',
    company: 'Riverside Restaurant Group',
    location: 'Phnom Penh, Cambodia',
    type: 'Part-time'
  },
  {
    title: 'Hotel Receptionist Trainee',
    description: 'Learn hotel operations while working at front desk. Greet guests, handle check-ins, and assist with inquiries. Must speak basic English and Khmer. Evening and weekend shifts available to accommodate school schedules.',
    company: 'City Center Hotel',
    location: 'Phnom Penh, Cambodia',
    type: 'Internship'
  },

  // Retail & Sales Jobs
  {
    title: 'Shop Assistant at Electronics Store',
    description: 'Help customers with phone and electronics purchases. Learn about latest technology while earning money. No experience required - we provide product training. Great for tech-savvy students who enjoy helping people.',
    company: 'Phnom Penh Electronics Hub',
    location: 'Phnom Penh, Cambodia',
    type: 'Part-time'
  },
  {
    title: 'Cashier at Supermarket',
    description: 'Handle customer payments and maintain cash register. Flexible part-time hours perfect for students. Training provided for point-of-sale systems and customer service. Opportunity for advancement to supervisor roles.',
    company: 'Lucky Supermarket Chain',
    location: 'Phnom Penh, Cambodia',
    type: 'Part-time'
  },
  {
    title: 'Fashion Store Sales Associate',
    description: 'Assist customers with clothing selection and maintain store displays. Perfect for students interested in fashion and retail. No experience needed - learn about customer service, inventory management, and visual merchandising.',
    company: 'Phnom Penh Fashion Plaza',
    location: 'Phnom Penh, Cambodia',
    type: 'Part-time'
  },

  // Office & Administrative Jobs
  {
    title: 'Office Assistant (Student Position)',
    description: 'Help with filing, data entry, and basic administrative tasks. Perfect introduction to office work for students. Flexible hours around school schedule. Learn Microsoft Office, professional communication, and office procedures.',
    company: 'Phnom Penh Business Center',
    location: 'Phnom Penh, Cambodia',
    type: 'Part-time'
  },
  {
    title: 'Document Scanner & Digital Filing',
    description: 'Scan and organize important documents into digital format. Quiet work environment suitable for students. No experience required - just attention to detail and basic computer skills. Can study during quiet periods.',
    company: 'Legal Services Cambodia',
    location: 'Phnom Penh, Cambodia',
    type: 'Part-time'
  },
  {
    title: 'Phone Survey Interviewer',
    description: 'Conduct phone surveys for market research companies. Practice speaking skills while earning money. Training provided for interview techniques and data collection. Flexible evening hours available.',
    company: 'Cambodia Market Research',
    location: 'Phnom Penh, Cambodia',
    type: 'Part-time'
  },

  // Education & Tutoring Jobs
  {
    title: 'Math Tutor for Primary Students',
    description: 'Teach basic mathematics to primary school children. Share your knowledge while supporting your own studies. Flexible scheduling around your classes. No formal teaching experience required - just strong math skills and patience.',
    company: 'Phnom Penh Learning Academy',
    location: 'Phnom Penh, Cambodia',
    type: 'Part-time'
  },
  {
    title: 'Computer Skills Teacher Assistant',
    description: 'Help teach basic computer skills to community members. Assist with Microsoft Office, internet browsing, and email setup. Great way to share your tech knowledge while earning money. Weekend classes available.',
    company: 'Digital Literacy Cambodia',
    location: 'Phnom Penh, Cambodia',
    type: 'Part-time'
  },
  {
    title: 'English Conversation Practice Partner',
    description: 'Practice English conversation with adult learners. Help improve their speaking confidence while you earn money. Casual, friendly environment - no formal teaching required. Excellent for bilingual students.',
    company: 'English Corner Phnom Penh',
    location: 'Phnom Penh, Cambodia',
    type: 'Part-time'
  },

  // Delivery & Transportation Jobs
  {
    title: 'Food Delivery Rider',
    description: 'Deliver meals to customers around Phnom Penh. Work when you want with flexible scheduling. Need motorcycle or bicycle. Good income potential with tips. Perfect for students who want to work around their class schedule.',
    company: 'Food Panda Cambodia',
    location: 'Phnom Penh, Cambodia',
    type: 'Freelance'
  },
  {
    title: 'Package Delivery Assistant',
    description: 'Help sort and deliver packages in Phnom Penh area. Learn logistics and customer service skills. Flexible part-time hours. Training provided for handling procedures and customer interaction.',
    company: 'Express Delivery Cambodia',
    location: 'Phnom Penh, Cambodia',
    type: 'Part-time'
  },
  {
    title: 'Courier Service Helper',
    description: 'Assist with document and small package delivery between offices in Phnom Penh. Great way to learn the city while earning money. Motorcycle or bicycle required. Good communication skills needed.',
    company: 'City Courier Services',
    location: 'Phnom Penh, Cambodia',
    type: 'Part-time'
  },

  // Creative & Media Jobs
  {
    title: 'Social Media Content Assistant',
    description: 'Create posts and content for local businesses social media accounts. Use your creativity and social media skills to help businesses grow online. Remote work possible with flexible hours.',
    company: 'Phnom Penh Digital Agency',
    location: 'Phnom Penh, Cambodia',
    type: 'Freelance'
  },
  {
    title: 'Event Photography Helper',
    description: 'Assist photographers at weddings, parties, and corporate events. Learn photography skills while earning money. Equipment provided. Weekend work available. Great for creative students interested in photography.',
    company: 'Memories Photography Studio',
    location: 'Phnom Penh, Cambodia',
    type: 'Part-time'
  },
  {
    title: 'Graphic Design Trainee',
    description: 'Learn graphic design while helping with simple projects. Perfect for students interested in art and design. Training provided in Photoshop and design basics. Build portfolio while earning money.',
    company: 'Creative Design Cambodia',
    location: 'Phnom Penh, Cambodia',
    type: 'Internship'
  },

  // Service & Maintenance Jobs
  {
    title: 'Car Wash Attendant',
    description: 'Help wash and detail cars at busy car wash center. Learn vehicle maintenance basics while earning money. Flexible hours including weekends. No experience required - training provided for proper washing techniques.',
    company: 'Clean Car Cambodia',
    location: 'Phnom Penh, Cambodia',
    type: 'Part-time'
  },
  {
    title: 'Internet Cafe Assistant',
    description: 'Help customers with computer and internet services. Assist with printing, scanning, and basic tech support. Perfect for tech-savvy students. Learn customer service and basic IT troubleshooting.',
    company: 'Cyber Zone Phnom Penh',
    location: 'Phnom Penh, Cambodia',
    type: 'Part-time'
  },
  {
    title: 'Barista Trainee',
    description: 'Learn to make coffee and serve customers at popular coffee shop. Great environment to practice English with international customers. Training provided for coffee preparation and customer service.',
    company: 'Phnom Penh Coffee House',
    location: 'Phnom Penh, Cambodia',
    type: 'Part-time'
  },

  // Healthcare & Wellness Support
  {
    title: 'Pharmacy Assistant',
    description: 'Help organize medications and assist customers at pharmacy. Learn about healthcare products while earning money. Good opportunity for students interested in healthcare field. Training provided for inventory management.',
    company: 'City Pharmacy Network',
    location: 'Phnom Penh, Cambodia',
    type: 'Part-time'
  },
  {
    title: 'Fitness Center Receptionist',
    description: 'Greet members and handle check-ins at fitness center. Learn about health and fitness industry. Flexible schedule including early morning and evening shifts. Great for students interested in sports and wellness.',
    company: 'Phnom Penh Fitness Club',
    location: 'Phnom Penh, Cambodia',
    type: 'Part-time'
  },

  // Construction & Manual Labor (Light work suitable for students)
  {
    title: 'Construction Site Helper (Light Duties)',
    description: 'Assist with light construction tasks like organizing tools and materials. Learn basic construction skills while earning good wages. Flexible daily work - no long-term commitment required. Safety training provided.',
    company: 'Phnom Penh Construction Co',
    location: 'Phnom Penh, Cambodia',
    type: 'Part-time'
  },

  // Security & Safety
  {
    title: 'Security Guard Trainee (Night Shift)',
    description: 'Learn security procedures while working night shifts at office buildings. Good pay for overnight work that allows daytime studying. Training provided for security protocols and emergency procedures.',
    company: 'Secure Guard Cambodia',
    location: 'Phnom Penh, Cambodia',
    type: 'Part-time'
  },

  // Manufacturing & Production
  {
    title: 'Factory Quality Inspector',
    description: 'Check products for quality standards in garment factory. Learn about manufacturing processes and quality control. Day or evening shifts available. Good opportunity to develop attention to detail skills.',
    company: 'Phnom Penh Garments Ltd',
    location: 'Phnom Penh, Cambodia',
    type: 'Part-time'
  },
  {
    title: 'Warehouse Organizer',
    description: 'Help organize and sort inventory in warehouse. Learn logistics and inventory management. Physical work that builds strength and work ethic. Flexible shifts available around school schedule.',
    company: 'PP Distribution Center',
    location: 'Phnom Penh, Cambodia',
    type: 'Part-time'
  }
];

async function addPhnomPenhJobs() {
  try {
    console.log('Adding more Phnom Penh jobs...');
    
    // Add Phnom Penh jobs
    for (const job of phnomPenhJobs) {
      await pool.execute(
        'INSERT INTO jobs (title, description, company, location, type, employer_id) VALUES (?, ?, ?, ?, ?, ?)',
        [job.title, job.description, job.company, job.location, job.type, 1]
      );
    }
    
    console.log(`Successfully added ${phnomPenhJobs.length} new jobs in Phnom Penh!`);
    
    // Display added jobs
    const [jobs] = await pool.execute('SELECT id, title, company, location, type FROM jobs WHERE location LIKE "%Phnom Penh%" ORDER BY created_at DESC');
    console.log(`\nTotal jobs in Phnom Penh: ${jobs.length}`);
    
    // Group by category for better display
    const categories = {
      'Restaurant & Hospitality': jobs.filter(j => j.title.toLowerCase().includes('waiter') || j.title.toLowerCase().includes('kitchen') || j.title.toLowerCase().includes('hotel') || j.title.toLowerCase().includes('receptionist')),
      'Retail & Sales': jobs.filter(j => j.title.toLowerCase().includes('shop') || j.title.toLowerCase().includes('cashier') || j.title.toLowerCase().includes('sales') || j.title.toLowerCase().includes('fashion')),
      'Office & Admin': jobs.filter(j => j.title.toLowerCase().includes('office') || j.title.toLowerCase().includes('assistant') || j.title.toLowerCase().includes('document') || j.title.toLowerCase().includes('survey')),
      'Education & Tutoring': jobs.filter(j => j.title.toLowerCase().includes('tutor') || j.title.toLowerCase().includes('teacher') || j.title.toLowerCase().includes('english')),
      'Delivery & Transportation': jobs.filter(j => j.title.toLowerCase().includes('delivery') || j.title.toLowerCase().includes('courier') || j.title.toLowerCase().includes('rider')),
      'Other Opportunities': jobs.filter(j => !['waiter', 'kitchen', 'hotel', 'receptionist', 'shop', 'cashier', 'sales', 'fashion', 'office', 'assistant', 'document', 'survey', 'tutor', 'teacher', 'english', 'delivery', 'courier', 'rider'].some(keyword => j.title.toLowerCase().includes(keyword)))
    };
    
    Object.entries(categories).forEach(([category, jobList]) => {
      if (jobList.length > 0) {
        console.log(`\n📂 ${category} (${jobList.length} jobs):`);
        jobList.slice(0, 5).forEach((job, index) => {
          console.log(`   ${index + 1}. ${job.title} at ${job.company} - ${job.type}`);
        });
        if (jobList.length > 5) {
          console.log(`   ... and ${jobList.length - 5} more jobs in this category`);
        }
      }
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error adding Phnom Penh jobs:', error.message);
    process.exit(1);
  }
}

addPhnomPenhJobs();