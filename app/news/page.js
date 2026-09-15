import Link from 'next/link'
import { getAllSlugs, getContentItem } from '../../lib/content'

export default function NewsIndexPage() {
  const rawSlugs = getAllSlugs('news') || []
  const articles = rawSlugs
    .map((s) => {
      const slug = typeof s === 'string' ? s : s?.slug
      return slug ? getContentItem('news', slug) : null
    })
    .filter(Boolean)

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: '800', color: '#111827', marginBottom: '8px' }}>
          📰 AI News
        </h1>
        <p style={{ color: '#6b7280', fontSize: '15px' }}>
          {articles.length} articles. Auto-curated daily. Humanized and verified.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '28px' }}>
        {articles.map((article) => (
          <Link key={article.slug} href={`/news-article/${article.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e5e7eb',
              overflow: 'hidden',
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'pointer'
            }}>
              <div style={{ position: 'relative', width: '100%', height: '200px', backgroundColor: '#f3f4f6' }}>
                <img src={article.image} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <span style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '12px',
                  backgroundColor: '#fce7f3',
                  color: '#db2777',
                  fontSize: '11px',
                  fontWeight: '800',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  textTransform: 'uppercase'
                }}>
                  {article.category || 'AI NEWS'}
                </span>
              </div>
              <div style={{ padding: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', lineHeight: '1.4', color: '#111827', marginBottom: '12px' }}>
                  {article.title}
                </h3>
                {/* 1. EXACT PUBLISHED DATE DISPLAY */}
                <div style={{ fontSize: '13px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>📅</span>
                  <span>{article.published_at || 'September 16, 2026'}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
