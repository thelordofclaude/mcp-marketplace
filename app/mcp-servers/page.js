'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

const MCP_SERVERS = [
  {
    id: '5ire-mcp',
    title: '5ire MCP Server',
    slug: '5ire-mcp-server',
    subtitle: '5ire-io/mcp-server',
    description: 'Cross-platform desktop AI assistant and MCP client compatible with major AI workflows.',
    category: 'Backend & APIs',
    installs: '5.3K',
    featured: true
  },
  {
    id: 'api-mcp',
    title: 'Best API MCP Servers',
    slug: 'best-api-mcp-servers',
    subtitle: 'mcp/api-tools',
    description: 'Connect frontier models directly to REST and GraphQL APIs with automated schema mapping.',
    category: 'Backend & APIs',
    installs: '12.4K',
    featured: false
  },
  {
    id: 'browser-mcp',
    title: 'Best Browser MCP Servers',
    slug: 'best-browser-mcp-servers',
    subtitle: 'mcp/browser-automation',
    description: 'Autonomous web browsing and DOM extraction for Claude and Cursor agents.',
    category: 'Testing & QA',
    installs: '8.9K',
    featured: false
  },
  {
    id: 'database-mcp',
    title: 'PostgreSQL & Database MCP',
    slug: 'database-mcp-servers',
    subtitle: 'mcp/database-connector',
    description: 'Safe read/write database connectors for Postgres, MySQL, and SQLite.',
    category: 'Database',
    installs: '15.1K',
    featured: false
  },
  {
    id: 'devops-mcp',
    title: 'DevOps & CI/CD MCP',
    slug: 'devops-mcp-servers',
    subtitle: 'mcp/devops-pipeline',
    description: 'Monitor deployment pipelines, logs, and server health from within Claude.',
    category: 'DevOps',
    installs: '7.2K',
    featured: false
  },
  {
    id: 'filesystem-mcp',
    title: 'Filesystem MCP Server',
    slug: 'filesystem-mcp-server',
    subtitle: 'mcp/filesystem-tools',
    description: 'Secure local filesystem access and operations for developer AI agents.',
    category: 'Developer Tools',
    installs: '22.8K',
    featured: false
  }
];

const CATEGORIES = [
  { name: 'All Servers', slug: 'all', count: 198 },
  { name: 'Backend & APIs', slug: 'backend', count: 42 },
  { name: 'Developer Tools', slug: 'devtools', count: 38 },
  { name: 'Database', slug: 'database', count: 29 },
  { name: 'DevOps', slug: 'devops', count: 24 },
  { name: 'Testing & QA', slug: 'testing', count: 18 },
];

export default function MCPServersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('installed');

  const filteredServers = useMemo(() => {
    return MCP_SERVERS.filter((server) => {
      const matchesSearch =
        server.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        server.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        server.subtitle.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'all' ||
        server.category.toLowerCase().includes(selectedCategory.toLowerCase());

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div style={{ backgroundColor: '#faf8f5', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#1c1917', paddingBottom: '60px' }}>
      
      {/* Top Banner / Featured Promo Cards */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 24px 0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          
          <div style={{ border: '1px solid #fecdd3', borderRadius: '12px', padding: '16px', backgroundColor: '#fff1f2', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', fontSize: '14px', color: '#e11d48' }}>
                <span>⚡ CodeRabbit</span>
              </div>
              <p style={{ fontSize: '12px', color: '#475569', margin: '8px 0 12px 0', lineHeight: '1.4' }}>
                AI writes the code. CodeRabbit catches the slop.
              </p>
            </div>
            <a href="#" style={{ fontSize: '12px', fontWeight: '700', color: '#e11d48', textDecoration: 'none' }}>Try For Free →</a>
          </div>

          <div style={{ border: '1px solid #fecdd3', borderRadius: '12px', padding: '16px', backgroundColor: '#fff1f2', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', fontSize: '14px', color: '#e11d48' }}>
                <span>🤖 ego lite browser</span>
              </div>
              <p style={{ fontSize: '12px', color: '#475569', margin: '8px 0 12px 0', lineHeight: '1.4' }}>
                Fastest browser for AI agents to run web automation tasks.
              </p>
            </div>
            <a href="#" style={{ fontSize: '12px', fontWeight: '700', color: '#e11d48', textDecoration: 'none' }}>Download Free →</a>
          </div>

          <div style={{ border: '1px solid #fecdd3', borderRadius: '12px', padding: '16px', backgroundColor: '#fff1f2', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', fontSize: '14px', color: '#e11d48' }}>
                <span>▲ inference shell</span>
              </div>
              <p style={{ fontSize: '12px', color: '#475569', margin: '8px 0 12px 0', lineHeight: '1.4' }}>
                Create and run specialized AI agents in minutes.
              </p>
            </div>
            <a href="#" style={{ fontSize: '12px', fontWeight: '700', color: '#e11d48', textDecoration: 'none' }}>Build now →</a>
          </div>

          <div style={{ border: '1px solid #fecdd3', borderRadius: '12px', padding: '16px', backgroundColor: '#fff1f2', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', fontSize: '14px', color: '#e11d48' }}>
                <span>🎯 CodeHealth MCP</span>
              </div>
              <p style={{ fontSize: '12px', color: '#475569', margin: '8px 0 12px 0', lineHeight: '1.4' }}>
                Protect your code quality, stop the AI slop.
              </p>
            </div>
            <a href="#" style={{ fontSize: '12px', fontWeight: '700', color: '#e11d48', textDecoration: 'none' }}>Get MCP →</a>
          </div>

        </div>
      </div>

      {/* Main Container: Sidebar + Content */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: '260px 1fr', gap: '40px' }}>
        
        {/* Left Sidebar: Controls & Categories */}
        <aside>
          
          {/* Search Bar */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: '#78716c', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>
              Search MCP Servers
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tools, servers..."
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 36px',
                  borderRadius: '10px',
                  border: '1px solid #e7e5e4',
                  backgroundColor: '#ffffff',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#a8a29e', fontSize: '14px' }}>🔍</span>
            </div>
          </div>

          {/* Sort Dropdown */}
          <div style={{ marginBottom: '28px' }}>
            <label style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: '#78716c', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>
              Sort
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '10px',
                border: '1px solid #e7e5e4',
                backgroundColor: '#ffffff',
                fontSize: '13px',
                fontWeight: '600',
                color: '#292524',
                cursor: 'pointer'
              }}
            >
              <option value="installed">MOST INSTALLED</option>
              <option value="newest">NEWEST SERVERS</option>
              <option value="alphabetical">ALPHABETICAL</option>
            </select>
          </div>

          {/* Categories List */}
          <div>
            <label style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: '#78716c', letterSpacing: '0.05em', display: 'block', marginBottom: '12px' }}>
              Categories
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat.slug;
                return (
                  <button
                    key={cat.slug}
                    onClick={() => setSelectedCategory(cat.slug)}
                    style={{
                      display: 'flex',
                      justify: 'space-between',
                      alignItems: 'center',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: isActive ? '#f5f5f4' : 'transparent',
                      color: isActive ? '#0c0a09' : '#57534e',
                      fontWeight: isActive ? '700' : '500',
                      fontSize: '13px',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <span>{cat.name}</span>
                    <span style={{ fontSize: '11px', color: '#a8a29e' }}>{cat.count}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </aside>

        {/* Right Content Area */}
        <main>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '1px solid #e7e5e4', paddingBottom: '12px', marginBottom: '16px' }}>
            <span style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '0.05em', color: '#78716c', textTransform: 'uppercase' }}>
              {filteredServers.length} MCP SERVERS FOUND
            </span>
            <div style={{ fontSize: '11px', color: '#a8a29e', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', gap: '16px' }}>
              <span>INSTALLS</span>
            </div>
          </div>

          {/* Server Items List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredServers.length > 0 ? (
              filteredServers.map((server, index) => (
                <div
                  key={server.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'space-between',
                    padding: '16px',
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e7e5e4',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: '#a8a29e', width: '20px', paddingTop: '2px' }}>
                      {index + 1}
                    </span>
                    <div style={{ backgroundColor: '#18181b', color: '#ffffff', borderRadius: '8px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '14px' }}>
                      ⚡
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {/* Links directly to /mcp-server/[slug] */}
                        <Link href={`/mcp-server/${server.slug}`} style={{ textDecoration: 'none', color: '#0c0a09', fontWeight: '700', fontSize: '15px' }}>
                          {server.title}
                        </Link>
                        <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#78716c', backgroundColor: '#f5f5f4', padding: '2px 6px', borderRadius: '4px' }}>
                          {server.subtitle}
                        </span>
                      </div>
                      <p style={{ fontSize: '13px', color: '#57534e', margin: '4px 0 0 0', lineHeight: '1.4' }}>
                        {server.description}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: '#292524' }}>
                      {server.installs}
                    </span>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: '#a8a29e' }}>
                      🔖
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: '40px', textAlign: 'center', color: '#78716c', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e7e5e4' }}>
                No MCP servers found matching "{searchQuery}".
              </div>
            )}
          </div>

        </main>

      </div>
    </div>
  );
}
