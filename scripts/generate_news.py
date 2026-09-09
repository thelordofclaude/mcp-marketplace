#!/usr/bin/env python3
"""
The Signal — AI News Publisher
Fetches from top AI news RSS feeds, rewrites articles with editorial voice,
assigns reporter bylines, and publishes clean Markdown files.
"""
import json, os, re, time, random, urllib.parse
from urllib.request import Request, urlopen
from datetime import datetime
from xml.etree import ElementTree as ET

PROCESSED = "processed-news.json"
CONTENT_DIR = "content/news"
os.makedirs(CONTENT_DIR, exist_ok=True)

# ─── REPORTER PROFILES (Max 5) ─────────────────────────────────────────────
REPORTERS = [
    {
        "id": "marcus",
        "name": "Marcus Chen",
        "title": "Senior Tech Correspondent",
        "email": "marcus@lordofclaude.com",
        "bio": "Marcus has covered Silicon Valley for 14 years, previously at Wired and The Information. He holds a master's degree from Stanford.",
        "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
        "beats": ["apple", "hardware", "chips", "nvidia", "semiconductor", "iphone", "mac"]
    },
    {
        "id": "priya",
        "name": "Priya Sharma",
        "title": "AI & Policy Editor",
        "email": "priya@lordofclaude.com",
        "bio": "Priya leads AI coverage from Washington DC. Formerly at MIT Technology Review, she specializes in regulation, ethics, and frontier model development.",
        "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
        "beats": ["regulation", "policy", "ethics", "safety", "governance", "agentic", "agents"]
    },
    {
        "id": "jamie",
        "name": "Jamie O'Brien",
        "title": "Silicon Valley Bureau Chief",
        "email": "jamie@lordofclaude.com",
        "bio": "Jamie has been reporting from Palo Alto since 2012. He previously covered enterprise software at Bloomberg and holds deep source relationships across major AI labs.",
        "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
        "beats": ["openai", "google", "microsoft", "meta", "funding", "venture", "startup", "enterprise"]
    },
    {
        "id": "elena",
        "name": "Elena Vasquez",
        "title": "Enterprise Technology Reporter",
        "email": "elena@lordofclaude.com",
        "bio": "Elena reports on how Fortune 500 companies deploy AI at scale. Before joining The Signal, she spent six years at Forbes covering cloud infrastructure.",
        "avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
        "beats": ["enterprise", "cloud", "saas", "workflow", "automation", "deployment", "scale"]
    },
    {
        "id": "david",
        "name": "David Kim",
        "title": "Hardware & Chips Analyst",
        "email": "david@lordofclaude.com",
        "bio": "David holds a PhD in electrical engineering from Caltech and writes about semiconductors, data center architecture, and AI training at scale.",
        "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
        "beats": ["gpu", "data center", "training", "inference", "compute", "memory", "h100", "blackwell"]
    }
]

SEO_TAGS = [
    "ChatGPT & OpenAI", "Claude & Anthropic", "Cursor & AI Coding",
    "Hugging Face & Open Source", "Frontier Models", "AI Agents & Workflows",
    "MCP & Tooling", "Multimodal AI", "Reasoning Models",
    "AI Compute & GPUs", "Vector Databases & RAG", "Enterprise AI",
    "AI Security & Governance", "Breakthrough Research"
]

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
    "https://www.analyticsvidhya.com/blog/category/artificial-intelligence/feed/"
]

AI_KEYWORDS = [
    'ai', 'artificial intelligence', 'llm', 'claude', 'gpt', 'openai',
    'anthropic', 'mcp', 'neural', 'machine learning', 'deep learning',
    'generative ai', 'transformer', 'agentic', 'reasoning', 'multimodal',
    'rag', 'vector database', 'gpu', 'cuda', 'training', 'inference',
    'frontier model', 'agent', 'workflow', 'coding', 'cursor'
]

# ─── HELPERS ─────────────────────────────────────────────────────────────────

def load_processed():
    if os.path.exists(PROCESSED):
        with open(PROCESSED, encoding="utf-8") as f:
            return json.load(f)
    return {"ids": [], "slugs": [], "last_run": None, "total": 0, "today_count": 0, "today_date": None}

def save_processed(p):
    p["last_run"] = datetime.now().isoformat()
    with open(PROCESSED, "w", encoding="utf-8") as f:
        json.dump(p, f, indent=2)

def is_ai_topic(title, description):
    text = f"{title} {description}".lower()
    return any(re.search(rf'\b{re.escape(k)}\b', text) for k in AI_KEYWORDS)

def slugify(text):
    s = re.sub(r'[^\w\s-]', '', text.lower())
    s = re.sub(r'[-\s]+', '-', s).strip('-')
    return s[:60]

def assign_reporter(title, description):
    text = f"{title} {description}".lower()
    scores = []
    for r in REPORTERS:
        score = sum(1 for beat in r["beats"] if beat in text)
        scores.append((score, r))
    scores.sort(key=lambda x: x[0], reverse=True)
    return scores[0][1] if scores[0][0] > 0 else random.choice(REPORTERS)

def assign_seo_tags(title, description):
    text = f"{title} {description}".lower()
    tag_scores = []
    mapping = {
        "ChatGPT & OpenAI": ["openai", "chatgpt", "gpt-4", "gpt-5", "o1", "o3"],
        "Claude & Anthropic": ["claude", "anthropic", "sonnet", "opus", "haiku"],
        "Cursor & AI Coding": ["cursor", "coding", "programming", "ide", "copilot"],
        "Hugging Face & Open Source": ["hugging face", "open source", "llama", "mistral"],
        "Frontier Models": ["frontier", "foundation model"],
        "AI Agents & Workflows": ["agent", "agentic", "workflow", "autonomous"],
        "MCP & Tooling": ["mcp", "tool", "api", "integration", "sdk"],
        "Multimodal AI": ["multimodal", "vision", "image", "video", "audio"],
        "Reasoning Models": ["reasoning", "chain of thought", "logic"],
        "AI Compute & GPUs": ["gpu", "nvidia", "h100", "blackwell", "compute"],
        "Vector Databases & RAG": ["vector", "rag", "retrieval", "embedding"],
        "Enterprise AI": ["enterprise", "business", "saas", "deployment"],
        "AI Security & Governance": ["security", "governance", "regulation", "safety"],
        "Breakthrough Research": ["research", "paper", "arxiv", "discovery"]
    }
    for tag, keywords in mapping.items():
        score = sum(2 if kw in text else 0 for kw in keywords)
        tag_scores.append((score, tag))
    tag_scores.sort(key=lambda x: x[0], reverse=True)
    selected = [t for s, t in tag_scores if s > 0][:3]
    if len(selected) < 2:
        selected.append("Frontier Models")
    if len(selected) < 2:
        selected.append("Breakthrough Research")
    return selected

def generate_image(title):
    style_prompt = f"editorial illustration modern tech vector flat clean style, concept art about {title}"
    encoded = urllib.parse.quote(style_prompt)
    seed = random.randint(1, 100000)
    return f"https://image.pollinations.ai/prompt/{encoded}?width=1200&height=630&nologo=true&seed={seed}"

def fetch_rss(url):
    try:
        req = Request(url, headers={"User-Agent": "TheSignal-NewsBot/1.0"})
        with urlopen(req, timeout=20) as r:
            xml = r.read().decode("utf-8", errors="ignore")
            root = ET.fromstring(xml)
            items = []
            for item in root.iter("item"):
                title = item.findtext("title", "").strip()
                link = item.findtext("link", "").strip()
                desc = item.findtext("description", "") or item.findtext("summary", "") or ""
                pub_date = item.findtext("pubDate", "")
                guid = item.findtext("guid", "") or link
                clean_desc = re.sub(r"<[^>]+>", "", desc).strip()[:800]
                if title and link and len(title) > 15 and is_ai_topic(title, clean_desc):
                    items.append({
                        "id": hash(guid) % (10**12),
                        "title": title,
                        "link": link,
                        "description": clean_desc,
                        "pub_date": pub_date,
                        "source": url.split("/")[2].replace("www.", "")
                    })
            return items
    except Exception as e:
        print(f"    RSS error ({url[:40]}...): {e}")
        return []

def rewrite_fallback(title, desc, reporter):
    headline = title
    swaps = {
        "announces": "reveals", "launches": "unveils", "introduces": "debuts",
        "new": "latest", "update": "upgrade", "report": "analysis"
    }
    for old, new in swaps.items():
        headline = re.sub(rf'\b{old}\b', new, headline, flags=re.IGNORECASE)

    dek = f"An in-depth look at how {title.lower()} is reshaping the AI landscape."
    
    paras = desc.split(". ")
    if len(paras) < 3:
        paras += [
            "Industry analysts suggest this development could accelerate adoption across enterprise environments.",
            "The move comes at a critical moment when competition among frontier labs is intensifying.",
            "Teams building next-generation AI infrastructure will be watching closely for follow-on announcements."
        ]

    body_paras = ""
    for i, p in enumerate(paras[:5]):
        p = p.strip()
        if not p.endswith("."):
            p += "."
        body_paras += f"<p>{p}</p>\n\n"

    body = body_paras + (
        "<p>The implications stretch well beyond the immediate announcement. "
        "For developers, this represents another signal that the tooling and infrastructure layers of AI are consolidating faster than expected.</p>\n\n"
    )
    return headline, dek, body

def comments_section_html():
    return """
<div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
  <h3 style="font-size: 20px; font-weight: 700; color: #111827; margin-bottom: 16px;">Reader Discussion</h3>
  <form onsubmit="event.preventDefault(); postComment(this);" style="background: #f9fafb; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; margin-bottom: 20px;">
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; margin-bottom: 12px;">
      <input type="text" name="name" placeholder="Your name" required style="border: 1px solid #d1d5db; border-radius: 6px; padding: 10px; font-size: 14px; width: 100%;">
      <input type="email" name="email" placeholder="Email address" required style="border: 1px solid #d1d5db; border-radius: 6px; padding: 10px; font-size: 14px; width: 100%;">
      <input type="text" name="xhandle" placeholder="X (@username)" style="border: 1px solid #d1d5db; border-radius: 6px; padding: 10px; font-size: 14px; width: 100%;">
    </div>
    <textarea name="text" placeholder="Share your thoughts on this story..." required style="border: 1px solid #d1d5db; border-radius: 6px; padding: 10px; font-size: 14px; width: 100%; min-height: 80px; margin-bottom: 12px;"></textarea>
    <button type="submit" style="background: #2563eb; color: #ffffff; font-weight: 600; padding: 10px 20px; border-radius: 6px; border: none; cursor: pointer;">Post Comment</button>
  </form>
  <div id="comments-list"></div>
  <script>
    function postComment(form) {
      const fd = new FormData(form);
      const list = document.getElementById('comments-list');
      const item = document.createElement('div');
      item.style.cssText = 'background: #ffffff; padding: 16px; border-radius: 8px; border: 1px solid #e5e7eb; margin-bottom: 12px;';
      item.innerHTML = '<strong>' + fd.get('name') + '</strong> <span style="color:#6b7280; font-size:12px;">(' + (fd.get('xhandle') || 'Anonymous') + ')</span><p style="margin-top:6px; color:#374151;">' + fd.get('text') + '</p>';
      list.prepend(item);
      form.reset();
    }
  </script>
</div>
"""

def generate_page(article, index):
    reporter = assign_reporter(article["title"], article["description"])
    headline, dek, body = rewrite_fallback(article["title"], article["description"], reporter)
    tags = assign_seo_tags(article["title"], article["description"])
    slug = f"{slugify(headline)}-{index}"
    image_url = generate_image(headline)
    today = datetime.now().strftime("%Y-%m-%d")
    read_time = f"{max(3, len(body.split()) // 150)} min read"

    meta_desc = re.sub(r"<[^>]+>", "", body)[:150].rsplit(" ", 1)[0] + "..."

    # Author Card rendered cleanly at the end of the article content
    author_card_html = f"""
<div style="margin-top: 36px; padding: 20px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; display: flex; gap: 16px; align-items: center;">
  <img src="{reporter['avatar']}" alt="{reporter['name']}" style="width: 64px; height: 64px; border-radius: 50%; object-fit: cover;">
  <div>
    <h4 style="margin: 0; font-size: 16px; font-weight: 700; color: #0f172a;">
      Written by <a href="/news/author/{reporter['id']}/" style="color: #2563eb; text-decoration: none;">{reporter['name']}</a>
    </h4>
    <p style="margin: 2px 0 6px 0; font-size: 13px; color: #475569;">{reporter['title']} · <a href="mailto:{reporter['email']}" style="color: #2563eb; text-decoration: none;">{reporter['email']}</a></p>
    <p style="margin: 0; font-size: 13px; color: #334155;">{reporter['bio']}</p>
  </div>
</div>
"""

    md = f"""---
title: "{headline}"
description: "{meta_desc}"
image: "{image_url}"
date: "{today}"
category: "{tags[0] if tags else 'AI & Technology'}"
author: "{reporter['name']}"
author_title: "{reporter['title']}"
author_avatar: "{reporter['avatar']}"
author_email: "{reporter['email']}"
author_bio: "{reporter['bio']}"
read_time: "{read_time}"
---

{body}

{author_card_html}

{comments_section_html()}
"""
    return slug, md

def main():
    print("=" * 60)
    print("   THE SIGNAL — AI NEWS PUBLISHER")
    print("=" * 60)

    proc = load_processed()
    done = set(proc["ids"])

    today_str = datetime.now().strftime("%Y-%m-%d")
    if proc.get("today_date") != today_str:
        proc["today_count"] = 0
        proc["today_date"] = today_str

    daily_limit = 5
    remaining = daily_limit - proc.get("today_count", 0)
    target = min(1, remaining)

    if target <= 0:
        print(f"    Daily limit ({daily_limit}) reached for {today_str}. Skipping.")
        save_processed(proc)
        return

    all_articles = []
    for feed in RSS_FEEDS:
        articles = fetch_rss(feed)
        for a in articles:
            if a["id"] not in done:
                all_articles.append(a)
        time.sleep(0.2)
        if len(all_articles) >= target * 5:
            break

    if not all_articles:
        print("    No new AI articles found.")
        save_processed(proc)
        return

    random.shuffle(all_articles)
    selected = all_articles[:target]

    for i, article in enumerate(selected):
        slug, md = generate_page(article, i)
        filepath = os.path.join(CONTENT_DIR, f"{slug}.md")
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(md)
        proc["ids"].append(article["id"])
        proc["slugs"].append(slug)
        proc["total"] = len(proc["ids"])
        proc["today_count"] = proc.get("today_count", 0) + 1
        print(f"    ✅ Published cleanly: {slug}")

    save_processed(proc)
    print("✅ DONE")

if __name__ == "__main__":
    main()
