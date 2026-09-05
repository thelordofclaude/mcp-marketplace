import { getAllSlugs } from '../../lib/content'

export async function GET() {
  const baseUrl = 'https://yourdomain.com'

  const mcpSlugs = getAllSlugs('mcp-servers')
  const skillSlugs = getAllSlugs('claude-skills')
  const newsSlugs = getAllSlugs('news')

  const urls = [
    { loc: `${baseUrl}/`, priority: '1.0' },
    { loc: `${baseUrl}/mcp-servers/`, priority: '0.9' },
    { loc: `${baseUrl}/claude-skills/`, priority: '0.9' },
    { loc: `${baseUrl}/news/`, priority: '0.9' },
    { loc: `${baseUrl}/submit/`, priority: '0.5' },
    { loc: `${baseUrl}/advertise/`, priority: '0.5' },
    ...mcpSlugs.map(s => ({ loc: `${baseUrl}/mcp-server/${s.slug}/`, priority: '0.8' })),
    ...skillSlugs.map(s => ({ loc: `${baseUrl}/claude-skill/${s.slug}/`, priority: '0.8' })),
    ...newsSlugs.map(s => ({ loc: `${baseUrl}/news-article/${s.slug}/`, priority: '0.7' })),
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <priority>${u.priority}</priority>
    <changefreq>weekly</changefreq>
  </url>`).join('
')}
</urlset>`

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' }
  })
}
