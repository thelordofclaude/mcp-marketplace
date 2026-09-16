import newsArticles from '../../processed-news.json';
import mcpServers from '../../processed-mcp.json';
import claudeSkills from '../../processed-skills.json';

export async function GET() {
  const baseUrl = 'https://www.lordofclaude.com';

  // 1. Core Static Pages
  const staticPages = [
    '',
    '/mcp-servers',
    '/claude-skills',
    '/news',
    '/submit',
    '/advertise',
    '/about',
    '/contact',
    '/help',
    '/community-guidelines',
    '/newsletters',
    '/careers',
    '/ad-choices',
    '/cookie-notice',
    '/ca-notice',
    '/closed-captioning',
    '/disclaimer',
    '/privacy-policy',
    '/terms-of-service',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastMod: new Date().toISOString().split('T')[0],
    priority: route === '' ? '1.0' : '0.8',
  }));

  // 2. Dynamic Pages from Local JSON Archives
  const dynamicPages = [];

  if (Array.isArray(claudeSkills)) {
    claudeSkills.forEach((item) => {
      const slug = item.slug || item.id;
      if (slug) {
        dynamicPages.push({
          url: `${baseUrl}/claude-skill/${slug}`,
          lastMod: new Date().toISOString().split('T')[0],
          priority: '0.7',
        });
      }
    });
  }

  if (Array.isArray(mcpServers)) {
    mcpServers.forEach((item) => {
      const slug = item.slug || item.id;
      if (slug) {
        dynamicPages.push({
          url: `${baseUrl}/mcp-server/${slug}`,
          lastMod: new Date().toISOString().split('T')[0],
          priority: '0.7',
        });
      }
    });
  }

  if (Array.isArray(newsArticles)) {
    newsArticles.forEach((item) => {
      const slug = item.slug || item.id;
      if (slug) {
        dynamicPages.push({
          url: `${baseUrl}/news-article/${slug}`,
          lastMod: new Date().toISOString().split('T')[0],
          priority: '0.6',
        });
      }
    });
  }

  const allPages = [...staticPages, ...dynamicPages];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (page) => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastMod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}
