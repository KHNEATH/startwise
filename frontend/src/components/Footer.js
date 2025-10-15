


import React from 'react';

const Footer = () => (
  <footer className="w-full bg-gradient-to-r from-blue-700 to-purple-700 text-white py-10 mt-10 shadow-inner" aria-label="Footer">
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10 border-b border-blue-400/30 pb-8 mb-6">
        {/* Brand & Description */}
        <div className="flex flex-col items-center md:items-start md:w-1/3">
          <div className="flex flex-col items-center md:items-start mb-3">
            <span className="font-extrabold text-2xl tracking-tight" style={{letterSpacing: '0.03em'}}>StartWise</span>
          </div>
          <p className="text-blue-100 text-base leading-relaxed max-w-xs text-center md:text-left">
            Cambodia's #1 Job Matching Service<br />Specialized for students who don't have any experience on work.
          </p>
        </div>
        {/* Contact Info */}
        <div className="flex flex-col items-center md:items-start md:w-1/3 text-base text-blue-100">
          <div className="font-semibold text-lg text-white mb-2">Our Contact</div>
          <div className="mb-1">#30, Streer02, Phum KhmerLue, Sangkat KokRorka, Khan PrekPnov, Phnom Penh, Cambodia</div>
          <div className="mb-1">+855 86366996</div>
          <div className="mb-1">info@startwise.works</div>
          <div className="mb-1">Monday — Friday</div>
          <div className="mb-1">8:00am - 6:00pm</div>
          <a href="/privacy" className="underline text-blue-200 hover:text-white mt-2">Privacy Policy</a>
        </div>
        {/* Copyright */}
        <div className="flex flex-col items-center md:items-end md:w-1/3 text-xs text-blue-200 mt-8 md:mt-0 justify-end">
          <div className="text-center md:text-right">© 2025 Startwise (Cambodia) Co., Ltd.<br />All Rights Reserved.</div>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
