"use client";

import { ReactNode, useState, useEffect } from "react";
import Image from "next/image";
import Navbar from "./Navbar";

const desktopBackgrounds = ["/bg1.jpg", "/bg2.jpg", "/bg3.jpg", "/bg4.jpg", "/bg5.jpg"];
const mobileBackgrounds = ["/bg1-mobile.jpg", "/bg2-mobile.jpg", "/bg3-mobile.jpg", "/bg4-mobile.jpg", "/bg5-mobile.jpg"];

const LandingSection = ({
  pinkContainer,
  loginSignout,
}: {
  pinkContainer: ReactNode;
  loginSignout: ReactNode;
}) => {
  const [backgroundImages, setBackgroundImages] = useState<string[]>(desktopBackgrounds);
  const [currentImage, setCurrentImage] = useState(backgroundImages[0]);
  const [nextImage, setNextImage] = useState(backgroundImages[1]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [imageKey, setImageKey] = useState(0);

  useEffect(() => {
    const updateImages = () => {
      setBackgroundImages(window.innerWidth < 768 ? mobileBackgrounds : desktopBackgrounds);
    };

    updateImages();
    window.addEventListener("resize", updateImages);
    return () => window.removeEventListener("resize", updateImages);
  }, []);

  useEffect(() => {
    setCurrentImage(backgroundImages[0]);
    setNextImage(backgroundImages[1]);
  }, [backgroundImages]);

  useEffect(() => {
    const switchImage = () => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImage(nextImage);
        setImageKey((prev) => prev + 1);
        setIsTransitioning(false);
        const nextIndex = (backgroundImages.indexOf(nextImage) + 1) % backgroundImages.length;
        setNextImage(backgroundImages[nextIndex]);
      }, 1000);
    };

    const interval = setInterval(switchImage, 8000);
    return () => clearInterval(interval);
  }, [nextImage, backgroundImages]);

  useEffect(() => {
    const adjustHeight = () => {
      const landingSection = document.querySelector('.landing-section') as HTMLElement; // Cast to HTMLElement
      if (landingSection) {
        landingSection.style.height = `${window.innerHeight}px`;
      }
    };

    window.addEventListener('resize', adjustHeight);
    window.addEventListener('load', adjustHeight);
    adjustHeight();

    return () => {
      window.removeEventListener('resize', adjustHeight);
      window.removeEventListener('load', adjustHeight);
    };
  }, []);

  return (
    <>
      {/* Hero Section with Background */}
      <div className="relative w-full h-[100dvh] flex items-center justify-center overflow-hidden landing-section">
        {/* Background Image Container (With Border) */}
        <div className="absolute inset-0 w-full h-[100dvh] border-8 border-[#AF7B5C] bg-clip-padding z-0 overflow-hidden">
          {/* Current Image */}
          <Image
            key={`current-${imageKey}`}
            src={currentImage}
            alt="Background Image"
            fill
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
          />
        </div>

        {/* Navbar */}
        <div className="absolute top-0 left-0 w-full z-20">
          <Navbar>{loginSignout}</Navbar>
        </div>

        {/* Pink Container */}
        <div className="relative z-10 mx-5">{pinkContainer}</div>
      </div>
    </>
  );
};

export default LandingSection;