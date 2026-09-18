'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

export default function SearchAndSidebar({ articles, featured, latestNews, trendingServers, trendingSkills }) {
  const [searchQuery, setSearchQuery] = useState('');

  // Combine Search Index across News, MCP Servers, and Skills
  const searchIndex = useMemo(() => {
    const servers = trendingServers.map((s) => ({
      title: s.name,
      description: `MCP Server for ${s.category}`,
      type: 'MCP Server',
      link: `/mcp-server/${s.slug}`,
    }));

    const skills = trendingSkills.map((sk) => ({
      title: sk.name,
      description: `Claude Skill for ${sk.category}`,
      type: 'Claude Skill',
      link: `/claude-skill/${sk.slug}`,
    }));

    return [...articles, ...servers, ...skills];
  }, [articles, trendingServers, trendingSkills]);

  // Filter Search Results dynamically
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return searchIndex.filter(
      (item) =>
        item.title?.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.type?.toLowerCase().includes(query)
    );
  }, [searchQuery, searchIndex]);

  return (
    <>
      {/* Universal Search Bar Section */}
      <div style={{ marginBottom: '32px', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#ffffff', border: '2px solid #e2e8f0', borderRadius: '16px', padding: '12px 20px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <span style={{ fontSize: '20px', marginRight: '12px' }}>🔍</span>
          <input
            type="text"
            placeholder="Search MCP Servers, Claude Skills, AI News & Protocols..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', border: 'none', outline: 'none', fontSize: '16px', color: '#0f172a', backgroundColor: 'transparent' }}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: '16px' }}>✕</button>
          )}
        </div>

        {/* Search Results Dropdown Overlay */}
        {searchQuery.trim() !== '' && (
          <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50, marginTop: '8px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', maxHeight: '420px', overflowY: 'auto', padding: '12px' }}>
            {searchResults.length > 0 ? (
              searchResults.map((item, idx) => (
                <Link key={idx} href={item.link} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ padding: '12px 16px', borderRadius: '8px', cursor: 'pointer', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontWeight: '700', fontSize: '15px', color: '#0f172a' }}>{item.title}</span>
                      <span style={{ fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '12px', backgroundColor: item.type === 'MCP Server' ? '#dbeafe' : item.type === 'Claude Skill' ? '#fce7f3' : '#f3e8ff', color: item.type === 'MCP Server' ? '#1e40af' : item.type === 'Claude Skill' ? '#9d174d' : '#6b21a8' }}>
                        {item.type}
                      </span>
                    </div>
                    {item.description && (
                      <p style={{ fontSize: '13px', color: '#64748b', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.description}</p>
                    )}
                  </div>
                </Link>
              ))
            ) : (
              <div style={{ padding: '20px', textAlign: 'center', color: '#64748b', fontSize: '14px' }}>No matches found for "{searchQuery}"</div>
            )}
          </div>
        )}
      </div>

      {/* Featured Hero Block */}
      {featured.title && !searchQuery && (
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
                    🗓️ {article.date || article.published_at || 'Sep 2026'}
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
