export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      padding: '40px 24px',
      textAlign: 'center',
      color: 'var(--text-muted)',
      fontSize: 13,
    }}>
      <div className="container">
        <p style={{ marginBottom: 8 }}>
          👑 <strong>LORD OF CLAUDE</strong> — The premier directory for verified MCP servers, Claude skills, and breaking AI news.
        </p>
        <p>
          Updated regularly. Verified before publishing. Zero manual effort.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 20, fontSize: 12 }}>
          <a href="/mcp-servers/" style={{ color: 'var(--text-secondary)' }}>MCP Servers</a>
          <a href="/claude-skills/" style={{ color: 'var(--text-secondary)' }}>Claude Skills</a>
          <a href="/news/" style={{ color: 'var(--text-secondary)' }}>AI News</a>
          <a href="/submit/" style={{ color: 'var(--text-secondary)' }}>Submit</a>
          <a href="/advertise/" style={{ color: 'var(--text-secondary)' }}>Advertise</a>
        </div>
      </div>
    </footer>
  )
}