import newsArticles from '../../processed-news.json';
import Link from 'next/link';

export const metadata = {
  title: 'Latest AI News, Claude Updates & Model Context Protocol Breakthroughs',
  description: 'Daily breaking news, expert analysis, and updates covering Anthropic Claude, Model Context Protocol (MCP), frontier AI models, and machine learning infrastructure.',
};

export default function NewsPage() {
  const articles = Array.isArray(newsArticles) ? newsArticles : [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header Section Optimized for SEO */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-3">
          📰 AI News & Model Context Protocol Updates
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Daily coverage of breaking AI developments, Anthropic Claude integrations, frontier LLMs, and MCP ecosystem advances.
        </p>
      </div>

      {/* News Article Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article, idx) => {
          const slug = article.slug || article.id;
          
          // Format exact date or fall back to current date string
          const formattedDate = article.date || article.published_at 
            ? new Date(article.date || article.published_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })
            : new Date().toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

          return (
            <div 
              key={idx} 
              className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white flex flex-col justify-between"
            >
              <div>
                {article.image && (
                  <div className="relative w-full h-48 bg-gray-100">
                    <img 
                      src={article.image} 
                      alt={article.title} 
                      className="w-full h-full object-cover" 
                    />
                    {article.category && (
                      <span className="absolute bottom-2 left-2 bg-pink-100 text-pink-700 text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        {article.category}
                      </span>
                    )}
                  </div>
                )}
                
                <div className="p-5">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    <Link href={`/news-article/${slug}`} className="hover:text-blue-600">
                      {article.title}
                    </Link>
                  </h2>
                  {article.summary && (
                    <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                      {article.summary}
                    </p>
                  )}
                </div>
              </div>

              {/* Exact Date Footer */}
              <div className="px-5 pb-5 pt-0 flex items-center text-xs text-gray-500">
                <span className="mr-1">🗓️</span>
                <time dateTime={article.date || article.published_at || new Date().toISOString()}>
                  {formattedDate}
                </time>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
