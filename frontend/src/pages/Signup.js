
import React, { useState } from 'react';
import { signup } from '../api/userApi';
import { saveToken } from '../utils/auth';
import Alert from '../components/Alert';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const name = `${firstName} ${lastName}`.trim();
      const res = await signup(name, email, password);
      saveToken(res.token);
      setSuccess({ title: 'Account created', message: 'Welcome! Redirecting to your profile…' });
      setTimeout(() => navigate('/profile'), 1000);
    } catch (err) {
      setError(err?.response?.data?.error || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-5xl min-h-[500px] rounded-3xl flex flex-col md:flex-row overflow-hidden shadow-2xl">
        {/* Left Image Panel */}
        <div className="hidden md:flex flex-col items-center justify-center w-1/3 bg-black/80 relative p-0 m-0 min-h-[500px]">
          <img 
            src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80"
            alt="Work Office"
            className="absolute inset-0 w-full h-full object-cover"
            style={{height:'100%', width:'100%', minHeight:'500px', borderRadius: 0, margin: 0, padding: 0, display:'block', zIndex: 1}}
          />
        </div>
        {/* Right Signup Form */}
        <div className="flex-1 flex flex-col justify-center px-8 py-12 md:py-16 md:px-16 bg-white">
          <button onClick={() => window.history.back()} className="mb-4 text-gray-400 hover:text-gray-700 text-2xl" aria-label="Back">←</button>
          <h2 className="text-6xl font-extrabold mb-2 leading-tight text-gray-900">Create an Account</h2>
          <div className="mb-6 text-base text-gray-700 font-medium">Already have an account? <a href="/login" className="text-black hover:underline font-bold">Log in</a></div>
          <form className="w-full" onSubmit={handleSubmit}>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 flex flex-col">
                <label className="text-gray-700 font-semibold text-base text-left" htmlFor="firstName">First Name</label>
                <input
                  id="firstName"
                  className="border border-gray-300 rounded-full px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-black placeholder-gray-400 font-medium"
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  required
                  autoComplete="given-name"
                />
              </div>
              <div className="flex-1 flex flex-col">
                <label className="text-gray-700 font-semibold text-base text-left" htmlFor="lastName">Last Name</label>
                <input
                  id="lastName"
                  className="border border-gray-300 rounded-full px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-black placeholder-gray-400 font-medium"
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  required
                  autoComplete="family-name"
                />
              </div>
            </div>
            <div className="flex flex-col gap-5 mb-6">
              <label className="text-gray-700 font-semibold text-base text-left" htmlFor="email">Email Address</label>
              <input
                id="email"
                className="border border-gray-300 rounded-full px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-black placeholder-gray-400 font-medium"
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
              <label className="text-gray-700 font-semibold text-base text-left" htmlFor="password">Password</label>
              <input
                id="password"
                className="border border-gray-300 rounded-full px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-black placeholder-gray-400 font-medium"
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
              <label className="text-gray-700 font-semibold text-base text-left" htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                className="border border-gray-300 rounded-full px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-black placeholder-gray-400 font-medium"
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>
            <div className="flex items-center mb-6">
              <input type="checkbox" id="terms" className="mr-2 w-5 h-5 rounded" required />
              <label htmlFor="terms" className="text-gray-700 text-sm">I agree to the <a href="/terms" className="underline font-semibold">Terms &amp; Condition</a></label>
            </div>
            <button className="bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-full w-full py-4 text-xl transition-all mb-2 shadow-lg" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
            {error && <div className="text-red-500 text-center mt-2 font-semibold">{error}</div>}
            {success && (
              <div className="mt-4">
                <Alert type="success" title={success.title} message={success.message} onClose={() => setSuccess(null)} />
              </div>
            )}
          </form>
          <div className="flex items-center my-8">
            <div className="flex-grow h-px bg-gray-200" />
            <span className="mx-4 text-gray-400 font-semibold">or</span>
            <div className="flex-grow h-px bg-gray-200" />
          </div>
          <div className="flex gap-4">
            <a href="https://accounts.google.com/" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 border-2 border-blue-200 bg-white rounded-full py-3 px-4 text-blue-900 hover:bg-blue-50 font-bold text-base shadow transition-all" style={{boxShadow:'0 4px 24px 0 #e5e9f2', minHeight:'48px', maxHeight:'52px'}}>
              <svg className="w-6 h-6" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.87-6.87C35.64 2.36 30.18 0 24 0 14.82 0 6.73 5.48 2.69 13.44l8.06 6.26C12.5 13.13 17.77 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.64 7.01l7.19 5.6C43.98 37.13 46.1 31.3 46.1 24.55z"/><path fill="#FBBC05" d="M10.75 28.19c-1.01-2.99-1.01-6.19 0-9.18l-8.06-6.26C.9 16.36 0 20.06 0 24s.9 7.64 2.69 11.25l8.06-6.26z"/><path fill="#EA4335" d="M24 48c6.18 0 11.36-2.05 15.15-5.57l-7.19-5.6c-2.01 1.35-4.59 2.15-7.96 2.15-6.23 0-11.5-3.63-13.25-8.69l-8.06 6.26C6.73 42.52 14.82 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></g></svg>
              <span className="text-left">Continue with Google</span>
            </a>
            <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 border-2 border-blue-200 bg-white rounded-full py-3 px-4 text-blue-900 hover:bg-blue-50 font-bold text-base shadow transition-all" style={{boxShadow:'0 4px 24px 0 #e5e9f2', minHeight:'48px', maxHeight:'52px'}}>
              <svg className="w-6 h-6" viewBox="0 0 48 48"><path fill="#1877F3" d="M24 4C12.95 4 4 12.95 4 24c0 9.68 7.16 17.68 16.5 19.54V30.89h-4.97v-6.89h4.97v-3.89c0-4.92 2.93-7.64 7.42-7.64 2.15 0 4.4.38 4.4.38v4.83h-2.48c-2.45 0-3.22 1.52-3.22 3.08v3.24h5.48l-.88 6.89h-4.6v12.65C36.84 41.68 44 33.68 44 24c0-11.05-8.95-20-20-20z"/></svg>
              <span className="text-left">Continue with Facebook</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
