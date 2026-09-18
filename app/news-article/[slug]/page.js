import { notFound } from 'next/navigation'
import { getContentItem, getAllSlugs } from '../../../lib/content'
import Link from 'next/link'
import NewsSidebar from '../../../components/NewsSidebar'
import ArticleCommentsAndDiscussion from '../../../components/ArticleCommentsAndDiscussion'

// Fallback author metadata defaults
const DEFAULT_AUTHOR = {
  name: "Jamie O'Brien",
  title: "Silicon Valley Bureau Chief",
  email: "jamie@lordofclaude.com",
  bio: "Jamie has been reporting from Palo Alto since 2012. He previously covered enterprise software at Bloomberg and holds deep source relationships across major AI labs.",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80"
}

// Sample community responses fallback
const SAMPLE_COMMUNITY_RESPONSES = [
  {
    id: 1,
    name: "Alex Rivera",
    handle: "@alexrivera_ai",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    comment: "Great analysis. The integration complexity seems lower than expected, which could accelerate enterprise adoption.",
    claps: 42
  },
  {
    id: 2,
    name: "Michael Chang",
    handle: "@mchang_gpu",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    comment: "Great analysis. The integration complexity seems lower than expected, which could accelerate enterprise adoption.",
    claps: 116
  }
]

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

  // Safely format published_at
  const formattedDate = article.published_at
    ? article.published_at instanceof Date
      ? article.published_at.toISOString().split('T')[0]
      : String(article.published_at)
    : 'Recently'

  // Resolve Author fields with fallbacks (handles string or object metadata)
  const authorName = typeof article.author === 'object' ? article.author?.name : (article.author || DEFAULT_AUTHOR.name)
  const authorTitle = article.author_title || article.author?.role || DEFAULT_AUTHOR.title
  const authorEmail = article.author_email || DEFAULT_AUTHOR.email
  const authorBio = article.author_bio || DEFAULT_AUTHOR.bio
  const authorAvatar = article.author_avatar || article.author?.image || DEFAULT_AUTHOR.avatar

  // Sidebar and related articles
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
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '32px 20px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
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
            style={{ fontSize: '16px', lineHeight: '1.75', color: '#374151', marginBottom: '40px' }}
            dangerouslySetInnerHTML={{ __html: secondHalf || '' }} 
          />

          {/* Dark Theme Author Card */}
          <div style={{
            backgroundColor: '#0f172a',
            borderRadius: '16px',
            padding: '24px 28px',
            color: '#f8fafc',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '20px',
            boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.3)',
            marginBottom: '48px'
          }}>
            <img
              src={authorAvatar}
              alt={authorName}
              style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #334155', flexShrink: 0 }}
            />
            <div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#ffffff', marginBottom: '4px' }}>
                Written by <span style={{ color: '#60a5fa' }}>{authorName}</span>
              </div>
              <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '10px' }}>
                {authorTitle} · <a href={`mailto:${authorEmail}`} style={{ color: '#38bdf8', textDecoration: 'none' }}>{authorEmail}</a>
              </div>
              <p style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: '1.5', margin: 0 }}>
                {authorBio}
              </p>
            </div>
          </div>

          {/* Community Responses Section */}
          <section style={{ borderTop: '1px solid #e2e8f0', paddingTop: '32px', marginBottom: '40px' }}>
            <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', marginBottom: '24px' }}>
              Community Responses
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {SAMPLE_COMMUNITY_RESPONSES.map((resp) => (
                <div key={resp.id} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <img
                    src={resp.avatar}
                    alt={resp.name}
                    style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>{resp.name}</span>
                      <span style={{ fontSize: '13px', color: '#64748b' }}>{resp.handle}</span>
                    </div>
                    <p style={{ fontSize: '14px', color: '#334155', lineHeight: '1.5', margin: '0 0 8px 0' }}>
                      {resp.comment}
                    </p>
                    <div style={{ fontSize: '13px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>👏</span>
                      <span>{resp.claps} claps</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Interactive Comments & Discussion Component */}
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
