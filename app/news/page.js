import newsData from '../../processed-news.json';
import Link from 'next/link';

export const metadata = {
  title: 'Latest AI News, Claude Updates & Model Context Protocol Breakthroughs',
  description: 'Daily coverage of breaking AI developments, Anthropic Claude integrations, frontier LLMs, and MCP ecosystem advances.',
};

export default function NewsPage() {
  let articles = [];
  if (Array.isArray(newsData)) {
    articles = newsData;
  } else if (newsData && typeof newsData === 'object') {
    articles = newsData.articles || newsData.data || newsData.items || Object.values(newsData).find(Array.isArray) || [];
  }

  const getTitle = (item) => item?.title || item?.heading || item?.name || item?.headline || 'Untitled Article';
  const getSummary = (item) => item?.summary || item?.description || item?.excerpt || item?.content || '';
  const getImage = (item) => item?.image || item?.imageUrl || item?.thumbnail || item?.img || null;
  const getSlug = (item, idx) => item?.slug || item?.id || idx;

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Section */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 flex items-center justify-center gap-2">
          <span>📰</span> AI News & Model Context Protocol Updates
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed">
          Daily coverage of breaking AI developments, Anthropic Claude integrations, frontier LLMs, and MCP ecosystem advances.
        </p>
      </div>

      {/* Grid Displaying All Articles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article, idx) => {
          const slug = getSlug(article, idx);
          const title = getTitle(article);
          const summary = getSummary(article);
          const img = getImage(article);
          const rawDate = article.date || article.published_at || article.timestamp;

          return (
            <Link 
              key={slug} 
              href={`/news-article/${slug}`}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <div className="h-48 w-full bg-slate-900 overflow-hidden relative">
                  {img ? (
                    <img src={img} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-700 to-indigo-900 text-white font-bold text-lg p-4 text-center">
                      {title}
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <h2 className="font-bold text-gray-900 text-base group-hover:text-[#ec4899] transition line-clamp-2 leading-snug mb-2">
                    {title}
                  </h2>
                  {summary && (
                    <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">
                      {summary}
                    </p>
                  )}
                </div>
              </div>

              <div className="p-5 pt-0 text-xs text-gray-400 font-medium">
                🗓️ <time dateTime={rawDate || '2026-09-16'}>{formatDate(rawDate)}</time>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
