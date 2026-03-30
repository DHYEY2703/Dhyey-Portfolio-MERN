import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundManager } from '../utils/SoundManager';

interface Command {
  id: string;
  name: string;
  icon: string;
  action: () => void;
}

const CommandPalette: React.FC<{
  setActivePage: React.Dispatch<React.SetStateAction<string>>,
  setTheme: React.Dispatch<React.SetStateAction<string>>,
  setGameActive: React.Dispatch<React.SetStateAction<boolean>>
}> = ({ setActivePage, setTheme, setGameActive }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  const toggleCyberpunk = () => setTheme(prev => prev === 'cyberpunk' ? 'dark' : 'cyberpunk');

  const triggerDownload = () => {
    const a = document.createElement('a');
    a.href = '/assets/resume/DHYEY_MERN_RESUME.pdf';
    a.download = 'DHYEY_MERN_RESUME.pdf';
    a.click();
    setIsOpen(false);
  };

  const executeDestruction = () => {
    setIsOpen(false);
    setGameActive(true);
  };

  const commands: Command[] = [
    { id: '1', name: 'Navigate: About', icon: 'person-outline', action: () => { setActivePage('about'); setIsOpen(false); } },
    { id: '2', name: 'Navigate: Resume', icon: 'document-text-outline', action: () => { setActivePage('resume'); setIsOpen(false); } },
    { id: '3', name: 'Navigate: Portfolio', icon: 'briefcase-outline', action: () => { setActivePage('portfolio'); setIsOpen(false); } },
    { id: '4', name: 'Navigate: Blog', icon: 'newspaper-outline', action: () => { setActivePage('blog'); setIsOpen(false); } },
    { id: '5', name: 'Navigate: Contact', icon: 'mail-outline', action: () => { setActivePage('contact'); setIsOpen(false); } },
    { id: '6', name: 'System: Toggle Light/Dark Mode', icon: 'contrast-outline', action: () => { toggleTheme(); setIsOpen(false); } },
    { id: '7', name: 'System: Activate Cyberpunk Protocol', icon: 'terminal-outline', action: () => { toggleCyberpunk(); setIsOpen(false); } },
    { id: '8', name: 'Action: Download Resume (PDF)', icon: 'download-outline', action: triggerDownload },
    { id: '9', name: 'Action: Execute Destruction Protocol (Play)', icon: 'game-controller-outline', action: executeDestruction },
  ];

  const filteredCommands = query === '' 
    ? commands 
    : commands.filter(cmd => cmd.name.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K (Mac) or Ctrl+K (Windows)
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => {
          if (!prev) try { soundManager.playHover(); } catch(e) {}
          return !prev;
        });
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 999999, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: '15vh' }}>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)' }}
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            style={{
              width: '90%', maxWidth: '600px',
              background: 'var(--eerie-black-2)',
              border: '1px solid var(--jet)',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              position: 'relative',
              zIndex: 1
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', padding: '15px 20px', borderBottom: '1px solid var(--jet)' }}>
              {/*@ts-expect-error custom component*/}
              <ion-icon name="search-outline" style={{ fontSize: '20px', color: 'var(--orange-yellow-crayola)' }}></ion-icon>
              <input 
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command or search..."
                style={{
                  width: '100%', border: 'none', background: 'transparent', 
                  color: 'var(--white-2)', fontSize: '18px', padding: '0 15px', outline: 'none'
                }}
              />
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--light-gray)', background: 'var(--onyx)', border: '1px solid var(--jet)', padding: '4px 8px', borderRadius: '4px' }}>ESC</div>
            </div>

            <div style={{ maxHeight: '350px', overflowY: 'auto' }} className="has-scrollbar">
              {filteredCommands.length > 0 ? (
                <ul style={{ padding: '10px 0', margin: 0 }}>
                  {filteredCommands.map((cmd) => (
                    <li key={cmd.id}>
                      <button 
                        onClick={() => {
                          try { soundManager.playClick(); } catch(e) {}
                          cmd.action();
                        }}
                        style={{
                          width: '100%', display: 'flex', alignItems: 'center', gap: '15px', 
                          padding: '12px 20px', background: 'transparent', border: 'none', cursor: 'pointer',
                          color: 'var(--light-gray)', transition: '0.2s', textAlign: 'left'
                        }}
                        onMouseEnter={(e) => { 
                          e.currentTarget.style.background = 'var(--onyx)'; 
                          e.currentTarget.style.color = 'var(--orange-yellow-crayola)'; 
                          try { soundManager.playHover(); } catch(e) {}
                        }}
                        onMouseLeave={(e) => { 
                          e.currentTarget.style.background = 'transparent'; 
                          e.currentTarget.style.color = 'var(--light-gray)'; 
                        }}
                      >
                         {/*@ts-expect-error custom component*/}
                        <ion-icon name={cmd.icon} style={{ fontSize: '18px' }}></ion-icon>
                        <span style={{ fontSize: '15px', fontWeight: 500 }}>{cmd.name}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--light-gray)', fontSize: '15px' }}>
                  No commands found for "<span style={{color: 'var(--orange-yellow-crayola)'}}>{query}</span>"
                </div>
              )}
            </div>
            <div style={{ padding: '12px 20px', background: 'rgba(0,0,0,0.2)', borderTop: '1px solid var(--jet)', fontSize: '12px', color: 'var(--light-gray-70)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Use <strong>Ctrl + K</strong> to navigate seamlessly</span>
              <span style={{ fontFamily: 'monospace', letterSpacing: '1px', color: 'var(--orange-yellow-crayola)' }}>DHYEY_OS v3.0 // TERMINAL</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
