'use client';

import { useState } from 'react';

export default function NewsletterPopup() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [closed, setClosed] = useState(false);

  if (closed) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        backgroundColor: '#ffffff',
        border: '1px solid #e7e5e4',
        borderRadius: '16px',
        padding: '20px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.03)',
        width: '320px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Close Button */}
      <button
        onClick={() => setClosed(true)}
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: '#a8a29e',
          fontSize: '14px',
          fontWeight: '700',
        }}
        aria-label="Close Newsletter"
      >
        ✕
      </button>

      <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#1c1917', margin: '0 0 4px 0' }}>
        Newsletter
      </h4>
      <p style={{ fontSize: '13px', color: '#57534e', margin: '0 0 16px 0', lineHeight: '1.4' }}>
        New MCP servers, weekly.
      </p>

      {subscribed ? (
        <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d', padding: '10px 12px', borderRadius: '10px', fontSize: '12px', fontWeight: '700', textAlign: 'center' }}>
          ✓ Thanks for subscribing!
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px' }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            style={{
              flex: 1,
              padding: '10px 12px',
              borderRadius: '10px',
              border: '1px solid #e7e5e4',
              backgroundColor: '#faf8f5',
              fontSize: '13px',
              outline: 'none',
              color: '#1c1917',
            }}
          />
          <button
            type="submit"
            style={{
              backgroundColor: '#8b5cf6',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              padding: '10px 16px',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
          >
            Subscribe
          </button>
        </form>
      )}
    </div>
  );
}
