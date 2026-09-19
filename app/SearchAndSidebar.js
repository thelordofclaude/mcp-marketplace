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

const MCP_CATEGORIES = [
  { name: 'Official', count: 10, icon: '🏛️', slug: 'official' },
  { name: 'Databases', count: 5, icon: '🗄️', slug: 'databases' },
  { name: 'DevOps', count: 5, icon: '⚙️', slug: 'devops' },
  { name: 'Code Tools', count: 4, icon: '💻', slug: 'code-tools' },
  { name: 'AI Tools', count: 3, icon: '🤖', slug: 'ai-tools' },
  { name: 'Productivity', count: 5, icon: '📅', slug: 'productivity' },
  { name: 'Communication', count: 4, icon: '💬', slug: 'communication' },
  { name: 'Cloud', count: 5, icon: '☁️', slug: 'cloud' }
];

export default function SearchAndSidebar({ articles, featured, latestNews, trendingServers, trendingSkills }) {
  const [activeTab, setActiveTab] = useState(null); // 'skills' | 'mcp' | 'aitools' | null
  const [filterQuery, setFilterQuery] = useState('');

  const handleTabClick = (tabKey) => {
    if (activeTab === tabKey) {
      setActiveTab(null);
    } else {
      setActiveTab(tabKey);
      setFilterQuery('');
    }
  };

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
      (item) => item.title.toLowerCase().includes(q) || item.category.toLowerCase().includes(q)
    );
  }, [activeTab, filterQuery, trendingSkills, trendingServers]);

  return (
    <>
      {/* 1. UPPER SECTION: Styled Lilac 3-Tab Search Bar */}
      <div style={{ maxWidth: '680px', margin: '0 auto 24px auto', position: 'relative' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#ffffff',
            border: '2px solid #ddd6fe',
            borderRadius: '9999px',
            padding: '6px 8px 6px 20px',
            boxShadow: '0 10px 25px -5px rgba(139, 92, 246, 0.15)',
            background: 'linear-gradient(180deg, #ffffff 0%, #f5f3ff 100%)',
          }}
        >
          <button
            onClick={() => handleTabClick('skills')}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              border: 'none',
              background: activeTab === 'skills' ? '#ede9fe' : 'transparent',
              padding: '10px 14px',
              borderRadius: '9999px',
              cursor: 'pointer',
              fontWeight: '800',
              fontSize: '13px',
              color: activeTab === 'skills' ? '#6d28d9' : '#1e293b',
            }}
          >
            <span style={{ fontSize: '16px' }}>🏠</span> SKILLS
          </button>

          <div style={{ width: '1px', height: '24px', backgroundColor: '#ddd6fe' }} />

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
            }}
          >
            <span>mcp</span>
            <span>servers</span>
          </button>

          <div style={{ width: '1px', height: '24px', backgroundColor: '#ddd6fe' }} />

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
            }}
          >
            AI tools
          </button>

          <button
            onClick={() => handleTabClick(activeTab || 'skills')}
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: '#8b5cf6',
              border: 'none',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4)',
            }}
          >
            🔍
          </button>
        </div>

        {/* Modal Overlay Dropdown */}
        {activeTab && (
          <div
            style={{
              position: 'absolute',
              top: '110%',
              left: 0,
              right: 0,
              zIndex: 100,
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15)',
              overflow: 'hidden',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', padding: '14px 18px', borderBottom: '1px solid #f1f5f9', gap: '12px' }}>
              <span>🔍</span>
              <input
                type="text"
                autoFocus
                placeholder={`Search ${activeTab.toUpperCase()}...`}
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                style={{ width: '100%', border: 'none', outline: 'none', fontSize: '14px', color: '#0f172a' }}
              />
              <button onClick={() => setActiveTab(null)} style={{ backgroundColor: '#f1f5f9', border: 'none', borderRadius: '6px', padding: '4px 8px', fontSize: '11px', cursor: 'pointer' }}>
                esc
              </button>
            </div>
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {modalItems.map((item, idx) => (
                <Link key={idx} href={item.link} onClick={() => setActiveTab(null)} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ padding: '12px 18px', borderBottom: '1px solid #f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>{item.title}</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>{item.category}</div>
                    </div>
                    <span style={{ fontSize: '11px', backgroundColor: '#f1f5f9', padding: '2px 8px', borderRadius: '6px', color: '#475569' }}>{item.subtitle}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2. MCPSKILLS DIRECTORY STATS & CATEGORIES */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#0f172a', margin: '0 0 8px 0' }}>Supercharge your AI with MCP & Skills</h1>
        <p style={{ fontSize: '15px', color: '#64748b', margin: '0 0 20px 0' }}>Connect Claude, Cursor, and Windsurf to tools, APIs, and domain-specific agent skills.</p>
        
        {/* Category Filter Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
          {MCP_CATEGORIES.map((cat, idx) => (
            <Link key={idx} href={`/mcp-servers?category=${cat.slug}`} style={{ textDecoration: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '9999px', fontSize: '13px', fontWeight: '600', color: '#334155' }}>
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
                <span style={{ fontSize: '11px', color: '#94a3b8', backgroundColor: '#f1f5f9', padding: '1px 6px', borderRadius: '10px' }}>{cat.count}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 3. POPULAR AI TOOLS GRID */}
      <div style={{ marginBottom: '36px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '20px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', margin: 0 }}>🛠️ Popular AI Tools</h3>
          <Link href="/ai-tools" style={{ fontSize: '12px', fontWeight: '700', color: '#8b5cf6', textDecoration: 'none' }}>View Directory</Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
          {POPULAR_AI_TOOLS.map((tool, idx) => (
            <Link key={idx} href={tool.link} style={{ textDecoration: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', borderRadius: '12px', backgroundColor: '#f8fafc', border: '1px solid #f1f5f9' }}>
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

      {/* 4. FEATURED HERO ARTICLE & MAIN CONTENT */}
      {featured.title && !activeTab && (
        <div style={{ backgroundColor: '#090d16', borderRadius: '24px', padding: '36px', color: '#ffffff', marginBottom: '32px' }}>
          <span style={{ backgroundColor: '#ec4899', color: '#ffffff', fontSize: '11px', fontWeight: '800', padding: '4px 12px', borderRadius: '9999px', textTransform: 'uppercase', display: 'inline-block', marginBottom: '16px' }}>FEATURED STORY</span>
          <h2 style={{ fontSize: '28px', fontWeight: '800', margin: '0 0 12px 0' }}>
            <Link href={featured.link} style={{ color: '#ffffff', textDecoration: 'none' }}>{featured.title}</Link>
          </h2>
          <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.6', margin: '0 0 24px 0' }}>{featured.description || featured.summary}</p>
          <Link href={featured.link} style={{ backgroundColor: '#ec4899', color: '#ffffff', padding: '10px 22px', borderRadius: '12px', textDecoration: 'none', fontWeight: '700', fontSize: '14px', display: 'inline-block' }}>Read Full Article</Link>
        </div>
      )}

      {/* 5. TWO COLUMN MAIN CONTENT & SIDEBAR */}
      <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
        <main style={{ flex: '1 1 0%', minWidth: 0 }}>
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', margin: 0 }}>AI News & Protocol Updates</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {latestNews.map((article) => (
              <Link key={article.slug} href={article.link} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ border: '1px solid #e2e8f0', borderRadius: '20px', backgroundColor: '#ffffff', padding: '20px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '15px', fontWeight: '700', margin: '0 0 10px 0', lineHeight: '1.4', color: '#0f172a' }}>{article.title}</h3>
                    <p style={{ fontSize: '13px', color: '#64748b', margin: 0, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{article.description || article.summary}</p>
                  </div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '16px' }}>🗓️ {typeof article.date === 'string' ? article.date : String(article.date || 'Sep 2026')}</div>
                </div>
              </Link>
            ))}
          </div>
        </main>

        <aside style={{ width: '320px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '28px' }}>
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '20px' }}>
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
        </aside>
      </div>
    </>
  );
}
