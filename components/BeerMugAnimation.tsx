"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const BeerMugAnimation = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Generate random bubble positions and properties
  const generateBubbles = (count: number) => {
    return Array.from({ length: count }).map((_, i) => {
      const size = 6 + Math.random() * 6; // 6-12px
      const left = 5 + Math.random() * 90; // 5-95px
      const delay = Math.random() * 2; // 0-2s
      const duration = 1.5 + Math.random() * 2; // 1.5-3.5s
      const xVariation = 2 + Math.random() * 8; // 2-10px
      
      return {
        id: i,
        size,
        left,
        delay,
        duration,
        xVariation
      };
    });
  };

  const bubbles = isClient ? generateBubbles(20) : [];

  if (!isClient) {
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="w-[100px] h-[150px] bg-gray-100 animate-pulse rounded-xl" />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Beer Mug - Centered */}
      <motion.div 
        className="relative w-[100px] h-[150px] opacity-80"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 0.8, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {/* Handle */}
        <div className="absolute w-[25px] h-[70px] top-[25px] left-full border-t-[15px] border-r-[15px] border-b-[15px] border-[#e1ebf0] rounded-r-xl" />
        
        {/* Glass Body */}
        <div className="absolute w-full h-full bg-[#e1ebf0] border-5 border-transparent -ml-[5px] -mb-[5px] rounded-b-xl overflow-hidden">
          {/* Contents */}
          <div className="absolute w-full h-[80%] bg-[#f5c00f]/60 bottom-0 left-0 z-[1] rounded-b-lg">
            {/* Randomized Bubbles */}
            {bubbles.map((bubble) => (
              <motion.div
                key={bubble.id}
                className="absolute bg-white/90 rounded-full"
                style={{
                  width: `${bubble.size}px`,
                  height: `${bubble.size}px`,
                  left: `${bubble.left}px`,
                  top: '150px',
                }}
                animate={{
                  y: -150,
                  opacity: [0, 0.7 + Math.random() * 0.3, 0],
                  x: [
                    0, 
                    Math.random() > 0.5 ? bubble.xVariation : -bubble.xVariation,
                    Math.random() > 0.5 ? bubble.xVariation/2 : -bubble.xVariation/2,
                    0
                  ],
                }}
                transition={{
                  duration: bubble.duration,
                  repeat: Infinity,
                  delay: bubble.delay,
                  ease: "easeInOut"
                }}
              />
            ))}
            
            {/* Foam */}
            <div className="absolute w-full h-[40px] -top-[40px] left-0 opacity-70 overflow-hidden">
              {Array.from({ length: 16 }).map((_, i) => {
                const size = i % 2 === 0 
                  ? 40 + Math.random() * 10 // 40-50px
                  : 30 + Math.random() * 10; // 30-40px
                const foamLeft = (i % 5) * 25 + (Math.random() * 10 - 5);
                
                return (
                  <motion.div
                    key={i}
                    className="absolute bg-white rounded-full"
                    style={{
                      width: `${size}px`,
                      height: `${size}px`,
                      left: `${foamLeft}px`,
                      top: '15px',
                    }}
                    animate={{
                      x: [0, 5 + Math.random() * 5, -5 - Math.random() * 5, 0],
                      y: [0, 4 + Math.random() * 2, -4 - Math.random() * 2, 0],
                      rotate: [0, Math.random() > 0.5 ? 5 : -5, 0]
                    }}
                    transition={{
                      duration: 6 + Math.random() * 3,
                      repeat: Infinity,
                      delay: i * 0.1,
                      ease: "easeInOut"
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BeerMugAnimation;