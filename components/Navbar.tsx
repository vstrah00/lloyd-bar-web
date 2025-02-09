"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const Navbar = ({ children }: { children: React.ReactNode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const pathname = usePathname(); // Fix: Use usePathname instead of useRouter

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 90);
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
    { name: "Menu", href: "/menu" },
    { name: "Events", href: "/events" },
    { name: "Games", href: "/games" },
    { name: "Gallery", href: "/gallery" },
    { name: "More Info", href: "/info" },
  ];

  return (
    <header
      className={`bg-white shadow-md fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled ? "py-1 px-5" : "py-2 px-5"
      }`}
    >
      <nav className="flex justify-between items-center">
        <div className="flex items-center gap-5">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Logo"
              width={isScrolled ? 80 : 140}
              height={50}
              className="transition-all duration-500"
            />
          </Link>
        </div>

        <div className="sm:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            className="text-black focus:outline-none"
          >
            {isMenuOpen ? <span className="text-xl">&#x2715;</span> : <span className="text-xl">&#9776;</span>}
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-5 text-black">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <span
                className={`navbar-item px-3 py-2 rounded-lg transition ${
                  pathname === item.href ? "bg-secondary-dark text-white" : ""
                }`}
              >
                {item.name}
              </span>
            </Link>
          ))}
          {children}
        </div>
      </nav>

      <div
        className={`fixed inset-0 bg-white z-50 flex flex-col items-center justify-center transition-all duration-500 ${
          isMenuOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        }`}
      >
        <button
          onClick={() => setIsMenuOpen(false)}
          aria-label="Close menu"
          className="absolute top-5 right-5 text-2xl"
        >
          &#x2715;
        </button>

        {navItems.map((item) => (
          <Link key={item.href} href={item.href} onClick={() => setIsMenuOpen(false)}>
            <span
              className={`block py-4 text-2xl ${
                pathname === item.href ? "text-black font-bold" : "hover:text-gray-500"
              }`}
            >
              {item.name}
            </span>
          </Link>
        ))}

        {children}

        <div className="absolute bottom-5 right-5 sm:hidden">
          <Link href="/">
            <Image src="/logo.png" alt="Logo" width={100} height={35} />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
