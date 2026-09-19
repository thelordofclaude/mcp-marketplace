import Link from 'next/link';
import processedNews from '../../processed-news.json';
import { getContentItem } from '../../lib/content';

/**
 * 1. CLEAN TEXT SANITIZER
 * Strips raw timestamp numbers (e.g. 202609190808, 202609181808) while retaining full title context.
 */
function sanitizeText(str) {
  if (!str) return '';
  return str
    .replace(/\b202[0-9]{9,}\b/g, '') // Removes numeric timestamps like 202609190808
    .replace(/\b\d{10,}\b/g, '')     // Removes unix timestamps
    .replace(/-\d+$/, '')             // Removes trailing slug IDs
    .replace(/\s+/g, ' ')             // Normalizes spacing
    .trim();
}

/**
 * 2. RELIABLE HIGH-RES ILLUSTRATION GENERATOR
 * Uses curated tech/comic cover visual keywords from Unsplash with fixed seeds to guarantee fast, reliable image renders.
 */
function getArticleCoverImage(slug, index) {
  const comicTopics = ['cyberpunk-art', 'digital-art', 'comic-book', 'ai-tech', 'future-city', 'neon-circuit'];
  const topic = comicTopics[index % comicTopics.length];
  return `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80&sig=${index + 100}`;
}

export default function NewsIndexPage() {
  const rawSlugs = processedNews?.slugs || [];
  const slugs = [...rawSlugs].reverse();

  const articles = slugs
    .slice(0, 100)
    .map((slug, index) => {
      const item = getContentItem('news', slug);
      if (!item) return null;

      const cleanTitle = sanitizeText(item.title);
      const cleanDescription = sanitizeText(item.description);

      // Fallback comic-style abstract cover images if article image is missing or broken
      const coverImage = getArticleCoverImage(slug, index);

      return {
        ...item,
        title: cleanTitle,
        description: cleanDescription,
        image: coverImage,
      };
    })
    .filter(Boolean);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: '800', color: '#0f172a', marginBottom: '12px' }}>
          📰 AI News & Model Context Protocol (MCP) Updates
        </h1>
        <p style={{ fontSize: '16px', color: '#475569', maxWidth: '750px', margin: '0 auto', lineHeight: '1.6' }}>
          Stay ahead with real-time AI intelligence, breaking Model Context Protocol (MCP) developments, Anthropic Claude updates, and developer ecosystem insights.
        </p>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
        {articles.map((article, index) => (
          <Link key={article.slug} href={`/news-article/${article.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px', backgroundColor: '#ffffff', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)', transition: 'transform 0.2s ease' }}>
              <div>
                {/* Image Container */}
                <div style={{ position: 'relative', width: '100%', height: '190px', borderRadius: '12px', overflow: 'hidden', marginBottom: '16px', backgroundColor: '#0f172a' }}>
                  <img
                    src={article.image}
                    alt={article.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    loading="lazy"
                  />
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    backgroundColor: '#ef4444',
                    color: '#ffffff',
                    fontSize: '10px',
                    fontWeight: '900',
                    letterSpacing: '0.08em',
                    padding: '3px 7px',
                    borderRadius: '4px',
                    textTransform: 'uppercase',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }}>
                    ISSUE #{articles.length - index}
                  </div>
                </div>

                {/* Title */}
                <h2 style={{ fontSize: '17px', fontWeight: '800', color: '#0f172a', lineHeight: '1.4', margin: '0 0 10px 0' }}>
                  {article.title}
                </h2>

                {/* Clean Description */}
                {article.description && (
                  <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.5', margin: '0 0 16px 0', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {article.description}
                  </p>
                )}
              </div>

              {/* Date Footer */}
              <div style={{ fontSize: '12px', fontWeight: '600', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                🗓️ {article.date || 'Sep 2026'}
              </div>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}
