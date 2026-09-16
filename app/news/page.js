import newsData from '../../processed-news.json';
import Link from 'next/link';

export const metadata = {
  title: 'Latest AI News, Claude Updates & Model Context Protocol Breakthroughs',
  description: 'Daily breaking news, expert analysis, and updates covering Anthropic Claude, Model Context Protocol (MCP), frontier AI models, and machine learning infrastructure.',
};

export default function NewsPage() {
  let articles = [];
  if (Array.isArray(newsData)) {
    articles = newsData;
  } else if (newsData && typeof newsData === 'object') {
    articles = newsData.articles || newsData.data || newsData.items || Object.values(newsData).find(Array.isArray) || [];
  }

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

  const getTitle = (item) => item?.title || item?.heading || item?.name || 'Untitled Article';
  const getSummary = (item) => item?.summary || item?.description || item?.excerpt || item?.content || '';
  const getImage = (item) => item?.image || item?.imageUrl || item?.thumbnail || item?.img || null;
  const getSlug = (item, idx) => item?.slug || item?.id || idx;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
            📰 AI News & Model Context Protocol Updates
          </h1>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
            Daily coverage of breaking AI developments, Anthropic Claude integrations, frontier LLMs, and MCP ecosystem advances.
          </p>
        </div>

        {/* 21 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, idx) => {
            const slug = getSlug(article, idx);
            const title = getTitle(article);
            const summary = getSummary(article);
            const img = getImage(article);
            const rawDate = article.date || article.published_at || article.timestamp;

            return (
              <div 
                key={slug} 
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition flex flex-col justify-between"
              >
                <div>
                  {img && (
                    <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                      <img 
                        src={img} 
                        alt={title} 
                        className="w-full h-full object-cover object-center" 
                      />
                      {article.category && (
                        <span className="absolute bottom-3 left-3 bg-pink-100 text-pink-700 text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide">
                          {article.category}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="p-6 space-y-3">
                    <h2 className="text-lg font-bold text-gray-900 line-clamp-2 hover:text-pink-600 transition">
                      <Link href={`/news-article/${slug}`}>
                        {title}
                      </Link>
                    </h2>
                    {summary && (
                      <p className="text-gray-600 text-xs sm:text-sm line-clamp-3 leading-relaxed">
                        {summary}
                      </p>
                    )}
                  </div>
                </div>

                <div className="px-6 pb-6 pt-0 flex items-center text-xs font-medium text-gray-400">
                  <span className="mr-1.5">🗓️</span>
                  <time dateTime={rawDate || '2026-09-16'}>
                    {formatDate(rawDate)}
                  </time>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
