import newsData from '../../processed-news.json';
import Link from 'next/link';

export const metadata = {
  title: 'Latest AI News, Claude Updates & Model Context Protocol Breakthroughs',
  description: 'Daily breaking news, expert analysis, and updates covering Anthropic Claude, Model Context Protocol (MCP), frontier AI models, and machine learning infrastructure.',
};

export default function NewsPage() {
  const articles = Array.isArray(newsData) ? newsData : (newsData?.articles || []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* SEO Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl tracking-tight mb-4">
            📰 AI News & Model Context Protocol Updates
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Daily coverage of breaking AI developments, Anthropic Claude integrations, frontier LLMs, and MCP ecosystem advances.
          </p>
        </div>

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, idx) => {
            const slug = article.slug || article.id || idx;
            const articleDate = article.date || article.published_at || article.timestamp;

            // Format exact dates safely
            let formattedDate = 'Sep 16, 2026';
            if (articleDate) {
              try {
                formattedDate = new Date(articleDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                });
              } catch (e) {
                formattedDate = String(articleDate);
              }
            }

            return (
              <div 
                key={slug} 
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  {article.image && (
                    <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                      <img 
                        src={article.image} 
                        alt={article.title || 'AI News Image'} 
                        className="w-full h-full object-cover object-center" 
                      />
                      {article.category && (
                        <span className="absolute bottom-3 left-3 bg-pink-100 text-pink-700 text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide">
                          {article.category}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-blue-600 transition-colors">
                      <Link href={`/news-article/${slug}`}>
                        {article.title}
                      </Link>
                    </h2>
                    {article.summary && (
                      <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed mb-4">
                        {article.summary}
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer with Exact Date Tag */}
                <div className="px-6 pb-6 pt-0 flex items-center text-xs font-medium text-gray-500">
                  <span className="mr-1.5">🗓️</span>
                  <time dateTime={articleDate || '2026-09-16'}>
                    {formattedDate}
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
