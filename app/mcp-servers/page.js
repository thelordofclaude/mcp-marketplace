import Link from 'next/link'
import { getAllItems } from '../../lib/content'

export default function McpServersPage() {
  const items = getAllItems('mcp-servers') || []

  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 12 }}>⚡ MCP Servers</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          {items.length} verified Model Context Protocol integrations.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
        {items.map((item) => (
          <Link
            key={item.slug}
            href={`/mcp-server/${item.slug}/`}
            className="card"
            style={{ display: 'block', padding: 20, textDecoration: 'none', color: 'inherit' }}
          >
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{item.title || item.slug}</h3>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{item.meta_description || item.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
