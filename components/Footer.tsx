"use client"; // If using Next.js App Router

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

const Footer = () => {
  const t = useTranslations("Footer");
  const pathname = usePathname();
  const locale = pathname.split('/')[1] === 'hr' ? 'hr' : 'en';
  
  // Pre-calculate the current year
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-logo">
            <Image src="/logo.png" alt="Beach Bar Lloyd" width={150} height={50} className="h-auto w-auto" />
          </div>
          <div className="footer-links">
            <Link href={`/${locale}/about`} className="footer-link">{t("aboutUs")}</Link>
            <Link href={`/${locale}/menu`} className="footer-link">{t("menu")}</Link>
            <Link href="https://www.google.com/maps/search/?api=1&query=Beach%20Bar%20Lloyd%20Okrug%20Donji" className="footer-link">{t("location")}</Link>
            <Link href="https://instagram.com/beach_bar_lloyd" className="footer-link">Instagram</Link>
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
                <Image src="/insta-icon.png" alt="" width={24} height={24} className="mt-1 h-6 w-6" />
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
