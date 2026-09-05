import Link from 'next/link'
import { getContentItems } from '../../lib/content'

export default function NewsPage() {
  const articles = getContentItems('news')

  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 12 }}>
          📰 AI News
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 16 }}>
          {articles.length} articles. Auto-curated daily. Humanized and verified.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: 24,
      }}>
        {articles.map(article => (
          <Link
            key={article.slug}
            href={`/news-article/${article.slug}/`}
            className="card"
            style={{ display: 'block', overflow: 'hidden' }}
          >
            {article.image && (
              <div style={{
                height: 180,
                background: `url(${article.image}) center/cover`,
                position: 'relative',
              }}>
                <span className="tag tag-pink" style={{ position: 'absolute', bottom: 10, left: 10 }}>
                  {article.source || 'AI News'}
                </span>
              </div>
            )}
            <div style={{ padding: 18 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 10, lineHeight: 1.4 }}>
                {article.title}
              </h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 12 }}>
                {article.meta_description?.slice(0, 120)}...
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)' }}>
                <span>📅 {article.published_at || 'Recently'}</span>
                {article.manual && <span style={{ color: 'var(--accent)' }}>✍️ Manual</span>}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {articles.length === 0 && (
        <div style={{ textAlign: 'center', padding: 80, color: 'var(--text-muted)' }}>
          <p style={{ fontSize: 18, marginBottom: 12 }}>📭 No news articles yet</p>
          <p>The auto-publisher runs daily at 8 AM UTC. Check back soon!</p>
          <p style={{ marginTop: 16 }}>
            Or <a href="https://github.com/YOUR-USERNAME/YOUR-REPO/issues/new?labels=manual-news" style={{ color: 'var(--accent)' }}>submit one manually via GitHub Issue</a>.
          </p>
        </div>
      )}
    </div>
  )
}
