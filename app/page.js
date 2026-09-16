import newsData from '../processed-news.json';
import Link from 'next/link';

export default function HomePage() {
  let articles = [];
  if (Array.isArray(newsData)) {
    articles = newsData;
  } else if (newsData && typeof newsData === 'object') {
    articles = newsData.articles || newsData.data || newsData.items || Object.values(newsData).find(Array.isArray) || [];
  }

  const featuredArticle = articles[0] || {};
  const latestNews = articles.slice(1, 5);

  const formatDate = (rawDate) => {
    if (!rawDate) return 'Sep 16, 2026';
    try {
      return new Date(rawDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch (e) {
      return String(rawDate);
    }
  };

  const featuredSlug = featuredArticle.slug || featuredArticle.id || '';
  const featuredImage = featuredArticle.image || featuredArticle.imageUrl || '/logo.png';
  const featuredTitle = featuredArticle.title || 'Context7 MCP Server Raises $3M Seed Round';
  const featuredSummary = featuredArticle.summary || featuredArticle.description || 'The open-source MCP server for up-to-date documentation and code examples.';

  return (
    <div>
      {/* Featured Main Hero Tile */}
      {featuredArticle && (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            backgroundColor: '#0f172a',
            borderRadius: '16px',
            overflow: 'hidden',
            color: '#fff'
          }}>
            <div style={{ flex: '1 1 400px', padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'between' }}>
              <div>
                <span style={{ backgroundColor: '#db2777', color: '#fff', fontSize: '12px', fontWeight: 'bold', padding: '4px 12px', borderRadius: '12px', textTransform: 'uppercase' }}>
                  {featuredArticle.category || 'FEATURED'}
                </span>
                <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginTop: '16px', marginBottom: '12px', lineHeight: '1.3' }}>
                  <Link href={`/news-article/${featuredSlug}`} style={{ color: '#fff', textDecoration: 'none' }}>
                    {featuredTitle}
                  </Link>
                </h1>
                <p style={{ color: '#cbd5e1', fontSize: '15px', lineHeight: '1.5', marginBottom: '20px' }}>
                  {featuredSummary}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: 'auto' }}>
                <Link href={`/news-article/${featuredSlug}`} style={{ backgroundColor: '#db2777', color: '#fff', textDecoration: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px' }}>
                  Read Full Story
                </Link>
                <span style={{ fontSize: '13px', color: '#94a3b8' }}>
                  🗓️ {formatDate(featuredArticle.date || featuredArticle.published_at)}
                </span>
              </div>
            </div>

            <div style={{ flex: '1 1 300px', minHeight: '250px', maxHeight: '350px', overflow: 'hidden' }}>
              <img src={featuredImage} alt={featuredTitle} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </div>
        </div>
      )}

      {/* Small Latest News Grid */}
      <div style={{ maxWidth: '1200px', margin: '30px auto', padding: '0 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
          <h2 style={{ fontSize: '22px', fontStyle: 'normal', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>Latest News</h2>
          <Link href="/news" style={{ color: '#db2777', fontWeight: 'bold', textDecoration: 'none', fontSize: '14px' }}>
            View All News &rarr;
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
          {latestNews.map((article, idx) => {
            const slug = article.slug || article.id || idx;
            const title = article.title || '';
            const img = article.image || article.imageUrl || '/logo.png';
            const cat = article.category || 'AI NEWS';

            return (
              <div key={slug} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ height: '140px', overflow: 'hidden', position: 'relative', backgroundColor: '#f1f5f9' }}>
                    <img src={img} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <span style={{ position: 'absolute', top: '8px', left: '8px', backgroundColor: '#fce7f3', color: '#be185d', fontSize: '10px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '10px', textTransform: 'uppercase' }}>
                      {cat}
                    </span>
                  </div>
                  <div style={{ padding: '14px' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 'bold', margin: '0 0 8px 0', lineHeight: '1.4', color: '#0f172a' }}>
                      <Link href={`/news-article/${slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        {title}
                      </Link>
                    </h3>
                  </div>
                </div>
                <div style={{ padding: '0 14px 14px 14px', fontSize: '12px', color: '#64748b' }}>
                  🗓️ {formatDate(article.date || article.published_at)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
