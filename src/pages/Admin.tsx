import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

interface Message {
  _id: string;
  fullname: string;
  email: string;
  message: string;
  createdAt: string;
}

const Admin: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'dhyey@admin123') { // Simple password logic
      setIsAuthenticated(true);
      fetchMessages();
      toast.success('Welcome back, Dhyey!');
    } else {
      toast.error('Incorrect password');
    }
  };

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${API_URL}/api/messages`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      } else {
        toast.error('Failed to fetch messages');
      }
    } catch {
      toast.error('Server offline');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--smoky-black)', color: 'white' }}>
        <Toaster />
        <article className="contact active" style={{ maxWidth: '400px', width: '100%' }}>
          <header>
            <h2 className="h2 article-title">Admin Login</h2>
          </header>
          <form className="form" onSubmit={handleLogin}>
            <input 
              type="password" 
              className="form-input" 
              placeholder="Enter Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
            <button className="form-btn" type="submit">
              <span>Login</span>
            </button>
            <a href="#" onClick={() => window.location.hash = ''} style={{marginTop: '15px', display: 'block', color: 'var(--orange-yellow-crayola)'}}>← Back to Portfolio</a>
          </form>
        </article>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto', color: 'var(--white-2)' }}>
      <Toaster />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 className="h2 pb-2 border-b border-gray-700">Inbox Dashboard</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={fetchMessages} className="form-btn" style={{ padding: '8px 15px', fontSize: '13px' }}>
            <span>Refresh</span>
          </button>
          <button onClick={() => window.location.hash = ''} className="form-btn" style={{ padding: '8px 15px', fontSize: '13px', background: 'var(--onyx)' }}>
            <span>Exit Admin</span>
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading messages...</p>
      ) : messages.length === 0 ? (
        <p>No messages yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {messages.map((msg) => (
            <div key={msg._id} className="content-card" style={{ cursor: 'default' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap' }}>
                <h4 className="h4">{msg.fullname}</h4>
                <time style={{ color: 'var(--light-gray-70)' }}>{new Date(msg.createdAt).toLocaleString()}</time>
              </div>
              <a href={`mailto:${msg.email}`} style={{ color: 'var(--orange-yellow-crayola)', marginBottom: '15px', display: 'inline-block' }}>{msg.email}</a>
              <p style={{ color: 'var(--light-gray)', lineHeight: '1.6', background: 'var(--eerie-black-1)', padding: '15px', borderRadius: '8px' }}>
                {msg.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Admin;
