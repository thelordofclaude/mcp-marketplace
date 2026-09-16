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

  const getTitle = (item) => item?.title || item?.heading || item?.name || item?.headline || item?.topic || 'AI & Model Context Protocol News';
  const getSummary = (item) => item?.summary || item?.description || item?.excerpt || item?.content || item?.body || '';
  const getImage = (item) => item?.image || item?.imageUrl || item?.thumbnail || item?.img || item?.cover || null;
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
  // Takes ALL remaining articles (from index 1 to the end) instead of slicing only 4
  const latestNews = articles.slice(1);

  return (
    <div style={{ width: '100%', padding: '24px 32px', boxSizing: 'border-box', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#0f172a' }}>
      
      {/* Search Bar UI */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px', width: '100%' }}>
        <form 
          onSubmit={(e) => e.preventDefault()}
          style={{ 
            position: 'relative', 
            width: '100%', 
            maxWidth: '720px',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <span style={{ position: 'absolute', left: '18px', fontSize: '16px', color: '#94a3b8', pointerEvents: 'none' }}>
            🔍
          </span>

          <input 
            type="text" 
            placeholder="Search Claude skills, MCP servers, plugins, tools..." 
            style={{ 
              width: '100%', 
              padding: '14px 130px 14px 48px', 
              borderRadius: '9999px', 
              border: '2px solid #e2e8f0', 
              fontSize: '14px', 
              outline: 'none', 
              backgroundColor: '#ffffff',
              boxShadow: '0 8px 24px rgba(15, 23, 42, 0.04)',
              boxSizing: 'border-box',
              color: '#0f172a'
            }}
          />

          <span style={{
            position: 'absolute',
            right: '100px',
            backgroundColor: '#f1f5f9',
            border: '1px solid #cbd5e1',
            color: '#64748b',
            borderRadius: '6px',
            padding: '2px 7px',
            fontSize: '11px',
            fontWeight: '700',
            pointerEvents: 'none'
          }}>
            ⌘K
          </span>

          <button
            type="submit"
            style={{
              position: 'absolute',
              right: '6px',
              backgroundColor: '#ec4899',
              color: '#ffffff',
              border: 'none',
              padding: '9px 18px',
              borderRadius: '9999px',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(236, 72, 153, 0.3)'
            }}
          >
            Search
          </button>
        </form>
      </div>

      {/* Category Tiles */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '32px' }}>
        {[
          { icon: '🔹', name: 'Context7', tag: 'MCP Server' },
          { icon: '🦁', name: 'Brave Search', tag: 'MCP Server' },
          { icon: '🐙', name: 'GitHub', tag: 'MCP Server' },
          { icon: '⚡', name: 'Supabase', tag: 'MCP Server' },
          { icon: '📝', name: 'Notion', tag: 'MCP Server' }
        ].map((item, idx) => (
          <div 
            key={idx} 
            style={{ 
              backgroundColor: '#f8fafc', 
              border: '1px solid #e2e8f0', 
              padding: '7px 16px', 
              borderRadius: '9999px', 
              fontSize: '13px', 
              fontWeight: '600', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
            }}
          >
            <span style={{ fontSize: '14px' }}>{item.icon}</span> 
            <span style={{ color: '#0f172a' }}>{item.name}</span> 
            <span style={{ color: '#64748b', fontWeight: '500', fontSize: '12px' }}>{item.tag}</span>
          </div>
        ))}
      </div>

      {/* Hero Block & Trending Sidebar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '28px', marginBottom: '40px' }}>
        
        {/* Main Hero Card */}
        <div style={{ backgroundColor: '#090d16', borderRadius: '24px', padding: '36px', color: '#ffffff', position: 'relative', overflow: 'hidden', minHeight: '340px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ zIndex: 2, maxWidth: '580px' }}>
            <span style={{ backgroundColor: '#ec4899', color: '#ffffff', fontSize: '11px', fontWeight: '800', padding: '4px 12px', borderRadius: '9999px', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'inline-block', marginBottom: '16px' }}>
              {featured.category || 'FEATURED'}
            </span>
            <h1 style={{ fontSize: '32px', fontWeight: '800', margin: '0 0 12px 0', lineHeight: '1.2' }}>
              <Link href={`/news-article/${getSlug(featured, 0)}`} style={{ color: '#ffffff', textDecoration: 'none' }}>
                {getTitle(featured)}
              </Link>
            </h1>
            {getSummary(featured) && (
              <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.6', margin: '0 0 24px 0' }}>
                {getSummary(featured)}
              </p>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Link href={`/news-article/${getSlug(featured, 0)}`} style={{ backgroundColor: '#ec4899', color: '#ffffff', padding: '10px 22px', borderRadius: '12px', textDecoration: 'none', fontWeight: '700', fontSize: '14px', display: 'inline-block' }}>
                Read Full Story
              </Link>
              <span style={{ fontSize: '13px', color: '#94a3b8' }}>
                🗓️ {formatDate(featured.date || featured.published_at)}
              </span>
            </div>
          </div>
          {getImage(featured) && (
            <img src={getImage(featured)} alt="" style={{ position: 'absolute', right: 0, top: 0, width: '50%', height: '100%', objectFit: 'cover', opacity: 0.2, pointerEvents: 'none' }} />
          )}
        </div>

        {/* Top Trending Sidebar */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #f1f5f9', borderRadius: '24px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', margin: 0 }}>Top Trending</h3>
            <div style={{ backgroundColor: '#f8fafc', padding: '3px', borderRadius: '8px', display: 'flex', gap: '4px' }}>
              <button style={{ backgroundColor: '#ec4899', color: '#ffffff', border: 'none', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}>MCP Servers</button>
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
              <div key={item.rank} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f8fafc', paddingBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontWeight: '800', fontSize: '13px' }}>{item.rank}.</span>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '13px' }}>{item.name}</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>{item.cat}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right', fontSize: '12px' }}>
                  <div style={{ fontWeight: '800' }}>{item.count}</div>
                  <div style={{ color: '#10b981', fontWeight: '700' }}>{item.growth}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Full Articles Section & Sidebar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '28px' }}>
        
        {/* Complete Latest News Grid (Displays all remaining 20 articles) */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '800', margin: 0 }}>Latest News</h2>
            <Link href="/news" style={{ color: '#ec4899', textDecoration: 'none', fontWeight: '700', fontSize: '13px' }}>View Dedicated News Page &rarr;</Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
            {latestNews.map((article, idx) => {
              const slug = getSlug(article, idx + 1);
              const title = getTitle(article);
              const img = getImage(article);

              return (
                <Link key={slug} href={`/news-article/${slug}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                  <div style={{ border: '1px solid #f1f5f9', borderRadius: '20px', overflow: 'hidden', backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                    <div>
                      <div style={{ height: '160px', backgroundColor: '#6b21a8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontWeight: '800', textAlign: 'center', padding: '16px', fontSize: '18px', letterSpacing: '0.5px' }}>
                        {img ? <img src={img} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : 'LORD OF CLAUDE'}
                      </div>
                      <div style={{ padding: '16px' }}>
                        <h3 style={{ fontSize: '14px', fontWeight: '700', margin: '0 0 8px 0', lineHeight: '1.4' }}>
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

        {/* Sticky Sidebar with Newsletter */}
        <div>
          <div style={{ position: 'sticky', top: '80px', backgroundColor: '#00d8f6', borderRadius: '24px', padding: '28px', color: '#042f2e', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '800', margin: '0 0 10px 0' }}>Join the Newsletter</h3>
            <p style={{ fontSize: '13px', margin: '0 0 20px 0', lineHeight: '1.5', color: '#083344', fontWeight: '500' }}>
              Subscribe for the latest Claude skills, MCP servers, and breaking AI updates.
            </p>
            <form onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Email Address" 
                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: 'none', fontSize: '14px', marginBottom: '12px', outline: 'none', boxSizing: 'border-box', backgroundColor: '#ffffff', color: '#0f172a' }}
              />
              <button type="submit" style={{ width: '100%', backgroundColor: '#00b5ce', color: '#ffffff', fontWeight: '800', padding: '12px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                SUBSCRIBE
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
