import { notFound } from 'next/navigation'
import { getContentItem, getAllSlugs } from '../../../lib/content'
import Link from 'next/link'
import NewsSidebar from '../../../components/NewsSidebar'
import ArticleCommentsAndDiscussion from '../../../components/ArticleCommentsAndDiscussion'

// Required for static site export
export async function generateStaticParams() {
  try {
    const slugs = getAllSlugs('news') || []
    return slugs.map((slug) => ({
      slug: typeof slug === 'string' ? slug : slug?.slug || String(slug),
    }))
  } catch (error) {
    return [{ slug: 'default' }]
  }
}

export default function NewsArticlePage({ params }) {
  const slug = params?.slug

  if (!slug || slug === 'default') return notFound()

  const article = getContentItem('news', slug)
  if (!article) return notFound()

  // Safely format published_at to avoid [object Date] error
  const formattedDate = article.published_at
    ? article.published_at instanceof Date
      ? article.published_at.toISOString().split('T')[0]
      : String(article.published_at)
    : 'Recently'

  // Fetch all articles for sidebar and related content
  const rawSlugs = getAllSlugs('news') || []
  const allArticles = rawSlugs
    .map((s) => {
      const itemSlug = typeof s === 'string' ? s : s?.slug
      return itemSlug ? getContentItem('news', itemSlug) : null
    })
    .filter(Boolean)

  const sidebarArticles = allArticles.filter((item) => item.slug !== slug)
  const relatedArticles = sidebarArticles.slice(0, 2)

  // Split content paragraph array to insert "Also Read"
  const contentParagraphs = article.content ? article.content.split('\n\n') : []
  const midIndex = Math.ceil(contentParagraphs.length / 2)
  const firstHalf = contentParagraphs.slice(0, midIndex).join('<br/><br/>')
  const secondHalf = contentParagraphs.slice(midIndex).join('<br/><br/>')

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '32px 20px' }}>
      
      {/* Breadcrumbs */}
      <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '20px' }}>
        <Link href="/" style={{ color: '#4b5563', textDecoration: 'none' }}>Home</Link>
        {' → '}
        <Link href="/news/" style={{ color: '#4b5563', textDecoration: 'none' }}>AI News</Link>
        {' → '}
        <span>{article.title?.slice(0, 40)}...</span>
      </div>

      {/* Main Container: Two-Column Flex Grid */}
      <div style={{ display: 'flex', flexDirection: 'row', gap: '48px', alignItems: 'flex-start' }}>
        
        {/* Left Column: Main Article Body */}
        <main style={{ flex: '1 1 0%', minWidth: 0 }}>
          
          <h1 style={{ fontSize: '32px', fontWeight: '800', lineHeight: '1.25', color: '#111827', marginBottom: '16px' }}>
            {article.title}
          </h1>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', fontSize: '13px', color: '#6b7280', marginBottom: '24px' }}>
            <span>📅 {formattedDate}</span>
            <span style={{ background: '#f3e8ff', color: '#9333ea', padding: '2px 10px', borderRadius: '12px', fontWeight: '600' }}>
              {article.category || 'AI & Technology'}
            </span>
          </div>

          {article.image && (
            <img
              src={article.image}
              alt={article.title}
              style={{ width: '100%', borderRadius: '12px', marginBottom: '28px', objectFit: 'cover', maxHeight: '420px' }}
            />
          )}

          {/* First Half of Content */}
          <div 
            className="markdown-content" 
            style={{ fontSize: '16px', lineHeight: '1.75', color: '#374151' }}
            dangerouslySetInnerHTML={{ __html: firstHalf || '' }} 
          />

          {/* ALSO READ SECTION */}
          {relatedArticles.length > 0 && (
            <div style={{
              margin: '36px 0',
              padding: '20px 24px',
              backgroundColor: '#f8fafc',
              borderLeft: '4px solid #00bcff',
              borderRadius: '0 12px 12px 0',
              borderTop: '1px solid #e2e8f0',
              borderRight: '1px solid #e2e8f0',
              borderBottom: '1px solid #e2e8f0'
            }}>
              <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase', color: '#00bcff', display: 'block', marginBottom: '10px' }}>
                📌 ALSO READ
              </span>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {relatedArticles.map((rel, idx) => (
                  <li key={idx} style={{ fontSize: '15px', fontWeight: '700' }}>
                    <Link href={`/news-article/${rel.slug}`} style={{ color: '#0f172a', textDecoration: 'none' }}>
                      → {rel.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Second Half of Content */}
          <div 
            className="markdown-content" 
            style={{ fontSize: '16px', lineHeight: '1.75', color: '#374151' }}
            dangerouslySetInnerHTML={{ __html: secondHalf || '' }} 
          />

          {/* Author Card */}
          {article.author && (
            <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#f9fafb', borderRadius: '12px', border: '1px solid #f3f4f6', display: 'flex', gap: '16px', alignItems: 'center' }}>
              {article.author.image && (
                <img src={article.author.image} alt={article.author.name} style={{ width: '48px', height: '48px', borderRadius: '50%' }} />
              )}
              <div>
                <div style={{ fontWeight: '700', fontSize: '14px', color: '#111827' }}>Written by {article.author.name}</div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>{article.author.role}</div>
              </div>
            </div>
          )}

          {/* Interactive Client Component for Comments */}
          <ArticleCommentsAndDiscussion initialComments={article.comments || []} />

          <div style={{ marginTop: '32px' }}>
            <Link href="/news/" style={{ color: '#9333ea', fontWeight: '600', textDecoration: 'none' }}>
              ← Back to all AI News
            </Link>
          </div>
        </main>

        {/* Right Column: News Sidebar */}
        <NewsSidebar articles={sidebarArticles} />

      </div>
    </div>
  )
}
