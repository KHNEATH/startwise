import React from 'react';

const About = () => (
  <main className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-800 via-blue-600 to-blue-400 py-16">
    <section className="w-full max-w-5xl mx-auto flex flex-col items-center justify-center text-center px-4 py-16 bg-white/10 rounded-3xl shadow-2xl border border-blue-300 backdrop-blur-md">
      <h1 className="text-white text-5xl md:text-6xl font-extrabold mb-8 drop-shadow-xl">About Us</h1>
      <p className="text-white/90 text-xl md:text-2xl mb-6">StartWise is Cambodia's #1 Job Matching Service, specialized for students and young professionals who don't have any experience on work. We connect talent with opportunity, helping you take the next step in your career journey.</p>
      <p className="text-white/80 text-lg md:text-xl">Our mission is to empower the next generation with access to jobs, internships, and career resources. We believe everyone deserves a chance to succeed, regardless of background or experience.</p>
    </section>
  </main>
);

export default About;
