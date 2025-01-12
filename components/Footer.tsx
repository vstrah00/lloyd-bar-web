// components/Footer.js
import React from 'react';
import Link from 'next/link';
import { SiInstagram } from 'react-icons/si';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-logo">
            <img src="/logo.png" alt="My Website Logo" width={150} height={50} />
          </div>
          <div className="footer-links">
            <Link href="/about" className="footer-link">About Us</Link>
            <Link href="/services" className="footer-link">Services</Link>
            <Link href="/contact" className="footer-link">Contact</Link>
            <Link href="/privacy-policy" className="footer-link">Privacy Policy</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-social">
            <Link href="https://instagram.com" className="footer-social-icon" aria-label="Instagram">
              <div className="flex items-center space-x-2">
                <SiInstagram size={24} />
                <span className="footer-instagram-handle">@beach_bar_lloyd</span>
              </div>
            </Link>
          </div>
          <div className="footer-social"></div>
          <div className="footer-copyright">
            &copy; {new Date().getFullYear()} Beach Bar Lloyd. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;