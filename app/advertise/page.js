export default function AdvertisePage() {
  return (
    <div className="container" style={{ padding: '60px 24px', maxWidth: 720 }}>
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 12 }}>
          📢 Advertise on ClaudeHub
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 16 }}>
          Reach AI developers, tool builders, and Claude power users.
        </p>
      </div>

      <div style={{ display: 'grid', gap: 24 }}>
        {/* Stats Card */}
        <div className="card" style={{ padding: 28, textAlign: 'center' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 24,
          }}>
            <div>
              <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--accent)' }}>10K+</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Monthly Visitors</div>
            </div>
            <div>
              <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--accent)' }}>5K+</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Indexed Pages</div>
            </div>
            <div>
              <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--accent)' }}>85%</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Developer Audience</div>
            </div>
          </div>
        </div>

        {/* Placement Card */}
        <div className="card" style={{ padding: 28 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Ad Placements</h2>
          <div style={{ display: 'grid', gap: 16 }}>
            {[
              { name: 'Featured Bar', desc: 'Top-of-page icon slot on homepage', price: '$199/mo' },
              { name: 'Hero Carousel', desc: 'Full-width featured story (rotating)', price: '$399/mo' },
              { name: 'Category Sponsor', desc: 'Sponsored label on MCP/Skills category', price: '$149/mo' },
              { name: 'Newsletter', desc: 'Featured in weekly email to subscribers', price: '$99/mo' },
            ].map(slot => (
              <div key={slot.name} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px 0',
                borderBottom: '1px solid var(--border)',
              }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600 }}>{slot.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{slot.desc}</div>
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--accent)' }}>{slot.price}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Card */}
        <div className="card" style={{ padding: 28, textAlign: 'center' }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
            Ready to reach AI developers?
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 20 }}>
            Email us for a media kit, audience breakdown, and custom package.
          </p>
          <a href="mailto:ads@claudehub.ai" className="btn btn-primary" style={{ fontSize: 16, padding: '12px 32px' }}>
            Contact Sales →
          </a>
        </div>
      </div>
    </div>
  )
}
