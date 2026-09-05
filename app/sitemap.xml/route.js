export async function GET() {
  const baseUrl = 'https://mcp-marketplace.vercel.app'

  const urls = [
    { loc: baseUrl, priority: '1.0' },
    { loc: `${baseUrl}/mcp-servers/`, priority: '0.8' },
    { loc: `${baseUrl}/claude-skills/`, priority: '0.8' },
    { loc: `${baseUrl}/news/`, priority: '0.8' },
    { loc: `${baseUrl}/submit/`, priority: '0.5' },
    { loc: `${baseUrl}/advertise/`, priority: '0.5' },
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls
    .map(
      (u) => `
    <url>
      <loc>${u.loc}</loc>
      <priority>${u.priority}</priority>
      <changefreq>weekly</changefreq>
    </url>`
    )
    .join('')}
</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}
