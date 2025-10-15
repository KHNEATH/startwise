import React from 'react';

const JobPost = () => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [loginForm, setLoginForm] = React.useState({ email: '', password: '' });
  const [loginError, setLoginError] = React.useState('');
  const [postForm, setPostForm] = React.useState({ title: '', description: '' });
  const [postSuccess, setPostSuccess] = React.useState(false);
  const [jobs, setJobs] = React.useState([]);
  const [applicants] = React.useState([
    { id: 1, name: 'Sokha', email: 'sokha@email.com', job: 'Frontend Developer' },
    { id: 2, name: 'Dara', email: 'dara@email.com', job: 'Backend Developer' },
  ]);

  const handleLoginChange = e => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
    setLoginError('');
  };
  const handleLogin = e => {
    e.preventDefault();
    // TODO: Integrate with backend auth
    if (loginForm.email === 'employer@email.com' && loginForm.password === 'password') {
      setIsLoggedIn(true);
    } else {
      setLoginError('Invalid credentials');
    }
  };
  const handlePostChange = e => {
    setPostForm({ ...postForm, [e.target.name]: e.target.value });
  };
  const handlePostJob = e => {
    e.preventDefault();
    // TODO: Integrate with backend
    setJobs([{ ...postForm, id: Date.now() }, ...jobs]);
    setPostForm({ title: '', description: '' });
    setPostSuccess(true);
    setTimeout(() => setPostSuccess(false), 2000);
  };

  if (!isLoggedIn) {
    return (
      <>
        <section className="flex flex-col items-center min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-10 px-2 relative overflow-hidden">
          {/* Hero Section with Wave SVG */}
          <div className="absolute top-0 left-0 w-full h-40 pointer-events-none select-none">
            <svg viewBox="0 0 1440 320" className="w-full h-full"><path fill="#34d399" fillOpacity="0.3" d="M0,160L60,170.7C120,181,240,203,360,197.3C480,192,600,160,720,133.3C840,107,960,85,1080,101.3C1200,117,1320,171,1380,197.3L1440,224L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"></path></svg>
          </div>
          <div className="w-full max-w-3xl bg-gradient-to-r from-green-400 to-blue-500 rounded-3xl shadow-2xl p-12 flex flex-col md:flex-row items-center mb-12 animate-fade-in relative z-10">
            <div className="flex-1 flex flex-col items-start justify-center gap-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl">🚀</span>
                <h2 className="text-5xl font-semibold text-white tracking-wide animate-slide-in leading-tight font-sans" style={{fontFamily:'Inter, Segoe UI, Arial, sans-serif', letterSpacing:'-0.02em'}}>Employer Login</h2>
              </div>
              <p className="text-blue-50 text-xl font-normal max-w-xl animate-fade-in-delay mb-4 font-sans" style={{fontFamily:'Inter, Segoe UI, Arial, sans-serif', letterSpacing:'-0.01em'}}>Access your dashboard to post jobs and manage applicants.</p>
            </div>
            <div className="hidden md:flex flex-1 h-full relative items-center justify-center animate-fade-in-delay2">
              <div className="relative">
                <img src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80" alt="Professional" className="object-cover w-80 h-56 rounded-2xl shadow-xl border-4 border-white/70" />
                <div className="absolute -bottom-5 -right-5 bg-blue-500 rounded-full w-14 h-14 flex items-center justify-center shadow-lg text-white text-3xl border-4 border-white/70" style={{boxShadow:'0 4px 24px 0 rgba(59,130,246,0.15)'}}>💼</div>
              </div>
            </div>
          </div>
          {/* Vertical Stepper with Icons */}
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 animate-fade-in-delay2 flex gap-8 relative z-10">
            <div className="flex flex-col items-center pt-2">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-green-500 text-white font-bold text-lg mb-2 border-4 border-green-200">1</div>
              <div className="h-10 w-1 bg-green-200" />
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 text-gray-500 font-bold text-lg mb-2 border-4 border-gray-100">2</div>
            </div>
            <div className="flex-1">
              <div className="mb-6">
                <span className="font-semibold text-green-700 flex items-center gap-2">🔑 Login</span>
                <span className="block text-gray-400 text-sm">Step 1 of 2</span>
              </div>
              <form className="space-y-5" onSubmit={handleLogin}>
                <input name="email" value={loginForm.email} onChange={handleLoginChange} className="p-3 border-2 border-green-100 rounded-xl w-full focus:ring-2 focus:ring-green-400 placeholder-gray-400 font-medium" type="email" placeholder="Email" />
                <input name="password" value={loginForm.password} onChange={handleLoginChange} className="p-3 border-2 border-green-100 rounded-xl w-full focus:ring-2 focus:ring-green-400 placeholder-gray-400 font-medium" type="password" placeholder="Password" />
                {loginError && <div className="text-red-500 text-sm">{loginError}</div>}
                <button className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-3 rounded-lg shadow hover:scale-105 transition font-semibold text-lg w-full flex items-center justify-center gap-2" type="submit">
                  <span>🔐</span>
                  Login
                </button>
              </form>
            </div>
          </div>
        </section>
        <style>{`
          @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
          @keyframes fade-in-delay { from { opacity: 0; transform: translateY(20px);} to { opacity: 1; transform: none; } }
          @keyframes fade-in-delay2 { from { opacity: 0; transform: translateY(40px);} to { opacity: 1; transform: none; } }
          @keyframes slide-in { from { opacity: 0; transform: translateX(-40px);} to { opacity: 1; transform: none; } }
          .animate-fade-in { animation: fade-in 0.7s both; }
          .animate-fade-in-delay { animation: fade-in-delay 0.9s both; }
          .animate-fade-in-delay2 { animation: fade-in-delay2 1.1s both; }
          .animate-slide-in { animation: slide-in 0.8s both; }
        `}</style>
      </>
    );
  }

  return (
    <section className="flex flex-col items-center min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-10 px-2">
      {/* Hero Section */}
      <div className="w-full max-w-4xl bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl shadow-xl p-10 flex flex-col md:flex-row items-center mb-12 animate-fade-in relative">
        <div className="flex-1 flex flex-col items-start justify-center">
          <h2 className="text-4xl font-extrabold text-white mb-4 tracking-tight animate-slide-in flex items-center gap-3">
            <span>📝</span>
            Post a Job
          </h2>
          <p className="text-blue-50 text-lg max-w-xl mb-6 animate-fade-in-delay">Share your opportunity and find the best candidates for your company.</p>
        </div>
        <div className="hidden md:block flex-1 h-full relative animate-fade-in-delay2">
          <img src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80" alt="Post a Job" className="object-cover w-full h-full rounded-r-2xl shadow-lg" />
        </div>
      </div>

      {/* Job Post Form */}
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-10 mb-10 animate-fade-in-delay2">
        <form className="space-y-5" onSubmit={handlePostJob}>
          <input name="title" value={postForm.title} onChange={handlePostChange} className="p-3 border-2 border-green-100 rounded-xl w-full focus:ring-2 focus:ring-green-400 placeholder-gray-400 font-medium" type="text" placeholder="Job Title" />
          <textarea name="description" value={postForm.description} onChange={handlePostChange} className="p-3 border-2 border-green-100 rounded-xl w-full focus:ring-2 focus:ring-green-400 placeholder-gray-400 font-medium" placeholder="Job Description" rows={4} />
          <button className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-3 rounded-lg shadow hover:scale-105 transition font-semibold text-lg w-full" type="submit">Post Job</button>
          {postSuccess && <div className="text-green-600 text-sm mt-2">Job posted successfully!</div>}
        </form>
      </div>

      {/* Posted Jobs */}
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 mb-10 animate-fade-in-delay3">
        <h3 className="text-xl font-semibold mb-4 text-blue-700">Your Posted Jobs</h3>
        {jobs.length === 0 ? (
          <div className="text-gray-400 italic">No jobs posted yet.</div>
        ) : (
          <div className="grid gap-4">
            {jobs.map(job => (
              <div key={job.id} className="bg-gradient-to-br from-green-50 to-blue-50 border border-green-100 rounded-xl p-4 shadow hover:shadow-lg transition-all flex items-center gap-3">
                <span className="text-green-500 text-2xl">📌</span>
                <div>
                  <div className="font-bold text-lg text-green-800 mb-1">{job.title}</div>
                  <div className="text-gray-700">{job.description}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Applicants */}
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 animate-fade-in-delay4">
        <h3 className="text-xl font-semibold mb-4 text-gray-700 flex items-center gap-2">👥 Applicants</h3>
        {applicants.length === 0 ? (
          <div className="text-gray-400 italic">No applicants yet.</div>
        ) : (
          <div className="grid gap-4">
            {applicants.map(app => (
              <div key={app.id} className="bg-gradient-to-br from-blue-50 to-green-50 border border-blue-100 rounded-xl p-4 shadow hover:shadow-lg transition-all flex items-center gap-3">
                <span className="text-blue-500 text-2xl">👤</span>
                <div>
                  <div className="font-bold text-lg text-blue-800 mb-1">{app.name} <span className="text-xs text-gray-500">({app.email})</span></div>
                  <div className="text-gray-700">{app.job}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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
    </section>
  );
}

export default JobPost;
