
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { isLoggedIn, removeToken } from '../utils/auth';
import logo from '../assets/startwise-new-logo.svg';
import { useTranslation } from 'react-i18next';

const navLinks = [
  { to: '/', label: 'Home', type: 'route' },
  { to: 'services', label: 'Service', type: 'anchor' },
  { to: '/about', label: 'About', type: 'route' },
  { to: '/contact', label: 'Contact', type: 'route' },
];




const PrimaryNav = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const loggedIn = isLoggedIn();
  
  // Check if user is admin
  const isAdmin = () => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    try {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      return tokenPayload.role === 'admin';
    } catch {
      return false;
    }
  };

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  return (
  <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-700 via-purple-600 to-purple-500 text-white shadow-lg rounded-b-2xl border-b-2 border-purple-400/40">
      {/* Logo Left */}
      <div className="flex items-center gap-2" tabIndex={0} aria-label="Home">
        <Link to="/" className="flex items-center gap-2 select-none">
          <span className="font-extrabold text-2xl tracking-tight text-white drop-shadow-lg" style={{ fontFamily: 'inherit', letterSpacing: '0.01em', textShadow: '0 2px 16px #1e3a8a55' }}>StartWise</span>
        </Link>
      </div>
      {/* Menu Center */}
  <div className="hidden md:flex gap-4 text-base items-center mx-auto" role="menubar">
    {navLinks.map(link => (
      link.type === 'anchor' ? (
        <a
          key={link.to}
          href={`#${link.to}`}
          className="px-3 py-2 rounded-lg uppercase font-semibold tracking-wide transition hover:bg-white/10 text-white cursor-pointer"
          role="menuitem"
          tabIndex={0}
          onClick={e => {
            e.preventDefault();
            const el = document.getElementById(link.to);
            if (el) {
              el.scrollIntoView({ behavior: 'smooth' });
            } else {
              window.location.href = `/#${link.to}`;
            }
          }}
        >
          {link.label}
        </a>
      ) : (
        <Link
          key={link.to}
          to={link.to}
          className={`px-3 py-2 rounded-lg uppercase font-semibold tracking-wide transition hover:bg-white/10 text-white ${location.pathname === link.to ? 'bg-white/20 font-bold shadow' : ''}`}
          role="menuitem"
          tabIndex={0}
          aria-current={location.pathname === link.to ? 'page' : undefined}
        >
          {link.label}
        </Link>
      )
    ))}
  </div>
      {/* Actions Right */}
      <div className="flex gap-2 items-center">
        {loggedIn ? (
          <>
            <Link to="/profile" className="bg-white/20 text-white px-4 py-2 rounded-lg shadow hover:bg-white/30 font-bold transition border border-white/30" role="menuitem" tabIndex={0}>Profile</Link>
            {isAdmin() && (
              <Link to="/admin" className="bg-red-500/80 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow font-bold transition border border-red-700/30" role="menuitem" tabIndex={0}>Admin</Link>
            )}
            <button onClick={handleLogout} className="bg-white/10 text-white px-4 py-2 rounded-lg shadow hover:bg-white/20 font-bold transition border border-white/20" role="menuitem" tabIndex={0}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow font-bold transition border border-blue-700/30" role="menuitem" tabIndex={0} style={{minWidth:'120px',textAlign:'center'}}>Login</Link>
            <Link to="/signup" className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg shadow font-bold transition border border-purple-700/30 ml-2" role="menuitem" tabIndex={0} style={{minWidth:'120px',textAlign:'center'}}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default PrimaryNav;
