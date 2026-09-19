'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

const CATEGORIES = [
  { name: 'Official', slug: 'official' },
  { name: 'Databases', slug: 'database' },
  { name: 'DevOps & Cloud', slug: 'devops' },
  { name: 'Developer Tools', slug: 'devtools' },
  { name: 'Testing & QA', slug: 'testing' },
  { name: 'Backend & APIs', slug: 'backend' },
];

const AI_TOOLS = [
  { name: 'Claude Desktop', icon: '🤖', desc: 'Anthropic Official Client' },
  { name: 'Cursor', icon: '⚡', desc: 'AI-First Code Editor' },
  { name: 'v0 by Vercel', icon: '▲', desc: 'Generative UI System' },
  { name: 'Continue', icon: '💡', desc: 'Open-source AI Extension' },
];

const FEATURED_SKILLS = [
  { name: 'Web Scraping & DOM Search', command: 'npx -y @modelcontextprotocol/server-puppeteer', category: 'Automation', rating: '4.9 ★' },
  { name: 'PostgreSQL Query Runner', command: 'npx -y @modelcontextprotocol/server-postgres', category: 'Database', rating: '4.8 ★' },
  { name: 'GitHub PR & Issue Management', command: 'npx -y @modelcontextprotocol/server-github', category: 'Developer Tools', rating: '5.0 ★' },
  { name: 'Brave Web Search API', command: 'npx -y @modelcontextprotocol/server-brave-search', category: 'Search', rating: '4.7 ★' },
];

const CLIENT_GUIDES = [
  { name: 'Claude Desktop', file: 'claude_desktop_config.json', config: '{\n  "mcpServers": {\n    "github": {\n      "command": "npx",\n      "args": ["-y", "@modelcontextprotocol/server-github"]\n    }\n  }\n}' },
  { name: 'Cursor IDE', file: '.cursor/mcp.json', config: '{\n  "mcpServers": {\n    "postgres": {\n      "command": "npx",\n      "args": ["-y", "@modelcontextprotocol/server-postgres"]\n    }\n  }\n}' },
];

const MCP_SERVERS = [
  { id: '5ire-mcp', title: '5ire MCP Server', slug: '5ire-mcp-server', subtitle: '5ire-io/mcp-server', description: 'Cross-platform desktop AI assistant and MCP client compatible with major AI workflows.', category: 'backend', installs: '5.3K', verified: true },
  { id: 'api-mcp', title: 'Best API MCP Servers', slug: 'best-api-mcp-servers', subtitle: 'mcp/api-tools', description: 'Connect frontier models directly to REST and GraphQL APIs with automated schema mapping.', category: 'backend', installs: '12.4K', verified: true },
  { id: 'browser-mcp', title: 'Best Browser MCP Servers', slug: 'best-browser-mcp-servers', subtitle: 'mcp/browser-automation', description: 'Autonomous web browsing and DOM extraction for Claude and Cursor agents.', category: 'testing', installs: '8.9K', verified: false },
  { id: 'database-mcp', title: 'PostgreSQL & Database MCP', slug: 'database-mcp-servers', subtitle: 'mcp/database-connector', description: 'Safe read/write database connectors for Postgres, MySQL, and SQLite.', category: 'database', installs: '15.1K', verified: true },
  { id: 'devops-mcp', title: 'DevOps & CI/CD MCP', slug: 'devops-mcp-servers', subtitle: 'mcp/devops-pipeline', description: 'Monitor deployment pipelines, logs, and server health from within Claude.', category: 'devops', installs: '7.2K', verified: false },
  { id: 'filesystem-mcp', title: 'Filesystem MCP Server', slug: 'filesystem-mcp-server', subtitle: 'mcp/filesystem-tools', description: 'Secure local filesystem access and operations for developer AI agents.', category: 'devtools', installs: '22.8K', verified: true }
];

export default function MCPServersPage() {
  const [activeTab, setActiveTab] = useState('mcp');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredServers = useMemo(() => {
    return MCP_SERVERS.filter((server) => {
      const matchesSearch =
        server.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        server.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        server.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || server.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div style={{ backgroundColor: '#faf8f5', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#1c1917' }}>
      
      {/* Upper Header & Search Bar */}
      <div style={{ maxWidth: '900px', margin: '0 auto', paddingTop: '40px', paddingLeft: '24px', paddingRight: '24px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', backgroundColor: '#e9d5ff', padding: '4px', borderRadius: '9999px', marginBottom: '16px', gap: '4px' }}>
          <button onClick={() => setActiveTab('skills')} style={{ padding: '8px 20px', borderRadius: '9999px', border: 'none', fontSize: '12px', fontWeight: '800', cursor: 'pointer', backgroundColor: activeTab === 'skills' ? '#8b5cf6' : 'transparent', color: activeTab === 'skills' ? '#ffffff' : '#6b21a8' }}>SKILLS</button>
          <button onClick={() => setActiveTab('mcp')} style={{ padding: '8px 20px', borderRadius: '9999px', border: 'none', fontSize: '12px', fontWeight: '800', cursor: 'pointer', backgroundColor: activeTab === 'mcp' ? '#8b5cf6' : 'transparent', color: activeTab === 'mcp' ? '#ffffff' : '#6b21a8' }}>MCP SERVERS</button>
          <button onClick={() => setActiveTab('tools')} style={{ padding: '8px 20px', borderRadius: '9999px', border: 'none', fontSize: '12px', fontWeight: '800', cursor: 'pointer', backgroundColor: activeTab === 'tools' ? '#8b5cf6' : 'transparent', color: activeTab === 'tools' ? '#ffffff' : '#6b21a8' }}>AI TOOLS</button>
        </div>

        <div style={{ position: 'relative', width: '100%', marginBottom: '24px' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search MCP servers, tools, or skills..."
            style={{ width: '100%', padding: '16px 20px 16px 48px', fontSize: '15px', borderRadius: '16px', border: '1px solid #e7e5e4', backgroundColor: '#ffffff', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', outline: 'none', boxSizing: 'border-box' }}
          />
          <span style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', fontSize: '18px', color: '#a8a29e' }}>🔍</span>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '32px' }}>
          <button onClick={() => setSelectedCategory('all')} style={{ padding: '6px 14px', borderRadius: '9999px', border: '1px solid #e7e5e4', fontSize: '13px', fontWeight: '600', cursor: 'pointer', backgroundColor: selectedCategory === 'all' ? '#18181b' : '#ffffff', color: selectedCategory === 'all' ? '#ffffff' : '#44403c' }}>All</button>
          {CATEGORIES.map((cat) => (
            <button key={cat.slug} onClick={() => setSelectedCategory(cat.slug)} style={{ padding: '6px 14px', borderRadius: '9999px', border: '1px solid #e7e5e4', fontSize: '13px', fontWeight: '600', cursor: 'pointer', backgroundColor: selectedCategory === cat.slug ? '#18181b' : '#ffffff', color: selectedCategory === cat.slug ? '#ffffff' : '#44403c' }}>{cat.name}</button>
          ))}
        </div>
      </div>

      {/* AI Tools Bar */}
      <div style={{ maxWidth: '1000px', margin: '0 auto 40px auto', padding: '0 24px' }}>
        <h3 style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: '#78716c', letterSpacing: '0.05em', marginBottom: '12px' }}>Popular Compatible AI Clients</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '12px' }}>
          {AI_TOOLS.map((tool) => (
            <div key={tool.name} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e7e5e4' }}>
              <span style={{ fontSize: '20px' }}>{tool.icon}</span>
              <div>
                <div style={{ fontWeight: '700', fontSize: '13px' }}>{tool.name}</div>
                <div style={{ fontSize: '11px', color: '#78716c' }}>{tool.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MCP Servers List */}
      <div style={{ maxWidth: '1000px', margin: '0 auto 60px auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e7e5e4', paddingBottom: '12px', marginBottom: '16px' }}>
          <span style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '0.05em', color: '#78716c', textTransform: 'uppercase' }}>{filteredServers.length} MCP SERVERS DIRECTORY</span>
          <span style={{ fontSize: '11px', color: '#a8a29e', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>INSTALLS</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredServers.map((server, index) => (
            <div key={server.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px', backgroundColor: '#ffffff', borderRadius: '14px', border: '1px solid #e7e5e4', boxShadow: '0 2px 6px rgba(0,0,0,0.01)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#a8a29e', width: '20px' }}>{index + 1}</span>
                <div style={{ backgroundColor: '#18181b', color: '#ffffff', borderRadius: '10px', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '16px' }}>⚡</div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <Link href={`/mcp-server/${server.slug}`} style={{ textDecoration: 'none', color: '#0c0a09', fontWeight: '700', fontSize: '16px' }}>{server.title}</Link>
                    {server.verified && <span style={{ backgroundColor: '#dcfce7', color: '#15803d', fontSize: '10px', fontWeight: '800', padding: '2px 6px', borderRadius: '4px' }}>OFFICIAL</span>}
                    <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#78716c', backgroundColor: '#f5f5f4', padding: '2px 6px', borderRadius: '4px' }}>{server.subtitle}</span>
                  </div>
                  <p style={{ fontSize: '13px', color: '#57534e', margin: '4px 0 0 0', lineHeight: '1.4' }}>{server.description}</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontSize: '14px', fontWeight: '700', color: '#18181b' }}>{server.installs}</span>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: '#a8a29e' }}>🔖</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* LOWER SECTION 1: Trending Skills Grid */}
      <div style={{ backgroundColor: '#f5f3ff', borderTop: '1px solid #e9d5ff', borderBottom: '1px solid #e9d5ff', padding: '60px 24px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#4c1d95', margin: '0 0 4px 0' }}>Trending MCP Agent Skills</h2>
            <p style={{ fontSize: '14px', color: '#6d28d9', margin: 0 }}>Instant execution capabilities ready to drop into Claude or Cursor.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            {FEATURED_SKILLS.map((skill) => (
              <div key={skill.name} style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '16px', border: '1px solid #ddd6fe' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: '800', color: '#7c3aed', backgroundColor: '#f3e8ff', padding: '2px 8px', borderRadius: '6px' }}>{skill.category}</span>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: '#d97706' }}>{skill.rating}</span>
                </div>
                <h4 style={{ fontSize: '14px', fontWeight: '700', margin: '0 0 12px 0' }}>{skill.name}</h4>
                <div style={{ backgroundColor: '#faf8f5', padding: '8px 10px', borderRadius: '6px', fontFamily: 'monospace', fontSize: '11px', color: '#57534e', overflowX: 'auto' }}>
                  {skill.command}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* LOWER SECTION 2: Client Quickstart Configuration Code Blocks */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '60px 24px' }}>
        <div style={{ marginBottom: '28px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '800', margin: '0 0 8px 0' }}>How to Install MCP Servers</h2>
          <p style={{ fontSize: '14px', color: '#78716c', margin: 0 }}>Copy the standard configuration into your preferred AI client setup file.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {CLIENT_GUIDES.map((guide) => (
            <div key={guide.name} style={{ backgroundColor: '#ffffff', border: '1px solid #e7e5e4', borderRadius: '16px', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontWeight: '800', fontSize: '15px' }}>{guide.name}</span>
                <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#78716c', backgroundColor: '#f5f5f4', padding: '2px 8px', borderRadius: '6px' }}>{guide.file}</span>
              </div>
              <pre style={{ backgroundColor: '#0f172a', color: '#e2e8f0', padding: '14px', borderRadius: '10px', fontSize: '12px', fontFamily: 'monospace', overflowX: 'auto', margin: 0 }}>
                {guide.config}
              </pre>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
