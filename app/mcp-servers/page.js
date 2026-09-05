import Link from 'next/link'
import { getContentItems } from '../../lib/content'

export default function MCPServersPage() {
  const servers = getContentItems('mcp-servers')

  const categories = {}
  servers.forEach(s => {
    const cat = s.category || 'general'
    if (!categories[cat]) categories[cat] = []
    categories[cat].push(s)
  })

  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 12 }}>
          🔌 MCP Servers
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 16 }}>
          {servers.length} verified Model Context Protocol servers for Claude, Cursor, and AI agents.
        </p>
      </div>

      {/* Category Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
        <Link href="/mcp-servers/" className="btn btn-primary" style={{ fontSize: 13 }}>
          All ({servers.length})
        </Link>
        {Object.entries(categories).map(([cat, items]) => (
          <span key={cat} className="btn btn-outline" style={{ fontSize: 13 }}>
            {cat.charAt(0).toUpperCase() + cat.slice(1)} ({items.length})
          </span>
        ))}
      </div>

      {/* Card Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 20,
      }}>
        {servers.slice(0, 50).map(server => (
          <Link
            key={server.slug}
            href={`/mcp-server/${server.slug}/`}
            className="card"
            style={{ display: 'block', padding: 20 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10,
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20,
              }}>
                🔌
              </div>
              <span style={{ fontSize: 12, color: 'var(--accent-orange)', fontWeight: 600 }}>
                ⭐ {server.stars?.toLocaleString() || 0}
              </span>
            </div>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>{server.name || server.title}</h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 14 }}>
              {server.meta_description?.slice(0, 100)}...
            </p>
            <div style={{ display: 'flex', gap: 12, fontSize: 12, color: 'var(--text-muted)' }}>
              <span>🟦 {server.language || 'Unknown'}</span>
              <span>📁 {server.category || 'General'}</span>
            </div>
          </Link>
        ))}
      </div>

      {servers.length === 0 && (
        <div style={{ textAlign: 'center', padding: 80, color: 'var(--text-muted)' }}>
          <p style={{ fontSize: 18, marginBottom: 12 }}>📭 No MCP servers published yet</p>
          <p>The auto-publisher runs every Monday. Check back soon!</p>
        </div>
      )}
    </div>
  )
}
