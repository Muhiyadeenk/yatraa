import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './IntroAnimation.css';

const IntroAnimation = ({ onFinish }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      if (onFinish) setTimeout(onFinish, 1000); 
    }, 5500); 
    return () => clearTimeout(timer);
  }, [onFinish]);

  const letters = "Yathraa".split("");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.5, // Start text shortly after flight starts
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { ease: "easeInOut", duration: 0.8 }
    }
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 1.2, 
        ease: [0.6, 0.01, -0.05, 0.95],
      },
    },
  };

  const planeVariants = {
    hidden: { x: -150, y: 40, opacity: 0, rotate: 15 },
    visible: {
      x: 0,
      y: -20,
      opacity: [0, 1, 1, 0], 
      rotate: 0,
      transition: {
        duration: 2.5, 
        ease: "easeInOut",
        times: [0, 0.2, 0.8, 1]
      }
    }
  };

  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: [0, 0.5, 0], 
      transition: {
        duration: 2.5, 
        ease: "easeInOut",
        times: [0, 0.5, 1]
      }
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div 
          className="intro-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          {/* Central Glow */}
          <motion.div 
            className="glow-effect"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.6, scale: 1.2 }}
            transition={{ delay: 0.2, duration: 2, ease: "easeOut" }}
          />

          <div className="logo-container">
            
            {/* Travel Path Animation */}
            <div className="travel-animation-wrapper">
              <motion.svg 
                className="travel-path"
                width="200" height="100" viewBox="0 0 200 100"
                style={{ position: 'absolute', top: '-60px', left: '-50px', zIndex: 1 }}
              >
                <motion.path 
                  d="M 10 80 Q 100 0, 150 40" 
                  fill="transparent" 
                  stroke="#10b981" 
                  strokeWidth="2" 
                  strokeDasharray="4 4"
                  variants={pathVariants}
                  initial="hidden"
                  animate="visible"
                />
              </motion.svg>
              
              <motion.div
                className="airplane"
                variants={planeVariants}
                initial="hidden"
                animate="visible"
                style={{ position: 'absolute', top: '-40px', left: '100px', zIndex: 2 }}
              >
                {/* Airplane SVG */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.6L3 8l6 5-3.2 3.2-2.4-.8-1.1 1.1 3.5 1.8 1.8 3.5 1.1-1.1-.8-2.4 3.2-3.2 5 6l1.2-.7c.4-.2.7-.6.6-1.1z"/>
                </svg>
              </motion.div>
            </div>

            {/* Text */}
            <motion.div 
              className="text-wrapper"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {letters.map((letter, idx) => (
                <motion.span key={idx} variants={letterVariants} className="letter">
                  {letter}
                </motion.span>
              ))}
              
              {/* Dot */}
              <motion.span 
                className="dot"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  delay: 2.5, // Popping in as the text finishes
                  type: "spring", 
                  stiffness: 260, 
                  damping: 20 
                }}
              >
                .
              </motion.span>
            </motion.div>

            {/* Shimmer Overlay */}
            <motion.div 
              className="shimmer"
              initial={{ x: '-100%' }}
              animate={{ x: '200%' }}
              transition={{ delay: 3.2, duration: 1.5, ease: "linear" }}
            />
          </div>

          {/* Background Ambient Motion */}
          <motion.div 
            className="ambient-bg"
            animate={{ 
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroAnimation;
