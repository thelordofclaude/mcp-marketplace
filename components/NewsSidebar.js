'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function NewsSidebar({ articles = [] }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  // Get the latest 6 articles dynamically passed from props
  const latestArticles = articles.slice(0, 6);

  return (
    <aside className="w-full lg:w-[340px] shrink-0">
      <div className="sticky top-6 flex flex-col gap-8">
        
        {/* 1. MOST POPULAR / LATEST NEWS SECTION */}
        <section className="relative overflow-hidden pr-4">
          <span className="block text-xs font-extrabold uppercase tracking-widest text-purple-700 mb-4">
            MOST POPULAR
          </span>

          {/* Rotated Cyan Watermark Background Text */}
          <div 
            className="absolute -right-8 top-1/2 -translate-y-1/2 rotate-90 text-[64px] font-black text-[rgb(127,255,212)] opacity-60 pointer-events-none select-none whitespace-nowrap z-0"
            aria-hidden="true"
          >
            Most Popular
          </div>

          <ol className="relative z-10 list-none p-0 m-0">
            {latestArticles.length > 0 ? (
              latestArticles.map((item, index) => (
                <li 
                  key={item.id || item.slug || index} 
                  className="relative pl-7 pb-4 mb-4 border-b border-gray-200 last:border-b-0 last:mb-0"
                >
                  <span className="absolute left-0 top-0 font-extrabold text-base text-purple-700">
                    {index + 1}.
                  </span>
                  <Link 
                    href={item.url || `/news/${item.slug || item.id}`} 
                    className="text-[15px] font-bold leading-snug text-gray-900 hover:text-blue-600 transition-colors duration-150 block"
                  >
                    {item.title}
                  </Link>
                </li>
              ))
            ) : (
              <p className="text-xs text-gray-500">No recent stories found.</p>
            )}
          </ol>
        </section>

        {/* 2. NEWSLETTER SUBSCRIBE BOX */}
        <section className="bg-slate-50 border border-slate-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-slate-900 m-0 mb-2">
            Get The Signal Delivered
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed m-0 mb-4">
            Subscribe to get breaking updates, technical deep-dives, and market analyses delivered straight to your inbox daily.
          </p>

          {subscribed ? (
            <div className="bg-green-50 text-green-700 border border-green-200 p-3 rounded-md text-xs font-semibold text-center">
              ✓ Thanks for subscribing!
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2.5">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email" 
                required 
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-md text-sm outline-none focus:border-blue-500 transition-colors"
              />
              <button 
                type="submit" 
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-md transition-colors duration-150 cursor-pointer"
              >
                Subscribe
              </button>
            </form>
          )}
        </section>

      </div>
    </aside>
  );
}
