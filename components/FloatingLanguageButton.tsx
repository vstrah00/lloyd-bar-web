"use client"; // Marking this as a client component

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const FloatingLanguageToggle = ({ languages }: { languages: string[] }) => {
  const pathname = usePathname();
  const router = useRouter(); // To trigger page reloading after language change

  const [isOpen, setIsOpen] = useState(false); // To control toggle state
  const [scrollPosition, setScrollPosition] = useState(0); // To store current scroll position

  // Handle language change
  const handleLanguageChange = (lang: string) => {
    const pathSegments = pathname.split("/").slice(2); // Skip the first two parts of the path (language and base)
    const newPathname = `/${lang}/${pathSegments.join("/")}`; // Build the new pathname with the selected language

    setScrollPosition(window.scrollY); // Save the current scroll position
    router.push(newPathname); // Trigger page reload
    setIsOpen(false); // Close the toggle after selection
  };

  // After page has rendered, restore the scroll position
  useEffect(() => {
    window.scrollTo(0, scrollPosition); // Reset scroll to the saved position
  }, [pathname, scrollPosition]); // Re-run when `pathname` or `scrollPosition` changes

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-4">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 rounded-full bg-primary border-white-100 border-2 text-white text-sm font-semibold transition-all duration-300"
      >
        {pathname.split('/')[1] === 'en' ? 'EN' : 'HR'}
      </button>

      {/* Dropdown Menu for More Languages - Open above the main button */}
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
