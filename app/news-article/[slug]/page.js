import { notFound } from 'next/navigation'
import { getContentItem, getAllSlugs } from '../../../lib/content'
import Link from 'next/link'

export function generateStaticParams() {
  try {
    const slugs = getAllSlugs('news') || []
    const mapped = slugs.map((slug) => ({
      slug: typeof slug === 'string' ? slug : slug?.slug || String(slug),
    }))

    // Next.js static export requires at least one param to build.
    if (mapped.length === 0) {
      return [{ slug: 'default' }]
    }

    return mapped
  } catch (error) {
    return [{ slug: 'default' }]
  }
}

export default function NewsArticlePage({ params }) {
  const slug = params?.slug
  
  if (!slug || slug === 'default') {
    return notFound()
  }

  const article = getContentItem('news', slug)

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

      <div style={{ display: 'flex', gap: 16, alignItems: 'center', fontSize: 13, color: 'var(--text-muted)', marginBottom: 32, paddingBottom: 24, borderBottom: '1px solid var(--border)' }}>
        <span>📅 {article.published_at || 'Recently'}</span>
        <span style={{ background: 'rgba(147, 51, 234, 0.1)', color: '#9333ea', padding: '2px 8px', borderRadius: 12, fontWeight: 500 }}>
          {article.category || 'AI & Technology'}
        </span>
      </div>

      <div className="markdown-content" dangerouslySetInnerHTML={{ __html: article.content?.replace(/\n/g, '<br>') || '' }} />

      <div style={{ marginTop: 32 }}>
        <Link href="/news/" style={{ color: 'var(--accent)', fontWeight: 600 }}>
          ← Back to all AI News
        </Link>
      </div>
    </div>
  )
}
