import React, { useState, useEffect } from 'react';

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
      { _id: '1', title: 'Design conferences in 2022', category: 'Design', date: 'Fab 23, 2022', text: 'Where visionaries converge to shape the future of design.', img: '/assets/images/blog-1.jpg', createdAt: new Date().toISOString() },
      { _id: '2', title: 'Best fonts every designer', category: 'Design', date: 'Fab 23, 2022', text: 'Elevating design with timeless typography that speaks volumes.', img: '/assets/images/blog-2.jpg', createdAt: new Date().toISOString() },
      { _id: '3', title: 'Design digest #80', category: 'Design', date: 'Fab 23, 2022', text: 'Design Digest #80 – Spacing: The invisible thread that weaves harmony into design.', img: '/assets/images/blog-3.jpg', createdAt: new Date().toISOString() },
      { _id: '4', title: 'UI interactions of the week', category: 'Design', date: 'Fab 23, 2022', text: 'Crafting moments of fluidity and engagement with every tap.', img: '/assets/images/blog-4.jpg', createdAt: new Date().toISOString() },
      { _id: '5', title: 'The forgotten art of spacing', category: 'Design', date: 'Fab 23, 2022', text: 'Spacing is the silent art that shapes clarity, balance, and harmony in design.', img: '/assets/images/blog-5.jpg', createdAt: new Date().toISOString() },
      { _id: '6', title: 'Design digest #79', category: 'Design', date: 'Fab 23, 2022', text: 'Issue #79 – Mastering the art of spacing: where design finds clarity and balance.', img: '/assets/images/blog-6.jpg', createdAt: new Date().toISOString() },
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
              <a href="#">
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
              </a>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
};

export default Blog;
