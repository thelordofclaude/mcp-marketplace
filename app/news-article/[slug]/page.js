'use client'

import { useState, useEffect } from 'react'
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

// Component for Rotating Recent News Bar
function RotatingNewsTiles({ articles }) {
  const [startIndex, setStartIndex] = useState(0)

  useEffect(() => {
    if (articles.length <= 3) return
    const timer = setInterval(() => {
      setStartIndex((prev) => (prev + 1) % articles.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [articles.length])

  if (!articles || articles.length === 0) return null

  // Grab 3 visible items with wrap-around
  const visibleArticles = []
  for (let i = 0; i < Math.min(3, articles.length); i++) {
    const idx = (startIndex + i) % articles.length
    visibleArticles.push(articles[idx])
  }

  return (
    <div style={{
      marginTop: '48px',
      marginBottom: '32px',
      padding: '24px',
      backgroundColor: '#fbfbfe',
      border: '1px solid #ede9fe',
      borderRadius: '20px',
      boxShadow: '0 4px 12px rgba(124, 58, 237, 0.04)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '18px' }}>⚡</span>
          <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#6d28d9', margin: 0, letterSpacing: '0.02em', textTransform: 'uppercase' }}>
            Latest Stories You Might Have Missed
          </h4>
        </div>
        {articles.length > 3 && (
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => setStartIndex((prev) => (prev === 0 ? articles.length - 1 : prev - 1))}
              style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid #ddd6fe', backgroundColor: '#ffffff', cursor: 'pointer', fontWeight: 'bold', color: '#6d28d9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              ‹
            </button>
            <button
              onClick={() => setStartIndex((prev) => (prev + 1) % articles.length)}
              style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid #ddd6fe', backgroundColor: '#ffffff', cursor: 'pointer', fontWeight: 'bold', color: '#6d28d9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              ›
            </button>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        {visibleArticles.map((art, idx) => (
          <Link key={idx} href={`/news-article/${art.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{
              backgroundColor: '#ffffff',
              border: '1px solid #f3e8ff',
              borderRadius: '14px',
              padding: '16px',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justify: 'space-between',
              transition: 'border-color 0.2s ease, transform 0.2s ease',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
            }}>
              <div>
                <span style={{ fontSize: '10px', fontWeight: '800', color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>
                  {art.category || 'AI Update'}
                </span>
                <h5 style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', margin: '0 0 8px 0', lineHeight: '1.35', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {art.title}
                </h5>
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '12px' }}>
                🗓️ {art.published_at ? String(art.published_at).split('T')[0] : 'Recent'}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

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

  // Resolve Author fields with fallbacks
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

  // Filter out top 5 "Most Popular" articles for the rotating bottom tile bar
  const top5PopularSlugs = new Set(sidebarArticles.slice(0, 5).map((a) => a.slug))
  const rotatingBarArticles = sidebarArticles.filter((a) => !top5PopularSlugs.has(a.slug))

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

          {/* PURPLE BRAND AUTHOR CARD */}
          <div style={{
            background: 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)',
            borderRadius: '16px',
            padding: '24px 28px',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '20px',
            boxShadow: '0 10px 25px -5px rgba(124, 58, 237, 0.25)',
            marginBottom: '48px'
          }}>
            <img
              src={authorAvatar}
              alt={authorName}
              style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255, 255, 255, 0.3)', flexShrink: 0 }}
            />
            <div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#ffffff', marginBottom: '4px' }}>
                Written by <span style={{ color: '#fef08a' }}>{authorName}</span>
              </div>
              <div style={{ fontSize: '13px', color: '#ddd6fe', marginBottom: '10px' }}>
                {authorTitle} · <a href={`mailto:${authorEmail}`} style={{ color: '#ffffff', textDecoration: 'underline' }}>{authorEmail}</a>
              </div>
              <p style={{ fontSize: '14px', color: '#f3e8ff', lineHeight: '1.5', margin: 0 }}>
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

          {/* ROTATING RECENT NEWS TILE BAR (Excludes Most Popular) */}
          <RotatingNewsTiles articles={rotatingBarArticles} />

          <div style={{ marginTop: '24px' }}>
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
