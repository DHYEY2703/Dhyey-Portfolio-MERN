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
      { _id: '1', title: 'Design conferences in 2022', category: 'Design', date: 'Fab 23, 2022', text: 'Where visionaries converge to shape the future of design. Design conferences in 2022 brought together creative minds from across the globe to explore trends in user interface design, interaction patterns, and visual storytelling. From immersive workshops to keynote presentations, these events showcased how design thinking is transforming industries and shaping the digital landscape.', img: '/assets/images/blog-1.jpg', createdAt: new Date().toISOString() },
      { _id: '2', title: 'Best fonts every designer', category: 'Design', date: 'Fab 23, 2022', text: 'Elevating design with timeless typography that speaks volumes. The right font can make or break a design. From the elegance of serif fonts to the modern clarity of sans-serif families, typography choices influence readability, tone, and user experience. This article explores must-have fonts that every designer should consider in their toolkit.', img: '/assets/images/blog-2.jpg', createdAt: new Date().toISOString() },
      { _id: '3', title: 'Design digest #80', category: 'Design', date: 'Fab 23, 2022', text: 'Design Digest #80 – Spacing: The invisible thread that weaves harmony into design. Proper use of whitespace and spacing is one of the most underrated yet crucial aspects of design. This digest explores techniques for creating balanced layouts, improving visual hierarchy, and ensuring content breathability across all screen sizes.', img: '/assets/images/blog-3.jpg', createdAt: new Date().toISOString() },
      { _id: '4', title: 'UI interactions of the week', category: 'Design', date: 'Fab 23, 2022', text: 'Crafting moments of fluidity and engagement with every tap. This week\'s roundup of outstanding UI interactions showcases creative animations, micro-interactions, and gesture-based navigation patterns that push boundaries and elevate user engagement beyond static interfaces.', img: '/assets/images/blog-4.jpg', createdAt: new Date().toISOString() },
      { _id: '5', title: 'The forgotten art of spacing', category: 'Design', date: 'Fab 23, 2022', text: 'Spacing is the silent art that shapes clarity, balance, and harmony in design. Often overlooked, strategic spacing between elements determines the rhythm and flow of a page. This article dives deep into margin, padding, and gap strategies that separate good designs from truly great ones.', img: '/assets/images/blog-5.jpg', createdAt: new Date().toISOString() },
      { _id: '6', title: 'Design digest #79', category: 'Design', date: 'Fab 23, 2022', text: 'Issue #79 – Mastering the art of spacing: where design finds clarity and balance. Continuing our exploration of fundamental design principles, this issue covers practical examples, case studies, and expert insights into how spacing transforms user interfaces into polished, professional experiences.', img: '/assets/images/blog-6.jpg', createdAt: new Date().toISOString() },
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
