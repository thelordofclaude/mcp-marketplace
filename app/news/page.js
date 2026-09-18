import Link from 'next/link';
import processedNews from '../../processed-news.json';
import { getContentItem } from '../../lib/content';

function cleanTitle(rawTitle) {
  if (!rawTitle) return '';
  return rawTitle
    .replace(/-\d+$/, '')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function NewsIndexPage() {
  // Reversing slugs puts the latest articles (Sept 15, 16, 17...) at the top
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

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: '800', color: '#0f172a', marginBottom: '12px' }}>
          📰 AI News & Model Context Protocol (MCP) Updates
        </h1>
        <p style={{ fontSize: '16px', color: '#475569', maxWidth: '750px', margin: '0 auto', lineHeight: '1.6' }}>
          Stay ahead with real-time AI intelligence, breaking Model Context Protocol (MCP) developments, Anthropic Claude updates, and developer ecosystem insights.
        </p>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
        {articles.map((article) => (
          <Link key={article.slug} href={`/news-article/${article.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', backgroundColor: '#ffffff', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)' }}>
              <div>
                {article.image && (
                  <img src={article.image} alt={article.title} style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '10px', marginBottom: '16px' }} />
                )}
                <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', lineHeight: '1.4', margin: '0 0 12px 0' }}>
                  {article.title}
                </h2>
                {article.description && (
                  <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.5', margin: '0 0 16px 0', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {article.description}
                  </p>
                )}
              </div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                🗓️ {article.date || 'Sep 2026'}
              </div>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}
