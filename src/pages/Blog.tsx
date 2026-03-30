import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BlogPost {
  _id: string;
  title: string;
  category: string;
  date: string;
  text: string;
  img: string;
  createdAt: string;
}

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await fetch(`${API_URL}/api/blogs`);
        if (!res.ok) throw new Error('Failed to fetch blogs');
        const data = await res.json();
        
        if (data.length > 0) {
          setPosts(data);
        } else {
          loadFallback();
        }
      } catch (err) {
        console.error('Failed to load blogs', err);
        loadFallback();
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const loadFallback = () => {
    setPosts([
      { _id: '1', title: 'Dockerizing a full MERN architecture from scratch', category: 'DevOps', date: 'Oct 12, 2024', text: 'To achieve true production readiness, hardcoding localhost configs just doesn\'t cut it. In this deep dive, we explore how to seamlessly containerize an Express API, a React frontend, and a MongoDB instance using Docker Compose. We\'ll look at creating multi-stage Dockerfiles for minimal image sizes, managing environment variables securely, and configuring Nginx as a reverse proxy to route traffic intelligently between containers.', img: '/assets/images/blog-1.jpg', createdAt: '2024-10-12T10:00:00.000Z' },
      { _id: '2', title: 'Building Autonomous AI Voice Assistants with Gemini', category: 'AI Integration', date: 'Jan 04, 2025', text: 'Large Language Models are evolving past text generation. By wiring the Google Gemini API to the browser\'s native Web Speech Recognition APIs, we can create persistent, hands-free AI assistants. We break down the exact architecture needed to stream SSE byte chunks directly into the SpeechSynthesis engine for zero-latency audible AI responses, and how to program the LLM to autonomously control React Router UI states.', img: '/assets/images/blog-2.jpg', createdAt: '2025-01-04T14:30:00.000Z' },
      { _id: '3', title: 'Scaling WebSockets for real-time dashboards', category: 'Backend', date: 'Nov 28, 2024', text: 'When HTTP polling becomes an expensive bottleneck, WebSockets act as the saving grace for real-time data streaming. This post details how to integrate Socket.IO tightly with an Express/Node.js backend to power live notification systems and dynamic data pipelines. We also cover load-balancing WebSocket connections using Redis adapters so your real-time data survives across multiple server instances.', img: '/assets/images/blog-3.jpg', createdAt: '2024-11-28T09:15:00.000Z' },
      { _id: '4', title: 'Securing REST APIs with Advanced JWT Strategies', category: 'Security', date: 'Aug 19, 2024', text: 'Authentication is notoriously easy to get wrong. Relying on simple localStorage tokens opens the door to cross-site scripting (XSS) attacks. Here, we outline the industry standard approach: using HttpOnly, Secure, SameSite cookies to store JSON Web Tokens. We also implement refreshing token lifecycles and strictly strictly-typed Role-Based Access Control (RBAC) middleware for Express routes to protect administrative endpoints.', img: '/assets/images/blog-4.jpg', createdAt: '2024-08-19T11:45:00.000Z' },
      { _id: '5', title: 'Mastering Framer Motion Physics in React', category: 'Frontend', date: 'Dec 15, 2024', text: 'CSS transitions are great, but for truly organic, "God-Tier" UI experiences, we need physics-based animations. Framer Motion fundamentally changes how React elements enter and exit the DOM. We\'ll write custom stagger orchestration loops, animate shared layout identifiers between routing changes, and use spring dynamics (stiffness & damping) to make interactive elements feel heavy, grounded, and physically realistic.', img: '/assets/images/blog-5.jpg', createdAt: '2024-12-15T16:20:00.000Z' },
      { _id: '6', title: 'Schema Design Patterns in MongoDB', category: 'Database', date: 'July 02, 2024', text: 'Document databases offer incredible flexibility, but poor schema design will inevitably lead to memory crashes and incredibly slow queries at scale. Should you embed or reference? We explore the One-to-Few, One-to-Many, and One-to-Squillions modeling patterns. Learning when to denormalize your document data and how to correctly use deeply nested compound indexes makes the difference between a sluggish app and a lightning-fast one.', img: '/assets/images/blog-6.jpg', createdAt: '2024-07-02T08:00:00.000Z' },
    ]);
  };

  return (
    <article className="blog active" data-page="blog">
      <header>
        <h2 className="h2 article-title">Blog</h2>
      </header>
      <section className="blog-posts">
        {loading && <p style={{ color: 'var(--light-gray)' }}>Loading articles...</p>}
        <ul className="blog-posts-list">
          {posts.map((post) => (
            <li className="blog-post-item" key={post._id}>
              <div onClick={() => setSelectedPost(post)} style={{ cursor: 'pointer' }}>
                <figure className="blog-banner-box">
                  <img src={post.img} alt={post.title} loading="lazy" />
                </figure>
                <div className="blog-content">
                  <div className="blog-meta">
                    <p className="blog-category">{post.category}</p>
                    <span className="dot"></span>
                    <time dateTime={new Date(post.createdAt).toISOString().split('T')[0]}>
                      {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </time>
                  </div>
                  <h3 className="h3 blog-item-title">{post.title}</h3>
                  <p className="blog-text">
                    {post.text}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Blog Detail Modal */}
      <AnimatePresence>
        {selectedPost && (
          <div className="modal-container active" style={{ zIndex: 1000, pointerEvents: 'all' }}>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              exit={{ opacity: 0 }}
              className="overlay active" 
              onClick={() => setSelectedPost(null)} 
            ></motion.div>
            
            <motion.section 
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{
                position: 'fixed',
                top: 0,
                right: 0,
                width: '100%',
                maxWidth: '550px',
                height: '100vh',
                background: 'var(--eerie-black-2)',
                borderLeft: '1px solid var(--jet)',
                padding: '30px',
                zIndex: 1001,
                overflowY: 'auto',
                boxShadow: 'var(--shadow-5)'
              }}
            >
              <button 
                onClick={() => setSelectedPost(null)}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: 'var(--onyx)',
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  border: 'none',
                  color: 'var(--orange-yellow-crayola)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer'
                }}
              >
                {/*@ts-expect-error: ion-icon custom component*/}
                <ion-icon name="close-outline" style={{ fontSize: '24px' }}></ion-icon>
              </button>

              <div style={{ marginTop: '40px' }}>
                <figure style={{ borderRadius: '16px', overflow: 'hidden', marginBottom: '20px', boxShadow: 'var(--shadow-2)' }}>
                  <img src={selectedPost.img} alt={selectedPost.title} style={{ width: '100%', height: 'auto', objectFit: 'cover' }} />
                </figure>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <span style={{ color: 'var(--orange-yellow-crayola)', fontSize: '13px', background: 'hsla(45, 100%, 72%, 0.1)', padding: '4px 12px', borderRadius: '20px' }}>{selectedPost.category}</span>
                  <time style={{ color: 'var(--light-gray)', fontSize: '13px' }} dateTime={new Date(selectedPost.createdAt).toISOString().split('T')[0]}>
                    {new Date(selectedPost.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </time>
                </div>

                <h3 className="h2" style={{ color: 'var(--white-2)', marginBottom: '20px' }}>{selectedPost.title}</h3>
                
                <p style={{ color: 'var(--light-gray)', lineHeight: '1.8', fontSize: '15px' }}>
                  {selectedPost.text}
                </p>
              </div>
            </motion.section>
          </div>
        )}
      </AnimatePresence>
    </article>
  );
};

export default Blog;
