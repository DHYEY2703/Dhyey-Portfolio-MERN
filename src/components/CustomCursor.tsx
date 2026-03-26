import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CustomCursor: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('clickable')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  const mainVariants = {
    default: {
      x: mousePosition.x - 10,
      y: mousePosition.y - 10,
      scale: 1,
      backgroundColor: 'var(--orange-yellow-crayola)',
      opacity: 1
    },
    hover: {
      x: mousePosition.x - 10,
      y: mousePosition.y - 10,
      scale: 3.5,
      backgroundColor: 'var(--orange-yellow-crayola)',
      opacity: 0.5
    }
  };

  const orbVariants = {
    default: {
      x: mousePosition.x - 40,
      y: mousePosition.y - 40,
      scale: 1
    },
    hover: {
      x: mousePosition.x - 40,
      y: mousePosition.y - 40,
      scale: 1.5
    }
  };

  return (
    <>
      {/* Trailing Glowing Orb */}
      <motion.div
        variants={orbVariants}
        animate={isHovering ? "hover" : "default"}
        transition={{ type: 'spring', stiffness: 100, damping: 20, mass: 0.8 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'var(--text-gradient-yellow)',
          filter: 'blur(25px)',
          opacity: 0.6,
          pointerEvents: 'none',
          zIndex: 9998,
        }}
      />
      
      {/* Solid Main Ball */}
      <motion.div
        variants={mainVariants}
        animate={isHovering ? "hover" : "default"}
        transition={{ type: 'spring', stiffness: 500, damping: 28, mass: 0.5 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9999
        }}
        className="custom-cursor-ball"
      />
    </>
  );
};

export default CustomCursor;
