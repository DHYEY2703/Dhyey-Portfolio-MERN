import { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import About from './pages/About';
import Resume from './pages/Resume';
import Portfolio from './pages/Portfolio';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import Admin from './pages/Admin'; // Trigger TS server re-check

import Background3D from './components/Background3D';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import CustomCursor from './components/CustomCursor';
import FloatingContact from './components/FloatingContact';
import Loader from './components/Loader';
import { soundManager } from './utils/SoundManager';
import ChatbotWidget from './components/ChatbotWidget';
import confetti from 'canvas-confetti';
import { Helmet } from 'react-helmet-async';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activePage, setActivePage] = useState('about');
  const [theme, setTheme] = useState('dark');
  const keysRef = useRef('');

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

    // Easter Egg Konami Code ('dhyey')
    const handleKonami = (e: KeyboardEvent) => {
      keysRef.current += e.key.toLowerCase();
      if (keysRef.current.length > 10) keysRef.current = keysRef.current.slice(-10);
      
      if (keysRef.current.includes('dhyey')) {
        soundManager.playClick();
        confetti({
          particleCount: 200,
          spread: 100,
          origin: { y: 0.5 },
          colors: ['#fdbf5c', '#00ff88', '#ff0055', '#61dafb']
        });
        keysRef.current = '';
      }
    };
    window.addEventListener('keydown', handleKonami);

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
      window.removeEventListener('keydown', handleKonami);
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
      <FloatingContact />
      <ChatbotWidget setActivePage={setActivePage} />
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
