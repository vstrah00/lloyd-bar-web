"use client";

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';

const FloatingLanguageToggle = ({ languages }: { languages: string[] }) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (lang: string) => {
    const pathSegments = pathname.split("/").slice(2); // Skip the first two parts (locale and base)
    const newPathname = `/${lang}/${pathSegments.join("/")}`;

    // Force a full page reload to ensure the locale is persisted
    window.location.href = newPathname;
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 rounded-full bg-primary border-white-100 border-2 text-white text-sm font-semibold transition-all duration-300"
      >
        {pathname.split('/')[1] === 'en' ? 'EN' : 'HR'}
      </button>

      {isOpen && (
        <div className="absolute bottom-16 right-0 bg-white shadow-md rounded-lg mt-2 py-2 w-32 text-center">
          {languages.map((lang) => (
            <button
              key={lang}
              onClick={() => handleLanguageChange(lang)}
              className={`block px-4 py-2 text-sm w-full text-gray-700 ${
                lang === pathname.split('/')[1] ? 'bg-primary text-white' : 'hover:bg-gray-200'
              }`}
            >
              {lang === "en" ? "EN" : lang === "hr" ? "HR" : lang.toUpperCase()}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FloatingLanguageToggle;