import Link from 'next/link';
import processedNews from '../processed-news.json';
import { getContentItem } from '../lib/content';

export default function HomePage() {
  const slugs = processedNews?.slugs || [];

  // Hydrate full content items for real dates, images, and descriptions on the server
  const articles = slugs
    .map((slug) => getContentItem('news', slug))
    .filter(Boolean);

  const featured = articles[0] || {};
  const latestNews = articles.slice(1);
  const tickerItems = articles.slice(0, 5); // Ticker tile dataset

  return (
    <div style={{ width: '100%', padding: '24px 32px', boxSizing: 'border-box', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#0f172a' }}>
      
      {/* Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px', width: '100%' }}>
        <form style={{ position: 'relative', width: '100%', maxWidth: '720px', display: 'flex', alignItems: 'center' }}>
          <span style={{ position: 'absolute', left: '18px', fontSize: '16px', color: '#94a3b8', pointerEvents: 'none' }}>🔍</span>
          <input 
            type="text" 
            placeholder="Search Claude skills, MCP servers, plugins, tools..." 
            style={{ width: '100%', padding: '14px 130px 14px 48px', borderRadius: '9999px', border: '2px solid #e2e8f0', fontSize: '14px', outline: 'none', backgroundColor: '#ffffff', boxShadow: '0 8px 24px rgba(15, 23, 42, 0.04)', boxSizing: 'border-box', color: '#0f172a' }}
          />
          <span style={{ position: 'absolute', right: '100px', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', color: '#64748b', borderRadius: '6px', padding: '2px 7px', fontSize: '11px', fontWeight: '700', pointerEvents: 'none' }}>⌘K</span>
          <button type="submit" style={{ position: 'absolute', right: '6px', backgroundColor: '#ec4899', color: '#ffffff', border: 'none', padding: '9px 18px', borderRadius: '9999px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 2px 8px rgba(236, 72, 153, 0.3)' }}>Search</button>
        </form>
      </div>

      {/* Featured Hero Block */}
      {featured.title && (
        <div style={{ backgroundColor: '#090d16', borderRadius: '24px', padding: '36px', color: '#ffffff', marginBottom: '32px', position: 'relative', overflow: 'hidden' }}>
          <span style={{ backgroundColor: '#ec4899', color: '#ffffff', fontSize: '11px', fontWeight: '800', padding: '4px 12px', borderRadius: '9999px', textTransform: 'uppercase', display: 'inline-block', marginBottom: '16px' }}>FEATURED</span>
          <h1 style={{ fontSize: '32px', fontWeight: '800', margin: '0 0 12px 0' }}>
            <Link href={`/news-article/${featured.slug}`} style={{ color: '#ffffff', textDecoration: 'none' }}>
              {featured.title}
            </Link>
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.6', margin: '0 0 24px 0' }}>{featured.description || featured.summary}</p>
          <Link href={`/news-article/${featured.slug}`} style={{ backgroundColor: '#ec4899', color: '#ffffff', padding: '10px 22px', borderRadius: '12px', textDecoration: 'none', fontWeight: '700', fontSize: '14px', display: 'inline-block' }}>Read Story</Link>
        </div>
      )}

      {/* Continuously Moving News Strip Ticker */}
      <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', marginBottom: '40px', background: '#f8fafc', padding: '12px 0', border: '1px solid #e2e8f0', borderRadius: '16px' }}>
        <div style={{ display: 'inline-flex', gap: '16px', animation: 'marquee 25s linear infinite' }}>
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <Link key={i} href={`/news-article/${item.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ minWidth: '260px', padding: '10px 16px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', display: 'inline-block' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#ec4899', display: 'block' }}>⚡ BREAKING</span>
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', whiteSpace: 'normal', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {item.title}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Grid Section Title */}
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a' }}>AI News & Protocol Updates</h2>
        <p style={{ fontSize: '14px', color: '#64748b', margin: '4px 0 0 0' }}>All breaking news articles generated on the platform.</p>
      </div>

      {/* Grid of Articles */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {latestNews.map((article) => (
          <Link key={article.slug} href={`/news-article/${article.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '20px', overflow: 'hidden', backgroundColor: '#ffffff', padding: '20px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
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

    </div>
  );
}
