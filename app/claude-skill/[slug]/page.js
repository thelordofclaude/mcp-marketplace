import { getContentItem, getAllSlugs } from '../../../lib/content'
import { notFound } from 'next/navigation'

export function generateStaticParams() {
  try {
    const slugs = getAllSlugs('claude-skill') || []
    const mapped = slugs.map((slug) => ({
      slug: typeof slug === 'string' ? slug : slug?.slug || String(slug),
    }))
    return mapped.length > 0 ? mapped : [{ slug: 'default' }]
  } catch (error) {
    return [{ slug: 'default' }]
  }
}

export default function ClaudeSkillPage({ params }) {
  const slug = params?.slug
  if (!slug || slug === 'default') return notFound()

  const item = getContentItem('claude-skill', slug)
  if (!item) return notFound()

  return (
    <div className="container" style={{ padding: '40px 24px', maxWidth: 720 }}>
      <h1>{item.title}</h1>
      <div className="markdown-content" dangerouslySetInnerHTML={{ __html: item.content }} />
    </div>
  )
}
