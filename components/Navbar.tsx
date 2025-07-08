"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

const Navbar = ({ children }: { children: React.ReactNode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const pathname = usePathname();
  const t = useTranslations("Navbar");

  // Function to strip locale part of the pathname (keep this)
  const getLocalizedPathname = (pathname: string) => {
    const segments = pathname.split('/');
    if (segments[1] === "en" || segments[1] === "hr") {
      return '/' + segments.slice(2).join('/');
    }
    return pathname;
  };

  // --- NEW: Determine if it's the home page ---
  const localizedPathname = getLocalizedPathname(pathname);
  const isHomePage = localizedPathname === '/';
  // --- END NEW ---


  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const navItems = [
    { name: t("home"), href: "/" },
    { name: t("priceList"), href: "/menu" },
    { name: t("events"), href: "/events" },
    { name: t("games"), href: "/games" },
    { name: t("gallery"), href: "/gallery" },
    { name: t("blog"), href: "/blogPage" },
    { name: t("about"), href: "/about" },
  ];


  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 p-0 ${
        isScrolled ? "bg-black/40 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <nav
        className={`flex justify-between transition-all duration-500 2xl:w-[80%] xl:w-[80%] lg:w-[80%] items-center mx-auto
          ${isScrolled ? "px-6 py-3 md:px-10 md:py-3" : "px-6 py-3 md:px-12 md:py-4"}
        `}
      >
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Logo"
              width={160} // Base width hint (largest size)
              height={60} // Base height hint (adjust for aspect ratio if needed)
              className={`
                transition-all duration-500 h-auto
                ${isScrolled
                  // --- SCROLLED STATE ---
                  // If Home: Use original scrolled mobile size (e.g., w-20).
                  // If Not Home: Use smaller scrolled mobile size (e.g., w-16).
                  // Desktop size remains md:w-[100px]
                  ? `${isHomePage ? 'w-20' : 'w-16'} md:w-[100px]`
                  // --- NOT SCROLLED STATE ---
                  // If Home: Use original default mobile size (e.g., w-28).
                  // If Not Home: Use smaller default mobile size (e.g., w-24).
                  // Desktop size remains md:w-40
                  : `${isHomePage ? 'w-34' : 'w-24'} md:w-40`
                }
              `}
              priority
            />
          </Link>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1 text-30-bold">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link ${
                (item.href === "/" ? localizedPathname === item.href : localizedPathname.startsWith(item.href))
                  ? "active-link"
                  : ""
              }`}
            >
              {item.name}
            </Link>
          ))}
          {children}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={t("toggleMenu")}
          className={`md:hidden text-30-bold z-50 ${isMenuOpen ? "!text-white-100" : "!text-white"}`}
        >
          {isMenuOpen ? <span>✕</span> : <span>☰</span>}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center transition-all duration-500 ${
          isMenuOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        }`}
        style={{ top: 0, height: "100vh" }}
      >
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setIsMenuOpen(false)}
            className={`nav-link text-30-semibold ${
              (item.href === "/" ? localizedPathname === item.href : localizedPathname.startsWith(item.href))
                ? "active-link"
                : "text-gray-400"
            }`}
          >
            {item.name}
          </Link>
        ))}
        {children}
      </div>
    </header>
  );
};

export default Navbar;