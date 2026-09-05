#!/usr/bin/env python3
"""
Auto AI News Publisher
Fetches from top AI news RSS feeds, rewrites articles, generates images,
and publishes to the website. Scales: 1/day → 2/day → 3/day.
"""
import json, os, re, time, random, urllib.parse
from urllib.request import Request, urlopen
from datetime import datetime, timedelta
from xml.etree import ElementTree as ET

PROCESSED = "processed-news.json"
CONTENT = "content/news"
os.makedirs(CONTENT, exist_ok=True)

# Scale schedule: Month 1 = 1/day, Month 2-3 = 2/day, Month 4+ = 3/day
START_DATE = datetime(2026, 9, 1)  # Adjust to your launch date
days_since_start = (datetime.now() - START_DATE).days
if days_since_start < 30:
    TARGET_PER_RUN = 1
elif days_since_start < 90:
    TARGET_PER_RUN = 1  # Script runs twice daily (8am + 6pm) = 2/day
else:
    TARGET_PER_RUN = 1  # Script runs 3 times daily = 3/day

# Top AI News RSS Feeds
RSS_FEEDS = [
    "https://techcrunch.com/category/artificial-intelligence/feed/",
    "https://www.theverge.com/ai-artificial-intelligence/rss/index.xml",
    "https://venturebeat.com/category/ai/feed/",
    "https://www.wired.com/tag/artificial-intelligence/feed/",
    "https://arstechnica.com/tag/ai/feed/",
    "https://www.technologyreview.com/feed/",
    "https://www.artificialintelligence-news.co.uk/feed/",
    "https://www.marktechpost.com/category/artificial-intelligence/feed/",
    "https://syncedreview.com/category/ai-industry/feed/",
    "https://www.analyticsvidhya.com/blog/category/artificial-intelligence/feed/",
    "https://www.ai-journal.com/rss.xml",
    "https://blog.google/technology/ai/rss/",
    "https://openai.com/blog/rss.xml",
    "https://www.anthropic.com/rss.xml",
    "https://blog.deepmind.com/rss",
    "https://ai.googleblog.com/feeds/posts/default",
    "https://www.microsoft.com/en-us/research/research-area/artificial-intelligence/feed/",
    "https://blog.meta.com/ai/rss",
    "https://stability.ai/blog/rss.xml",
    "https://blog.huggingface.co/rss",
]

def load_processed():
    if os.path.exists(PROCESSED):
        with open(PROCESSED) as f: return json.load(f)
    return {"ids": [], "slugs": [], "last_run": None, "total": 0, "today_count": 0, "today_date": None}

def save_processed(p):
    p["last_run"] = datetime.now().isoformat()
    with open(PROCESSED, "w") as f: json.dump(p, f, indent=2)

def fetch_rss(url):
    """Fetch and parse RSS feed."""
    try:
        req = Request(url, headers={"User-Agent": "ClaudeHub-NewsBot/1.0"})
        with urlopen(req, timeout=20) as r:
            xml = r.read().decode('utf-8', errors='ignore')
            root = ET.fromstring(xml)

            items = []
            for item in root.iter('item'):
                title = item.findtext('title', '').strip()
                link = item.findtext('link', '').strip()
                desc = item.findtext('description', '') or item.findtext('summary', '') or ''
                pub_date = item.findtext('pubDate', '')
                guid = item.findtext('guid', '') or link

                if title and link and len(title) > 15:
                    items.append({
                        "id": hash(guid) % (10**12),
                        "title": title,
                        "link": link,
                        "description": re.sub(r'<[^>]+>', '', desc).strip()[:500],
                        "pub_date": pub_date,
                        "source": url.split('/')[2].replace('www.', '')
                    })
            return items
    except Exception as e:
        print(f"   RSS error ({url[:40]}...): {e}")
        return []

def rewrite_article(title, description, source):
    """
    Rewrite the article headline and summary.
    If OpenAI/Anthropic API key available, uses LLM.
    Otherwise, does basic paraphrasing.
    """
    openai_key = os.environ.get("OPENAI_API_KEY", "")
    anthropic_key = os.environ.get("ANTHROPIC_API_KEY", "")

    if openai_key:
        return rewrite_with_openai(title, description, source, openai_key)
    elif anthropic_key:
        return rewrite_with_anthropic(title, description, source, anthropic_key)
    else:
        return rewrite_basic(title, description, source)

def rewrite_with_openai(title, desc, source, key):
    """Use GPT-4 to humanize and rewrite."""
    try:
        import urllib.request
        data = json.dumps({
            "model": "gpt-4o-mini",
            "messages": [
                {"role": "system", "content": "You are a tech news editor. Rewrite the given AI news headline and summary to be punchy, engaging, and SEO-friendly. Keep the headline under 70 characters. Keep the summary under 200 words. Maintain factual accuracy. Add relevant keywords like 'AI', 'Claude', 'MCP', 'LLM' where natural."},
                {"role": "user", "content": f"Source: {source}\nOriginal headline: {title}\nOriginal summary: {desc}\n\nRewrite both. Return ONLY a JSON object with 'headline' and 'summary' keys."}
            ],
            "temperature": 0.7,
            "max_tokens": 500
        }).encode()

        req = urllib.request.Request(
            "https://api.openai.com/v1/chat/completions",
            data=data,
            headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
            method="POST"
        )
        with urllib.request.urlopen(req, timeout=30) as r:
            result = json.loads(r.read().decode())
            content = result["choices"][0]["message"]["content"]
            # Extract JSON from response
            match = re.search(r'\{[^}]*"headline"[^}]*"summary"[^}]*\}', content, re.DOTALL)
            if match:
                parsed = json.loads(match.group())
                return parsed.get("headline", title), parsed.get("summary", desc)
    except Exception as e:
        print(f"   OpenAI rewrite failed: {e}")
    return rewrite_basic(title, desc, source)

def rewrite_with_anthropic(title, desc, source, key):
    """Use Claude to humanize and rewrite."""
    try:
        import urllib.request
        data = json.dumps({
            "model": "claude-3-haiku-20240307",
            "max_tokens": 500,
            "messages": [
                {"role": "user", "content": f"Rewrite this AI news headline and summary to be punchy and SEO-friendly. Keep headline under 70 chars. Summary under 200 words. Return ONLY JSON with 'headline' and 'summary' keys.\n\nSource: {source}\nHeadline: {title}\nSummary: {desc}"}
            ]
        }).encode()

        req = urllib.request.Request(
            "https://api.anthropic.com/v1/messages",
            data=data,
            headers={"x-api-key": key, "Content-Type": "application/json", "anthropic-version": "2023-06-01"},
            method="POST"
        )
        with urllib.request.urlopen(req, timeout=30) as r:
            result = json.loads(r.read().decode())
            content = result["content"][0]["text"]
            match = re.search(r'\{[^}]*"headline"[^}]*"summary"[^}]*\}', content, re.DOTALL)
            if match:
                parsed = json.loads(match.group())
                return parsed.get("headline", title), parsed.get("summary", desc)
    except Exception as e:
        print(f"   Anthropic rewrite failed: {e}")
    return rewrite_basic(title, desc, source)

def rewrite_basic(title, desc, source):
    """Basic paraphrasing without API keys."""
    # Simple transformations
    new_title = title
    replacements = {
        "announces": "reveals",
        "launches": "unveils",
        "introduces": "debuts",
        "new": "latest",
        "update": "upgrade",
    }
    for old, new in replacements.items():
        new_title = re.sub(rf'\b{old}\b', new, new_title, flags=re.IGNORECASE)

    # Add context if missing
    if "AI" not in new_title and "artificial intelligence" not in new_title.lower():
        new_title = f"AI Update: {new_title}"
    if len(new_title) > 70:
        new_title = new_title[:67].rsplit(" ", 1)[0] + "..."

    # Enhance description
    new_desc = desc
    if len(new_desc) < 100:
        new_desc += f" This development from {source} highlights the rapid evolution of artificial intelligence tools and their impact on developers and businesses."

    return new_title, new_desc

def generate_image(title):
    """Generate image using Pollinations.ai (free, no API key)."""
    prompt = f"Tech news illustration about: {title}. Modern, clean, futuristic, digital art, no text, professional blog header image."
    encoded = urllib.parse.quote(prompt)
    return f"https://image.pollinations.ai/prompt/{encoded}?width=800&height=450&nologo=true&seed={random.randint(1, 10000)}"

def generate_page(article, index):
    headline, summary = rewrite_article(article["title"], article["description"], article["source"])
    slug = re.sub(r'[^a-z0-9]+', '-', headline.lower()).strip('-')[:60]
    # Ensure unique slug
    slug = f"{slug}-{index}"

    image_url = generate_image(headline)
    today = datetime.now().strftime("%Y-%m-%d")

    meta_desc = summary[:150].rsplit(" ", 1)[0] + "..."
    if len(meta_desc) > 160:
        meta_desc = meta_desc[:157] + "..."

    schema = {
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        "headline": headline,
        "description": summary,
        "image": image_url,
        "datePublished": today,
        "dateModified": today,
        "author": {"@type": "Organization", "name": "ClaudeHub"},
        "publisher": {"@type": "Organization", "name": "ClaudeHub", "logo": {"@type": "ImageObject", "url": "https://yourdomain.com/logo.png"}}
    }

    body = f"""## Summary

{summary}

## Key Takeaways

- {headline.split(':')[-1].strip() if ':' in headline else headline}
- This development impacts AI developers, researchers, and businesses adopting AI tools.
- Stay updated with ClaudeHub for the latest in AI infrastructure, MCP servers, and Claude ecosystem news.

## Source

Original story from [{article['source']}]({article['link']}).

---

*Published on {today} by ClaudeHub AI News Bot. This article was auto-curated and rewritten for clarity and SEO optimization.*
"""

    md = f"""---
slug: {slug}
title: "{headline}"
meta_description: "{meta_desc}"
keywords: "AI news, artificial intelligence, {article['source']}, Claude, MCP, LLM, tech news"
type: news
source: {article['source']}
source_url: {article['link']}
image: {image_url}
published_at: {today}
schema_json: |
  {json.dumps(schema)}
---

# {headline}

![{headline}]({image_url})

{body}
"""
    return slug, md

def main():
    print("=" * 55)
    print("  AUTO AI NEWS PUBLISHER")
    print("=" * 55)

    proc = load_processed()
    done = set(proc["ids"])

    # Check daily limit
    today_str = datetime.now().strftime("%Y-%m-%d")
    if proc.get("today_date") != today_str:
        proc["today_count"] = 0
        proc["today_date"] = today_str

    # Determine how many to publish this run
    daily_limit = 1 if days_since_start < 30 else (2 if days_since_start < 90 else 3)
    remaining_today = daily_limit - proc.get("today_count", 0)
    target = min(TARGET_PER_RUN, remaining_today)

    if target <= 0:
        print(f"   Daily limit ({daily_limit}) reached for today. Skipping.")
        save_processed(proc)
        return

    print(f"📰 Target: {target} articles (daily limit: {daily_limit}, already today: {proc.get('today_count', 0)})")

    # Fetch from RSS feeds
    all_articles = []
    for feed in RSS_FEEDS:
        articles = fetch_rss(feed)
        for a in articles:
            if a["id"] not in done:
                all_articles.append(a)
        time.sleep(0.5)
        if len(all_articles) >= target * 3:
            break

    print(f"   Fetched {len(all_articles)} new articles from RSS feeds")

    if not all_articles:
        print("   No new articles found.")
        save_processed(proc)
        return

    # Shuffle and pick top ones
    random.shuffle(all_articles)
    selected = all_articles[:target]

    for i, article in enumerate(selected):
        slug, md = generate_page(article, i)
        with open(os.path.join(CONTENT, f"{slug}.md"), "w", encoding="utf-8") as f:
            f.write(md)
        proc["ids"].append(article["id"])
        proc["slugs"].append(slug)
        proc["total"] = len(proc["ids"])
        proc["today_count"] = proc.get("today_count", 0) + 1
        print(f"   ✅ Published: {slug[:50]}...")
        time.sleep(1)

    save_processed(proc)
    print(f"\n💾 Total articles: {proc['total']}")
    print(f"   Published today: {proc['today_count']}/{daily_limit}")
    print("✅ DONE")

if __name__ == "__main__":
    main()
