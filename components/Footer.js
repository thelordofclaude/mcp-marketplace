import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#102aef', color: '#ffffff', padding: '48px 20px 32px 20px', marginTop: '80px' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', marginBottom: '40px' }}>
          
          {/* Logo Column */}
          <div>
            <div style={{ fontSize: '28px', fontWeight: '900', letterSpacing: '-1px', marginBottom: '16px' }}>
              👑 LORD OF CLAUDE
            </div>
            <p style={{ fontSize: '13px', color: '#bfdbfe', lineHeight: '1.6' }}>
              The premier destination for verified MCP servers, Claude skills, and breaking AI news.
            </p>
          </div>

          {/* Column 1 */}
          <div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', fontWeight: '600' }}>
              <li><Link href="/about" style={{ color: '#ffffff', textDecoration: 'none' }}>About</Link></li>
              <li><Link href="/contact" style={{ color: '#ffffff', textDecoration: 'none' }}>Contact</Link></li>
              <li><Link href="/help" style={{ color: '#ffffff', textDecoration: 'none' }}>Help</Link></li>
              <li><Link href="/community-guidelines" style={{ color: '#ffffff', textDecoration: 'none' }}>Community Guidelines</Link></li>
              <li><Link href="/newsletters" style={{ color: '#ffffff', textDecoration: 'none' }}>Newsletters</Link></li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', fontWeight: '600' }}>
              <li><Link href="/careers" style={{ color: '#ffffff', textDecoration: 'none' }}>Careers</Link></li>
              <li><Link href="/ad-choices" style={{ color: '#ffffff', textDecoration: 'none' }}>Ad Choices</Link></li>
              <li><Link href="/privacy-policy" style={{ color: '#ffffff', textDecoration: 'none' }}>Privacy Policy</Link></li>
              <li><Link href="/cookie-notice" style={{ color: '#ffffff', textDecoration: 'none' }}>Cookie Notice</Link></li>
              <li><Link href="/ca-notice" style={{ color: '#ffffff', textDecoration: 'none' }}>CA Notice</Link></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', fontWeight: '600' }}>
              <li><Link href="/terms-of-service" style={{ color: '#ffffff', textDecoration: 'none' }}>Terms of Service</Link></li>
              <li><Link href="/sitemap.xml" style={{ color: '#ffffff', textDecoration: 'none' }}>Sitemap</Link></li>
              <li><Link href="/closed-captioning" style={{ color: '#ffffff', textDecoration: 'none' }}>Closed Captioning</Link></li>
              <li><Link href="/advertise" style={{ color: '#ffffff', textDecoration: 'none' }}>Advertise</Link></li>
              <li><Link href="/disclaimer" style={{ color: '#ffffff', textDecoration: 'none' }}>Disclaimer</Link></li>
            </ul>
          </div>

          {/* App Download Column */}
          <div>
            <h3 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '16px' }}>
              Get the App
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button style={{ backgroundColor: '#000000', color: '#ffffff', border: '1px solid #3b82f6', borderRadius: '8px', padding: '10px 16px', textAlign: 'left', cursor: 'pointer' }}>
                <span style={{ fontSize: '10px', display: 'block', textTransform: 'uppercase' }}>GET IT ON</span>
                <span style={{ fontSize: '14px', fontWeight: '700' }}>Google Play</span>
              </button>
              <button style={{ backgroundColor: '#000000', color: '#ffffff', border: '1px solid #3b82f6', borderRadius: '8px', padding: '10px 16px', textAlign: 'left', cursor: 'pointer' }}>
                <span style={{ fontSize: '10px', display: 'block', textTransform: 'uppercase' }}>Download on the</span>
                <span style={{ fontSize: '14px', fontWeight: '700' }}>App Store</span>
              </button>
            </div>
          </div>

        </div>

        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.2)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: '#bfdbfe' }}>
          <div>© 2026 Lord of Claude Media, LLC. All Rights Reserved.</div>
          <div style={{ fontWeight: '800', fontSize: '16px', color: '#ffffff' }}>LORD OF CLAUDE</div>
        </div>
      </div>
    </footer>
  )
}
