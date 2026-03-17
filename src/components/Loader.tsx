import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoaderProps {
  onComplete: () => void;
}

const Loader: React.FC<LoaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [showEnter, setShowEnter] = useState(false);

  useEffect(() => {
    // Scroll lock the body
    document.body.style.overflow = 'hidden';

    const duration = 2000;
    const intervalTime = 20;
    const steps = duration / intervalTime;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const newProgress = Math.min(Math.round((currentStep / steps) * 100), 100);
      setProgress(newProgress);

      if (currentStep >= steps) {
        clearInterval(interval);
        setTimeout(() => {
          setShowEnter(true);
        }, 300);
      }
    }, intervalTime);

    return () => {
      clearInterval(interval);
      // Restore scroll when unmounting
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <motion.div
      initial={{ y: 0 }}
      exit={{ y: '-100vh', opacity: 0 }}
      transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        backgroundColor: 'var(--eerie-black-1)',
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden'
      }}
    >
      {/* Massive Background Text Matching Photo layout but with Portfolio Color */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          whiteSpace: 'nowrap',
          fontSize: '40vw',
          fontWeight: 900,
          color: 'var(--orange-yellow-crayola)', // Matching the portfolio's golden yellow theme
          opacity: 1, // Completely solid, exactly like the photo style
          zIndex: 1,
          fontFamily: '"Arial Black", Impact, sans-serif',
          letterSpacing: '-0.06em',
          lineHeight: 1,
          textShadow: 'none',
        }}
      >
        <div style={{ transform: 'translate(-50%, -50%)' }}>DHYEY</div>
      </motion.div>

      <div style={{ zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <AnimatePresence mode="wait">
          {!showEnter ? (
            <motion.div
              key="counter"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              <div style={{ 
                fontSize: 'clamp(60px, 10vw, 120px)', 
                fontWeight: 'bold', 
                color: 'var(--white-2)', 
                fontFamily: 'monospace',
                letterSpacing: '-2px',
                textShadow: '0 4px 15px rgba(0,0,0,0.6)' // Added readability shadow to pop against the cyan background
              }}>
                {progress}%
              </div>
              
              {/* Progress bar line */}
              <div style={{ width: '250px', height: '3px', backgroundColor: 'var(--jet)', marginTop: '10px', position: 'relative', overflow: 'hidden', borderRadius: '4px' }}>
                <motion.div
                  style={{ position: 'absolute', top: 0, left: 0, height: '100%', backgroundColor: 'var(--orange-yellow-crayola)' }}
                  initial={{ width: '0%' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
            </motion.div>
          ) : (
            <motion.button
              key="enterBtn"
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onComplete}
              style={{
                padding: '16px 45px',
                fontSize: '18px',
                fontWeight: 'bold',
                backgroundColor: 'var(--orange-yellow-crayola)',
                color: 'var(--eerie-black-1)',
                border: 'none',
                borderRadius: '30px',
                cursor: 'pointer',
                boxShadow: '0 10px 40px hsla(45, 100%, 72%, 0.4)',
                fontFamily: 'inherit',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}
            >
              Enter Portfolio
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Loader;
