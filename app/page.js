import fs from 'fs';
import path from 'path';
import Link from 'next/link';

function getNewsArticles() {
  const newsDir = path.join(process.cwd(), 'content', 'news');
  if (!fs.existsSync(newsDir)) return [];

  const fileNames = fs.readdirSync(newsDir);
  return fileNames
    .filter((file) => file.endsWith('.json') || file.endsWith('.md'))
    .map((fileName) => {
      const filePath = path.join(newsDir, fileName);
      const rawContent = fs.readFileSync(filePath, 'utf8');
      const slug = fileName.replace(/\.(json|md)$/, '');

      try {
        const parsed = JSON.parse(rawContent);
        return {
          slug: parsed.slug || slug,
          title: parsed.title || parsed.heading || parsed.headline || slug.replace(/-/g, ' '),
          summary: parsed.summary || parsed.description || parsed.excerpt || '',
          date: parsed.date || parsed.published_at || parsed.created_at || 'Sep 16, 2026',
          image: parsed.image || parsed.imageUrl || null,
        };
      } catch (e) {
        return {
          slug,
          title: slug.replace(/-/g, ' '),
          summary: '',
          date: 'Sep 16, 2026',
          image: null,
        };
      }
    });
}

export default function HomePage() {
  const articles = getNewsArticles();
  const featured = articles[0] || {};
  const latestNews = articles.slice(1);

  return (
    <div style={{ width: '100%', padding: '24px 32px', boxSizing: 'border-box', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#0f172a' }}>
      
      {/* Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px', width: '100%' }}>
        <form onSubmit={(e) => e.preventDefault()} style={{ position: 'relative', width: '100%', maxWidth: '720px', display: 'flex', alignItems: 'center' }}>
          <span style={{ position: 'absolute', left: '18px', fontSize: '16px', color: '#94a3b8', pointerEvents: 'none' }}>🔍</span>
          <input 
            type="text" 
            placeholder="Search Claude skills, MCP servers, plugins, tools..." 
            style={{ width: '100%', padding: '14px 130px 14px 48px', borderRadius: '9999px', border: '2px solid #e2e8f0', fontSize: '14px', outline: 'none', backgroundColor: '#ffffff', boxShadow: '0 8px 24px rgba(15, 23, 42, 0.04)', boxSizing: 'border-box', color: '#0f172a' }}
          />
          <span style={{ position: 'absolute', right: '100px', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', color: '#64748b', borderRadius: '6px', padding: '2px 7px', fontSize: '11px', fontWeight: '700', pointerEvents: 'none' }}>⌘K</span>
          <button type="submit" style={{ position: 'absolute', right: '6px', backgroundColor: '#ec4899', color: '#ffffff', border: 'none', padding: '9px 18px', borderRadius: '9999px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 2px 8px rgba(236, 72, 153, 0.3)' }}>Search</button>
        </form>
      </div>

      {/* Hero Block */}
      {featured.title && (
        <div style={{ backgroundColor: '#090d16', borderRadius: '24px', padding: '36px', color: '#ffffff', marginBottom: '40px', position: 'relative', overflow: 'hidden' }}>
          <span style={{ backgroundColor: '#ec4899', color: '#ffffff', fontSize: '11px', fontWeight: '800', padding: '4px 12px', borderRadius: '9999px', textTransform: 'uppercase', display: 'inline-block', marginBottom: '16px' }}>FEATURED</span>
          <h1 style={{ fontSize: '32px', fontWeight: '800', margin: '0 0 12px 0' }}>
            <Link href={`/news-article/${featured.slug}`} style={{ color: '#ffffff', textDecoration: 'none' }}>
              {featured.title}
            </Link>
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.6', margin: '0 0 24px 0' }}>{featured.summary}</p>
          <Link href={`/news-article/${featured.slug}`} style={{ backgroundColor: '#ec4899', color: '#ffffff', padding: '10px 22px', borderRadius: '12px', textDecoration: 'none', fontWeight: '700', fontSize: '14px', display: 'inline-block' }}>Read Story</Link>
        </div>
      )}

      {/* Grid of All Real Articles */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        {latestNews.map((article) => (
          <Link key={article.slug} href={`/news-article/${article.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ border: '1px solid #f1f5f9', borderRadius: '20px', overflow: 'hidden', backgroundColor: '#ffffff', padding: '20px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: '700', margin: '0 0 10px 0', lineHeight: '1.4' }}>{article.title}</h3>
                <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.5', margin: 0 }}>{article.summary}</p>
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '16px' }}>🗓️ {article.date}</div>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}
