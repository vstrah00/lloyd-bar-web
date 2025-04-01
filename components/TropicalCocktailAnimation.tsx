// src/components/CocktailAnimation.tsx
"use client";

import React, { useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';

const CocktailAnimation = () => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  const glassVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 10,
        stiffness: 100,
        delay: 0.5
      }
    }
  };

  const iceVariants = {
    hidden: { scale: 0 },
    visible: (i: number) => ({
      scale: 1,
      transition: {
        delay: 0.8 + i * 0.1,
        type: "spring",
        stiffness: 200
      }
    })
  };

  return (
    <div 
      ref={ref}
      className="relative h-80 w-64 mx-auto flex items-end justify-center bg-gradient-to-b from-sky-100 to-blue-200 rounded-lg shadow-lg"
    >
      {/* Cocktail glass - PROPER ANATOMY */}
      <motion.div
        className="relative"
        variants={glassVariants}
        initial="hidden"
        animate={controls}
      >
        {/* Glass base - now at bottom where it belongs */}
        <div className="mx-auto h-2 w-10 bg-white/90 rounded-full" />
        
        {/* Glass stem - properly connected to base */}
        <div className="mx-auto h-20 w-3 bg-white/80 rounded-b-lg" />
        
        {/* Glass bowl */}
        <div className="relative h-40 w-32 rounded-b-full rounded-t-lg bg-white/50 overflow-hidden border-t-2 border-l-2 border-r-2 border-white/70">
          {/* Liquid */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-b from-amber-300 to-orange-500"
            initial={{ height: "0%" }}
            animate={{
              height: "80%",
              transition: { delay: 0.7, duration: 0.8, ease: "backOut" }
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-amber-200/50 to-transparent" />
          </motion.div>

          {/* Ice cubes */}
          {[
            { top: "30%", left: "15%", size: "w-8 h-8 rotate-12" },
            { top: "40%", left: "60%", size: "w-7 h-7 -rotate-8" },
            { top: "55%", left: "30%", size: "w-9 h-9 rotate-5" },
            { top: "65%", left: "70%", size: "w-6 h-6 -rotate-15" }
          ].map((ice, i) => (
            <motion.div
              key={i}
              className={`absolute ${ice.size} bg-white/90 rounded-lg`}
              style={{ top: ice.top, left: ice.left }}
              variants={iceVariants}
              custom={i}
              initial="hidden"
              animate={controls}
            />
          ))}

          {/* Lemon slice - more natural placement */}
          <motion.div
            className="absolute top-10 right-3 w-9 h-9 bg-yellow-300 rounded-full border-2 border-yellow-400 rotate-12"
            initial={{ scale: 0 }}
            animate={{
              scale: 1,
              transition: { delay: 1.1, type: "spring" }
            }}
          >
            <div className="absolute top-1/2 left-1/2 w-6 h-1 bg-yellow-500/50 -translate-x-1/2 -translate-y-1/2 rotate-45" />
          </motion.div>

          {/* Umbrella - off-center and naturally tilted */}
          <motion.div
            className="absolute top-6 left-8 origin-bottom"
            initial={{ rotate: -15, y: -20, opacity: 0 }}
            animate={{
              rotate: [-5, 5, -5],
              y: 0,
              opacity: 1,
              transition: { 
                delay: 1.3,
                rotate: {
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut"
                }
              }
            }}
          >
            <div className="w-14 h-7 bg-gradient-to-r from-pink-400 to-red-500 rounded-t-full" />
            <div className="mx-auto w-1 h-12 bg-amber-700/90" style={{ transform: 'rotate(5deg)' }} />
            <div className="absolute top-0 left-1/2 w-1 h-10 bg-pink-500 -translate-x-1/2 rotate-45 origin-bottom" />
            <div className="absolute top-0 left-1/2 w-1 h-10 bg-pink-500 -translate-x-1/2 -rotate-45 origin-bottom" />
          </motion.div>
        </div>
      </motion.div>

      {/* Bubbles - more natural movement */}
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white/40"
          style={{
            bottom: `${Math.random() * 15 + 5}%`,
            left: `${10 + Math.random() * 80}%`,
            width: `${2 + Math.random() * 6}px`,
            height: `${2 + Math.random() * 6}px`
          }}
          initial={{ y: 0, opacity: 0 }}
          animate={{
            y: -120,
            opacity: [0, 0.7, 0],
            x: Math.random() > 0.5 ? [0, 5, -5, 0] : [0, -5, 5, 0],
            transition: {
              delay: 1 + i * 0.1,
              duration: 2 + Math.random() * 3,
              repeat: Infinity
            }
          }}
        />
      ))}

      {/* Subtle condensation droplets */}
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={`drop-${i}`}
          className="absolute bg-white/80 rounded-full"
          style={{
            left: `${15 + Math.random() * 70}%`,
            width: `${1 + Math.random() * 3}px`,
            height: `${3 + Math.random() * 7}px`
          }}
          initial={{ y: 20, opacity: 0 }}
          animate={{
            y: [0, 10, 20],
            opacity: [0.8, 0.5, 0],
            transition: {
              delay: 2 + i * 0.3,
              duration: 3,
              repeat: Infinity
            }
          }}
        />
      ))}
    </div>
  );
};

export default CocktailAnimation;