const pool = require('./db');

const demoTestimonials = [
  {
    name: 'Sarah Johnson',
    position: 'Software Engineer at Google',
    content: 'StartWise helped me transition from a junior developer to a senior engineer at one of the top tech companies. The CV builder and career guidance were invaluable in my job search.',
    rating: 5,
    user_id: 1
  },
  {
    name: 'Michael Chen',
    position: 'Product Manager at Meta',
    content: 'The job matching feature on StartWise is incredible. I found my dream job within just 2 weeks of signing up. Highly recommended for anyone looking to advance their career.',
    rating: 5,
    user_id: 2
  },
  {
    name: 'Emily Rodriguez',
    position: 'UX Designer at Apple',
    content: 'StartWise not only helped me build a professional CV but also connected me with mentors in the design industry. The platform is a game-changer for career development.',
    rating: 5,
    user_id: 3
  },
  {
    name: 'David Thompson',
    position: 'Data Scientist at Netflix',
    content: 'I was struggling to showcase my skills effectively. StartWise\'s CV builder and portfolio features helped me present my work in a way that impressed recruiters.',
    rating: 5,
    user_id: 4
  },
  {
    name: 'Lisa Park',
    position: 'Marketing Director at Spotify',
    content: 'The career tips and industry insights on StartWise are top-notch. I learned so much about interview preparation and salary negotiation that directly helped me land my current role.',
    rating: 4,
    user_id: 5
  },
  {
    name: 'Alex Williams',
    position: 'DevOps Engineer at Amazon',
    content: 'StartWise made job hunting so much easier. The platform\'s clean interface and powerful search features helped me find opportunities that perfectly matched my skills.',
    rating: 5,
    user_id: 6
  }
];

async function addDemoTestimonials() {
  try {
    // Check if testimonials table exists
    const [tables] = await pool.execute("SHOW TABLES LIKE 'testimonials'");
    
    if (tables.length === 0) {
      console.log('Testimonials table does not exist, skipping...');
      process.exit(0);
    }
    
    // Clear existing demo testimonials
    await pool.execute('DELETE FROM testimonials WHERE user_id <= 10');
    console.log('Cleared existing demo testimonials');
    
    // Add demo testimonials
    for (const testimonial of demoTestimonials) {
      await pool.execute(
        'INSERT INTO testimonials (name, position, content, rating, user_id, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
        [testimonial.name, testimonial.position, testimonial.content, testimonial.rating, testimonial.user_id]
      );
    }
    
    console.log(`Successfully added ${demoTestimonials.length} demo testimonials!`);
    
    // Display added testimonials
    const [testimonials] = await pool.execute('SELECT name, position, rating FROM testimonials ORDER BY created_at DESC');
    console.log('\nTestimonials now in database:');
    testimonials.forEach((testimonial, index) => {
      console.log(`${index + 1}. ${testimonial.name} - ${testimonial.position} (${testimonial.rating}/5 stars)`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error adding demo testimonials:', error.message);
    process.exit(1);
  }
}

addDemoTestimonials();