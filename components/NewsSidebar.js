'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function NewsSidebar({ articles = [] }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const latestArticles = articles.slice(0, 5);

  return (
    <aside style={{ width: '340px', flexShrink: 0, position: 'sticky', top: '24px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        {/* 1. MOST POPULAR LISTICLE */}
        <section style={{ position: 'relative', overflow: 'hidden', paddingRight: '16px' }}>
          <span style={{
            display: 'block',
            fontSize: '13px',
            fontWeight: '800',
            letterSpacing: '1px',
            color: '#6366f1',
            marginBottom: '16px',
            textTransform: 'uppercase'
          }}>
            MOST POPULAR
          </span>

          {/* Cyan Rotated Background Watermark */}
          <div 
            style={{
              position: 'absolute',
              right: '-40px',
              top: '50%',
              transform: 'translateY(-50%) rotate(90deg)',
              fontSize: '60px',
              fontWeight: '900',
              color: '#7fffd4',
              opacity: 0.5,
              pointerEvents: 'none',
              userSelect: 'none',
              whiteSpace: 'nowrap',
              zIndex: 0
            }}
            aria-hidden="true"
          >
            Most Popular
          </div>

          <ol style={{ position: 'relative', zIndex: 1, listStyle: 'none', padding: 0, margin: 0 }}>
            {latestArticles.map((item, index) => (
              <li 
                key={item.slug || index} 
                style={{
                  position: 'relative',
                  paddingLeft: '28px',
                  paddingBottom: '14px',
                  marginBottom: '14px',
                  borderBottom: '1px solid #e5e7eb'
                }}
              >
                <span style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  fontWeight: '800',
                  fontSize: '16px',
                  color: '#6366f1'
                }}>
                  {index + 1}.
                </span>
                <Link 
                  href={`/news-article/${item.slug}`} 
                  style={{
                    fontSize: '15px',
                    fontWeight: '700',
                    lineHeight: '1.35',
                    color: '#111827',
                    textDecoration: 'none'
                  }}
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ol>
        </section>

        {/* 2. MAIN PAGE MATCHING NEWSLETTER BOX */}
        <section style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
          overflow: 'hidden'
        }}>
          {/* Cyan Header Box */}
          <div style={{
            backgroundColor: '#00bcff',
            padding: '24px 20px',
            textAlign: 'center'
          }}>
            <h3 style={{
              margin: 0,
              fontSize: '22px',
              fontWeight: '800',
              color: '#ffffff',
              letterSpacing: '-0.3px'
            }}>
              Join the Newsletter
            </h3>
          </div>

          {/* Form Content Body */}
          <div style={{ padding: '20px' }}>
            <p style={{
              margin: '0 0 16px 0',
              fontSize: '14px',
              color: '#64748b',
              fontWeight: '500'
            }}>
              Subscribe for latest content
            </p>

            {subscribed ? (
              <div style={{
                backgroundColor: '#f0fdf4',
                color: '#16a34a',
                border: '1px solid #bbf7d0',
                padding: '12px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '600',
                textAlign: 'center'
              }}>
                ✓ Thanks for subscribing!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address" 
                  required 
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <button 
                  type="submit" 
                  style={{
                    width: 'fit-content',
                    padding: '10px 24px',
                    backgroundColor: '#00bcff',
                    color: '#ffffff',
                    fontWeight: '800',
                    fontSize: '13px',
                    letterSpacing: '0.5px',
                    border: 'none',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                    boxShadow: '0 2px 8px rgba(0, 188, 255, 0.3)'
                  }}
                >
                  SUBSCRIBE
                </button>
              </form>
            )}
          </div>
        </section>

      </div>
    </aside>
  );
}
