import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export async function GET() {
  const baseUrl = 'https://www.lordofclaude.com';

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

  let dynamicPages = [];

  try {
    const [{ data: skills }, { data: mcpServers }, { data: newsArticles }] = await Promise.all([
      supabase.from('claude_skills').select('slug, updated_at'),
      supabase.from('mcp_servers').select('slug, updated_at'),
      supabase.from('news_articles').select('slug, updated_at'),
    ]);

    if (skills) {
      skills.forEach((item) => {
        dynamicPages.push({
          url: `${baseUrl}/claude-skill/${item.slug}`,
          lastMod: item.updated_at ? new Date(item.updated_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          priority: '0.7',
        });
      });
    }

    if (mcpServers) {
      mcpServers.forEach((item) => {
        dynamicPages.push({
          url: `${baseUrl}/mcp-server/${item.slug}`,
          lastMod: item.updated_at ? new Date(item.updated_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          priority: '0.7',
        });
      });
    }

    if (newsArticles) {
      newsArticles.forEach((item) => {
        dynamicPages.push({
          url: `${baseUrl}/news-article/${item.slug}`,
          lastMod: item.updated_at ? new Date(item.updated_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          priority: '0.6',
        });
      });
    }
  } catch (error) {
    console.error('Error fetching dynamic sitemap routes:', error);
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
