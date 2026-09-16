import newsData from '../processed-news.json';
import Link from 'next/link';

export default function HomePage() {
  // Extract live articles defensively
  let articles = [];
  if (Array.isArray(newsData)) {
    articles = newsData;
  } else if (newsData && typeof newsData === 'object') {
    articles = newsData.articles || newsData.data || newsData.items || Object.values(newsData).find(Array.isArray) || [];
  }

  // Assign live featured article and latest news items
  const featuredArticle = articles[0] || {
    title: 'Context7 MCP Server Raises $3M Seed Round',
    summary: 'The open-source MCP server for up-to-date documentation and code examples.',
    slug: 'context7-mcp-server',
    date: 'Sep 16, 2026',
    category: 'FEATURED'
  };

  const latestNews = articles.slice(1, 5);

  const formatDate = (rawDate) => {
    if (!rawDate) return 'Sep 16, 2026';
    try {
      return new Date(rawDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch (e) {
      return String(rawDate);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        
        {/* Main Hero Featured Article Tile */}
        <section className="relative rounded-3xl overflow-hidden bg-slate-900 text-white shadow-xl grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-7 p-8 lg:p-12 flex flex-col justify-between space-y-6">
            <div>
              <span className="inline-block bg-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
                {featuredArticle.category || 'FEATURED'}
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                <Link href={`/news-article/${featuredArticle.slug || featuredArticle.id || ''}`} className="hover:underline">
                  {featuredArticle.title}
                </Link>
              </h1>
              <p className="mt-4 text-slate-300 text-base sm:text-lg line-clamp-3">
                {featuredArticle.summary || featuredArticle.description}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link 
                href={`/news-article/${featuredArticle.slug || featuredArticle.id || ''}`}
                className="bg-pink-600 hover:bg-pink-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
              >
                Read Full Story
              </Link>
              <span className="text-sm text-slate-400 flex items-center">
                🗓️ {formatDate(featuredArticle.date || featuredArticle.published_at)}
              </span>
            </div>
          </div>

          <div className="lg:col-span-5 relative min-h-[300px] bg-slate-800">
            <img 
              src={featuredArticle.image || featuredArticle.imageUrl || '/logo.png'} 
              alt={featuredArticle.title} 
              className="w-full h-full object-cover"
            />
          </div>
        </section>

        {/* Latest News Grid Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-gray-200 pb-4">
            <h2 className="text-2xl font-bold text-gray-900">Latest News</h2>
            <Link href="/news" className="text-pink-600 hover:text-pink-700 text-sm font-semibold">
              View All News &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {latestNews.map((article, idx) => {
              const slug = article.slug || article.id || idx;
              return (
                <div key={slug} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                  <div>
                    <div className="relative h-44 w-full bg-gray-100 overflow-hidden">
                      <img 
                        src={article.image || article.imageUrl || '/logo.png'} 
                        alt={article.title} 
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-3 left-3 bg-pink-100 text-pink-700 text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase">
                        {article.category || 'AI NEWS'}
                      </span>
                    </div>

                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 text-base line-clamp-2 hover:text-blue-600 transition-colors">
                        <Link href={`/news-article/${slug}`}>
                          {article.title}
                        </Link>
                      </h3>
                    </div>
                  </div>

                  <div className="p-4 pt-0 text-xs text-gray-500 flex items-center">
                    <span className="mr-1">🗓️</span>
                    <time dateTime={article.date || '2026-09-16'}>
                      {formatDate(article.date || article.published_at)}
                    </time>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </div>
    </div>
  );
}
