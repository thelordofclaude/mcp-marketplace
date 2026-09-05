'use client'
import { useState } from 'react'

export default function SearchBar({ placeholder = "Claude skills, MCP servers, plugins, tools, and more..." }) {
  const [query, setQuery] = useState('')

  return (
    <div className="container" style={{ padding: '24px 24px 0' }}>
      <div style={{
        maxWidth: 700,
        margin: '0 auto',
        position: 'relative',
      }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          style={{
            width: '100%',
            padding: '16px 24px 16px 52px',
            borderRadius: 50,
            border: '1px solid var(--border)',
            background: 'var(--bg)',
            color: 'var(--text-primary)',
            fontSize: 15,
            outline: 'none',
            boxShadow: 'var(--shadow)',
            transition: 'all 0.2s',
          }}
          onFocus={(e) => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px rgba(236,72,153,0.15)' }}
          onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'var(--shadow)' }}
        />
        <span style={{
          position: 'absolute',
          left: 20,
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: 18,
          opacity: 0.4,
        }}>🔍</span>
        <button style={{
          position: 'absolute',
          right: 6,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 40,
          height: 40,
          borderRadius: '50%',
          background: 'var(--accent)',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 16,
        }}>
          →
        </button>
      </div>
    </div>
  )
}
