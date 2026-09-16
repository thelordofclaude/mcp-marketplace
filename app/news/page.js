import newsData from '../../processed-news.json';
import Link from 'next/link';

export const metadata = {
  title: 'Latest AI News, Claude Updates & Model Context Protocol Breakthroughs',
  description: 'Daily breaking news, expert analysis, and updates covering Anthropic Claude, Model Context Protocol (MCP), frontier AI models, and machine learning infrastructure.',
};

export default function NewsPage() {
  let articles = [];
  if (Array.isArray(newsData)) {
    articles = newsData;
  } else if (newsData && typeof newsData === 'object') {
    articles = newsData.articles || newsData.data || newsData.items || Object.values(newsData).find(Array.isArray) || [];
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
      
      {/* Keyword Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a', marginBottom: '12px' }}>
          📰 AI News & Model Context Protocol Updates
        </h1>
        <p style={{ fontSize: '16px', color: '#475569', maxWidth: '700px', margin: '0 auto' }}>
          Daily coverage of breaking AI developments, Anthropic Claude integrations, frontier LLMs, and MCP ecosystem advances.
        </p>
      </div>

      {/* Grid Rendering All 21 Articles */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
        {articles.map((article, idx) => {
          const slug = article.slug || article.id || idx;
          const title = article.title || '';
          const summary = article.summary || article.description || article.excerpt || '';
          const img = article.image || article.imageUrl || article.thumbnail;
          const cat = article.category || 'AI NEWS';
          const rawDate = article.date || article.published_at || article.timestamp;

          let formattedDate = 'Sep 16, 2026';
          if (rawDate) {
            try {
              formattedDate = new Date(rawDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });
            } catch (e) {
              formattedDate = String(rawDate);
            }
          }

          return (
            <div key={slug} style={{ border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden', backgroundColor: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div>
                {img && (
                  <div style={{ height: '180px', overflow: 'hidden', position: 'relative', backgroundColor: '#f1f5f9' }}>
                    <img src={img} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    {cat && (
                      <span style={{ position: 'absolute', bottom: '12px', left: '12px', backgroundColor: '#fce7f3', color: '#be185d', fontSize: '11px', fontWeight: 'bold', padding: '3px 10px', borderRadius: '12px', textTransform: 'uppercase' }}>
                        {cat}
                      </span>
                    )}
                  </div>
                )}

                <div style={{ padding: '20px' }}>
                  <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 10px 0', lineHeight: '1.4', color: '#0f172a' }}>
                    <Link href={`/news-article/${slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      {title}
                    </Link>
                  </h2>
                  {summary && (
                    <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.5', margin: 0, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {summary}
                    </p>
                  )}
                </div>
              </div>

              <div style={{ padding: '0 20px 20px 20px', fontSize: '13px', color: '#64748b', fontWeight: '500' }}>
                🗓️ <time dateTime={rawDate || '2026-09-16'}>{formattedDate}</time>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
