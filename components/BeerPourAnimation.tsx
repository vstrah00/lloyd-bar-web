// src/components/BeerPourAnimation.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

// --- Constants ---
const GLASS_VISUAL_HEIGHT_PX = 200;
const GLASS_VISUAL_WIDTH_PX = 100;

const BORDER_TOP_PX = 5;
const BORDER_SIDES_PX = 10;
const BORDER_BOTTOM_PX = 30;

const FOAM_DIV_HEIGHT_PX = 60;

// Calculate the height available for the liquid inside the borders
const LIQUID_AREA_HEIGHT_PX = GLASS_VISUAL_HEIGHT_PX - BORDER_TOP_PX - BORDER_BOTTOM_PX;
const LIQUID_AREA_WIDTH_PX = GLASS_VISUAL_WIDTH_PX - (BORDER_SIDES_PX * 2);

// Foam positioning - now calculated from top of container
const FOAM_FINAL_TOP_PX = BORDER_TOP_PX - (FOAM_DIV_HEIGHT_PX * 0.3); // Slightly overlaps top border
const FOAM_INITIAL_TOP_PX = GLASS_VISUAL_HEIGHT_PX; // Start below the container

const BeerPourAnimation = () => {
  const pourControls = useAnimation();
  const beerControls = useAnimation();
  const headControls = useAnimation();

  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const sequence = async () => {
      await new Promise(resolve => setTimeout(resolve, 500));

      // 1. Start the pour stream animation
      await pourControls.start({
        bottom: `${BORDER_BOTTOM_PX}px`,
        opacity: 1,
        height: `${GLASS_VISUAL_HEIGHT_PX * 1.5}px`,
        transition: { duration: 0.4, ease: 'easeIn' },
      });

      // 2. Fill the beer and raise the foam head
      beerControls.start({
        height: `${LIQUID_AREA_HEIGHT_PX}px`,
        opacity: 1,
        transition: { duration: 1.5, ease: 'linear' },
      });
      
      headControls.start({
        top: `${FOAM_FINAL_TOP_PX}px`,
        opacity: 1,
        transition: { duration: 1.6, ease: 'easeOut', delay: 0.3 },
      });

      await new Promise(resolve => setTimeout(resolve, 1500));

      // 3. Stop the pour stream animation
      await pourControls.start({
        height: '0%',
        opacity: 0,
        transition: { duration: 0.5, ease: 'easeOut' },
      });
    };

    if (!hasAnimated) {
      sequence();
      setHasAnimated(true);
    }
  }, [pourControls, beerControls, headControls, hasAnimated]);

  return (
    <div
      className="relative mx-auto mt-[70px]"
      style={{
        perspective: '500px',
        height: `${GLASS_VISUAL_HEIGHT_PX}px`,
        width: `${GLASS_VISUAL_WIDTH_PX}px`,
      }}
      aria-hidden="true"
    >
      {/* Pour Stream */}
      <motion.div
        className="absolute left-1/2 z-0 w-[20px] -translate-x-1/2 rounded-lg bg-[#fac92c]"
        initial={{ bottom: '110%', height: '0%', opacity: 0 }}
        animate={pourControls}
        style={{ originY: 0 }}
      />

      {/* Liquid Container */}
      <div
        className="absolute z-10 overflow-hidden bg-transparent"
        style={{
          bottom: `${BORDER_BOTTOM_PX}px`,
          left: `${BORDER_SIDES_PX}px`,
          height: `${LIQUID_AREA_HEIGHT_PX}px`,
          width: `${LIQUID_AREA_WIDTH_PX}px`,
        }}
      >
        {/* Beer Liquid */}
        <motion.div
          className="absolute bottom-0 left-0 w-full bg-[#fac92c]"
          initial={{ height: '0px', opacity: 0 }}
          animate={beerControls}
        >
          <div className="absolute right-0 top-0 h-full w-1/2 bg-[#ea9602] opacity-70" />
        </motion.div>
      </div>

      {/* Glass Visuals */}
      <div
        className="absolute inset-0 z-20 pointer-events-none"
        style={{ transform: 'rotateX(-15deg)' }} // Reduced tilt for better alignment
      >
        {/* Glass Borders */}
        <div className="absolute top-0 left-0 w-full bg-[#e8e4d9] opacity-80" style={{ height: `${BORDER_TOP_PX}px` }} />
        <div className="absolute bottom-0 left-0 w-full bg-[#e8e4d9] opacity-80" style={{ height: `${BORDER_BOTTOM_PX}px` }} />
        <div className="absolute top-0 left-0 h-full bg-[#e8e4d9] opacity-80" style={{ width: `${BORDER_SIDES_PX}px` }} />
        <div className="absolute top-0 right-0 h-full bg-[#e8e4d9] opacity-80" style={{ width: `${BORDER_SIDES_PX}px` }} />

        {/* Reflections */}
        <div className="absolute left-[15px] top-[15%] h-[25%] w-[8px] rounded-full bg-white/70" />
        <div className="absolute right-[18px] top-[10%] h-[65%] w-[10px] rounded-full bg-white/50" />
      </div>

      {/* Foam Head */}
      <motion.div
        className="absolute left-1/2 z-30 w-[70px] -translate-x-1/2"
        style={{ height: `${FOAM_DIV_HEIGHT_PX}px` }}
        initial={{ top: `${FOAM_INITIAL_TOP_PX}px`, opacity: 0 }}
        animate={headControls}
      >
        {/* Foam Circles */}
        <div className="absolute bottom-0 left-0 h-[80%] w-[100%] rounded-full bg-white" />
        <div className="absolute bottom-[5px] left-[45px] h-[40px] w-[40px] rounded-full bg-white" />
        <div className="absolute bottom-[10px] right-[-15px] h-[50px] w-[50px] rounded-full bg-white" />
        <div className="absolute bottom-[15px] left-[-10px] h-[35px] w-[35px] rounded-full bg-white" />
      </motion.div>
    </div>
  );
};

export default BeerPourAnimation;