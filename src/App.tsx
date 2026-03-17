import { useState } from 'react';
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

function App() {
  const [activePage, setActivePage] = useState('about');
  const [theme, setTheme] = useState('dark');

  // Listen to hash changes for Admin panel
  const [isAdmin, setIsAdmin] = React.useState(window.location.hash === '#admin');

  React.useEffect(() => {
    const handleHashChange = () => setIsAdmin(window.location.hash === '#admin');
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  if (isAdmin) {
    return <Admin />;
  }

  return (
    <>
      <Toaster position="top-right" />
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
