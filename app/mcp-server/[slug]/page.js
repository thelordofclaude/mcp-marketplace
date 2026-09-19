import Link from 'next/link';

export default function MCPServerDetailPage({ params }) {
  const { slug } = params;
  const formattedTitle = slug.replace(/-/g, ' ').toUpperCase();

  return (
    <div style={{ backgroundColor: '#faf8f5', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif', padding: '40px 24px', color: '#1c1917' }}>
      <div style={{ maxWidth: '840px', margin: '0 auto' }}>
        
        <Link href="/mcp-servers" style={{ textDecoration: 'none', color: '#8b5cf6', fontWeight: '700', fontSize: '14px', display: 'inline-block', marginBottom: '24px' }}>
          ← Back to MCP Servers Directory
        </Link>

        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e7e5e4', borderRadius: '20px', padding: '32px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ backgroundColor: '#18181b', color: '#ffffff', borderRadius: '10px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
              ⚡
            </div>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: '800', margin: 0 }}>{formattedTitle}</h1>
              <span style={{ fontSize: '12px', fontFamily: 'monospace', color: '#78716c' }}>mcp/{slug}</span>
            </div>
          </div>

          <p style={{ fontSize: '15px', color: '#57534e', lineHeight: '1.6', marginBottom: '28px' }}>
            Integration details, command installation schemas, and client connection configs for {formattedTitle}.
          </p>

          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '800', textTransform: 'uppercase', color: '#78716c', letterSpacing: '0.05em', marginBottom: '8px' }}>
              Quick Install Command
            </h3>
            <div style={{ backgroundColor: '#0f172a', color: '#38bdf8', padding: '14px 18px', borderRadius: '10px', fontFamily: 'monospace', fontSize: '13px' }}>
              npx -y @modelcontextprotocol/server-{slug}
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: '14px', fontWeight: '800', textTransform: 'uppercase', color: '#78716c', letterSpacing: '0.05em', marginBottom: '8px' }}>
              Claude Desktop Config Snippet
            </h3>
            <pre style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', padding: '16px', borderRadius: '10px', fontSize: '13px', fontFamily: 'monospace', overflowX: 'auto', color: '#334155' }}>
{`{
  "mcpServers": {
    "${slug}": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-${slug}"]
    }
  }
}`}
            </pre>
          </div>
        </div>

      </div>
    </div>
  );
}
