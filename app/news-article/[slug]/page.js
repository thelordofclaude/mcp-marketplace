import { notFound } from 'next/navigation'
import { getContentItem, getAllSlugs } from '../../../lib/content'
import Link from 'next/link'

export async function generateStaticParams() {
  return getAllSlugs('news')
}

export default function NewsArticlePage({ params }) {
  const article = getContentItem('news', params.slug)

  if (!article) return notFound()

  return (
    <div className="container" style={{ padding: '40px 24px', maxWidth: 720 }}>
      <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>
        <Link href="/" style={{ color: 'var(--text-secondary)' }}>Home</Link>
        {' → '}
        <Link href="/news/" style={{ color: 'var(--text-secondary)' }}>AI News</Link>
        {' → '}
        <span>{article.title?.slice(0, 40)}...</span>
      </div>

      {article.image && (
        <img
          src={article.image}
          alt={article.title}
          style={{ width: '100%', borderRadius: 12, marginBottom: 24 }}
        />
      )}

      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 16, lineHeight: 1.2 }}>
        {article.title}
      </h1>

      <div style={{ display: 'flex', gap: 16, fontSize: 13, color: 'var(--text-muted)', marginBottom: 32, paddingBottom: 24, borderBottom: '1px solid var(--border)' }}>
        <span>📅 {article.published_at || 'Recently'}</span>
        <span>📰 {article.source || 'ClaudeHub'}</span>
        {article.manual && <span style={{ color: 'var(--accent)' }}>✍️ Manually submitted</span>}
      </div>

      <div className="markdown-content" dangerouslySetInnerHTML={{ __html: article.content?.replace(/\n/g, '<br>') || '' }} />

      {article.source_url && (
        <div style={{ marginTop: 32, padding: 16, background: 'var(--surface)', borderRadius: 8 }}>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            Original source: <a href={article.source_url} target="_blank" style={{ color: 'var(--accent)' }}>{article.source_url}</a>
          </p>
        </div>
      )}

      <div style={{ marginTop: 32 }}>
        <Link href="/news/" style={{ color: 'var(--accent)', fontWeight: 600 }}>
          ← Back to all AI News
        </Link>
      </div>
    </div>
  )
}
