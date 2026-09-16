'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()

  const navItems = [
    { href: '/claude-skills/', label: '📚 Claude Skills' },
    { href: '/mcp-servers/', label: '🔌 MCP Servers' },
    { href: '/news/', label: '📰 AI News' },
    { href: '/submit/', label: '🚀 Submit' }
  ]

  return (
    <nav style={{
      borderBottom: '1px solid #e2e8f0',
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(12px)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      width: '100%',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
        height: 64,
        width: '100%',
        padding: '0 32px',
        boxSizing: 'border-box'
      }}>
        
        {/* Extreme Left: Logo */}
        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <Image 
              src="/logo.png" 
              alt="LORD OF CLAUDE Logo" 
              width={220} 
              height={56} 
              style={{ height: 48, width: 'auto', objectFit: 'contain' }}
              priority
            />
          </Link>
        </div>

        {/* Center Section: Perfectly Centered Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center' }}>
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                padding: '8px 16px',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                textDecoration: 'none',
                color: pathname === item.href ? '#ec4899' : '#475569',
                background: pathname === item.href ? '#fce7f3' : 'transparent',
                transition: 'all 0.2s ease',
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Extreme Right: Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'flex-end' }}>
          <Link href="/advertise/" className="btn btn-outline" style={{ 
            fontSize: 13, 
            padding: '8px 16px',
            borderRadius: 10,
            border: '1px solid #cbd5e1',
            color: '#334155',
            textDecoration: 'none',
            fontWeight: 600
          }}>
            📢 Advertise
          </Link>

          <button 
            onClick={() => window.openAuthModal && window.openAuthModal()} 
            style={{ 
              fontSize: 13, 
              padding: '8px 18px', 
              cursor: 'pointer',
              backgroundColor: '#ec4899',
              color: '#ffffff',
              border: 'none',
              borderRadius: 10,
              fontWeight: 700
            }}
          >
            Sign In
          </button>

          <div 
            onClick={() => window.openAuthModal && window.openAuthModal()} 
            style={{
              width: 36, 
              height: 36, 
              borderRadius: '50%',
              background: '#f1f5f9',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: 16, 
              cursor: 'pointer'
            }}
          >
            👤
          </div>
        </div>

      </div>
    </nav>
  )
}
