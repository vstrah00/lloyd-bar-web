"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const Navbar = ({ children }: { children: React.ReactNode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const pathname = usePathname();

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
    { name: "Home", href: "/" },
    { name: "Drinks", href: "/menu" },
    { name: "Events", href: "/events" },
    { name: "Games", href: "/games" },
    { name: "Gallery", href: "/gallery" },
    { name: "Info", href: "/info" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 p-0 ${
        isScrolled ? "bg-black/40 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <nav
        className={`flex justify-between items-center transition-all duration-500
          ${isScrolled ? "px-6 py-3 md:px-10 md:py-3" : "px-6 py-5 md:px-12 md:py-8"}
        `}
      >

      {/* Logo */}
        <div className="flex items-center">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Logo"
              width={isScrolled ? 100 : 160} // Adjust size on scroll
              height={60}
              className="transition-all duration-500"
            />
          </Link>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1 text-30-extrabold">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="nav-link">
              {item.name}
            </Link>
          ))}
          {children}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
          className={`md:hidden text-30-bold z-50 ${
            isMenuOpen ? "!text-white-100" : "!text-black"
          }`}
        >
          {isMenuOpen ? <span>&#x2715;</span> : <span>&#9776;</span>}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center transition-all duration-500 ${
          isMenuOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        }`}
        style={{
          top: 0, // Always stick to the top of the screen
          height: "100vh", // Full height to cover the screen
        }}
      >
    
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setIsMenuOpen(false)}
            className="nav-link text-30-semibold"
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
