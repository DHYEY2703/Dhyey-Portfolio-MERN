import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import About from './pages/About';
import Resume from './pages/Resume';
import Portfolio from './pages/Portfolio';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import Admin from './pages/Admin'; // Trigger TS server re-check

import Background3D from './components/Background3D';
import { Toaster, toast } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import CustomCursor from './components/CustomCursor';
import FloatingContact from './components/FloatingContact';
import Loader from './components/Loader';
import { soundManager } from './utils/SoundManager';
import ChatbotWidget from './components/ChatbotWidget';
import CommandPalette from './components/CommandPalette';
import confetti from 'canvas-confetti';
import { Helmet } from 'react-helmet-async';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activePage, setActivePage] = useState('about');
  const [theme, setTheme] = useState('dark');

  // Track Unique Visitor Session
  useEffect(() => {
    const trackVisitor = async () => {
      // Prevent tracking if we already logged them this session
      if (sessionStorage.getItem('visited')) return;
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        await fetch(`${API_URL}/api/visitors`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userAgent: navigator.userAgent })
        });
        sessionStorage.setItem('visited', 'true');
      } catch (err) {
        console.error('Failed to log visit', err);
      }
    };
    // Add small delay to let splash screen load first
    setTimeout(trackVisitor, 2000); 
  }, []);

  // --- EASTER EGG: Premium Fireworks & Custom Toast ---
  const executeEasterEgg = () => {
    // 1. Premium Fireworks Confetti
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 99999 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);

    // 2. Play a premium success sound
    try { soundManager.playClick(); } catch (e) {}

    // 3. Luxurious Custom Toast Notification
    toast.custom(() => (
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9, y: -20 }}
        style={{
          background: 'linear-gradient(135deg, rgba(30,30,30,0.95) 0%, rgba(15,15,15,0.98) 100%)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,165,0,0.4)', // Warm orange border
          padding: '20px 30px',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          boxShadow: '0 10px 40px rgba(255,165,0,0.15)'
        }}
      >
        <div style={{ fontSize: '32px', filter: 'drop-shadow(0 0 10px rgba(255,165,0,0.8))' }}>💎</div>
        <div>
          <h4 style={{ margin: 0, color: 'var(--white-1)', fontSize: '18px', fontWeight: 600 }}>Secret Unlocked!</h4>
          <p style={{ margin: '5px 0 0 0', color: 'var(--light-gray)', fontSize: '14px' }}>
            You discovered the <span style={{color: 'var(--orange-yellow-crayola)'}}>Elite Visitor Badge</span>.
          </p>
        </div>
      </motion.div>
    ), { duration: 5000 });

    localStorage.setItem('elite_visitor', 'true');
  };

  // Listen to hash changes for Admin panel
  const [isAdmin, setIsAdmin] = useState(window.location.hash === '#admin');

  useEffect(() => {
    const handleHashChange = () => setIsAdmin(window.location.hash === '#admin');
    window.addEventListener('hashchange', handleHashChange);

    // Auto-start ambient music on first user interaction anywhere on the document
    const startAmbientMusic = () => {
      soundManager.init();
      soundManager.playAmbientMusic();
      // Remove listeners once it's started
      window.removeEventListener('click', startAmbientMusic);
      window.removeEventListener('keydown', startAmbientMusic);
      window.removeEventListener('touchstart', startAmbientMusic);
      window.removeEventListener('mousemove', startAmbientMusic);
    };



    window.addEventListener('click', startAmbientMusic, { once: true });
    window.addEventListener('keydown', startAmbientMusic, { once: true });
    window.addEventListener('touchstart', startAmbientMusic, { once: true });
    window.addEventListener('mousemove', startAmbientMusic, { once: true });

    // Global sound effects listener
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('clickable')
      ) {
        soundManager.playHover();
      }
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Don't play click on the very first "Enter" to avoid overlapping contexts
      if (!showSplash && (target.tagName.toLowerCase() === 'a' ||
          target.tagName.toLowerCase() === 'button' ||
          target.closest('a') ||
          target.closest('button') ||
          target.classList.contains('clickable'))) {
        soundManager.playClick();
      }
    };

    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('click', startAmbientMusic);
      window.removeEventListener('keydown', startAmbientMusic);
      window.removeEventListener('touchstart', startAmbientMusic);
      window.removeEventListener('mousemove', startAmbientMusic);
    };
  }, [showSplash]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  if (isAdmin) {
    return <Admin />;
  }

  const handleEnterExperience = () => {
    soundManager.init();
    soundManager.playClick();
    setShowSplash(false);
  };

  return (
    <>
      <Helmet>
        <title>Dhyey Barbhaya | Full Stack Developer</title>
        <meta name="description" content="Portfolio of Dhyey Barbhaya. I specialize in the MERN stack, AI integration, and scalable web apps." />
        <meta property="og:title" content="Dhyey Barbhaya Portfolio" />
        <meta property="og:description" content="Discover my latest projects in React, Node.js, AI, and comprehensive MERN Stack architectures." />
        <meta property="og:url" content="https://dhyeybarbhaya.com" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <CustomCursor />
      <Toaster position="top-right" />
      <CommandPalette setActivePage={setActivePage} setTheme={setTheme} />
      {!isAdmin && <FloatingContact />}

      {/* EASTER EGG: The Secret Hidden Spot */}
      <div 
        onClick={executeEasterEgg}
        title="???"
        style={{
          position: 'fixed',
          bottom: '25px',
          right: '85px',
          width: '20px',
          height: '20px',
          opacity: 0.01, // Invisible
          cursor: 'crosshair', // Tiny visual hint
          zIndex: 9999,
          borderRadius: '50%'
        }}
      />
      <ChatbotWidget setActivePage={setActivePage} setTheme={setTheme} />
      <AnimatePresence>
        {showSplash && <Loader onComplete={handleEnterExperience} />}
      </AnimatePresence>
      <Background3D theme={theme} />
      <main>
        <Sidebar toggleTheme={toggleTheme} theme={theme} />
        <div className="main-content">
          <Navbar activePage={activePage} setActivePage={setActivePage} />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activePage === 'about' && <About />}
              {activePage === 'resume' && <Resume />}
              {activePage === 'portfolio' && <Portfolio />}
              {activePage === 'blog' && <Blog />}
              {activePage === 'contact' && <Contact />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </>
  );
}

export default App;
