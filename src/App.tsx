import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import About from './pages/About';
import Resume from './pages/Resume';
import Portfolio from './pages/Portfolio';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import Background3D from './components/Background3D';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import CustomCursor from './components/CustomCursor';
import FloatingContact from './components/FloatingContact';
import Loader from './components/Loader';
import { soundManager } from './utils/SoundManager';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activePage, setActivePage] = useState('about');
  const [theme, setTheme] = useState('dark');

  // Listen to hash changes for Admin panel
  const [isAdmin, setIsAdmin] = useState(window.location.hash === '#admin');

  useEffect(() => {
    const handleHashChange = () => setIsAdmin(window.location.hash === '#admin');
    window.addEventListener('hashchange', handleHashChange);

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
      <CustomCursor />
      <Toaster position="top-right" />
      <FloatingContact />
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
