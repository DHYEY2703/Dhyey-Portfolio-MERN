import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FloatingContact: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 100 }}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            style={{
              position: 'absolute',
              bottom: '70px',
              right: '0',
              background: 'var(--eerie-black-2)',
              border: '1px solid var(--jet)',
              borderRadius: '16px',
              padding: '20px',
              width: '280px',
              boxShadow: 'var(--shadow-4)',
              display: 'flex',
              flexDirection: 'column',
              gap: '15px'
            }}
          >
            <h4 style={{ color: 'var(--white-2)', borderBottom: '1px solid var(--jet)', paddingBottom: '10px' }}>Quick Details</h4>
            
            <a href="mailto:dhyeybarbhaya@gmail.com" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--light-gray)' }}>
              <div style={{ background: 'var(--border-gradient-onyx)', padding: '8px', borderRadius: '8px', color: 'var(--orange-yellow-crayola)', display: 'flex' }}>
                {/*@ts-expect-error: ion-icon custom component*/}
                <ion-icon name="mail-outline"></ion-icon>
              </div>
              <span style={{ fontSize: '13px' }}>dhyeybarbhaya@gmail.com</span>
            </a>

            <a href="tel:+918347938469" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--light-gray)' }}>
              <div style={{ background: 'var(--border-gradient-onyx)', padding: '8px', borderRadius: '8px', color: 'var(--orange-yellow-crayola)', display: 'flex' }}>
                {/*@ts-expect-error: ion-icon custom component*/}
                <ion-icon name="call-outline"></ion-icon>
              </div>
              <span style={{ fontSize: '13px' }}>+91 8347938469</span>
            </a>

            <a href="https://github.com/DHYEY2703" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--light-gray)' }}>
              <div style={{ background: 'var(--border-gradient-onyx)', padding: '8px', borderRadius: '8px', color: 'var(--orange-yellow-crayola)', display: 'flex' }}>
                {/*@ts-expect-error: ion-icon custom component*/}
                <ion-icon name="logo-github"></ion-icon>
              </div>
              <span style={{ fontSize: '13px' }}>github.com/DHYEY2703</span>
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'var(--bg-gradient-yellow-1)',
          border: 'none',
          boxShadow: 'var(--shadow-2)',
          color: 'var(--smoky-black)',
          fontSize: '24px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer'
        }}
      >
        <motion.div
          animate={{ rotate: isOpen ? 135 : 0 }}
          transition={{ duration: 0.3 }}
          style={{ display: 'flex' }}
        >
          {/*@ts-expect-error: ion-icon custom component*/}
          <ion-icon name="chatbubble-ellipses-outline"></ion-icon>
        </motion.div>
      </motion.button>
    </div>
  );
};

export default FloatingContact;
