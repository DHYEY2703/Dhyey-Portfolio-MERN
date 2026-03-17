import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import About from './pages/About';
import Resume from './pages/Resume';
import Portfolio from './pages/Portfolio';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import Background3D from './components/Background3D';

function App() {
  const [activePage, setActivePage] = useState('about');

  return (
    <>
      <Background3D />
      <main>
        <Sidebar />
        <div className="main-content">
          <Navbar activePage={activePage} setActivePage={setActivePage} />
          {activePage === 'about' && <About />}
          {activePage === 'resume' && <Resume />}
          {activePage === 'portfolio' && <Portfolio />}
          {activePage === 'blog' && <Blog />}
          {activePage === 'contact' && <Contact />}
        </div>
      </main>
    </>
  );
}

export default App;
