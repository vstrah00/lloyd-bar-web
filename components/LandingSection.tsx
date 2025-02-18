"use client";

import { ReactNode, useState, useEffect } from "react";
import Image from "next/image";
import Navbar from "./Navbar";

const backgroundImages = ["/bg1.jpg", "/bg2.jpg", "/bg3.jpg", "/bg4.jpg", "/bg5.jpg"];

const LandingSection = ({
  children,
  loginSignout,
}: {
  children: ReactNode;
  loginSignout: ReactNode;
}) => {
  const [currentImage, setCurrentImage] = useState(backgroundImages[0]);
  const [nextImage, setNextImage] = useState(backgroundImages[1]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [imageKey, setImageKey] = useState(0);

  useEffect(() => {
    const switchImage = () => {
      setIsTransitioning(true);

      setTimeout(() => {
        setCurrentImage(nextImage);
        setImageKey((prevKey) => prevKey + 1);
        setIsTransitioning(false);

        const currentIndex = backgroundImages.indexOf(nextImage);
        const nextIndex = (currentIndex + 1) % backgroundImages.length;
        setNextImage(backgroundImages[nextIndex]);
      }, 1000); // 1s fade transition
    };

    const interval = setInterval(switchImage, 8000); // Switch every 8 seconds
    return () => clearInterval(interval);
  }, [nextImage]);

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* Background Image Container */}
      <div className="absolute inset-0 w-full h-screen border-8 border-[#AF7B5C] bg-clip-padding z-0 overflow-hidden">
        {/* Current Image (zooms in continuously) */}
        <Image
          key={`current-${imageKey}`}
          src={currentImage}
          alt="Background Image"
          fill
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            isTransitioning ? "opacity-0" : "opacity-100"
          } animate-zoom`} // Apply zoom animation
        />

        {/* Next Image (starts from scale 1 and zooms in independently) */}
        <Image
          key={`next-${imageKey}`}
          src={nextImage}
          alt="Next Background Image"
          fill
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            isTransitioning ? "opacity-100" : "opacity-0"
          } ${isTransitioning ? "animate-zoom" : ""}`} // Apply zoom animation only during transition
        />
      </div>

      {/* Navbar */}
      <div className="relative z-20">
        <Navbar>{loginSignout}</Navbar>
      </div>

      {/* Main Content */}
      <div className="relative z-10 pt-[5rem] md:pt-[6rem] lg:pt-[7rem]">
        {children}
      </div>

      {/* Add the @keyframes animation to your CSS */}
      <style jsx>{`
        @keyframes zoomIn {
          0% {
            transform: scale(1);
          }
          100% {
            transform: scale(1.1);
          }
        }

        .animate-zoom {
          animation: zoomIn 10s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default LandingSection;