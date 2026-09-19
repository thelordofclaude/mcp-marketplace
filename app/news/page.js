import Link from 'next/link';
import processedNews from '../../processed-news.json';
import { getContentItem } from '../../lib/content';

/**
 * 1. CLEAN TEXT SANITIZER
 * Strips numeric timestamps (e.g., 202609190808) from both titles and descriptions.
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
 * 2. UNIQUE GRADIENT THUMBNAIL GENERATOR
 * Generates dynamic, distinct color gradients for each article card based on index.
 */
function getArticleGradient(index) {
  const gradients = [
    'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
    'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
    'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
    'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
  ];
  return gradients[index % gradients.length];
}

export default function NewsIndexPage() {
  const rawSlugs = processedNews?.slugs || [];
  const slugs = [...rawSlugs].reverse();

  const articles = slugs
    .slice(0, 100)
    .map((slug, index) => {
      const item = getContentItem('news', slug);
      if (!item) return null;

      return {
        ...item,
        title: sanitizeText(item.title),
        description: sanitizeText(item.description),
        bgGradient: getArticleGradient(index),
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
        {articles.map((article) => (
          <Link key={article.slug} href={`/news-article/${article.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px', backgroundColor: '#ffffff', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)', transition: 'transform 0.2s ease' }}>
              <div>
                {/* Dynamic Gradient Cover */}
                <div style={{ 
                  width: '100%', 
                  height: '160px', 
                  borderRadius: '12px', 
                  marginBottom: '16px', 
                  background: article.bgGradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontSize: '32px'
                }}>
                  ⚡
                </div>

                {/* Title */}
                <h2 style={{ fontSize: '17px', fontWeight: '800', color: '#0f172a', lineHeight: '1.4', margin: '0 0 10px 0' }}>
                  {article.title}
                </h2>

                {/* Clean Description (No raw timestamps) */}
                {article.description && (
                  <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.5', margin: '0 0 16px 0', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {article.description}
                  </p>
                )}
              </div>

              {/* Date Footer */}
              <div style={{ fontSize: '12px', fontWeight: '600', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                📅 {article.date || 'Sep 2026'}
              </div>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}
