import Link from 'next/link';
import processedNews from '../processed-news.json';
import { getContentItem } from '../lib/content';

function cleanTitle(rawTitle) {
  if (!rawTitle) return '';
  return rawTitle
    .replace(/-\d+$/, '')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function HomePage() {
  // Reversing slugs puts the newest articles first
  const rawSlugs = processedNews?.slugs || [];
  const slugs = [...rawSlugs].reverse();

  const articles = slugs
    .slice(0, 100)
    .map((slug) => {
      const item = getContentItem('news', slug);
      if (!item) return null;
      return {
        ...item,
        title: cleanTitle(item.title),
      };
    })
    .filter(Boolean);

  const featured = articles[0] || {};
  const latestNews = articles.slice(1, 100);
  const tickerItems = articles.slice(0, 5);

  return (
    <div style={{ width: '100%', padding: '24px 32px', boxSizing: 'border-box', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#0f172a' }}>
      
      {/* Featured Hero Block */}
      {featured.title && (
        <div style={{ backgroundColor: '#090d16', borderRadius: '24px', padding: '36px', color: '#ffffff', marginBottom: '32px' }}>
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

      {/* Grid Header */}
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a' }}>AI News & Protocol Updates</h2>
        <p style={{ fontSize: '14px', color: '#64748b', margin: '4px 0 0 0' }}>Latest breaking stories and developments.</p>
      </div>

      {/* Grid of Articles */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {latestNews.map((article) => (
          <Link key={article.slug} href={`/news-article/${article.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
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
                🗓️ {article.date || 'Sep 2026'}
              </div>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}
