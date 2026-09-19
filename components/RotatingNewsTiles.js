'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function RotatingNewsTiles({ articles }) {
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    if (!articles || articles.length <= 3) return;
    const timer = setInterval(() => {
      setStartIndex((prev) => (prev + 1) % articles.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [articles]);

  if (!articles || articles.length === 0) return null;

  // Grab up to 3 visible items with wrap-around
  const visibleArticles = [];
  for (let i = 0; i < Math.min(3, articles.length); i++) {
    const idx = (startIndex + i) % articles.length;
    visibleArticles.push(articles[idx]);
  }

  return (
    <div
      style={{
        marginTop: '48px',
        marginBottom: '32px',
        padding: '24px',
        backgroundColor: '#fbfbfe',
        border: '1px solid #ede9fe',
        borderRadius: '20px',
        boxShadow: '0 4px 12px rgba(124, 58, 237, 0.04)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '18px' }}>⚡</span>
          <h4
            style={{
              fontSize: '15px',
              fontWeight: '800',
              color: '#6d28d9',
              margin: 0,
              letterSpacing: '0.02em',
              textTransform: 'uppercase',
            }}
          >
            Latest Stories You Might Have Missed
          </h4>
        </div>
        {articles.length > 3 && (
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => setStartIndex((prev) => (prev === 0 ? articles.length - 1 : prev - 1))}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: '1px solid #ddd6fe',
                backgroundColor: '#ffffff',
                cursor: 'pointer',
                fontWeight: 'bold',
                color: '#6d28d9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ‹
            </button>
            <button
              onClick={() => setStartIndex((prev) => (prev + 1) % articles.length)}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: '1px solid #ddd6fe',
                backgroundColor: '#ffffff',
                cursor: 'pointer',
                fontWeight: 'bold',
                color: '#6d28d9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ›
            </button>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        {visibleArticles.map((art, idx) => (
          <Link key={idx} href={`/news-article/${art.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #f3e8ff',
                borderRadius: '14px',
                padding: '16px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between',
                transition: 'border-color 0.2s ease, transform 0.2s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: '800',
                    color: '#7c3aed',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    display: 'block',
                    marginBottom: '6px',
                  }}
                >
                  {art.category || 'AI Update'}
                </span>
                <h5
                  style={{
                    fontSize: '14px',
                    fontWeight: '700',
                    color: '#0f172a',
                    margin: '0 0 8px 0',
                    lineHeight: '1.35',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {art.title}
                </h5>
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '12px' }}>
                🗓️ {art.published_at ? String(art.published_at).split('T')[0] : 'Recent'}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
