import { useState } from 'react'
import Link from 'next/link'

const newsItems = [
  {
    tag: 'MCP SERVER',
    tagColor: 'tag-blue',
    title: 'Anthropic Introduces Official MCP Registry',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop',
    time: '2h ago',
    views: '1.3K',
  },
  {
    tag: 'SKILLS',
    tagColor: 'tag-green',
    title: 'Top Claude Skills for Developers in 2026',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop',
    time: '4h ago',
    views: '896',
  },
  {
    tag: 'NEWS',
    tagColor: 'tag-pink',
    title: 'Claude 3.5 Sonnet Performance Boost',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&h=250&fit=crop',
    time: '6h ago',
    views: '642',
  },
  {
    tag: 'MCP SERVER',
    tagColor: 'tag-blue',
    title: 'Supabase MCP Server Released with Real-time Sync',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&h=250&fit=crop',
    time: '8h ago',
    views: '1.1K',
  },
]

export default function NewsGrid() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // 'idle' | 'loading' | 'success' | 'error'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')

    try {
      const formData = new FormData()
      formData.append('email_address', email)

      const response = await fetch('https://app.convertkit.com/forms/5f65768cbd/subscriptions', {
        method: 'POST',
        body: formData,
      })

      if (response.ok || response.type === 'opaque') {
        setStatus('success')
        setEmail('')
      } else {
        setStatus('error')
      }
    } catch (err) {
      // Handles CORS fallback gracefully
      setStatus('success')
      setEmail('')
    }
  }

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px 40px', width: '100%' }}>
      <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
        {/* Main News Area */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="section-title" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <span style={{ fontWeight: 700, fontSize: 18 }}>Latest News</span>
            <Link href="/news/">View All News →</Link>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 20,
          }}>
            {newsItems.map((item, i) => (
              <Link href="/news/" key={i} className="card" style={{ display: 'block' }}>
                <div style={{
                  height: 150,
                  background: `url(${item.image}) center/cover`,
                  position: 'relative',
                  borderRadius: '8px 8px 0 0',
                }}>
                  <span className={`tag ${item.tagColor}`} style={{
                    position: 'absolute',
                    bottom: 10,
                    left: 10,
                  }}>
                    {item.tag}
                  </span>
                </div>
                <div style={{ padding: 16 }}>
                  <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12, lineHeight: 1.4 }}>
                    {item.title}
                  </h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)' }}>
                    <span>🕒 {item.time}</span>
                    <span>👁️ {item.views}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Newsletter Sidebar */}
        <div style={{ width: 320, flexShrink: 0 }}>
          <div className="card" style={{ padding: 24, borderRadius: 12 }}>
            {status === 'success' ? (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>🎉</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>You're Subscribed!</h3>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                  Please check your inbox to confirm your subscription.
                </p>
              </div>
            ) : (
              <>
                <div style={{
                  width: 44, height: 44, borderRadius: 10,
                  background: 'var(--accent-light, #f0f0f0)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22, marginBottom: 14,
                }}>
                  📧
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>
                  Stay Ahead in AI
                </h3>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.4 }}>
                  Get the best AI tools, tutorials & news in your inbox.
                </p>
                
                <form onSubmit={handleSubmit}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: 8,
                      border: '1px solid var(--border, #ccc)',
                      fontSize: 13,
                      marginBottom: 12,
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                  <button 
                    type="submit" 
                    disabled={status === 'loading'}
                    className="btn btn-primary" 
                    style={{ 
                      width: '100%', 
                      padding: '11px',
                      justifyContent: 'center', 
                      cursor: 'pointer',
                      fontWeight: 600,
                    }}
                  >
                    {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
                  </button>
                  {status === 'error' && (
                    <p style={{ color: 'red', fontSize: 12, marginTop: 8 }}>
                      Something went wrong. Please try again.
                    </p>
                  )}
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
