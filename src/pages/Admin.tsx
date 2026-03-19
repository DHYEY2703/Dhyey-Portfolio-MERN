import React, { useState, useEffect, type FormEvent } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { io, Socket } from 'socket.io-client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

interface Message {
  _id: string;
  fullname: string;
  email: string;
  message: string;
  createdAt: string;
}

const mockAnalyticsData = [
  { name: 'Mon', visitors: 120 },
  { name: 'Tue', visitors: 200 },
  { name: 'Wed', visitors: 150 },
  { name: 'Thu', visitors: 280 },
  { name: 'Fri', visitors: 300 },
  { name: 'Sat', visitors: 450 },
  { name: 'Sun', visitors: 400 },
];

const Admin: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [newBlog, setNewBlog] = useState({ title: '', category: '', text: '', img: '' });
  const [isSubmittingBlog, setIsSubmittingBlog] = useState(false);
  const [password, setPassword] = useState('');
  const [token, setToken] = useState<string | null>(localStorage.getItem('adminToken'));
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('adminToken'));
  const [loading, setLoading] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<any[]>(mockAnalyticsData);

  useEffect(() => {
    let newSocket: Socket | null = null;
    if (isAuthenticated && token) {
      fetchMessages();
      fetchBlogs();
      fetchAnalytics();

      // Connect WebSocket
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      newSocket = io(API_URL);

      // Listen for Live Messages
      newSocket.on('new_message', (msg: Message) => {
        toast.success(`New Message from ${msg.fullname}!`, { icon: '📩', duration: 5000 });
        setMessages((prev) => [msg, ...prev]);
        
        // Play notification sound if possible
        try {
          const audio = new Audio('/assets/notification.mp3');
          audio.play().catch(e => console.log('Audio autoplay blocked', e));
        } catch (e) {}
      });
    }

    return () => {
      if (newSocket) newSocket.disconnect();
    };
  }, [isAuthenticated, token]);

  const fetchAnalytics = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${API_URL}/api/visitors/analytics`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAnalyticsData(data);
      }
    } catch {
      console.error('Failed to fetch analytics');
    }
  };

  const fetchBlogs = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${API_URL}/api/blogs`);
      if (res.ok) {
        const data = await res.json();
        setBlogs(data);
      }
    } catch {
      console.error('Failed to fetch blogs');
    }
  };

  const handleBlogSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmittingBlog(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${API_URL}/api/blogs`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newBlog)
      });
      if (res.ok) {
        toast.success('Blog published successfully!');
        setNewBlog({ title: '', category: '', text: '', img: '' });
        fetchBlogs();
      } else {
        toast.error('Failed to publish blog (Unauthorized)');
      }
    } catch {
      toast.error('Server offline');
    } finally {
      setIsSubmittingBlog(false);
    }
  };

  const deleteBlog = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${API_URL}/api/blogs/${id}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success('Blog deleted');
        fetchBlogs();
      } else {
        toast.error('Failed to delete blog');
      }
    } catch {
      toast.error('Server offline');
    }
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      
      if (res.ok && data.token) {
        localStorage.setItem('adminToken', data.token);
        setToken(data.token);
        setIsAuthenticated(true);
        toast.success('Welcome back, Dhyey!');
      } else {
        toast.error('Incorrect password');
      }
    } catch {
      toast.error('Server offline');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setToken(null);
    setIsAuthenticated(false);
  };

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${API_URL}/api/messages`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      } else {
        if (res.status === 401) handleLogout();
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
          <button onClick={() => { fetchMessages(); fetchBlogs(); }} className="form-btn" style={{ padding: '8px 15px', fontSize: '13px' }}>
            <span>Refresh</span>
          </button>
          <button onClick={() => window.location.hash = ''} className="form-btn" style={{ padding: '8px 15px', fontSize: '13px', background: 'var(--onyx)' }}>
            <span>Exit Admin</span>
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading messages...</p>
      ) : (
        <>
          <div className="content-card" style={{ marginBottom: '30px', padding: '20px' }}>
            <h3 className="h3" style={{ marginBottom: '20px', color: 'var(--orange-yellow-crayola)' }}>Visitor Analytics (Last 7 Days)</h3>
            <div style={{ width: '100%', height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analyticsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="name" stroke="#888" />
                  <YAxis stroke="#888" />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'var(--eerie-black-1)', border: '1px solid var(--jet)', borderRadius: '8px' }}
                    itemStyle={{ color: '#fdbf5c' }}
                  />
                  <Line type="monotone" dataKey="visitors" stroke="#fdbf5c" strokeWidth={3} dot={{ fill: '#00ff88', r: 5 }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <h3 className="h3" style={{ marginBottom: '20px', borderBottom: '1px solid var(--jet)', paddingBottom: '10px' }}>Recent Messages</h3>
          {messages.length === 0 ? (
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
          
          <h3 className="h3" style={{ marginBottom: '20px', marginTop: '40px', borderBottom: '1px solid var(--jet)', paddingBottom: '10px', color: '#00ff88' }}>Blog Content Management (CMS)</h3>
          
          <div className="content-card" style={{ marginBottom: '30px' }}>
            <h4 className="h4" style={{ marginBottom: '15px' }}>Draft New Article</h4>
            <form className="form" onSubmit={handleBlogSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input type="text" className="form-input" placeholder="Blog Title" value={newBlog.title} onChange={e => setNewBlog({...newBlog, title: e.target.value})} required />
              <input type="text" className="form-input" placeholder="Category (e.g. Design, Tech)" value={newBlog.category} onChange={e => setNewBlog({...newBlog, category: e.target.value})} required />
              <input type="text" className="form-input" placeholder="Cover Image Path (e.g. /assets/images/blog-1.jpg)" value={newBlog.img} onChange={e => setNewBlog({...newBlog, img: e.target.value})} required />
              <textarea className="form-input" placeholder="Article Content..." value={newBlog.text} onChange={e => setNewBlog({...newBlog, text: e.target.value})} required style={{ minHeight: '100px' }}></textarea>
              <button className="form-btn" type="submit" disabled={isSubmittingBlog}>
                <span>{isSubmittingBlog ? 'Publishing...' : 'Publish Article'}</span>
              </button>
            </form>
          </div>

          <h4 className="h4" style={{ marginBottom: '15px' }}>Manage Existing Articles</h4>
          {blogs.length === 0 ? (
            <p>No published articles found.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {blogs.map((blog) => (
                <div key={blog._id} className="content-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h5 className="h4" style={{ fontSize: '16px', marginBottom: '5px' }}>{blog.title}</h5>
                    <p style={{ fontSize: '13px', color: 'var(--orange-yellow-crayola)' }}>{blog.category} • {new Date(blog.createdAt).toLocaleDateString()}</p>
                  </div>
                  <button onClick={() => deleteBlog(blog._id)} style={{ background: 'rgba(255,0,0,0.1)', color: '#ff4d4d', border: '1px solid #ff4d4d', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer' }}>
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Admin;
