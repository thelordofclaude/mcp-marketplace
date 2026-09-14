import { useEffect } from 'react'
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
  useEffect(() => {
    // Load Kit script dynamically
    const script = document.createElement('script')
    script.src = 'https://lord-of-claude.kit.com/5f65768cbd/index.js'
    script.async = true
    script.setAttribute('data-uid', '5f65768cbd')
    
    const container = document.getElementById('kit-form-container')
    if (container && !container.hasChildNodes()) {
      container.appendChild(script)
    }
  }, [])

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
        <div style={{ width: 340, flexShrink: 0 }}>
          <div className="card" style={{ padding: 16, borderRadius: 12, minHeight: 280 }}>
            {/* Kit Script Render Target */}
            <div id="kit-form-container" />
          </div>
        </div>
      </div>
    </div>
  )
}
