

import React from 'react';
import { useTranslation } from 'react-i18next';

const Home = () => {
  useTranslation();

  // Unique animated typing effect for the welcome description
  const [typedText, setTypedText] = React.useState("");
  const fullText = "We are dedicated to delivering excellence, innovative solutions, and superior customer service.\nWe look forward to working with you.";
  React.useEffect(() => {
    let i = 0;
    setTypedText("");
    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, i + 1));
      i++;
      if (i === fullText.length) clearInterval(interval);
    }, 25);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-800 via-blue-600 to-blue-400">
      {/* Welcome Section */}
      <section className="w-full flex flex-col items-center justify-center pt-32 pb-12">
        <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center text-center px-6 py-12 bg-white/10 rounded-3xl shadow-2xl border border-blue-300 backdrop-blur-md">
          <h1 className="text-white text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-xl">Welcome to Our <span className="text-blue-200">StartWise</span></h1>
          <p className="text-blue-100 text-lg md:text-xl min-h-[48px] mb-6 font-medium whitespace-pre-line" style={{letterSpacing:'0.01em'}}>
            {typedText}<span className="animate-pulse">|</span>
          </p>
          <a href="#services" className="bg-white text-blue-700 font-bold px-8 py-3 rounded-full shadow-lg text-lg tracking-wide hover:bg-blue-100 transition-all">Explore Our Services</a>
        </div>
      </section>

      {/* Service Section */}
      <section id="services" className="w-full flex flex-col items-center justify-center py-16 px-2 bg-[#f4f8fb]">
        <h2 className="text-4xl font-bold text-blue-800 mb-10">Our Services</h2>
        <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* ProfileBuilder */}
          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center gap-4 min-h-[260px]">
            <img src="https://img.icons8.com/ios-filled/64/4a90e2/name.png" alt="ProfileBuilder" className="w-14 h-14 mb-2" />
            <h3 className="font-bold text-xl text-gray-800">ProfileBuilder</h3>
            <p className="text-gray-600 text-center">Create your professional profile to stand out to employers and recruiters.</p>
            <a href="/profile-builder" className="text-blue-700 font-semibold underline text-base hover:text-blue-900">Try ProfileBuilder</a>
          </div>
          {/* CvBuilder */}
          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center gap-4 min-h-[260px]">
            <img src="https://img.icons8.com/ios-filled/64/4a90e2/document--v1.png" alt="CvBuilder" className="w-14 h-14 mb-2" />
            <h3 className="font-bold text-xl text-gray-800">CvBuilder</h3>
            <p className="text-gray-600 text-center">Easily generate and export a modern CV with our guided builder.</p>
            <a href="/cv-builder" className="text-blue-700 font-semibold underline text-base hover:text-blue-900">Try CvBuilder</a>
          </div>
          {/* JobBoard */}
          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center gap-4 min-h-[260px]">
            <img src="https://img.icons8.com/ios-filled/64/4a90e2/briefcase.png" alt="JobBoard" className="w-14 h-14 mb-2" />
            <h3 className="font-bold text-xl text-gray-800">JobBoard</h3>
            <p className="text-gray-600 text-center">Browse and apply to the latest job opportunities from top companies.</p>
            <a href="/jobs" className="text-blue-700 font-semibold underline text-base hover:text-blue-900">Go to JobBoard</a>
          </div>
          {/* CareerTips */}
          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center gap-4 min-h-[260px]">
            <img src="https://img.icons8.com/ios-filled/64/4a90e2/idea.png" alt="CareerTips" className="w-14 h-14 mb-2" />
            <h3 className="font-bold text-xl text-gray-800">CareerTips</h3>
            <p className="text-gray-600 text-center">Get expert advice and tips to boost your career and job search success.</p>
            <a href="/career-tips" className="text-blue-700 font-semibold underline text-base hover:text-blue-900">Read CareerTips</a>
          </div>
          {/* JobPost */}
          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center gap-4 min-h-[260px]">
            <img src="https://img.icons8.com/ios-filled/64/4a90e2/add-file.png" alt="JobPost" className="w-14 h-14 mb-2" />
            <h3 className="font-bold text-xl text-gray-800">JobPost</h3>
            <p className="text-gray-600 text-center">Post a job and connect with thousands of qualified candidates.</p>
            <a href="/employer/job-post" className="text-blue-700 font-semibold underline text-base hover:text-blue-900">Post a Job</a>
          </div>
        </div>
      </section>
      
      {/* Achievement Section */}
      <section className="w-full flex flex-col items-center justify-center relative p-5" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center justify-center">
          <h2 className="text-white text-4xl font-bold mb-12 text-center">Achievement</h2>
          <div className="w-full flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24">
            {/* Stat 1 */}
            <div className="flex flex-col items-center justify-center">
              <svg width="64" height="64" fill="none" viewBox="0 0 24 24" className="mb-2 text-white"><path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" stroke="currentColor" strokeWidth="2"/><path d="M16 11.5V7M8 11.5V7" stroke="currentColor" strokeWidth="2"/></svg>
              <span className="text-white text-5xl font-semibold">953</span>
              <span className="text-white/80 text-xl mt-1">Total Jobs</span>
            </div>
            {/* Stat 2 */}
            <div className="flex flex-col items-center justify-center">
              <svg width="64" height="64" fill="none" viewBox="0 0 24 24" className="mb-2 text-white"><path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z" stroke="currentColor" strokeWidth="2"/><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2"/></svg>
              <span className="text-white text-5xl font-semibold">15.1k</span>
              <span className="text-white/80 text-xl mt-1">Seekers</span>
            </div>
            {/* Stat 3 */}
            <div className="flex flex-col items-center justify-center">
              <svg width="64" height="64" fill="none" viewBox="0 0 24 24" className="mb-2 text-white"><path d="M3 21V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14" stroke="currentColor" strokeWidth="2"/><path d="M16 3v4M8 3v4" stroke="currentColor" strokeWidth="2"/></svg>
              <span className="text-white text-5xl font-semibold">179</span>
              <span className="text-white/80 text-xl mt-1">Companies</span>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="w-full min-h-screen flex flex-col items-center justify-center">
        <div className="w-full max-w-3xl mx-auto flex flex-col items-center justify-center text-center px-4 py-16 bg-white/10 rounded-3xl shadow-2xl border border-blue-300 backdrop-blur-md">
          <h1 className="text-white text-6xl md:text-7xl font-extrabold leading-tight mb-6 drop-shadow-xl" style={{letterSpacing:'-0.03em', lineHeight: '1.05', textShadow: '0 4px 32px #1e3a8a55'}}>
            Find Your Dream Job
          </h1>
          <p className="text-white/90 text-xl md:text-2xl mb-8">Discover jobs, employment, and career opportunities tailored for you.</p>
          <form className="flex flex-col md:flex-row items-center gap-4 w-full max-w-xl mx-auto mb-8">
            <input type="text" placeholder="Job title, keywords..." className="flex-1 px-6 py-4 rounded-2xl text-gray-800 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg shadow-md border border-blue-200 bg-white/90" />
            <input type="text" placeholder="Location" className="flex-1 px-6 py-4 rounded-2xl text-gray-800 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg shadow-md border border-blue-200 bg-white/90" />
            <button type="submit" className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-8 py-4 rounded-2xl shadow-md transition-all text-lg">Find Jobs</button>
          </form>
          <div className="text-white/80 text-base mb-8">
            Popular Searches : <span className="text-white font-semibold">Designer, Developer, Web, iOS, PHP, Senior, Engineer</span>
          </div>
          <div className="flex items-center gap-6 mt-4 justify-center">
            <div className="flex -space-x-3">
              <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Candidate" className="w-12 h-12 rounded-full border-2 border-white shadow-lg" />
              <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Candidate" className="w-12 h-12 rounded-full border-2 border-white shadow-lg" />
              <img src="https://randomuser.me/api/portraits/men/54.jpg" alt="Candidate" className="w-12 h-12 rounded-full border-2 border-white shadow-lg" />
              <img src="https://randomuser.me/api/portraits/women/65.jpg" alt="Candidate" className="w-12 h-12 rounded-full border-2 border-white shadow-lg" />
              <span className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold border-2 border-white text-lg shadow-lg">+4</span>
            </div>
            <span className="text-white/90 text-xl font-semibold">10k+ Candidates</span>
            <a href="/cv-builder" className="ml-6 flex items-center gap-2 text-blue-700 bg-white font-semibold border border-blue-200 px-6 py-3 rounded-2xl transition-all text-lg shadow-md hover:bg-blue-50">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M12 16v-8m0 8l-4-4m4 4l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2"/></svg>
              Upload Your CV
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
