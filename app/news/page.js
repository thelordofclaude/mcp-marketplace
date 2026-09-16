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

  const getTitle = (item) => item?.title || item?.heading || item?.name || item?.headline || 'AI & MCP Article';
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

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 16px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* Page Title Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>
          📰 AI News & Model Context Protocol Updates
        </h1>
        <p style={{ fontSize: '15px', color: '#64748b', maxWidth: '650px', margin: '0 auto' }}>
          Daily coverage of breaking AI developments, Anthropic Claude integrations, frontier LLMs, and MCP ecosystem advances.
        </p>
      </div>

      {/* Grid Rendering 21 Live Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
        {articles.map((article, idx) => {
          const slug = getSlug(article, idx);
          const rawDate = article.date || article.published_at || article.timestamp;

          return (
            <div 
              key={slug} 
              style={{ border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden', backgroundColor: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
            >
              <div>
                <div style={{ height: '160px', backgroundColor: '#f8fafc', overflow: 'hidden' }}>
                  <img src={getImage(article)} alt={getTitle(article)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>

                <div style={{ padding: '20px' }}>
                  <h2 style={{ fontSize: '17px', fontWeight: 'bold', margin: '0 0 10px 0', lineHeight: '1.4', color: '#0f172a' }}>
                    <Link href={`/news-article/${slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      {getTitle(article)}
                    </Link>
                  </h2>
                  {getSummary(article) && (
                    <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.5', margin: 0, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {getSummary(article)}
                    </p>
                  )}
                </div>
              </div>

              <div style={{ padding: '0 20px 20px 20px', fontSize: '12px', color: '#94a3b8', fontWeight: '500' }}>
                🗓️ <time dateTime={rawDate || '2026-09-16'}>{formatDate(rawDate)}</time>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
