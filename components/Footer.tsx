"use client"; // If using Next.js App Router

import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

const Footer = () => {
  const t = useTranslations("Footer");
  
  // Pre-calculate the current year
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-logo">
            <img src="/logo.png" alt="My Website Logo" width={150} height={50} />
          </div>
          <div className="footer-links">
            <Link href="/about" className="footer-link">{t("aboutUs")}</Link>
            <Link href="/services" className="footer-link">{t("services")}</Link>
            <Link href="/contact" className="footer-link">{t("contact")}</Link>
            <Link href="/privacy-policy" className="footer-link">{t("privacyPolicy")}</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-social">
            <Link
              href="https://instagram.com/beach_bar_lloyd"
              className="footer-social-icon"
              aria-label="Instagram"
            >
              <div className="flex items-center space-x-2">
                <img src="/insta-icon.png" alt="Instagram" className="w-6 h-6 mt-1" />
                <span className="footer-link">
                  {t("instagramHandle")}
                </span>
              </div>
            </Link>
          </div>
          <div className="footer-social"></div>
          <div className="footer-copyright">
            {t("copyright", { year: currentYear })}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
