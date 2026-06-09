"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const FloatingLanguageToggle = ({ languages }: { languages: string[] }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (lang: string) => {
    const pathSegments = pathname.split("/").slice(2); // Skip the first two parts (locale and base)
    const newPathname = `/${lang}/${pathSegments.join("/")}`;

    // Save the selected language to localStorage
    localStorage.setItem("preferredLanguage", lang);

    // Use Next.js router to navigate without full reload
    router.replace(newPathname);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 md:bottom-8 md:right-8">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="min-h-11 min-w-11 rounded-full border border-white/70 bg-black/55 px-3 text-sm font-semibold text-white shadow-lg backdrop-blur-md transition-all duration-300 hover:bg-primary"
        aria-label="Change language"
      >
        {pathname.split("/")[1] === "en" ? "EN" : "HR"}
      </button>

      {isOpen && (
        <div className="absolute bottom-14 right-0 w-32 overflow-hidden rounded-md border border-white/20 bg-zinc-950/95 py-1 text-center shadow-xl backdrop-blur-md">
          {languages.map((lang) => (
            <button
              key={lang}
              onClick={() => handleLanguageChange(lang)}
              className={`block w-full px-4 py-2 text-sm font-semibold ${
                lang === pathname.split("/")[1]
                  ? "bg-primary text-white"
                  : "text-zinc-200 hover:bg-white/10"
              }`}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FloatingLanguageToggle;
