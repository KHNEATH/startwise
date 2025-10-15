

import React, { useState } from 'react';
import axios from 'axios';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Validate form
    if (!form.name || !form.email || !form.message) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }
    
    try {
      console.log('Sending contact form:', form);
      const response = await axios.post('/api/contact', form);
      console.log('Contact response:', response.data);
      setSubmitted(true);
      setForm({ name: '', email: '', phone: '', message: '' }); // Reset form
    } catch (err) {
      console.error('Contact form error:', err);
      setError(err.response?.data?.error || 'Failed to submit contact form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 py-12 px-2 pt-28">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left: Contact Info */}
        <div className="bg-white rounded-2xl shadow-2xl flex flex-col items-center justify-center px-8 py-14 text-center">
          <h1 className="text-4xl font-extrabold mb-4 tracking-wide text-blue-800">CONTACT</h1>
          <p className="text-blue-700 mb-8 max-w-md mx-auto">Cambodia's #1 Job Matching Service Specialized for students who don't have any experience on work.</p>
          <div className="mb-6">
            <div className="font-bold mb-1 text-blue-700">Address</div>
            <div className="text-blue-900 text-sm">#30, Streer02, Phum KhmerLue, Sangkat KokRorka, Khan PrekPnov, Phnom Penh, Cambodia</div>
          </div>
          <div className="mb-6">
            <div className="font-bold mb-1 text-blue-700">Phone</div>
            <div className="text-blue-900 text-sm">+855 86366996</div>
          </div>
          <div className="mb-6">
            <div className="font-bold mb-1 text-blue-700">Email</div>
            <div className="text-blue-900 text-sm">info@startwise.com</div>
          </div>
          <div className="flex justify-center gap-4 mt-4">
            <button className="text-blue-400 hover:text-blue-700 bg-transparent border-none cursor-pointer"><i className="fab fa-linkedin text-2xl"></i></button>
            <button className="text-blue-400 hover:text-blue-700 bg-transparent border-none cursor-pointer"><i className="fab fa-facebook text-2xl"></i></button>
            <button className="text-blue-400 hover:text-blue-700 bg-transparent border-none cursor-pointer"><i className="fab fa-instagram text-2xl"></i></button>
            <button className="text-blue-400 hover:text-blue-700 bg-transparent border-none cursor-pointer"><i className="fas fa-envelope text-2xl"></i></button>
          </div>
        </div>
        {/* Right: Contact Form */}
        <div className="bg-blue-50 rounded-2xl shadow-2xl flex flex-col justify-center px-8 py-14">
          <h2 className="text-2xl font-extrabold text-blue-800 mb-8 text-center tracking-wide">GET IN TOUCH</h2>
          {submitted ? (
            <div className="bg-green-100 text-green-800 p-4 rounded-lg text-center font-semibold">
              Thank you! We'll be in touch soon.
              <button 
                onClick={() => setSubmitted(false)} 
                className="block mx-auto mt-2 text-sm text-green-600 hover:text-green-800"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-100 text-red-800 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-blue-300 text-blue-900 placeholder-blue-400 py-3 px-2 focus:outline-none focus:border-blue-500 transition"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-blue-300 text-blue-900 placeholder-blue-400 py-3 px-2 focus:outline-none focus:border-blue-500 transition"
                required
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone number"
                value={form.phone}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-blue-300 text-blue-900 placeholder-blue-400 py-3 px-2 focus:outline-none focus:border-blue-500 transition"
                required
              />
              <textarea
                name="message"
                placeholder="Message"
                value={form.message}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-blue-300 text-blue-900 placeholder-blue-400 py-3 px-2 focus:outline-none focus:border-blue-500 transition min-h-[80px]"
                required
              />
              <button 
                type="submit" 
                disabled={loading}
                className={`w-full font-bold py-3 rounded-lg shadow mt-4 transition ${
                  loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-700 hover:bg-blue-800'
                } text-white`}
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
