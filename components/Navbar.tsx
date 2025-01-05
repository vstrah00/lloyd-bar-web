'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-md pb-2 px-5 fixed top-0 left-0 w-full z-50">
      <nav className="flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-5">
          <Link href="/">
            <Image src="/logo.png" alt="Logo" width={150} height={50} />
          </Link>
        </div>

        {/* Hamburger Menu (visible on small screens) */}
        <div className="sm:hidden">
          <button
            onClick={toggleMenu}
            aria-label="Toggle menu"
            className="text-black focus:outline-none"
          >
            {isMenuOpen ? (
              <span className="text-xl">&#x2715;</span> // Close icon (X)
            ) : (
              <span className="text-xl">&#9776;</span> // Hamburger icon (≡)
            )}
          </button>
        </div>

        {/* Links (Desktop View) */}
        <div className="hidden sm:flex items-center gap-5 text-black">
          <Link href="/">
            <span className='navbar-item'>Home</span>
          </Link>
          <Link href="/menu">
            <span className='navbar-item'>Menu</span>
          </Link>
          <Link href="/events">
            <span className='navbar-item'>Events</span>
          </Link>
          <Link href="/games">
            <span className='navbar-item'>Games</span>
          </Link>
          <Link href="/gallery">
            <span className='navbar-item'>Gallery</span>
          </Link>
          <Link href="/info">
            <span className='navbar-item'>More Info</span>
          </Link>
        </div>
      </nav>

      {/* Full-Screen Dropdown Menu (Small Screens) */}
      <div
        className={`fixed inset-0 bg-white z-50 flex flex-col items-center justify-center transition-all duration-500 ease-in-out ${
          isMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={toggleMenu}
          aria-label="Close menu"
          className="absolute top-5 right-5 text-2xl"
        >
          &#x2715; {/* Close icon (X) */}
        </button>

        {/* Menu Links */}
        <Link href="/" onClick={toggleMenu}>
          <span className="block py-4 text-2xl">Home</span>
        </Link>
        <Link href="/menu" onClick={toggleMenu}>
          <span className="block py-4 text-2xl">Menu</span>
        </Link>
        <Link href="/events" onClick={toggleMenu}>
          <span className="block py-4 text-2xl">Events</span>
        </Link>
        <Link href="/games" onClick={toggleMenu}>
          <span className="block py-4 text-2xl">Games</span>
        </Link>
        <Link href="/gallery" onClick={toggleMenu}>
          <span className="block py-4 text-2xl">Photo Gallery</span>
        </Link>
        <Link href="/info" onClick={toggleMenu}>
          <span className="block py-4 text-2xl">More Info</span>
        </Link>
        
        {/* Logo at Bottom Right (Mobile) */}
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
