import Link from 'next/link';
import processedNews from '../../processed-news.json';
import { getContentItem } from '../../lib/content';

/**
 * 1. SANITIZE HEADLINES
 * Strips out timestamp numbers (e.g. 202609180808, unix timestamps) and date strings.
 */
function cleanTitle(rawTitle) {
  if (!rawTitle) return '';
  return rawTitle
    .replace(/\b202[0-9]{9,}\b/g, '') // Strips concatenated timestamps like 202609180808
    .replace(/\b\d{10,}\b/g, '')     // Strips unix timestamps
    .replace(/\b\d{4}-\d{2}-\d{2}\b/g, '') // Strips YYYY-MM-DD
    .replace(/:\s*Next-Gen Breakthrough.*/i, '') // Trims repetitive template suffixes
    .replace(/-\d+$/, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * 2. COMIC MAGAZINE IMAGE GENERATOR
 * Generates comic book style cover art and appends nologo=true to strip Pollinations watermark.
 */
function getComicMagazineImageUrl(title, seed = 1) {
  const sanitized = cleanTitle(title);
  
  // Retro dynamic comic book magazine cover prompt
  const comicPrompt = `vintage comic book cover art, dynamic graphic novel style, bold dark ink lineart, halftone dot shading, retro pop art comic panel illustration, subject: ${sanitized}, highly detailed digital comic art`;

  const encodedPrompt = encodeURIComponent(comicPrompt);

  // model=flux for sharp graphic outputs; nologo=true strips the watermark
  return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=800&height=500&seed=${seed}&model=flux&nologo=true`;
}

export default function NewsIndexPage() {
  // Reversing slugs puts the latest articles at the top
  const rawSlugs = processedNews?.slugs || [];
  const slugs = [...rawSlugs].reverse();

  const articles = slugs
    .slice(0, 100)
    .map((slug, index) => {
      const item = getContentItem('news', slug);
      if (!item) return null;

      const title = cleanTitle(item.title);
      // Generate a comic magazine cover image overriding existing images
      const comicImage = getComicMagazineImageUrl(title, index * 107 + 42);

      return {
        ...item,
        title,
        image: comicImage,
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
                {/* Comic Style Card Image Container */}
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

                <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', lineHeight: '1.4', margin: '0 0 12px 0' }}>
                  {article.title}
                </h2>

                {article.description && (
                  <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.5', margin: '0 0 16px 0', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {article.description}
                  </p>
                )}
              </div>

              <div style={{ fontSize: '13px', fontWeight: '600', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                🗓️ {article.date || 'Sep 2026'}
              </div>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}
