'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

const POPULAR_AI_TOOLS = [
  { name: 'Claude 3.5 Sonnet', category: 'LLM & Reasoning', icon: '🧠', link: '/ai-tool/claude-3-5-sonnet' },
  { name: 'Cursor AI', category: 'Code Editor', icon: '💻', link: '/ai-tool/cursor-ai' },
  { name: 'v0 by Vercel', category: 'UI Generator', icon: '⚡', link: '/ai-tool/v0-vercel' },
  { name: 'Midjourney v6', category: 'Image Generation', icon: '🎨', link: '/ai-tool/midjourney-v6' },
  { name: 'Perplexity Pro', category: 'Search Engine', icon: '🔍', link: '/ai-tool/perplexity-pro' },
  { name: 'ElevenLabs', category: 'Voice Synthesis', icon: '🎙️', link: '/ai-tool/elevenlabs' },
];

export default function SearchAndSidebar({ articles, featured, latestNews, trendingServers, trendingSkills }) {
  const [activeTab, setActiveTab] = useState(null); // 'skills' | 'mcp' | 'aitools' | null
  const [filterQuery, setFilterQuery] = useState('');

  // Handle section click
  const handleTabClick = (tabKey) => {
    if (activeTab === tabKey) {
      setActiveTab(null);
    } else {
      setActiveTab(tabKey);
      setFilterQuery('');
    }
  };

  // Filter items based on active tab & query input
  const modalItems = useMemo(() => {
    let rawList = [];

    if (activeTab === 'skills') {
      rawList = trendingSkills.map((s) => ({
        title: s.name,
        category: s.category || 'Claude Skill',
        subtitle: 'Claude Skill',
        link: `/claude-skill/${s.slug}`,
      }));
    } else if (activeTab === 'mcp') {
      rawList = trendingServers.map((s) => ({
        title: s.name,
        category: s.category || 'MCP Server',
        subtitle: 'MCP Protocol Server',
        link: `/mcp-server/${s.slug}`,
      }));
    } else if (activeTab === 'aitools') {
      rawList = POPULAR_AI_TOOLS.map((t) => ({
        title: t.name,
        category: t.category,
        subtitle: 'AI Tool',
        link: t.link,
      }));
    }

    if (!filterQuery.trim()) return rawList;
    const q = filterQuery.toLowerCase();
    return rawList.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );
  }, [activeTab, filterQuery, trendingSkills, trendingServers]);

  return (
    <>
      {/* Centered Lilac 3-Section Stylized Search Bar */}
      <div style={{ maxWidth: '680px', margin: '0 auto 28px auto', position: 'relative' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#ffffff',
            border: '2px solid #ddd6fe', // Lilac border
            borderRadius: '9999px',
            padding: '6px 8px 6px 20px',
            boxShadow: '0 10px 25px -5px rgba(139, 92, 246, 0.15)',
            background: 'linear-gradient(180deg, #ffffff 0%, #f5f3ff 100%)',
          }}
        >
          {/* Section 1: SKILLS */}
          <button
            onClick={() => handleTabClick('skills')}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              gap: '8px',
              border: 'none',
              background: activeTab === 'skills' ? '#ede9fe' : 'transparent',
              padding: '10px 14px',
              borderRadius: '9999px',
              cursor: 'pointer',
              fontWeight: '800',
              fontSize: '13px',
              letterSpacing: '0.05em',
              color: activeTab === 'skills' ? '#6d28d9' : '#1e293b',
              transition: 'all 0.2s ease',
            }}
          >
            <span style={{ fontSize: '16px' }}>🏠</span> SKILLS
          </button>

          <div style={{ width: '1px', height: '24px', backgroundColor: '#ddd6fe' }} />

          {/* Section 2: MCP SERVERS */}
          <button
            onClick={() => handleTabClick('mcp')}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justify: 'center',
              border: 'none',
              background: activeTab === 'mcp' ? '#ede9fe' : 'transparent',
              padding: '6px 14px',
              borderRadius: '9999px',
              cursor: 'pointer',
              fontWeight: '800',
              fontSize: '12px',
              lineHeight: '1.1',
              color: activeTab === 'mcp' ? '#6d28d9' : '#1e293b',
              transition: 'all 0.2s ease',
            }}
          >
            <span>mcp</span>
            <span>servers</span>
          </button>

          <div style={{ width: '1px', height: '24px', backgroundColor: '#ddd6fe' }} />

          {/* Section 3: AI TOOLS */}
          <button
            onClick={() => handleTabClick('aitools')}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              border: 'none',
              background: activeTab === 'aitools' ? '#ede9fe' : 'transparent',
              padding: '10px 14px',
              borderRadius: '9999px',
              cursor: 'pointer',
              fontWeight: '800',
              fontSize: '13px',
              color: activeTab === 'aitools' ? '#6d28d9' : '#1e293b',
              transition: 'all 0.2s ease',
            }}
          >
            AI tools
          </button>

          {/* Lilac Search Button Trigger */}
          <button
            onClick={() => handleTabClick(activeTab || 'skills')}
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: '#8b5cf6', // Lilac/purple
              border: 'none',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4)',
              transition: 'transform 0.15s ease',
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </div>

        {/* Modal Dropdown overlay (Referenced from Image 3 layout) */}
        {activeTab && (
          <div
            style={{
              position: 'absolute',
              top: '110%',
              left: '0',
              right: '0',
              zIndex: 100,
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
            }}
          >
            {/* Modal Search Header */}
            <div style={{ display: 'flex', alignItems: 'center', padding: '14px 18px', borderBottom: '1px solid #f1f5f9', gap: '12px' }}>
              <span style={{ color: '#94a3b8' }}>🔍</span>
              <input
                type="text"
                autoFocus
                placeholder={`Search ${activeTab.toUpperCase()}... e.g. "deploy" or "python"`}
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                style={{ width: '100%', border: 'none', outline: 'none', fontSize: '14px', color: '#0f172a', backgroundColor: 'transparent' }}
              />
              <button
                onClick={() => setActiveTab(null)}
                style={{ backgroundColor: '#f1f5f9', border: 'none', borderRadius: '6px', padding: '4px 8px', fontSize: '11px', fontWeight: '600', color: '#64748b', cursor: 'pointer' }}
              >
                esc
              </button>
            </div>

            <div style={{ padding: '8px 16px', backgroundColor: '#f8fafc', fontSize: '11px', fontWeight: '700', color: '#94a3b8', letterSpacing: '0.05em' }}>
              {activeTab.toUpperCase()}
            </div>

            {/* List Dropdown Body */}
            <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
              {modalItems.length > 0 ? (
                modalItems.map((item, idx) => (
                  <Link key={idx} href={item.link} onClick={() => setActiveTab(null)} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 18px',
                        borderBottom: '1px solid #f8fafc',
                        cursor: 'pointer',
                        transition: 'background 0.15s',
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#000000'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <span style={{ fontSize: '16px', color: '#64748b' }}>📄</span>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>{item.title}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>
                          {item.category} • {item.subtitle}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div style={{ padding: '24px', textAlign: 'center', color: '#64748b', fontSize: '14px' }}>
                  No matching results found.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Popular AI Tools Section (Below Search Bar) */}
      <div style={{ marginBottom: '36px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '20px 24px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', margin: 0 }}>🛠️ Popular AI Tools</h3>
          <Link href="/ai-tools" style={{ fontSize: '12px', fontWeight: '700', color: '#8b5cf6', textDecoration: 'none' }}>View Directory</Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
          {POPULAR_AI_TOOLS.map((tool, idx) => (
            <Link key={idx} href={tool.link} style={{ textDecoration: 'none' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px',
                  borderRadius: '12px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #f1f5f9',
                  transition: 'all 0.15s ease',
                }}
                onMouseOver={(e) => e.currentTarget.style.borderColor = '#ddd6fe'}
                onMouseOut={(e) => e.currentTarget.style.borderColor = '#f1f5f9'}
              >
                <span style={{ fontSize: '20px' }}>{tool.icon}</span>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>{tool.name}</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>{tool.category}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Hero Block */}
      {featured.title && !activeTab && (
        <div style={{ backgroundColor: '#090d16', borderRadius: '24px', padding: '36px', color: '#ffffff', marginBottom: '32px' }}>
          <span style={{ backgroundColor: '#ec4899', color: '#ffffff', fontSize: '11px', fontWeight: '800', padding: '4px 12px', borderRadius: '9999px', textTransform: 'uppercase', display: 'inline-block', marginBottom: '16px' }}>FEATURED</span>
          <h1 style={{ fontSize: '32px', fontWeight: '800', margin: '0 0 12px 0' }}>
            <Link href={featured.link} style={{ color: '#ffffff', textDecoration: 'none' }}>
              {featured.title}
            </Link>
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.6', margin: '0 0 24px 0' }}>{featured.description || featured.summary}</p>
          <Link href={featured.link} style={{ backgroundColor: '#ec4899', color: '#ffffff', padding: '10px 22px', borderRadius: '12px', textDecoration: 'none', fontWeight: '700', fontSize: '14px', display: 'inline-block' }}>Read Story</Link>
        </div>
      )}

      {/* Main Two-Column Layout */}
      <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
        
        {/* Left Column: Grid Header & Articles */}
        <main style={{ flex: '1 1 0%', minWidth: 0 }}>
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', margin: 0 }}>AI News & Protocol Updates</h2>
            <p style={{ fontSize: '14px', color: '#64748b', margin: '4px 0 0 0' }}>Latest breaking stories and developments.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {latestNews.map((article) => (
              <Link key={article.slug} href={article.link} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ border: '1px solid #e2e8f0', borderRadius: '20px', backgroundColor: '#ffffff', padding: '20px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    {article.image && (
                      <img src={article.image} alt={article.title} style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '12px', marginBottom: '14px' }} />
                    )}
                    <h3 style={{ fontSize: '15px', fontWeight: '700', margin: '0 0 10px 0', lineHeight: '1.4', color: '#0f172a' }}>{article.title}</h3>
                    <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.5', margin: 0, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {article.description || article.summary}
                    </p>
                  </div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '16px' }}>
                    🗓️ {typeof article.date === 'string' ? article.date : String(article.date || 'Sep 2026')}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </main>

        {/* Right Column: Trending Sidebar */}
        <aside style={{ width: '320px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '28px' }}>
          
          {/* Trending MCP Servers */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', margin: 0 }}>⚡ Trending MCP Servers</h3>
              <Link href="/mcp-servers" style={{ fontSize: '12px', fontWeight: '700', color: '#2563eb', textDecoration: 'none' }}>View All</Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {trendingServers.map((server, idx) => (
                <Link key={idx} href={`/mcp-server/${server.slug}`} style={{ textDecoration: 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderRadius: '10px', backgroundColor: '#f8fafc', border: '1px solid #f1f5f9' }}>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>{server.name}</span>
                    <span style={{ fontSize: '11px', color: '#64748b', backgroundColor: '#e2e8f0', padding: '2px 8px', borderRadius: '6px' }}>{server.category}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Popular Claude Skills */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', margin: 0 }}>🎨 Popular Claude Skills</h3>
              <Link href="/claude-skills" style={{ fontSize: '12px', fontWeight: '700', color: '#ec4899', textDecoration: 'none' }}>View All</Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {trendingSkills.map((skill, idx) => (
                <Link key={idx} href={`/claude-skill/${skill.slug}`} style={{ textDecoration: 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderRadius: '10px', backgroundColor: '#fdf2f8', border: '1px solid #fce7f3' }}>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#831843' }}>{skill.name}</span>
                    <span style={{ fontSize: '11px', color: '#be185d', backgroundColor: '#fbcfe8', padding: '2px 8px', borderRadius: '6px' }}>{skill.category}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </aside>

      </div>
    </>
  );
}
