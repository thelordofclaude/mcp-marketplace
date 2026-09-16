import fs from 'fs';
import path from 'path';
import Link from 'next/link';

export const revalidate = 60;

function getNewsArticles() {
  try {
    const newsDir = path.join(process.cwd(), 'content', 'news');
    if (!fs.existsSync(newsDir)) return [];

    const fileNames = fs.readdirSync(newsDir).slice(0, 30);
    const articles = [];

    for (const fileName of fileNames) {
      if (!fileName.endsWith('.json') && !fileName.endsWith('.md')) continue;

      const filePath = path.join(newsDir, fileName);
      const rawContent = fs.readFileSync(filePath, 'utf8');
      const slug = fileName.replace(/\.(json|md)$/, '');

      try {
        const parsed = JSON.parse(rawContent);
        articles.push({
          slug: parsed.slug || slug,
          title: parsed.title || parsed.heading || parsed.headline || slug.replace(/-/g, ' '),
          summary: parsed.summary || parsed.description || parsed.excerpt || '',
          date: parsed.date || parsed.published_at || parsed.created_at || 'Sep 16, 2026',
        });
      } catch (e) {
        articles.push({
          slug,
          title: slug.replace(/-/g, ' '),
          summary: '',
          date: 'Sep 16, 2026',
        });
      }
    }
    return articles;
  } catch (err) {
    return [];
  }
}

export default function DedicatedNewsPage() {
  const articles = getNewsArticles();

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: '800', margin: '0 0 12px 0' }}>📰 AI News & MCP Protocol Updates</h1>
        <p style={{ color: '#64748b', fontSize: '16px' }}>All {articles.length} breaking news articles generated on the platform.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
        {articles.map((article) => (
          <Link key={article.slug} href={`/news-article/${article.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '20px', backgroundColor: '#ffffff', padding: '24px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h2 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 10px 0', lineHeight: '1.4' }}>{article.title}</h2>
                {article.summary && <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.5', margin: 0 }}>{article.summary}</p>}
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '16px' }}>🗓️ {article.date}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
