#!/usr/bin/env python3
"""
The Signal — AI News Publisher (Upgraded Edition)
Fetches from expanded AI news feeds and web scrapers, rewrites headlines and detailed long-form content,
generates dynamic comic-book style artwork, and assigns reporter profiles.
"""
import json, os, re, time, random, urllib.parse
from urllib.request import Request, urlopen
from datetime import datetime
from xml.etree import ElementTree as ET
from bs4 import BeautifulSoup

PROCESSED = "processed-news.json"
CONTENT_DIR = "content/news"
os.makedirs(CONTENT_DIR, exist_ok=True)

# ─── REPORTER PROFILES ─────────────────────────────────────────────────────
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

# ─── COMMENTERS ─────────────────────────────────────────────────────────────
COMMENTERS = [
    {"name": "Alex Rivera", "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face", "handle": "@alexrivera_ai"},
    {"name": "Sarah Jenkins", "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face", "handle": "@sjenkins_tech"},
    {"name": "David Wu", "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face", "handle": "@dwu_dev"},
    {"name": "Elena Rostova", "avatar": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face", "handle": "@elena_ai"},
    {"name": "Michael Chang", "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face", "handle": "@mchang_gpu"}
]

COMMENT_TEMPLATES = [
    "The rate at which these tools are evolving is incredible. Curious to see how this impacts production deployments next quarter.",
    "Solid breakdown. The architectural implications here are huge, especially for teams working on agentic workflows.",
    "This aligns with what we've been seeing in production. The latency benchmarks will be the real test.",
    "Very timely piece! Hope to see a follow-up once more benchmark data becomes publicly available.",
    "Great analysis. The integration complexity seems lower than expected, which could accelerate enterprise adoption."
]

# ─── UPDATED & VERIFIED RSS FEEDS ───────────────────────────────────────────
RSS_FEEDS = [
    "https://www.androguider.com/feeds/posts/default?alt=rss",
    "https://aiweekly.co/issues.rss",
    "https://www.artificialintelligence-news.com/feed/",
    "https://techcrunch.com/category/artificial-intelligence/feed/",
    "https://www.theverge.com/rss/index.xml",
    "https://venturebeat.com/category/ai/feed/",
    "https://www.wired.com/feed/tag/ai/latest/rss",
    "https://arstechnica.com/tag/ai/feed/",
    "https://www.technologyreview.com/feed/"
]

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5"
}

AI_KEYWORDS = [
    'ai', 'artificial intelligence', 'llm', 'claude', 'gpt', 'openai',
    'anthropic', 'mcp', 'neural', 'machine learning', 'deep learning',
    'generative ai', 'transformer', 'agentic', 'reasoning', 'multimodal',
    'rag', 'vector database', 'gpu', 'cuda', 'training', 'inference',
    'frontier model', 'agent', 'workflow', 'coding', 'cursor', 'tech'
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
    tags = []
    if any(k in text for k in ["openai", "chatgpt", "gpt"]): tags.append("ChatGPT & OpenAI")
    if any(k in text for k in ["claude", "anthropic"]): tags.append("Claude & Anthropic")
    if any(k in text for k in ["gpu", "nvidia", "hardware", "chip"]): tags.append("AI Compute & GPUs")
    if any(k in text for k in ["agent", "workflow"]): tags.append("AI Agents & Workflows")
    
    if not tags:
        tags = ["Frontier Models", "Enterprise AI"]
    return tags[:2]

# ─── HIGH QUALITY COMIC MAGAZINE IMAGE GENERATOR ────────────────────────────
def generate_comic_image(title):
    clean_title = re.sub(r'[^\w\s]', '', title)
    prompt = (
        f"graphic novel style comic book illustration of {clean_title}, "
        f"detailed comic panel art, sharp ink lineart, vibrant flat vector color palette, "
        f"cyberpunk tech aesthetic, high contrast, crisp detail, 8k resolution, pop art style, cinematic superhero comic book cover"
    )
    encoded = urllib.parse.quote(prompt)
    seed = random.randint(10000, 99999)
    return f"https://image.pollinations.ai/prompt/{encoded}?width=1200&height=630&nologo=true&seed={seed}&enhance=true"

# ─── REWRITE ENGINE FOR HEADLINES & LONG ARTICLES ──────────────────────────
def rewrite_headline_and_article(original_title, desc, reporter):
    prefixes = [
        "Inside the Shift:", "Behind the Scenes:", "Market Breakthrough:",
        "The Next Era:", "Analysis:", "Strategic Move:"
    ]
    swaps = {
        "announces": "Unveils Next-Gen",
        "launches": "Rolls Out High-Impact",
        "introduces": "Debuts Game-Changing",
        "new": "Advanced",
        "update": "Overhaul",
        "report": "Deep-Dive Analysis",
        "quits": "Departs Lab",
        "warns": "Issues Stark Warning On",
        "races": "Accelerates Strategy for"
    }

    rewritten_title = original_title
    for old, new in swaps.items():
        rewritten_title = re.sub(rf'\b{old}\b', new, rewritten_title, flags=re.IGNORECASE)
    
    if rewritten_title == original_title:
        rewritten_title = f"{random.choice(prefixes)} {original_title}"

    clean_desc = re.sub(r"<[^>]+>", "", desc).strip()
    sentences = [s.strip() for s in clean_desc.split(". ") if len(s.strip()) > 5]
    
    summary_lead = sentences[0] if sentences else "Significant developments are unfolding across the artificial intelligence sector."
    second_lead = sentences[1] if len(sentences) > 1 else "Industry experts are scrutinizing the long-term strategic implications of this step."
    detail_context = " ".join(sentences[2:]) if len(sentences) > 2 else "Organizations across the tech ecosystem are recalibrating their roadmaps in response to fast-moving developments."

    body = f"""<p class="lead"><strong>SAN FRANCISCO</strong> — In a pivotal moment for the artificial intelligence landscape, {summary_lead.lower() if summary_lead[0].isupper() else summary_lead} {second_lead}</p>

<h2>The Technical and Strategic Shift</h2>
<p>{detail_context}</p>

<p>As competition among frontier AI labs and enterprise software providers intensifies, today's announcement underscores a broader trend: rapid architectural refinement paired with aggressive infrastructure scaling. Industry observers note that the speed of execution is challenging established benchmarks across developer workflows and commercial deployments.</p>

<blockquote style="border-left: 4px solid #2563eb; padding-left: 16px; margin: 24px 0; color: #475569; font-style: italic;">
"What we are observing is not merely an incremental release, but a fundamental realignment in how autonomous tools and high-performance systems are integrated," noted lead industry analyst target metrics.
</blockquote>

<h2>Enterprise & Developer Impact</h2>
<p>For engineering teams and enterprise decision-makers, the immediate priority centers on integration friction, cost efficiency, and performance reliability. Early technical breakdowns suggest that adoption will hinge on standardizing protocols across existing software stacks.</p>

<ul>
  <li><strong>Enhanced Efficiency:</strong> Latency optimization remains a critical focal point for real-world application benchmarks.</li>
  <li><strong>Infrastructure Scaling:</strong> Demand for specialized compute and low-latency API pipelines continues to surge.</li>
  <li><strong>Regulatory Alignment:</strong> Enterprise buyers are placing heightened emphasis on governance, compliance, and security guarantees.</li>
</ul>

<h2>Looking Ahead</h2>
<p>As the rollout continues, market participants will be closely evaluating operational metrics, benchmark performance, and developer feedback. The Signal will continue tracking follow-on announcements and developer ecosystem reactions in real time.</p>
"""
    return rewritten_title, body

# ─── RSS FETCHING & DIRECT WEB SCRAPING ──────────────────────────────────────
def fetch_rss(url):
    try:
        req = Request(url, headers=HEADERS)
        with urlopen(req, timeout=15) as r:
            xml = r.read().decode("utf-8", errors="ignore")
            root = ET.fromstring(xml)
            items = []
            
            nodes = root.findall(".//item") or root.findall(".//{http://www.w3.org/2005/Atom}entry")
            for item in nodes:
                title = (item.findtext("title") or item.findtext("{http://www.w3.org/2005/Atom}title") or "").strip()
                link = (item.findtext("link") or item.findtext("{http://www.w3.org/2005/Atom}link") or "").strip()
                desc = (
                    item.findtext("description") or 
                    item.findtext("summary") or 
                    item.findtext("{http://www.w3.org/2005/Atom}summary") or ""
                )
                pub_date = item.findtext("pubDate") or item.findtext("{http://www.w3.org/2005/Atom}updated") or ""
                guid = item.findtext("guid") or link
                
                clean_desc = re.sub(r"<[^>]+>", "", desc).strip()[:1000]
                if title and len(title) > 12:
                    items.append({
                        "id": abs(hash(guid or title)),
                        "title": title,
                        "link": link,
                        "description": clean_desc,
                        "pub_date": pub_date,
                        "source": url.split("/")[2].replace("www.", "")
                    })
            return items
    except Exception as e:
        print(f"   [Feed Warning] Could not parse ({url[:45]}...): {e}")
        return []

def fetch_ground_news_articles():
    """Scrapes stories directly from Ground News AI Topic page."""
    items = []
    target_url = "https://ground.news/interest/artificial-intelligence"
    try:
        req = Request(target_url, headers=HEADERS)
        with urlopen(req, timeout=15) as response:
            html = response.read().decode("utf-8", errors="ignore")
            soup = BeautifulSoup(html, "html.parser")
            
            for a_tag in soup.find_all("a", href=re.compile(r"/article/")):
                title = a_tag.get_text(strip=True)
                href = a_tag.get("href", "")
                full_link = f"https://ground.news{href}" if href.startswith("/") else href
                
                if title and len(title) > 15:
                    items.append({
                        "id": abs(hash(full_link)),
                        "title": title,
                        "link": full_link,
                        "description": title,
                        "pub_date": "",
                        "source": "ground.news"
                    })
    except Exception as e:
        print(f"   [Scrape Warning] Could not scrape Ground News: {e}")
    return items

def get_all_articles():
    """Aggregates items from standard RSS feeds and direct page scrapers."""
    all_articles = []
    
    # Standard XML RSS/Atom Feeds
    for feed in RSS_FEEDS:
        all_articles.extend(fetch_rss(feed))
        time.sleep(0.1)
        
    # HTML Scrapers for non-RSS sites (e.g. Ground News)
    all_articles.extend(fetch_ground_news_articles())
    
    return all_articles

# ─── AUTOMATED COMMENTS MARKUP ───────────────────────────────────────────────
def comments_section_html(num_comments=2):
    selected_users = random.sample(COMMENTERS, num_comments)
    comments_html = ""
    for u in selected_users:
        text = random.choice(COMMENT_TEMPLATES)
        claps = random.randint(18, 140)
        comments_html += f"""
        <div style="padding: 16px 0; border-bottom: 1px solid #f3f4f6;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <img src="{u['avatar']}" style="width: 36px; height: 36px; border-radius: 50%; object-fit: cover;">
              <div>
                <div style="font-weight: 600; font-size: 14px; color: #111827;">{u['name']}</div>
                <div style="font-size: 12px; color: #6b7280;">{u['handle']}</div>
              </div>
            </div>
          </div>
          <p style="font-size: 14px; line-height: 1.5; color: #374151; margin: 0 0 10px 0;">{text}</p>
          <div style="font-size: 13px; color: #6b7280;">👏 {claps} claps</div>
        </div>
        """
    return f"""
<div style="margin-top: 48px; padding-top: 32px; border-top: 1px solid #e5e7eb;">
  <h3 style="font-size: 20px; font-weight: 700; color: #111827; margin-bottom: 20px;">Community Responses</h3>
  {comments_html}
</div>
"""

# ─── PAGE GENERATION ─────────────────────────────────────────────────────────
def generate_page(article, index):
    reporter = assign_reporter(article["title"], article["description"])
    headline, body = rewrite_headline_and_article(article["title"], article["description"], reporter)
    tags = assign_seo_tags(headline, article["description"])
    slug = f"{slugify(headline)}-{index}"
    image_url = generate_comic_image(headline)
    today = datetime.now().strftime("%Y-%m-%d")
    read_time = f"{max(4, len(body.split()) // 130)} min read"
    meta_desc = re.sub(r"<[^>]+>", "", body)[:150].rsplit(" ", 1)[0] + "..."

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
category: "{tags[0]}"
author: "{reporter['name']}"
author_title: "{reporter['title']}"
author_avatar: "{reporter['avatar']}"
author_email: "{reporter['email']}"
author_bio: "{reporter['bio']}"
read_time: "{read_time}"
---

{body}

{author_card_html}

{comments_section_html(2)}
"""
    return slug, md

# ─── MAIN EXECUTION ─────────────────────────────────────────────────────────
def main():
    print("=" * 60)
    print("    THE SIGNAL — UPGRADED AI NEWS PUBLISHER")
    print("=" * 60)

    proc = load_processed()
    done = set(proc["ids"])

    today_str = datetime.now().strftime("%Y-%m-%d")
    if proc.get("today_date") != today_str:
        proc["today_count"] = 0
        proc["today_date"] = today_str

    daily_limit = 5
    remaining = daily_limit - proc.get("today_count", 0)
    target = min(3, max(1, remaining))

    if remaining <= 0:
        print(f"    Daily limit ({daily_limit}) reached for {today_str}. Skipping.")
        save_processed(proc)
        return

    print("🔍 Crawling RSS Feeds & Direct Scrapers...")
    fetched_articles = get_all_articles()
    
    all_articles = [a for a in fetched_articles if a["id"] not in done]

    if not all_articles:
        print("    No new articles found.")
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
        proc["today_count"] = proc.get("today_count", 0) + 1
        print(f"    Published: {slug}.md")

    save_processed(proc)
    print("PROCESS COMPLETE")

if __name__ == "__main__":
    main()
