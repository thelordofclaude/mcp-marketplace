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
  const getSummary = (item) => item?.summary || item?.description || item?.excerpt || item?.content || item?.details || '';
  const getImage = (item) => item?.image || item?.imageUrl || item?.thumbnail || item?.img || '/logo.png';
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
      
      {/* Search Bar */}
      <div style={{ marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="Search Claude skills, MCP servers, plugins, tools, and more..." 
          style={{ width: '100%', maxWidth: '500px', padding: '10px 18px', borderRadius: '24px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
        />
      </div>

      {/* Hero Featured Tile + Top Trending Sidebar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', marginBottom: '32px' }}>
        
        {/* Hero Banner */}
        <div style={{ flex: '2 1 600px', backgroundColor: '#090d16', borderRadius: '24px', padding: '32px', color: '#fff', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyBetween: 'space-between', minHeight: '340px' }}>
          <div style={{ zIndex: 2, maxWidth: '550px' }}>
            <span style={{ backgroundColor: '#db2777', color: '#fff', fontSize: '11px', fontWeight: 'bold', padding: '4px 12px', borderRadius: '12px', textTransform: 'uppercase' }}>
              {featured.category || 'FEATURED'}
            </span>
            <h1 style={{ fontSize: '30px', fontWeight: '800', marginTop: '16px', marginBottom: '12px', lineHeight: '1.2' }}>
              <Link href={`/news-article/${getSlug(featured, 0)}`} style={{ color: '#fff', textDecoration: 'none' }}>
                {getTitle(featured)}
              </Link>
            </h1>
            {getSummary(featured) && (
              <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.5', marginBottom: '24px' }}>
                {getSummary(featured)}
              </p>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Link href={`/news-article/${getSlug(featured, 0)}`} style={{ backgroundColor: '#db2777', color: '#fff', padding: '10px 20px', borderRadius: '10px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>
                Read Full Story
              </Link>
              <span style={{ fontSize: '13px', color: '#64748b' }}>
                🗓️ {formatDate(featured.date || featured.published_at)}
              </span>
            </div>
          </div>
        </div>

        {/* Top Trending Sidebar */}
        <div style={{ flex: '1 1 300px', backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '24px', padding: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 16px 0', color: '#0f172a' }}>Top Trending</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { rank: 1, name: 'Context7', cat: 'Development', count: '2,390', growth: '+18.2%' },
              { rank: 2, name: 'Brave Search', cat: 'Search', count: '2,300', growth: '+18.2%' },
              { rank: 3, name: 'Filesystem', cat: 'Productivity', count: '2,300', growth: '+24.9%' },
              { rank: 4, name: 'GitHub', cat: 'Development', count: '2,300', growth: '+24.8%' },
              { rank: 5, name: 'Notion', cat: 'Productivity', count: '1,800', growth: '+18.5%' },
            ].map((item) => (
              <div key={item.rank} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', pb: '8px' }}>
                <div>
                  <span style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '14px' }}>{item.rank}. {item.name}</span>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>{item.cat}</div>
                </div>
                <div style={{ textAlign: 'right', fontSize: '12px' }}>
                  <div style={{ fontWeight: 'bold', color: '#0f172a' }}>{item.count}</div>
                  <div style={{ color: '#10b981', fontWeight: 'bold' }}>{item.growth}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Latest News Grid + Newsletter Sidebar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
        
        {/* Cards */}
        <div style={{ flex: '2 1 600px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0, color: '#0f172a' }}>Latest News</h2>
            <Link href="/news" style={{ color: '#db2777', textDecoration: 'none', fontWeight: 'bold', fontSize: '13px' }}>View All News &rarr;</Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
            {latestNews.map((article, idx) => {
              const slug = getSlug(article, idx);
              return (
                <div key={slug} style={{ border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden', backgroundColor: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ height: '140px', backgroundColor: '#f8fafc', overflow: 'hidden' }}>
                      <img src={getImage(article)} alt={getTitle(article)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ padding: '16px' }}>
                      <h3 style={{ fontSize: '15px', fontWeight: 'bold', margin: '0 0 8px 0', lineHeight: '1.4', color: '#0f172a' }}>
                        <Link href={`/news-article/${slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          {getTitle(article)}
                        </Link>
                      </h3>
                      <p style={{ fontSize: '12px', color: '#64748b', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {getSummary(article)}
                      </p>
                    </div>
                  </div>
                  <div style={{ padding: '0 16px 16px 16px', fontSize: '12px', color: '#94a3b8' }}>
                    🗓️ {formatDate(article.date || article.published_at)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Newsletter Sidebar */}
        <div style={{ flex: '1 1 300px' }}>
          <div style={{ backgroundColor: '#22d3ee', borderRadius: '24px', padding: '24px', color: '#083344' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginTop: 0, marginBottom: '8px' }}>Join the Newsletter</h3>
            <p style={{ fontSize: '12px', marginBottom: '16px', lineHeight: '1.4' }}>Subscribe for the latest Claude skills, MCP servers, and breaking AI updates.</p>
            <form onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Email Address" 
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: 'none', fontSize: '13px', marginBottom: '10px', outline: 'none' }}
              />
              <button type="submit" style={{ width: '100%', backgroundColor: '#67e8f9', color: '#042f2e', fontWeight: 'bold', padding: '10px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '13px' }}>
                SUBSCRIBE
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
