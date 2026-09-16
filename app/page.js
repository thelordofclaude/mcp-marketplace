'use client';

import newsData from '../processed-news.json';
import Link from 'next/link';

export default function HomePage() {
  // Extract articles array safely regardless of JSON structure
  let articles = [];
  if (Array.isArray(newsData)) {
    articles = newsData;
  } else if (newsData && typeof newsData === 'object') {
    articles = newsData.articles || newsData.data || newsData.items || Object.values(newsData).find(Array.isArray) || [];
  }

  // Dynamic property extractors for flexible JSON schema
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

  const featured = articles[0] || {};
  const latestNews = articles.slice(1, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Search Input Bar */}
      <div className="w-full">
        <input 
          type="text" 
          placeholder="Search Claude skills, MCP servers, plugins, tools, and more..." 
          className="w-full max-w-md px-4 py-2.5 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm text-gray-700 shadow-sm"
        />
      </div>

      {/* Featured Server Pill Tags */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold text-gray-700">
        <span className="bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer whitespace-nowrap">
          🔹 Context7 <span className="text-gray-400 font-normal">MCP Server</span>
        </span>
        <span className="bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer whitespace-nowrap">
          🦁 Brave Search <span className="text-gray-400 font-normal">MCP Server</span>
        </span>
        <span className="bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer whitespace-nowrap">
          🐙 GitHub <span className="text-gray-400 font-normal">MCP Server</span>
        </span>
        <span className="bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer whitespace-nowrap">
          ⚡ Supabase <span className="text-gray-400 font-normal">MCP Server</span>
        </span>
        <span className="bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer whitespace-nowrap">
          📝 Notion <span className="text-gray-400 font-normal">MCP Server</span>
        </span>
      </div>

      {/* Hero Section & Top Trending Sidebar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Main Hero Card */}
        <div className="lg:col-span-8 bg-[#0b0f17] text-white rounded-3xl p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden min-h-[360px] shadow-sm">
          <div className="z-10 max-w-xl">
            <span className="inline-block bg-[#ec4899] text-white text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
              {featured.category || 'FEATURED'}
            </span>
            
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-4 leading-tight">
              <Link href={`/news-article/${getSlug(featured, 0)}`} className="hover:underline text-white">
                {getTitle(featured)}
              </Link>
            </h1>

            {getSummary(featured) && (
              <p className="text-gray-300 text-sm sm:text-base line-clamp-3 mb-6 leading-relaxed">
                {getSummary(featured)}
              </p>
            )}

            <div className="flex items-center gap-4 pt-2">
              <Link 
                href={`/news-article/${getSlug(featured, 0)}`} 
                className="bg-[#ec4899] hover:bg-[#db2777] text-white font-bold text-sm px-6 py-2.5 rounded-xl transition shadow-sm"
              >
                Read Full Story
              </Link>
              <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
                🗓️ {formatDate(featured.date || featured.published_at)}
              </span>
            </div>
          </div>

          {getImage(featured) && (
            <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 lg:opacity-40 pointer-events-none">
              <img src={getImage(featured)} alt={getTitle(featured)} className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        {/* Top Trending Sidebar Card */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-gray-900 text-base">Top Trending</h3>
            <div className="flex bg-gray-100 rounded-lg p-1 text-xs font-semibold">
              <button className="bg-[#ec4899] text-white px-2.5 py-1 rounded-md">MCP Servers</button>
              <button className="text-gray-600 px-2.5 py-1">Skills</button>
            </div>
          </div>

          <div className="space-y-3.5">
            {[
              { rank: 1, name: 'Context7', cat: 'Development', count: '2,390', growth: '+18.2%' },
              { rank: 2, name: 'Brave Search', cat: 'Search', count: '2,300', growth: '+18.2%' },
              { rank: 3, name: 'Filesystem', cat: 'Productivity', count: '2,300', growth: '+24.9%' },
              { rank: 4, name: 'GitHub', cat: 'Development', count: '2,300', growth: '+24.8%' },
              { rank: 5, name: 'Notion', cat: 'Productivity', count: '1,800', growth: '+18.5%' },
            ].map((item) => (
              <div key={item.rank} className="flex items-center justify-between border-b border-gray-50 pb-2">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-extrabold text-gray-900">{item.rank}.</span>
                  <div>
                    <p className="font-bold text-gray-900 text-sm leading-tight">{item.name}</p>
                    <p className="text-xs text-gray-400">{item.cat}</p>
                  </div>
                </div>
                <div className="text-right text-xs">
                  <p className="font-extrabold text-gray-900">{item.count}</p>
                  <p className="text-emerald-500 font-bold">{item.growth}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Latest News & Newsletter Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pt-4">
        
        {/* News Cards Grid */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h2 className="text-xl font-extrabold text-gray-900">Latest News</h2>
            <Link href="/news" className="text-xs font-bold text-[#ec4899] hover:text-[#db2777]">
              View All News &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {latestNews.map((article, idx) => {
              const slug = getSlug(article, idx);
              const title = getTitle(article);
              const summary = getSummary(article);
              const img = getImage(article);

              return (
                <Link 
                  key={slug} 
                  href={`/news-article/${slug}`}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between group cursor-pointer"
                >
                  <div>
                    <div className="h-44 w-full bg-slate-900 overflow-hidden relative">
                      {img ? (
                        <img src={img} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-700 to-indigo-900 text-white font-bold text-lg p-4 text-center">
                          {title}
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 text-sm group-hover:text-[#ec4899] transition line-clamp-2 leading-snug mb-2">
                        {title}
                      </h3>
                      {summary && (
                        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                          {summary}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="p-4 pt-0 text-xs text-gray-400 flex items-center font-medium">
                    🗓️ <span className="ml-1">{formatDate(article.date || article.published_at)}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Newsletter Signup Form Widget */}
        <div className="lg:col-span-4">
          <div className="bg-[#00d8f6] rounded-3xl p-6 text-gray-900 shadow-sm space-y-4">
            <h3 className="text-xl font-extrabold">Join the Newsletter</h3>
            <p className="text-xs font-medium text-gray-800 leading-relaxed">
              Subscribe for the latest Claude skills, MCP servers, and breaking AI updates.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-3 pt-1">
              <input 
                type="email" 
                placeholder="Email Address" 
                className="w-full px-4 py-2.5 rounded-xl text-gray-900 bg-white placeholder-gray-400 text-sm focus:outline-none border-0 shadow-inner"
              />
              <button 
                type="submit" 
                className="w-full bg-[#00c2de] hover:bg-[#00b0c9] text-gray-900 font-extrabold py-2.5 rounded-xl text-sm transition shadow-sm uppercase tracking-wider"
              >
                SUBSCRIBE
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
