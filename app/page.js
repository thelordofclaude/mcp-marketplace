'use client';

import newsData from '../processed-news.json';
import Link from 'next/link';

export default function HomePage() {
  // Extract articles array safely regardless of JSON wrapper structure
  let articles = [];
  if (Array.isArray(newsData)) {
    articles = newsData;
  } else if (newsData && typeof newsData === 'object') {
    articles = newsData.articles || newsData.data || newsData.items || Object.values(newsData).find(Array.isArray) || [];
  }

  const featured = articles[0] || {};
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

  const getTitle = (item) => item?.title || item?.heading || item?.name || 'Untitled Article';
  const getSummary = (item) => item?.summary || item?.description || item?.excerpt || item?.content || '';
  const getImage = (item) => item?.image || item?.imageUrl || item?.thumbnail || item?.img || null;
  const getSlug = (item, idx) => item?.slug || item?.id || idx;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      {/* Search & Filter Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-1/2">
          <input 
            type="text" 
            placeholder="Search Claude skills, MCP servers, plugins, tools, and more..." 
            className="w-full pl-10 pr-10 py-2.5 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
          />
          <span className="absolute left-3.5 top-3 text-gray-400">🔍</span>
          <button className="absolute right-2 top-1.5 bg-pink-500 text-white rounded-full p-1.5 text-xs">
            ➔
          </button>
        </div>
      </div>

      {/* Featured Server Pill Tags */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 text-xs font-medium text-gray-700">
        <span className="bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer">
          🔹 Context7 <span className="text-gray-400">MCP Server</span>
        </span>
        <span className="bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer">
          🦁 Brave Search <span className="text-gray-400">MCP Server</span>
        </span>
        <span className="bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer">
          🐙 GitHub <span className="text-gray-400">MCP Server</span>
        </span>
        <span className="bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer">
          ⚡ Supabase <span className="text-gray-400">MCP Server</span>
        </span>
        <span className="bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer">
          📝 Notion <span className="text-gray-400">MCP Server</span>
        </span>
      </div>

      {/* Hero Section & Top Trending Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Featured Hero Card */}
        <div className="lg:col-span-8 bg-slate-950 text-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden min-h-[380px]">
          <div className="z-10 max-w-xl">
            <span className="inline-block bg-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide mb-4">
              {featured.category || 'FEATURED'}
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-4">
              <Link href={`/news-article/${getSlug(featured, 0)}`} className="hover:underline">
                {getTitle(featured)}
              </Link>
            </h1>
            {getSummary(featured) && (
              <p className="text-gray-300 text-sm sm:text-base line-clamp-3 mb-6">
                {getSummary(featured)}
              </p>
            )}
            
            <div className="flex flex-wrap items-center gap-3">
              <Link 
                href={`/news-article/${getSlug(featured, 0)}`} 
                className="bg-pink-600 hover:bg-pink-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition"
              >
                Read Full Story
              </Link>
              <span className="text-xs text-gray-400">
                🗓️ {formatDate(featured.date || featured.published_at)}
              </span>
            </div>
          </div>

          {getImage(featured) && (
            <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-30 lg:opacity-60 pointer-events-none">
              <img src={getImage(featured)} alt={getTitle(featured)} className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        {/* Sidebar: Top Trending */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 text-base">Top Trending</h3>
            <div className="flex bg-gray-100 rounded-lg p-1 text-xs font-semibold">
              <button className="bg-pink-600 text-white px-2.5 py-1 rounded-md">MCP Servers</button>
              <button className="text-gray-600 px-2.5 py-1">Skills</button>
            </div>
          </div>

          <div className="space-y-4 text-sm">
            {[
              { rank: 1, name: 'Context7', cat: 'Development', count: '2,390', growth: '+18.2%' },
              { rank: 2, name: 'Brave Search', cat: 'Search', count: '2,300', growth: '+18.2%' },
              { rank: 3, name: 'Filesystem', cat: 'Productivity', count: '2,300', growth: '+24.9%' },
              { rank: 4, name: 'GitHub', cat: 'Development', count: '2,300', growth: '+24.8%' },
              { rank: 5, name: 'Notion', cat: 'Productivity', count: '1,800', growth: '+18.5%' },
            ].map((item) => (
              <div key={item.rank} className="flex items-center justify-between border-b border-gray-50 pb-2.5">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-400">{item.rank}</span>
                  <div>
                    <p className="font-semibold text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-400">{item.cat}</p>
                  </div>
                </div>
                <div className="text-right text-xs">
                  <p className="font-bold text-gray-900">{item.count}</p>
                  <p className="text-emerald-500 font-medium">{item.growth}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Latest News Grid & Newsletter Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* News Cards */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h2 className="text-xl font-bold text-gray-900">Latest News</h2>
            <Link href="/news" className="text-xs font-bold text-pink-600 hover:text-pink-700">
              View All News &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {latestNews.map((article, idx) => {
              const slug = getSlug(article, idx);
              const title = getTitle(article);
              const summary = getSummary(article);
              const img = getImage(article);

              return (
                <div key={slug} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between">
                  <div>
                    {img && (
                      <div className="h-44 w-full bg-gray-100 overflow-hidden relative">
                        <img src={img} alt={title} className="w-full h-full object-cover" />
                        <span className="absolute top-3 left-3 bg-pink-100 text-pink-700 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase">
                          {article.category || 'NEWS'}
                        </span>
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 text-base line-clamp-2 hover:text-pink-600 transition mb-2">
                        <Link href={`/news-article/${slug}`}>
                          {title}
                        </Link>
                      </h3>
                      {summary && (
                        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                          {summary}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="p-4 pt-0 text-xs text-gray-400 flex items-center">
                    🗓️ <span className="ml-1">{formatDate(article.date || article.published_at)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar: Newsletter Signup Form */}
        <div className="lg:col-span-4">
          <div className="bg-cyan-400 text-white rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-xl font-bold">Join the Newsletter</h3>
            <p className="text-xs text-cyan-900 font-medium">
              Subscribe for the latest Claude skills, MCP servers, and breaking AI updates.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-3">
              <input 
                type="email" 
                placeholder="Email Address" 
                className="w-full px-4 py-2.5 rounded-xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none"
              />
              <button 
                type="submit" 
                className="w-full bg-cyan-300 hover:bg-cyan-200 text-cyan-950 font-bold py-2.5 rounded-xl text-sm transition"
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
