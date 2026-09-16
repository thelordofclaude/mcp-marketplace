import newsData from '../../processed-news.json';
import Link from 'next/link';

export const metadata = {
  title: 'Latest AI News, Claude Updates & Model Context Protocol Breakthroughs',
  description: 'Daily coverage of breaking AI developments, Anthropic Claude integrations, frontier LLMs, and MCP ecosystem advances.',
};

export default function NewsPage() {
  let articles = [];
  if (Array.isArray(newsData)) {
    articles = newsData;
  } else if (newsData && typeof newsData === 'object') {
    articles = newsData.articles || newsData.data || newsData.items || Object.values(newsData).find(Array.isArray) || [];
  }

  const getTitle = (item) => item?.title || item?.heading || item?.name || item?.headline || 'AI & MCP Article';
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

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 16px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* Centered Page Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <span>📰</span> AI News & Model Context Protocol Updates
        </h1>
        <p style={{ fontSize: '14px', color: '#64748b', maxWidth: '600px', margin: '0 auto', lineHeight: '1.5' }}>
          Daily coverage of breaking AI developments, Anthropic Claude integrations, frontier LLMs, and MCP ecosystem advances.
        </p>
      </div>

      {/* Grid of Articles */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
        {articles.map((article, idx) => {
          const slug = getSlug(article, idx);
          const title = getTitle(article);
          const img = getImage(article);
          const rawDate = article.date || article.published_at || article.timestamp;

          return (
            <Link key={slug} href={`/news-article/${slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ border: '1px solid #f1f5f9', borderRadius: '20px', overflow: 'hidden', backgroundColor: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                <div>
                  <div style={{ height: '180px', backgroundColor: '#6b21a8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '700', textAlign: 'center', padding: '16px' }}>
                    {img ? <img src={img} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : 'LORD OF CLAUDE'}
                  </div>

                  <div style={{ padding: '20px' }}>
                    <h2 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 8px 0', lineHeight: '1.4', color: '#0f172a' }}>
                      {title}
                    </h2>
                  </div>
                </div>

                <div style={{ padding: '0 20px 20px 20px', fontSize: '12px', color: '#94a3b8' }}>
                  🗓️ <time dateTime={rawDate || '2026-09-16'}>{formatDate(rawDate)}</time>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
