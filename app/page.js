'use client';

import newsData from '../processed-news.json';
import Link from 'next/link';

export default function HomePage() {
  let articles = [];
  if (Array.isArray(newsData)) {
    articles = newsData;
  } else if (newsData && typeof newsData === 'object') {
    articles = newsData.articles || newsData.data || newsData.items || Object.values(newsData).find(Array.isArray) || [];
  }

  const getTitle = (item) => item?.title || item?.heading || item?.name || item?.headline || 'AI & Model Context Protocol News';
  const getSummary = (item) => item?.summary || item?.description || item?.excerpt || item?.content || '';
  const getImage = (item) => item?.image || item?.imageUrl || item?.thumbnail || item?.img || null;
  const getSlug = (item, idx) => item?.slug || item?.id || idx;

  const formatDate = (rawDate) => {
    if (!rawDate) return 'Sep 16, 2026';
    try {
      return new Date(rawDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch (e) {
      return String(rawDate);
    }
  };

  const featured = articles[0] || {};
  const latestNews = articles.slice(1, 5);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* Search Input Bar */}
      <div style={{ marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="Search Claude skills, MCP servers, plugins, tools, and more..." 
          style={{ width: '100%', maxWidth: '460px', padding: '10px 18px', borderRadius: '24px', border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
        />
      </div>

      {/* Server Category Pills */}
      <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', marginBottom: '24px', fontSize: '13px', color: '#334155' }}>
        {[
          { icon: '🔹', name: 'Context7', type: 'MCP Server' },
          { icon: '🦁', name: 'Brave Search', type: 'MCP Server' },
          { icon: '🐙', name: 'GitHub', type: 'MCP Server' },
          { icon: '⚡', name: 'Supabase', type: 'MCP Server' },
          { icon: '📝', name: 'Notion', type: 'MCP Server' }
        ].map((pill, i) => (
          <span key={i} style={{ backgroundColor: '#f1f5f9', padding: '6px 14px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap', cursor: 'pointer', fontWeight: '600' }}>
            <span>{pill.icon}</span> {pill.name} <span style={{ color: '#94a3b8', fontWeight: '400' }}>{pill.type}</span>
          </span>
        ))}
      </div>

      {/* Hero Banner + Top Trending Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        
        {/* Main Hero Section */}
        <div style={{ backgroundColor: '#090d16', borderRadius: '24px', padding: '36px', color: '#fff', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '340px' }}>
          <div style={{ zIndex: 2, maxWidth: '580px' }}>
            <span style={{ backgroundColor: '#ec4899', color: '#fff', fontSize: '11px', fontWeight: '800', padding: '4px 12px', borderRadius: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {featured.category || 'FEATURED'}
            </span>
            <h1 style={{ fontSize: '32px', fontWeight: '800', marginTop: '18px', marginBottom: '14px', lineHeight: '1.2' }}>
              <Link href={`/news-article/${getSlug(featured, 0)}`} style={{ color: '#fff', textDecoration: 'none' }}>
                {getTitle(featured)}
              </Link>
            </h1>
            {getSummary(featured) && (
              <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.6', marginBottom: '24px' }}>
                {getSummary(featured)}
              </p>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Link href={`/news-article/${getSlug(featured, 0)}`} style={{ backgroundColor: '#ec4899', color: '#fff', padding: '10px 22px', borderRadius: '12px', textDecoration: 'none', fontWeight: '700', fontSize: '14px' }}>
                Read Full Story
              </Link>
              <span style={{ fontSize: '13px', color: '#94a3b8' }}>
                🗓️ {formatDate(featured.date || featured.published_at)}
              </span>
            </div>
          </div>
          {getImage(featured) && (
            <img src={getImage(featured)} alt="Hero background" style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '50%', height: '100%', objectFit: 'cover', opacity: 0.25, pointerEvents: 'none' }} />
          )}
        </div>

        {/* Top Trending Sidebar */}
        <div style={{ backgroundColor: '#fff', border: '1px solid #f1f5f9', borderRadius: '24px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: '800', margin: 0, color: '#0f172a' }}>Top Trending</h3>
            <div style={{ backgroundColor: '#f8fafc', padding: '3px', borderRadius: '8px', display: 'flex', gap: '4px' }}>
              <button style={{ backgroundColor: '#ec4899', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}>MCP Servers</button>
              <button style={{ backgroundColor: 'transparent', color: '#64748b', border: 'none', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>Skills</button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { rank: 1, name: 'Context7', cat: 'Development', count: '2,390', growth: '+18.2%' },
              { rank: 2, name: 'Brave Search', cat: 'Search', count: '2,300', growth: '+18.2%' },
              { rank: 3, name: 'Filesystem', cat: 'Productivity', count: '2,300', growth: '+24.9%' },
              { rank: 4, name: 'GitHub', cat: 'Development', count: '2,300', growth: '+24.8%' },
              { rank: 5, name: 'Notion', cat: 'Productivity', count: '1,800', growth: '+18.5%' },
            ].map((item) => (
              <div key={item.rank} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f8fafc', paddingBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontWeight: '800', color: '#0f172a', fontSize: '14px' }}>{item.rank}.</span>
                  <div>
                    <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '14px' }}>{item.name}</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>{item.cat}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right', fontSize: '12px' }}>
                  <div style={{ fontWeight: '800', color: '#0f172a' }}>{item.count}</div>
                  <div style={{ color: '#10b981', fontWeight: '700' }}>{item.growth}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Latest News & Newsletter Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        
        {/* Cards Column */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '800', margin: 0, color: '#0f172a' }}>Latest News</h2>
            <Link href="/news" style={{ color: '#ec4899', textDecoration: 'none', fontWeight: '700', fontSize: '13px' }}>View All News &rarr;</Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
            {latestNews.map((article, idx) => {
              const slug = getSlug(article, idx);
              const title = getTitle(article);
              const img = getImage(article);

              return (
                <Link key={slug} href={`/news-article/${slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ border: '1px solid #f1f5f9', borderRadius: '20px', overflow: 'hidden', backgroundColor: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                    <div>
                      <div style={{ height: '160px', backgroundColor: '#6b21a8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '700', textAlign: 'center', padding: '16px' }}>
                        {img ? <img src={img} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : 'LORD OF CLAUDE'}
                      </div>
                      <div style={{ padding: '16px' }}>
                        <h3 style={{ fontSize: '15px', fontWeight: '700', margin: '0 0 8px 0', lineHeight: '1.4', color: '#0f172a' }}>
                          {title}
                        </h3>
                      </div>
                    </div>
                    <div style={{ padding: '0 16px 16px 16px', fontSize: '12px', color: '#94a3b8' }}>
                      🗓️ {formatDate(article.date || article.published_at)}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Newsletter Widget */}
        <div>
          <div style={{ backgroundColor: '#00d8f6', borderRadius: '24px', padding: '28px', color: '#042f2e', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
            <h3 style={{ fontSize: '22px', fontWeight: '800', marginTop: 0, marginBottom: '10px' }}>Join the Newsletter</h3>
            <p style={{ fontSize: '13px', marginBottom: '20px', lineHeight: '1.5', color: '#083344', fontWeight: '500' }}>
              Subscribe for the latest Claude skills, MCP servers, and breaking AI updates.
            </p>
            <form onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Email Address" 
                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: 'none', fontSize: '14px', marginBottom: '12px', outline: 'none', boxSizing: 'border-box' }}
              />
              <button type="submit" style={{ width: '100%', backgroundColor: '#00c2de', color: '#042f2e', fontWeight: '800', padding: '12px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                SUBSCRIBE
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
