'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()

  const navItems = [
    { href: '/claude-skills/', label: '📚 Claude Skills', icon: true },
    { href: '/mcp-servers/', label: '🔌 MCP Servers', icon: true },
    { href: '/news/', label: '📰 AI News', icon: true },
  ]

  return (
    <nav style={{
      borderBottom: '1px solid var(--border)',
      background: 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(12px)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      width: '100%',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between',
        height: 64,
        width: '100%',
        maxWidth: '100%',
        padding: '0 32px',
        boxSizing: 'border-box'
      }}>
        {/* Far Left: Larger Logo */}
        <Link href="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          textDecoration: 'none'
        }}>
          <Image 
            src="/logo.png" 
            alt="LORD OF CLAUDE Logo" 
            width={220} 
            height={56} 
            style={{ height: 50, width: 'auto', objectFit: 'contain' }}
            priority
          />
        </Link>

        {/* Center Navigation Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                padding: '8px 16px',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 500,
                color: pathname === item.href ? 'var(--accent)' : 'var(--text-secondary)',
                background: pathname === item.href ? 'var(--accent-light)' : 'transparent',
                transition: 'all 0.2s',
              }}
            >
              {item.label}
            </Link>
          ))}
          <Link href="/submit/" className="btn btn-ghost" style={{ fontSize: 14 }}>
            🚀 Submit
          </Link>
        </div>

        {/* Far Right Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/advertise/" className="btn btn-outline" style={{ fontSize: 13, padding: '8px 16px' }}>
            📢 Advertise
          </Link>
          <button 
            onClick={() => window.openAuthModal && window.openAuthModal()} 
            className="btn btn-primary" 
            style={{ fontSize: 13, padding: '8px 16px', cursor: 'pointer' }}
          >
            Sign In
          </button>
          <div 
            onClick={() => window.openAuthModal && window.openAuthModal()} 
            style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'var(--surface-hover)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, cursor: 'pointer'
            }}
          >
            👤
          </div>
        </div>
      </div>
    </nav>
  )
}
