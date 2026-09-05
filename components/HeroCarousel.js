'use client'
import { useState } from 'react'
import Link from 'next/link'

const slides = [
  {
    tag: 'FEATURED',
    title: 'Context7 MCP Server Raises $3M Seed Round',
    desc: 'The open-source MCP server for up-to-date documentation and code examples. Now powering 10,000+ developer workflows.',
    cta: 'Read Full Story',
    cta2: 'View MCP Server',
    cta3: 'Explore Skills',
    image: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=800&h=400&fit=crop',
    date: 'Sep 5, 2026',
    readTime: '2 min read',
  },
  {
    tag: 'MCP SERVER',
    title: 'GitHub Official MCP Server Hits 50K Stars',
    desc: 'Manage repositories, issues, PRs, and actions directly from Claude Code with the official GitHub MCP integration.',
    cta: 'View Details',
    cta2: 'Install Now',
    cta3: null,
    image: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&h=400&fit=crop',
    date: 'Sep 4, 2026',
    readTime: '3 min read',
  },
  {
    tag: 'AI NEWS',
    title: 'Claude 4.0 Rumored for October Release',
    desc: 'Leaked benchmarks suggest 40% improvement in coding tasks. Anthropic tight-lipped on official timeline.',
    cta: 'Read Full Story',
    cta2: 'View Analysis',
    cta3: null,
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
    date: 'Sep 3, 2026',
    readTime: '4 min read',
  },
]

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0)

  return (
    <div className="container" style={{ padding: '0 24px 24px' }}>
      <div style={{ display: 'flex', gap: 24 }}>
        {/* Main Carousel */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            position: 'relative',
            borderRadius: 16,
            overflow: 'hidden',
            background: '#0f0f1a',
            minHeight: 380,
            display: 'flex',
          }}>
            <div style={{
              flex: 1,
              padding: 40,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              zIndex: 2,
            }}>
              <span className="tag tag-pink" style={{ width: 'fit-content', marginBottom: 16 }}>
                {slides[current].tag}
              </span>
              <h2 style={{
                fontSize: 32,
                fontWeight: 800,
                color: 'white',
                marginBottom: 12,
                lineHeight: 1.2,
              }}>
                {slides[current].title}
              </h2>
              <p style={{ color: '#a1a1aa', fontSize: 15, marginBottom: 24, maxWidth: 480 }}>
                {slides[current].desc}
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <button className="btn btn-primary">{slides[current].cta}</button>
                <button className="btn" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
                  {slides[current].cta2}
                </button>
                {slides[current].cta3 && (
                  <button className="btn" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
                    {slides[current].cta3}
                  </button>
                )}
              </div>
              <div style={{ display: 'flex', gap: 16, marginTop: 24, color: '#71717a', fontSize: 13 }}>
                <span>📅 {slides[current].date}</span>
                <span>⏱️ {slides[current].readTime}</span>
              </div>
            </div>

            <div style={{
              width: 320,
              background: `url(${slides[current].image}) center/cover`,
              position: 'relative',
            }}>
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to right, #0f0f1a 0%, transparent 50%)',
              }} />
            </div>

            {/* Arrows */}
            <button
              onClick={() => setCurrent((c) => (c - 1 + slides.length) % slides.length)}
              style={{
                position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.1)',
                color: 'white', border: 'none', cursor: 'pointer', fontSize: 16,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >‹</button>
            <button
              onClick={() => setCurrent((c) => (c + 1) % slides.length)}
              style={{
                position: 'absolute', right: 332, top: '50%', transform: 'translateY(-50%)',
                width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.1)',
                color: 'white', border: 'none', cursor: 'pointer', fontSize: 16,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >›</button>
          </div>

          {/* Dots */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 16 }}>
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                style={{
                  width: 24,
                  height: 6,
                  borderRadius: 3,
                  border: 'none',
                  cursor: 'pointer',
                  background: i === current ? 'var(--accent)' : '#e5e7eb',
                  transition: 'all 0.2s',
                }}
              />
            ))}
          </div>
        </div>

        {/* Trending Sidebar */}
        <div style={{ width: 320, flexShrink: 0 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 16,
          }}>
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>Top Trending</h3>
            <Link href="/mcp-servers/" style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 600 }}>
              View All →
            </Link>
          </div>

          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <button className="btn btn-primary" style={{ fontSize: 12, padding: '6px 12px' }}>
              MCP Servers
            </button>
            <button className="btn btn-outline" style={{ fontSize: 12, padding: '6px 12px' }}>
              Skills
            </button>
          </div>

          {[
            { rank: 1, name: 'Context7', cat: 'Development', installs: '2,390', growth: '+18.2%', color: '#4f46e5' },
            { rank: 2, name: 'Brave Search', cat: 'Search', installs: '2,300', growth: '+18.2%', color: '#f97316' },
            { rank: 3, name: 'Filesystem', cat: 'Productivity', installs: '2,300', growth: '+24.9%', color: '#10b981' },
            { rank: 4, name: 'GitHub', cat: 'Development', installs: '2,300', growth: '+24.8%', color: '#111827' },
            { rank: 5, name: 'Notion', cat: 'Productivity', installs: '1,800', growth: '+18.5%', color: '#000000' },
          ].map(item => (
            <div key={item.rank} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 0',
              borderBottom: '1px solid var(--border)',
            }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-muted)', width: 20 }}>
                {item.rank}
              </span>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: item.color + '15',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14,
              }}>
                {item.name[0]}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                  {item.name}
                  <span style={{ fontSize: 10, color: 'var(--blue)' }}>✓</span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.cat}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 12, fontWeight: 700 }}>{item.installs}</div>
                <div style={{ fontSize: 11, color: 'var(--green)' }}>{item.growth}</div>
              </div>
            </div>
          ))}

          <Link href="/mcp-servers/" style={{
            display: 'block',
            textAlign: 'center',
            padding: '12px',
            marginTop: 12,
            color: 'var(--accent)',
            fontSize: 13,
            fontWeight: 600,
          }}>
            View All MCP Servers →
          </Link>
        </div>
      </div>
    </div>
  )
}