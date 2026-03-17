import React from 'react';

const Blog: React.FC = () => {
  const posts = [
    { title: 'Design conferences in 2022', category: 'Design', date: 'Fab 23, 2022', text: 'Where visionaries converge to shape the future of design.', img: '/assets/images/blog-1.jpg' },
    { title: 'Best fonts every designer', category: 'Design', date: 'Fab 23, 2022', text: 'Elevating design with timeless typography that speaks volumes.', img: '/assets/images/blog-2.jpg' },
    { title: 'Design digest #80', category: 'Design', date: 'Fab 23, 2022', text: 'Design Digest #80 – Spacing: The invisible thread that weaves harmony into design.', img: '/assets/images/blog-3.jpg' },
    { title: 'UI interactions of the week', category: 'Design', date: 'Fab 23, 2022', text: 'Crafting moments of fluidity and engagement with every tap.', img: '/assets/images/blog-4.jpg' },
    { title: 'The forgotten art of spacing', category: 'Design', date: 'Fab 23, 2022', text: 'Spacing is the silent art that shapes clarity, balance, and harmony in design.', img: '/assets/images/blog-5.jpg' },
    { title: 'Design digest #79', category: 'Design', date: 'Fab 23, 2022', text: 'Issue #79 – Mastering the art of spacing: where design finds clarity and balance.', img: '/assets/images/blog-6.jpg' },
  ];

  return (
    <article className="blog active" data-page="blog">
      <header>
        <h2 className="h2 article-title">Blog</h2>
      </header>
      <section className="blog-posts">
        <ul className="blog-posts-list">
          {posts.map((post, index) => (
            <li className="blog-post-item" key={index}>
              <a href="#">
                <figure className="blog-banner-box">
                  <img src={post.img} alt={post.title} loading="lazy" />
                </figure>
                <div className="blog-content">
                  <div className="blog-meta">
                    <p className="blog-category">{post.category}</p>
                    <span className="dot"></span>
                    <time dateTime="2022-02-23">{post.date}</time>
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
