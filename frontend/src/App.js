import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';
import './App.css';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import JobBoard from './pages/JobBoard';
import JobDetail from './pages/JobDetail';
import NotFound from './pages/NotFound';
import PrimaryNav from './components/PrimaryNav';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProfileBuilder from './pages/ProfileBuilder';
import CVBuilder from './pages/CVBuilder';
import CVPreview from './pages/CVPreview';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

import CareerTips from './pages/CareerTips';
import JobPost from './pages/employer/JobPost';
import MentorshipChat from './pages/MentorshipChat';
import Privacy from './pages/Privacy';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
        <PrimaryNav />
        <div className="container mx-auto px-4 py-6 flex-1 pt-24">
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/profile-builder" element={<ProfileBuilder />} />
          <Route path="/cv-builder" element={<CVBuilder />} />
          <Route path="/cv-preview" element={<CVPreview />} />
          <Route path="/career-tips" element={<CareerTips />} />
          <Route path="/jobs" element={<JobBoard />} />
          <Route path="/jobs/:jobId" element={<JobDetail />} />
          <Route path="/employer/job-post" element={<JobPost />} />
          <Route path="/mentorship-chat" element={<MentorshipChat />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Footer />
        <ScrollToTop />
      </div>
    </Router>
  );
}

export default App;
