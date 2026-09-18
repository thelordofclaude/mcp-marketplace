import processedNews from '../processed-news.json';
import { getContentItem } from '../lib/content';
import SearchAndSidebar from './SearchAndSidebar';

function cleanTitle(rawTitle) {
  if (!rawTitle) return '';
  return rawTitle
    .replace(/-\d+$/, '')
    .replace(/\d{8,}/g, '')
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim();
}

// Safely format dates to string
function formatDate(dateVal) {
  if (!dateVal) return 'Sep 2026';
  if (dateVal instanceof Date) {
    return dateVal.toISOString().split('T')[0];
  }
  if (typeof dateVal === 'object') {
    return String(dateVal);
  }
  return String(dateVal);
}

const TRENDING_MCP_SERVERS = [
  { name: 'PostgreSQL MCP', category: 'Database', slug: 'postgresql-mcp' },
  { name: 'Brave Search MCP', category: 'Search & Web', slug: 'brave-search-mcp' },
  { name: 'GitHub Integration', category: 'Developer Tools', slug: 'github-mcp' },
  { name: 'Puppeteer Browser', category: 'Automation', slug: 'puppeteer-mcp' },
  { name: 'Filesystem Access', category: 'Core Utilities', slug: 'filesystem-mcp' },
];

const TRENDING_CLAUDE_SKILLS = [
  { name: 'Next.js 15 App Router Expert', category: 'Web Dev', slug: 'nextjs-15-expert' },
  { name: 'Python Code Optimization', category: 'Development', slug: 'python-code-opt' },
  { name: 'UI/UX Design Systems', category: 'Frontend', slug: 'ui-ux-design-systems' },
  { name: 'Tailwind CSS Generator', category: 'Styling', slug: 'tailwind-css-generator' },
];

export default function HomePage() {
  const rawSlugs = processedNews?.slugs || [];
  const slugs = [...rawSlugs].reverse();

  const articles = slugs
    .slice(0, 100)
    .map((slug) => {
      const item = getContentItem('news', slug);
      if (!item) return null;
      return {
        ...item,
        slug,
        type: 'News Article',
        link: `/news-article/${slug}`,
        title: cleanTitle(item.title),
        date: formatDate(item.date || item.published_at),
      };
    })
    .filter(Boolean);

  const featured = articles[0] || {};
  const latestNews = articles.slice(1, 100);

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 32px', boxSizing: 'border-box', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#0f172a' }}>
      <SearchAndSidebar
        articles={articles}
        featured={featured}
        latestNews={latestNews}
        trendingServers={TRENDING_MCP_SERVERS}
        trendingSkills={TRENDING_CLAUDE_SKILLS}
      />
    </div>
  );
}
