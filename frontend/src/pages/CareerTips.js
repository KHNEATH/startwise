
import React from 'react';
import { useTranslation } from 'react-i18next';

const CareerTips = () => {
  const { t } = useTranslation();
  return (
    <main className="flex flex-col items-center min-h-screen bg-gradient-to-br from-yellow-50 to-blue-50 py-10 px-2 pt-28">
      {/* Hero Section */}
      <div className="w-full max-w-4xl bg-gradient-to-r from-yellow-400 to-blue-400 rounded-2xl shadow-xl p-10 flex flex-col md:flex-row items-center mb-12 overflow-hidden animate-fade-in">
        <div className="flex-1 flex flex-col items-start justify-center">
          <h2 className="text-4xl font-extrabold text-white mb-4 tracking-tight animate-slide-in">{t('careerTips.title') || 'Career Growth & Tips'}</h2>
          <p className="text-blue-50 text-lg max-w-xl mb-6 animate-fade-in-delay">{t('careerTips.subtitle') || 'Unlock your potential with expert advice, mentorship, and actionable tips for every stage of your career.'}</p>
        </div>
        <div className="hidden md:block flex-1 h-full relative">
          <img src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&q=80" alt="Career Growth" className="object-cover w-full h-full rounded-r-2xl shadow-lg" />
        </div>
      </div>

      {/* Special Section for Students */}
      <div className="w-full max-w-4xl bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 mb-8 border-2 border-green-200">
        <h3 className="text-2xl font-bold text-green-800 mb-6 flex items-center gap-3">
          🎓 Special Guide for Cambodia High School Students
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <h4 className="font-bold text-green-700 mb-3 flex items-center gap-2">
              💰 Finding Your First Job While Studying
            </h4>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>• Look for part-time jobs that offer flexible hours</li>
              <li>• Consider tutoring younger students in subjects you excel at</li>
              <li>• Apply for internships during school holidays</li>
              <li>• Start with entry-level positions that provide training</li>
            </ul>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <h4 className="font-bold text-blue-700 mb-3 flex items-center gap-2">
              📝 Building Your First CV (No Experience Required!)
            </h4>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>• Include your school achievements and grades</li>
              <li>• List any volunteer work or community service</li>
              <li>• Mention language skills (Khmer, English, etc.)</li>
              <li>• Add computer skills and any certifications</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Tips Grid */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 animate-fade-in-delay2">
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-yellow-400 hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-yellow-500 text-3xl">🌱</span>
            <span className="font-bold text-lg text-gray-800">Start Small, Dream Big</span>
          </div>
          <p className="text-gray-700">Every successful person started somewhere. Take any job opportunity to gain experience and build your confidence. Even simple jobs teach valuable skills!</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-400 hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-blue-500 text-3xl">🗣️</span>
            <span className="font-bold text-lg text-gray-800">Practice Your English</span>
          </div>
          <p className="text-gray-700">Strong English skills open many doors in Cambodia. Practice speaking with customers, reading job descriptions, and writing professional emails.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-400 hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-green-500 text-3xl">⏰</span>
            <span className="font-bold text-lg text-gray-800">Balance Work & Study</span>
          </div>
          <p className="text-gray-700">Create a schedule that allows time for both work and studying. Communicate with employers about your school commitments - many are understanding!</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-400 hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-purple-500 text-3xl">🤝</span>
            <span className="font-bold text-lg text-gray-800">Build Professional Relationships</span>
          </div>
          <p className="text-gray-700">Be respectful, punctual, and eager to learn. Good relationships with supervisors and coworkers can lead to better opportunities and recommendations.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-red-400 hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-red-500 text-3xl">📱</span>
            <span className="font-bold text-lg text-gray-800">Learn Digital Skills</span>
          </div>
          <p className="text-gray-700">Basic computer skills, social media management, and online communication are essential in today's job market. Many free resources are available online!</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-indigo-400 hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-indigo-500 text-3xl">💪</span>
            <span className="font-bold text-lg text-gray-800">Stay Positive & Persistent</span>
          </div>
          <p className="text-gray-700">Job hunting can be challenging, but don't give up! Each application and interview is a learning experience that brings you closer to success.</p>
        </div>
      </div>

      {/* Mentorship Section */}
      <div className="w-full max-w-4xl bg-white p-8 rounded-2xl shadow-lg animate-fade-in-delay3 border border-gray-100">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <h3 className="text-3xl font-extrabold mb-4 text-blue-800 animate-slide-in flex items-center gap-3">
              🤝 Build Professional Relationships
            </h3>
            <p className="text-gray-700 mb-6 text-lg leading-relaxed">
              Be respectful, punctual, and eager to learn. Good relationships with supervisors and coworkers can 
              lead to better opportunities and recommendations.
            </p>
            
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-400">
                <h4 className="font-semibold text-blue-800 mb-2">💡 Professional Tips</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Always arrive on time and be prepared</li>
                  <li>• Ask questions when you don't understand something</li>
                  <li>• Show enthusiasm and willingness to help</li>
                  <li>• Maintain a positive attitude even during challenges</li>
                </ul>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-400">
                <h4 className="font-semibold text-green-800 mb-2">🌟 Building Your Network</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Connect with colleagues on professional platforms</li>
                  <li>• Join industry groups and student organizations</li>
                  <li>• Attend career fairs and networking events</li>
                  <li>• Ask for mentorship from experienced professionals</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="flex-1 flex justify-center">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=500&q=80" 
                alt="Professional Networking" 
                className="rounded-xl shadow-xl w-80 h-60 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fade-in-delay { from { opacity: 0; transform: translateY(20px);} to { opacity: 1; transform: none; } }
        @keyframes fade-in-delay2 { from { opacity: 0; transform: translateY(40px);} to { opacity: 1; transform: none; } }
        @keyframes fade-in-delay3 { from { opacity: 0; transform: translateY(60px);} to { opacity: 1; transform: none; } }
        @keyframes slide-in { from { opacity: 0; transform: translateX(-40px);} to { opacity: 1; transform: none; } }
        .animate-fade-in { animation: fade-in 0.7s both; }
        .animate-fade-in-delay { animation: fade-in-delay 0.9s both; }
        .animate-fade-in-delay2 { animation: fade-in-delay2 1.1s both; }
        .animate-fade-in-delay3 { animation: fade-in-delay3 1.3s both; }
        .animate-slide-in { animation: slide-in 0.8s both; }
      `}</style>
    </main>
  );
};

export default CareerTips;
