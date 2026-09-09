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

# ─── 20 REALISTIC COMMENTER PROFILES ─────────────────────────────────────────
COMMENTERS = [
    {"name": "Alex Rivera", "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face", "handle": "@alexrivera_ai"},
    {"name": "Sarah Jenkins", "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face", "handle": "@sjenkins_tech"},
    {"name": "David Wu", "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face", "handle": "@dwu_dev"},
    {"name": "Elena Rostova", "avatar": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face", "handle": "@elena_ai"},
    {"name": "Michael Chang", "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face", "handle": "@mchang_gpu"},
    {"name": "Jessica Taylor", "avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face", "handle": "@jtaylor_ml"},
    {"name": "Liam Thorne", "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face", "handle": "@lthorne_code"},
    {"name": "Amara Diallo", "avatar": "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop&crop=face", "handle": "@amara_data"},
    {"name": "Lucas Meyer", "avatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face", "handle": "@lmeyer_systems"},
    {"name": "Nina Patel", "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face", "handle": "@ninapatel_ai"},
    {"name": "Carlos Gomez", "avatar": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face", "handle": "@cgomez_tech"},
    {"name": "Emily Watson", "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face", "handle": "@ewatson_research"},
    {"name": "Tariq Mansour", "avatar": "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=100&h=100&fit=crop&crop=face", "handle": "@tariq_m"},
    {"name": "Chloe Bennett", "avatar": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop&crop=face", "handle": "@chloe_design"},
    {"name": "Siddharth Rao", "avatar": "https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?w=100&h=100&fit=crop&crop=face", "handle": "@sidrao_mcp"},
    {"name": "Hannah Abbott", "avatar": "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=100&h=100&fit=crop&crop=face", "handle": "@habbott_cloud"},
    {"name": "Vikram Malhotra", "avatar": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&h=100&fit=crop&crop=face", "handle": "@vmalhotra_ai"},
    {"name": "Rachel Vance", "avatar": "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face", "handle": "@rvance_sec"},
    {"name": "Daniel Park", "avatar": "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop&crop=face", "handle": "@dpark_infra"},
    {"name": "Sophie Martin", "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face", "handle": "@smartin_eth"}
]

COMMENT_TEMPLATES = [
    "The rate at which these tools are evolving is incredible. Curious to see how this impacts production deployments next quarter.",
    "Solid breakdown. The architectural implications here are huge, especially for teams working on agentic workflows.",
    "This aligns with what we've been seeing in production. The latency benchmarks will be the real test.",
    "Very timely piece! Hope to see a follow-up once more benchmark data becomes publicly available.",
    "Great analysis. The integration complexity seems lower than expected, which could accelerate enterprise adoption.",
    "Interesting perspective. I wonder how this impacts existing open-source alternatives over the next few months."
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

# ─── AUTOMATED COMMENT GENERATOR ─────────────────────────────────────────────

def generate_auto_comments(num_comments):
    selected_users = random.sample(COMMENTERS, num_comments)
    comments_html = ""
    
    for u in selected_users:
        text = random.choice(COMMENT_TEMPLATES)
        claps = random.randint(12, 185)
        replies_count = random.randint(0, 3)
        reply_label = f" · {replies_count} replies" if replies_count > 0 else ""
        
        comments_html += f"""
        <div style="padding: 16px 0; border-bottom: 1px solid #f3f4f6;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <img src="{u['avatar']}" style="width: 36px; height: 36px; border-radius: 50%; object-fit: cover;">
              <div>
                <div style="font-weight: 600; font-size: 14px; color: #111827;">{u['name']}</div>
                <div style="font-size: 12px; color: #6b7280;">Today {reply_label}</div>
              </div>
            </div>
            <button style="background: none; border: none; cursor: pointer; color: #9ca3af; font-size: 18px;">···</button>
          </div>
          <p style="font-size: 14px; line-height: 1.5; color: #374151; margin: 0 0 10px 0;">{text}</p>
          <div style="display: flex; align-items: center; gap: 16px; font-size: 13px; color: #6b7280;">
            <button onclick="this.querySelector('span').innerText = parseInt(this.querySelector('span').innerText) + 1" style="background: none; border: none; cursor: pointer; display: flex; align-items: center; gap: 4px; color: #6b7280; font-size: 13px; padding: 0;">
              👏 <span>{claps}</span>
            </button>
            <button style="background: none; border: none; cursor: pointer; color: #6b7280; font-size: 13px; padding: 0;">Reply</button>
          </div>
        </div>
        """
    return comments_html

def comments_section_html(num_auto_comments):
    auto_comments_markup = generate_auto_comments(num_auto_comments)
    total_count = num_auto_comments
    
    return f"""
<div style="margin-top: 48px; padding-top: 32px; border-top: 1px solid #e5e7eb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
    <h3 style="font-size: 22px; font-weight: 700; color: #111827; margin: 0;">Responses ({total_count})</h3>
  </div>

  <!-- SIGN IN TO COMMENT TRIGGER -->
  <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; margin-bottom: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
      <div style="width: 36px; height: 36px; border-radius: 50%; background: #f3f4f6; display: flex; align-items: center; justify-content: center; color: #9ca3af; font-size: 18px;">👤</div>
      <input type="text" onclick="openAuthModal()" readonly placeholder="What are your thoughts?" style="width: 100%; border: none; background: #f9fafb; padding: 10px 14px; border-radius: 8px; font-size: 14px; color: #4b5563; cursor: pointer;">
    </div>
    <div style="display: flex; justify-content: flex-end;">
      <button onclick="openAuthModal()" style="background: #2563eb; color: #ffffff; font-weight: 600; font-size: 14px; padding: 8px 18px; border-radius: 20px; border: none; cursor: pointer; transition: background 0.2s;">Sign in to Comment</button>
    </div>
  </div>

  <!-- AUTOMATED REAL COMMENTS -->
  <div id="comments-list">
    {auto_comments_markup}
  </div>
</div>

<!-- MEDIUM-STYLE SOCIAL LOGIN MODAL -->
<div id="authModal" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); z-index: 9999; align-items: center; justify-content: center;">
  <div style="background: #ffffff; border-radius: 16px; width: 100%; max-width: 400px; padding: 28px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); position: relative; font-family: sans-serif;">
    <button onclick="closeAuthModal()" style="position: absolute; top: 16px; right: 16px; background: none; border: none; font-size: 20px; cursor: pointer; color: #9ca3af;">✕</button>
    
    <h3 style="font-size: 20px; font-weight: 700; text-align: center; color: #111827; margin-top: 0; margin-bottom: 8px;">Sign in to join discussion</h3>
    <p style="font-size: 13px; color: #6b7280; text-align: center; margin-bottom: 24px;">Mandatory email registration for community features & daily AI insights.</p>

    <form onsubmit="handleAuthSubmit(event)" style="display: flex; flex-direction: column; gap: 12px;">
      <input type="text" id="authName" placeholder="Full Name" required style="border: 1px solid #d1d5db; border-radius: 8px; padding: 10px 12px; font-size: 14px; width: 100%; box-sizing: border-box;">
      <input type="email" id="authEmail" placeholder="Email Address (Mandatory)" required style="border: 1px solid #d1d5db; border-radius: 8px; padding: 10px 12px; font-size: 14px; width: 100%; box-sizing: border-box;">
      <input type="text" id="authX" placeholder="X / Twitter (@username)" style="border: 1px solid #d1d5db; border-radius: 8px; padding: 10px 12px; font-size: 14px; width: 100%; box-sizing: border-box;">
      
      <button type="submit" style="background: #2563eb; color: #ffffff; font-weight: 600; padding: 11px; border-radius: 8px; border: none; cursor: pointer; margin-top: 4px; font-size: 14px;">Continue with Email</button>
    </form>

    <div style="display: flex; align-items: center; margin: 20px 0; color: #9ca3af; font-size: 12px;">
      <div style="flex: 1; border-bottom: 1px solid #e5e7eb;"></div>
      <span style="padding: 0 10px;">OR SINGLE SIGN-ON</span>
      <div style="flex: 1; border-bottom: 1px solid #e5e7eb;"></div>
    </div>

    <div style="display: flex; flex-direction: column; gap: 8px;">
      <button onclick="socialLogin('Google')" style="background: #ffffff; border: 1px solid #d1d5db; border-radius: 8px; padding: 9px; font-size: 13px; font-weight: 500; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; color: #374151;">
        <span>🌐</span> Continue with Google (Gmail)
      </button>
      <button onclick="socialLogin('X')" style="background: #000000; color: #ffffff; border: none; border-radius: 8px; padding: 9px; font-size: 13px; font-weight: 500; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;">
        <span>𝕏</span> Continue with X.com
      </button>
      <button onclick="socialLogin('Facebook')" style="background: #1877f2; color: #ffffff; border: none; border-radius: 8px; padding: 9px; font-size: 13px; font-weight: 500; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;">
        <span>f</span> Continue with Facebook
      </button>
      <button onclick="socialLogin('Instagram')" style="background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888); color: #ffffff; border: none; border-radius: 8px; padding: 9px; font-size: 13px; font-weight: 500; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;">
        <span>📸</span> Continue with Instagram
      </button>
    </div>
  </div>
</div>

<script>
  function openAuthModal() {{
    document.getElementById('authModal').style.display = 'flex';
  }}
  function closeAuthModal() {{
    document.getElementById('authModal').style.display = 'none';
  }}
  function socialLogin(provider) {{
    const email = prompt('Enter mandatory email address for ' + provider + ' sign-in:');
    if (email) {{
      saveLead('Social User', email, '@' + provider.toLowerCase(), provider, provider + '_id_' + Math.floor(Math.random() * 1000000));
      alert('Successfully authenticated via ' + provider + '! You can now post comments.');
      closeAuthModal();
    }}
  }}
  function handleAuthSubmit(e) {{
    e.preventDefault();
    const name = document.getElementById('authName').value;
    const email = document.getElementById('authEmail').value;
    const xhandle = document.getElementById('authX').value;
    saveLead(name, email, xhandle, 'Email', xhandle || 'N/A');
    alert('Thank you! Your profile has been saved.');
    closeAuthModal();
  }}
  function saveLead(name, email, xhandle, provider, socialId) {{
    const user = {{
      userId: 'usr_' + Math.random().toString(36).substr(2, 9),
      name: name,
      email: email,
      provider: provider || 'Email',
      socialId: socialId || xhandle || 'N/A',
      createdAt: new Date().toISOString()
    }};
    let users = JSON.parse(localStorage.getItem('news_leads') || '[]');
    users.push(user);
    localStorage.setItem('news_leads', JSON.stringify(users));
    
    // Optional: send to backend endpoint if available
    fetch('/api/users/register', {{
      method: 'POST',
      headers: {{ 'Content-Type': 'application/json' }},
      body: JSON.stringify(user)
    }}).catch(err => console.log('Saved locally'));
  }}
</script>
"""

def generate_page(article, index):
    # Alternates between 1 and 2 auto comments per article
    num_auto_comments = 1 if (index % 2 == 0) else 2

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

{comments_section_html(num_auto_comments)}
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
