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
  return (
    <div className="container" style={{ padding: '0 24px 40px' }}>
      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        {/* News Grid */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="section-title">
            <span>Latest News</span>
            <Link href="/news/">View All News →</Link>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: 16,
          }}>
            {newsItems.map((item, i) => (
              <Link href="/news/" key={i} className="card" style={{ display: 'block' }}>
                <div style={{
                  height: 140,
                  background: `url(${item.image}) center/cover`,
                  position: 'relative',
                }}>
                  <span className={`tag ${item.tagColor}`} style={{
                    position: 'absolute',
                    bottom: 10,
                    left: 10,
                  }}>
                    {item.tag}
                  </span>
                </div>
                <div style={{ padding: 14 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 10, lineHeight: 1.4 }}>
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
        <div style={{ width: 280, flexShrink: 0 }}>
          <div className="card" style={{ padding: 24 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 12,
              background: 'var(--accent-light)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 24, marginBottom: 16,
            }}>
              📧
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>
              Stay Ahead in AI
            </h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>
              Get the best AI tools, tutorials & news in your inbox.
            </p>
            <input
              type="email"
              placeholder="Enter your email"
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 8,
                border: '1px solid var(--border)',
                fontSize: 13,
                marginBottom: 10,
                outline: 'none',
              }}
            />
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
