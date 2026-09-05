import Link from 'next/link'

const featured = [
  { name: 'Context7', type: 'MCP Server', icon: '🔷', color: '#4f46e5' },
  { name: 'Brave Search', type: 'MCP Server', icon: '🦁', color: '#f97316' },
  { name: 'GitHub', type: 'MCP Server', icon: '🐙', color: '#111827' },
  { name: 'Supabase', type: 'MCP Server', icon: '⚡', color: '#10b981' },
  { name: 'Notion', type: 'MCP Server', icon: '📝', color: '#000000' },
  { name: 'Anthropic', type: 'Claude Skill', icon: '🅰️', color: '#d97706' },
]

export default function FeaturedBar() {
  return (
    <div className="container" style={{ padding: '20px 24px' }}>
      <div style={{
        display: 'flex',
        gap: 12,
        overflowX: 'auto',
        paddingBottom: 8,
        scrollbarWidth: 'none',
      }}>
        {featured.map(item => (
          <Link
            key={item.name}
            href={`/mcp-servers/`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 16px',
              borderRadius: 10,
              border: '1px solid var(--border)',
              background: 'var(--bg)',
              minWidth: 'fit-content',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = item.color; e.currentTarget.style.boxShadow = `0 2px 8px ${item.color}20` }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none' }}
          >
            <span style={{ fontSize: 20 }}>{item.icon}</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{item.name}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.type}</div>
            </div>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 4 }}>↗</span>
          </Link>
        ))}
        <button style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '10px 16px',
          borderRadius: 10,
          border: '1px dashed var(--border)',
          background: 'var(--surface)',
          color: 'var(--text-muted)',
          fontSize: 13,
          fontWeight: 600,
          cursor: 'pointer',
          minWidth: 'fit-content',
        }}>
          <span>+</span> Add Featured
        </button>
      </div>
    </div>
  )
}