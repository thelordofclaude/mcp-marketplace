'use client'

export default function SubmitPage() {
  const repoUrl = typeof window !== 'undefined' 
    ? window.location.hostname.includes('vercel') 
      ? 'https://github.com/YOUR-USERNAME/YOUR-REPO'
      : 'https://github.com'
    : 'https://github.com'

  return (
    <div className="container" style={{ padding: '60px 24px', maxWidth: 720 }}>
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 12 }}>
          🚀 Submit to ClaudeHub
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 16 }}>
          Share your MCP server, Claude skill, or AI news with our community.
        </p>
      </div>

      <div style={{ display: 'grid', gap: 24 }}>
        {/* Submit News Card */}
        <div className="card" style={{ padding: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14,
              background: 'linear-gradient(135deg, #ec4899, #be185d)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 24,
            }}>
              📰
            </div>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700 }}>Submit News Article</h2>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
                Fastest method — published within 1 minute
              </p>
            </div>
          </div>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 20, lineHeight: 1.6 }}>
            Open a GitHub Issue with our template, fill in your headline and content, 
            and our bot automatically publishes it. No coding required.
          </p>
          <ol style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 20, paddingLeft: 20, lineHeight: 1.8 }}>
            <li>Click the button below</li>
            <li>Fill in the headline and article content</li>
            <li>Optional: Add an image URL or leave blank for auto-generation</li>
            <li>Submit the issue — the bot handles the rest</li>
          </ol>
          <a 
            href={`${repoUrl}/issues/new?labels=manual-news&template=manual-news.yml`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            style={{ display: 'inline-flex' }}
          >
            Open GitHub Issue Form →
          </a>
        </div>

        {/* Submit MCP Server Card */}
        <div className="card" style={{ padding: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14,
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 24,
            }}>
              🔌
            </div>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700 }}>Submit MCP Server</h2>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
                Auto-discovered weekly — or fast-track via email
              </p>
            </div>
          </div>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 20, lineHeight: 1.6 }}>
            If your MCP server is on GitHub with proper tags (mcp-server, model-context-protocol), 
            our bot will find and publish it automatically every Monday. 
            For faster inclusion, email us directly.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a href="mailto:submissions@claudehub.ai" className="btn btn-primary">
              Email Submission →
            </a>
            <span className="btn btn-outline" style={{ cursor: 'default' }}>
              Or wait for Monday auto-scan
            </span>
          </div>
        </div>

        {/* Submit Claude Skill Card */}
        <div className="card" style={{ padding: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14,
              background: 'linear-gradient(135deg, #10b981, #34d399)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 24,
            }}>
              📚
            </div>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700 }}>Submit Claude Skill</h2>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
                Rules, prompts, workflows — auto-discovered weekly
              </p>
            </div>
          </div>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 20, lineHeight: 1.6 }}>
            If your skill repo is tagged with claude-skill, cursor-rules, or similar topics, 
            our bot will find and publish it automatically every Monday.
          </p>
          <a href="mailto:submissions@claudehub.ai" className="btn btn-primary">
            Email Submission →
          </a>
        </div>
      </div>
    </div>
  )
}
