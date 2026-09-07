#!/usr/bin/env python3
"""
The Signal — AI News Publisher
Fetches from top AI news RSS feeds, rewrites articles with editorial voice,
generates comic-editorial images, assigns reporter bylines, and publishes
humanized markdown with SEO tags and reader comments sections.
"""
import json, os, re, time, random, urllib.parse, hashlib
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
        "bio": "Marcus has covered Silicon Valley for 14 years, previously at Wired and The Information. He holds a masters from Stanford and broke the story on Apples M-series chip strategy.",
        "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
        "beats": ["apple", "hardware", "chips", "nvidia", "semiconductor", "iphone", "mac"]
    },
    {
        "id": "priya",
        "name": "Priya Sharma",
        "title": "AI & Policy Editor",
        "bio": "Priya leads our AI coverage from Washington DC. Formerly at MIT Technology Review, she specializes in the intersection of regulation, ethics, and frontier model development.",
        "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
        "beats": ["regulation", "policy", "ethics", "safety", "governance", "agentic", "agents"]
    },
    {
        "id": "jamie",
        "name": "Jamie O'Brien",
        "title": "Silicon Valley Bureau Chief",
        "bio": "Jamie has been reporting from Palo Alto since 2012. He previously covered enterprise software at Bloomberg and holds deep source relationships across every major AI lab.",
        "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
        "beats": ["openai", "google", "microsoft", "meta", "funding", "venture", "startup", "enterprise"]
    },
    {
        "id": "elena",
        "name": "Elena Vasquez",
        "title": "Enterprise Technology Reporter",
        "bio": "Elena reports on how Fortune 500 companies are deploying AI at scale. Before joining The Signal, she spent six years at Forbes covering cloud infrastructure and SaaS.",
        "avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
        "beats": ["enterprise", "cloud", "saas", "workflow", "automation", "deployment", "scale"]
    },
    {
        "id": "david",
        "name": "David Kim",
        "title": "Hardware & Chips Analyst",
        "bio": "David holds a PhD in electrical engineering from Caltech and writes about semiconductors, data center architecture, and the physics of AI training at scale.",
        "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
        "beats": ["gpu", "data center", "training", "inference", "compute", "memory", "h100", "blackwell"]
    }
]

# ─── SEO TAGS ─────────────────────────────────────────────────────────────────
SEO_TAGS = [
    "ChatGPT & OpenAI", "Claude & Anthropic", "Cursor & AI Coding",
    "Hugging Face & Open Source", "Frontier Models", "AI Agents & Workflows",
    "MCP & Tooling", "Multimodal AI", "Reasoning Models",
    "AI Compute & GPUs", "Vector Databases & RAG", "Enterprise AI",
    "AI Security & Governance", "Breakthrough Research"
]

# ─── RSS FEEDS ────────────────────────────────────────────────────────────────
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
    """Assign the best-fit reporter based on article content."""
    text = f"{title} {description}".lower()
    scores = []
    for r in REPORTERS:
        score = sum(1 for beat in r["beats"] if beat in text)
        scores.append((score, r))
    scores.sort(key=lambda x: x[0], reverse=True)
    return scores[0][1] if scores[0][0] > 0 else random.choice(REPORTERS)

def assign_seo_tags(title, description):
    """Assign 2–3 relevant SEO tags based on content analysis."""
    text = f"{title} {description}".lower()
    tag_scores = []
    mapping = {
        "ChatGPT & OpenAI": ["openai", "chatgpt", "gpt-4", "gpt-5", "sam altman", "o1", "o3"],
        "Claude & Anthropic": ["claude", "anthropic", "sonnet", "opus", "haiku", "dario amodei"],
        "Cursor & AI Coding": ["cursor", "coding", "programming", "ide", "code generation", "copilot", "devin"],
        "Hugging Face & Open Source": ["hugging face", "huggingface", "open source", "llama", "mistral", "meta ai"],
        "Frontier Models": ["frontier", "gpt-5", "claude 4", "gemini 2", "next-gen", "foundation model"],
        "AI Agents & Workflows": ["agent", "agentic", "workflow", "autonomous", "task", "orchestration"],
        "MCP & Tooling": ["mcp", "tool", "api", "integration", "sdk", "framework", "plugin"],
        "Multimodal AI": ["multimodal", "vision", "image generation", "video", "audio", "speech"],
        "Reasoning Models": ["reasoning", "chain of thought", "o1", "o3", "logic", "inference"],
        "AI Compute & GPUs": ["gpu", "nvidia", "h100", "blackwell", "compute", "data center", "training cluster", "inference"],
        "Vector Databases & RAG": ["vector", "rag", "retrieval", "embedding", "pinecone", "weaviate", "chromadb"],
        "Enterprise AI": ["enterprise", "business", "fortune 500", "saas", "deployment", "scale", "corporate"],
        "AI Security & Governance": ["security", "governance", "regulation", "safety", "alignment", "policy", "risk"],
        "Breakthrough Research": ["research", "paper", "arxiv", "novel", "breakthrough", "discovery", "academic"]
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
    """Generate modern Verge-style comic editorial art via Pollinations."""
    style_prompt = (
        f"The Verge editorial illustration, graphic novel comic book art style, "
        f"vibrant pop art colors, bold lines, retro-futuristic concept art about {title}"
    )
    encoded = urllib.parse.quote(style_prompt)
    seed = random.randint(1, 100000)
    return f"https://image.pollinations.ai/prompt/{encoded}?width=1200&height=630&nologo=true&seed={seed}"

# ─── RSS FETCHING ────────────────────────────────────────────────────────────

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

# ─── ARTICLE REWRITING ───────────────────────────────────────────────────────

def rewrite_article(title, description, reporter):
    """Generate a thick, humanized editorial article."""
    openai_key = os.environ.get("OPENAI_API_KEY", "")
    anthropic_key = os.environ.get("ANTHROPIC_API_KEY", "")

    if openai_key:
        return rewrite_with_openai(title, description, reporter, openai_key)
    elif anthropic_key:
        return rewrite_with_anthropic(title, description, reporter, anthropic_key)
    else:
        return rewrite_fallback(title, description, reporter)

def rewrite_with_openai(title, desc, reporter, key):
    try:
        import urllib.request
        system_prompt = (
            "You are a senior technology journalist writing for an independent publication called The Signal. "
            "Your voice is sharp, analytical, and human. You write in long-form editorial style with narrative flow, "
            "scene-setting, and analytical depth. "
            "\n\n"
            "Rules:\n"
            "1. Write a compelling headline (max 90 chars) and a full article body (400–700 words).\n"
            "2. Include a strong lede, 3–5 body paragraphs, and one pull quote in <blockquote> tags with a <cite>.\n"
            "3. Do NOT include any source URLs, 'original story from', 'read more', 'auto-curated', bot signatures, or disclaimers.\n"
            "4. Do NOT mention that this was rewritten or reference the original source.\n"
            "5. Write as if you personally reported this story.\n"
            "6. Return ONLY a JSON object with keys: headline, dek (subheadline under 140 chars), body (HTML string)."
        )
        user_msg = f"Reporter: {reporter['name']}, {reporter['title']}\n\nOriginal headline: {title}\nOriginal summary: {desc}"
        data = json.dumps({
            "model": "gpt-4o-mini",
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_msg}
            ],
            "temperature": 0.75,
            "max_tokens": 1800
        }).encode()

        req = urllib.request.Request(
            "https://api.openai.com/v1/chat/completions",
            data=data,
            headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
            method="POST"
        )
        with urllib.request.urlopen(req, timeout=45) as r:
            result = json.loads(r.read().decode())
            content = result["choices"][0]["message"]["content"]
            match = re.search(r'\{.*"headline".*"dek".*"body".*\}', content, re.DOTALL)
            if match:
                parsed = json.loads(match.group())
                return parsed.get("headline", title), parsed.get("dek", ""), parsed.get("body", desc)
    except Exception as e:
        print(f"    OpenAI rewrite failed: {e}")
    return rewrite_fallback(title, desc, reporter)

def rewrite_with_anthropic(title, desc, reporter, key):
    try:
        import urllib.request
        system_prompt = (
            "You are a senior technology editor at The Signal, an independent tech publication. "
            "Rewrite the following AI news into a humanized, detailed editorial article. "
            "\n\n"
            "Requirements:\n"
            "- Compelling headline (max 90 chars)\n"
            "- A dek / subheadline (max 140 chars)\n"
            "- Full article body of 400–700 words in HTML\n"
            "- Include one <blockquote> with a <cite> for a pull quote\n"
            "- Do NOT include source links, disclaimers, bot signatures, or any indication this was generated\n"
            "- Write as original reporting\n"
            "Return ONLY JSON with keys: headline, dek, body"
        )
        user_msg = f"Reporter: {reporter['name']}, {reporter['title']}\n\nHeadline: {title}\nSummary: {desc}"
        data = json.dumps({
            "model": "claude-3-haiku-20240307",
            "max_tokens": 1800,
            "messages": [
                {"role": "user", "content": f"{system_prompt}\n\n{user_msg}"}
            ]
        }).encode()

        req = urllib.request.Request(
            "https://api.anthropic.com/v1/messages",
            data=data,
            headers={"x-api-key": key, "Content-Type": "application/json", "anthropic-version": "2023-06-01"},
            method="POST"
        )
        with urllib.request.urlopen(req, timeout=45) as r:
            result = json.loads(r.read().decode())
            content = result["content"][0]["text"]
            match = re.search(r'\{.*"headline".*"dek".*"body".*\}', content, re.DOTALL)
            if match:
                parsed = json.loads(match.group())
                return parsed.get("headline", title), parsed.get("dek", ""), parsed.get("body", desc)
    except Exception as e:
        print(f"    Anthropic rewrite failed: {e}")
    return rewrite_fallback(title, desc, reporter)

def rewrite_fallback(title, desc, reporter):
    """Basic humanized fallback when APIs are unavailable."""
    # Humanize headline
    headline = title
    swaps = {
        "announces": "reveals", "launches": "unveils", "introduces": "debuts",
        "new": "latest", "update": "upgrade", "report": "analysis",
        "study": "deep dive", "research": "investigation"
    }
    for old, new in swaps.items():
        headline = re.sub(rf'\b{old}\b', new, headline, flags=re.IGNORECASE)
    if len(headline) > 90:
        headline = headline[:87].rsplit(" ", 1)[0] + "..."

    dek = f"An in-depth look at how {title.lower()} is reshaping the AI landscape and what it means for the industry."
    if len(dek) > 140:
        dek = dek[:137] + "..."

    # Build thick body from description
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
        if i == 0:
            body_paras += f"<p>{p}</p>\n"
        elif i == 2:
            body_paras += (
                f'<blockquote>"{p}"<cite>— {reporter["name"]}, {reporter["title"]}</cite></blockquote>\n'
            )
        else:
            body_paras += f"<p>{p}</p>\n"

    body = body_paras + (
        f"<p>The implications stretch well beyond the immediate announcement. "
        f"For developers, this represents another signal that the tooling and infrastructure layers of AI are consolidating faster than most predicted. "
        f"For investors, it raises questions about which bets will pay off before the market resets expectations.</p>\n"
        f"<p>{reporter['name']} covers this beat from {reporter['title'].split()[-1] if reporter['title'].split() else 'the field'}. "
        f"Follow The Signal for continuing coverage.</p>"
    )
    return headline, dek, body

# ─── COMMENTS SECTION TEMPLATE ─────────────────────────────────────────────

def comments_section_html():
    return """
<div class="comments-section" style="margin-top:48px;padding-top:32px;border-top:1px solid #2a2a3a;">
  <h3 style="font-size:20px;font-weight:700;margin-bottom:24px;display:flex;align-items:center;gap:10px;color:#f0f0f5;">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
    Reader Discussion
  </h3>
  <form class="comment-form" style="background:#1e1e2e;padding:24px;border-radius:12px;margin-bottom:24px;border:1px solid #2a2a3a;" onsubmit="event.preventDefault(); postComment(this);">
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:12px;">
      <input type="text" class="form-input" name="name" placeholder="Your name" required style="background:#12121a;border:1px solid #2a2a3a;border-radius:8px;padding:12px 14px;color:#f0f0f5;font-size:14px;width:100%;">
      <input type="email" class="form-input" name="email" placeholder="Email address" required style="background:#12121a;border:1px solid #2a2a3a;border-radius:8px;padding:12px 14px;color:#f0f0f5;font-size:14px;width:100%;">
      <input type="text" class="form-input" name="xhandle" placeholder="X.com handle (@username)" style="background:#12121a;border:1px solid #2a2a3a;border-radius:8px;padding:12px 14px;color:#f0f0f5;font-size:14px;width:100%;">
    </div>
    <textarea class="form-input" name="text" placeholder="Share your thoughts on this story..." required style="background:#12121a;border:1px solid #2a2a3a;border-radius:8px;padding:12px 14px;color:#f0f0f5;font-size:14px;width:100%;min-height:100px;resize:vertical;margin-bottom:12px;"></textarea>
    <button type="submit" style="background:#ff6b35;color:#fff;border:none;padding:12px 28px;border-radius:8px;font-size:14px;font-weight:700;cursor:pointer;">Post Comment</button>
  </form>
  <div class="comments-list" id="comments-list"></div>
  <script>
    function postComment(form) {
      const fd = new FormData(form);
      const name = fd.get('name'), email = fd.get('email'), xhandle = fd.get('xhandle'), text = fd.get('text');
      const list = document.getElementById('comments-list');
      const item = document.createElement('div');
      item.style.cssText = 'background:#1e1e2e;padding:20px;border-radius:12px;border:1px solid #2a2a3a;margin-bottom:16px;';
      const initials = name.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase();
      item.innerHTML = '<div style="display:flex;align-items:center;gap:12px;margin-bottom:10px;"><div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#ff6b35,#ff8f5a);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;color:#fff;">'+initials+'</div><div style="flex:1;"><div style="font-size:14px;font-weight:700;color:#f0f0f5;">'+name+'</div><div style="font-size:12px;color:#6b6b7b;">'+(xhandle||'@anonymous')+' · '+email+'</div></div><div style="font-size:12px;color:#6b6b7b;">Just now</div></div><div style="font-size:14px;color:#a0a0b0;line-height:1.6;padding-left:48px;">'+text+'</div>';
      list.prepend(item);
      form.reset();
    }
  </script>
</div>
"""

# ─── PAGE GENERATION ─────────────────────────────────────────────────────────

def generate_page(article, index):
    reporter = assign_reporter(article["title"], article["description"])
    headline, dek, body = rewrite_article(article["title"], article["description"], reporter)
    tags = assign_seo_tags(article["title"], article["description"])
    slug = f"{slugify(headline)}-{index}"
    image_url = generate_image(headline)
    today = datetime.now().strftime("%Y-%m-%d")
    read_time = f"{max(5, len(body.split()) // 200)} min read"

    meta_desc = re.sub(r"<[^>]+>", "", body)[:150].rsplit(" ", 1)[0] + "..."
    if len(meta_desc) > 160:
        meta_desc = meta_desc[:157] + "..."

    schema = {
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        "headline": headline,
        "description": meta_desc,
        "image": image_url,
        "datePublished": today,
        "dateModified": today,
        "author": {
            "@type": "Person",
            "name": reporter["name"],
            "jobTitle": reporter["title"]
        },
        "publisher": {
            "@type": "Organization",
            "name": "The Signal"
        },
        "articleSection": tags[0] if tags else "AI & Technology",
        "keywords": ", ".join(tags)
    }

    tag_pills = "\n".join([f'<span class="hero-tag">{t}</span>' for t in tags])

    md = f"""---
slug: {slug}
title: "{headline}"
meta_description: "{meta_desc}"
keywords: "{', '.join(tags)}"
type: news
category: "{tags[0] if tags else 'AI & Technology'}"
image: {image_url}
published_at: {today}
read_time: {read_time}
reporter_name: {reporter['name']}
reporter_title: {reporter['title']}
reporter_avatar: {reporter['avatar']}
reporter_bio: {reporter['bio']}
schema_json: |
  {json.dumps(schema, indent=2)}
---

<div class="article-hero">
  <img src="{image_url}" alt="{headline}" loading="eager">
  <div class="article-tag-strip">
    {tag_pills}
  </div>
</div>

<div class="article-body">
  <div class="article-meta">
    <img src="{reporter['avatar']}" alt="{reporter['name']}" class="reporter-avatar">
    <div class="reporter-info">
      <div class="reporter-name">{reporter['name']}</div>
      <div class="reporter-title">{reporter['title']}</div>
    </div>
    <div class="article-date">{today} · {read_time}</div>
  </div>

  <h1 class="article-headline">{headline}</h1>
  <p class="article-dek">{dek}</p>

  <div class="article-content">
    {body}
  </div>

  {comments_section_html()}
</div>
"""
    return slug, md

# ─── MAIN ────────────────────────────────────────────────────────────────────

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

    # Publishing cadence
    days_since_start = (datetime.now() - datetime(2026, 9, 1)).days
    daily_limit = 1 if days_since_start < 30 else (2 if days_since_start < 90 else 3)
    remaining = daily_limit - proc.get("today_count", 0)
    target = min(1, remaining)  # 1 per run, respecting daily cap

    if target <= 0:
        print(f"    Daily limit ({daily_limit}) reached for {today_str}. Skipping.")
        save_processed(proc)
        return

    print(f"📰 Target: {target} article(s)  (daily cap: {daily_limit}, published today: {proc.get('today_count', 0)})")

    all_articles = []
    for feed in RSS_FEEDS:
        articles = fetch_rss(feed)
        for a in articles:
            if a["id"] not in done:
                all_articles.append(a)
        time.sleep(0.5)
        if len(all_articles) >= target * 5:
            break

    print(f"    Fetched {len(all_articles)} fresh AI articles")

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
        print(f"    ✅ Published: {slug}")
        time.sleep(1)

    save_processed(proc)
    print(f"\n💾 Total published: {proc['total']}")
    print(f"    Today: {proc['today_count']}/{daily_limit}")
    print("✅ DONE")

if __name__ == "__main__":
    main()
