"use client";

import { ReactNode, useState, useEffect } from "react";
import Image from "next/image";
import Navbar from "./Navbar";
import Wave from "./Wave"; // Import the Wave component

const desktopBackgrounds = ["/bg1w.jpg", "/bg2.jpg", "/bg3.jpg", "/bg4.jpg", "/bg5.jpg"];
const mobileBackgrounds = ["/bg1-mobile-xs.webp", "/bg2-mobile.webp", "/bg3-mobile.webp", "/bg4-mobile.webp"];

const LandingSection = ({
  pinkContainer,
  loginSignout,
}: {
  pinkContainer: ReactNode;
  loginSignout: ReactNode;
}) => {
  const [backgroundImages, setBackgroundImages] = useState<string[] | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [nextImage, setNextImage] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [imageKey, setImageKey] = useState(0);
  const [isHydrated, setIsHydrated] = useState(false);
  const [initialViewportHeight, setInitialViewportHeight] = useState<number | null>(null);

  useEffect(() => {
    setIsHydrated(true);

    // Capture viewport height on first load and store it in a CSS variable
    const vh = window.innerHeight;
    document.documentElement.style.setProperty("--fixed-vh", `${vh}px`);
    setInitialViewportHeight(vh);

    const images = window.innerWidth < 768 ? mobileBackgrounds : desktopBackgrounds;
    setBackgroundImages(images);
    setCurrentImage(images[0]);
    setNextImage(images[1]);
  }, []);

  useEffect(() => {
    if (!isHydrated || !backgroundImages) return;

    const switchImage = () => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImage(nextImage);
        setImageKey((prev) => prev + 1);
        setIsTransitioning(false);
        const nextIndex = (backgroundImages.indexOf(nextImage as string) + 1) % backgroundImages.length;
        setNextImage(backgroundImages[nextIndex]);
      }, 1000);
    };

    const interval = setInterval(switchImage, 3750);
    return () => clearInterval(interval);
  }, [nextImage, backgroundImages, isHydrated]);

  useEffect(() => {
    if (isHydrated && currentImage) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = currentImage;
      link.as = 'image';
      document.head.appendChild(link);
    }
  }, [isHydrated, currentImage]);

  const handleScrollDown = () => {
    if (initialViewportHeight === null) return;

    const currentScroll = window.scrollY; // Current scroll position
    const remainingScroll = initialViewportHeight - currentScroll; // Remaining distance to scroll

    window.scrollBy({
      top: remainingScroll,
      behavior: "smooth",
    });
  };

  if (!isHydrated || !backgroundImages || !currentImage || !nextImage) {
    return <div className="w-full h-screen bg-black"></div>;
  }

  return (
    <>
      <div className="relative w-full h-[var(--fixed-vh)] flex items-center justify-center overflow-hidden landing-section">
        <div className="absolute inset-0 w-full h-[var(--fixed-vh)] border-8 border-[#FFFFF] bg-clip-padding z-0 overflow-hidden">
          {/* Current Image */}
          <Image
            key={`current-${imageKey}`}
            src={currentImage}
            alt="Background Image"
            fill
            priority
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              isTransitioning ? "opacity-0" : "opacity-100"
            } animate-zoom`}
          />

          {/* Next Image */}
          <Image
            key={`next-${imageKey}`}
            src={nextImage}
            alt="Next Background Image"
            fill
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              isTransitioning ? "opacity-100" : "opacity-0"
            } ${isTransitioning ? "animate-zoom" : ""}`}
            loading="lazy"
          />

          {/* Wave Component */}
          <Wave />
        </div>

        <div className="absolute top-0 left-0 w-full z-20">
          <Navbar>{loginSignout}</Navbar>
        </div>

        <div className="relative z-10 mx-5">{pinkContainer}</div>

        {/* Down Arrow Button */}
        <button
          onClick={handleScrollDown}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 p-2 rounded-full bg-white bg-opacity-50 hover:bg-opacity-75 transition-opacity"
          aria-label="Scroll down"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-gray-800"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </button>
      </div>
    </>
  );
};

export default LandingSection;