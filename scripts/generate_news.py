import os
import json
import re
import random
import urllib.parse
from datetime import datetime

# ==========================================
# CONFIGURATION & CONSTANTS
# ==========================================
CONTENT_DIR = os.path.join(os.getcwd(), "content")
PROCESSED_NEWS_FILE = os.path.join(os.getcwd(), "processed-news.json")
IMAGE_MODEL = "flux"
IMAGE_WIDTH = 1200
IMAGE_HEIGHT = 630

def get_daily_article_limit() -> int:
    """
    Returns 2 articles/day for current month (September 2026), 
    and automatically scales to 3 articles/day next month (October 2026) onwards.
    """
    now = datetime.now()
    # September is month 9; if month > 9 or year > 2026, scale up
    if now.year > 2026 or now.month > 9:
        return 3
    return 2

# ==========================================
# 1. HELPER FUNCTIONS
# ==========================================
def clean_title(title: str) -> str:
    """Removes trailing index numbers (e.g., ' 0' or '-0') and cleans casing."""
    title = re.sub(r'[\s-]+\d+$', '', title)
    return title.strip()

def create_slug(title: str) -> str:
    """Converts article title into a clean URL-friendly slug."""
    clean = clean_title(title).lower()
    slug = re.sub(r'[^a-z0-9\s-]', '', clean)
    slug = re.sub(r'[\s_]+', '-', slug)
    return slug.strip('-')

def generate_3d_comic_image_url(article_title: str, context: str = "") -> str:
    """Generates Pollinations.ai image URL with 3D comic magazine style parameters."""
    clean = re.sub(r'[^a-zA-Z0-9\s]', '', clean_title(article_title))
    style_prompt = (
        f"3D comic book style illustration, vibrant comic magazine cover art, "
        f"detailed 3D render, vivid bold neon colors, dramatic lighting, pop art comic aesthetic, "
        f"expressive characters, highly detailed studio lighting based on: {clean}"
    )
    if context:
        style_prompt += f", {context}"

    encoded_prompt = urllib.parse.quote(style_prompt)
    seed = random.randint(1000, 99999)

    return (
        f"https://image.pollinations.ai/prompt/{encoded_prompt}"
        f"?width={IMAGE_WIDTH}&height={IMAGE_HEIGHT}"
        f"&model={IMAGE_MODEL}&seed={seed}&nologo=true&enhance=true"
    )

# ==========================================
# 2. MARKDOWN ARTICLE GENERATOR
# ==========================================
def generate_markdown_article(topic: str):
    raw_title = f"{topic}: Next-Gen Breakthrough Transmutes Enterprise AI Workloads"
    title = clean_title(raw_title)
    slug = create_slug(title)
    publish_date = datetime.now().strftime("%B %d, %Y")
    
    image_url = generate_3d_comic_image_url(
        article_title=title, 
        context="futuristic tech server, floating glowing holographic data, 3D graphic novel style"
    )

    description = f"Explore how recent developments in {topic} are revolutionizing real-time inference, cost efficiency, and enterprise model deployment."

    # Body Paragraphs
    p1 = (
        f"SAN FRANCISCO — In a landmark development for the artificial intelligence ecosystem, "
        f"recent announcements surrounding {topic} have signaled a monumental shift in enterprise adoption. "
        f"As demand for real-time inference and scalable serverless compute reaches unprecedented heights, "
        f"developers are rapidly moving away from legacy infrastructure in favor of AI-native platforms."
    )
    p2 = (
        f"Industry analysts note that traditional cloud setups struggle with dynamic scaling requirements "
        f"imposed by modern frontier models. Architectures centered around {topic} offer significant reductions "
        f"in latency while drastically cutting operational overhead for engineering teams worldwide."
    )
    p3 = (
        f"As competition intensifies among infrastructure providers, early benchmarks show performance "
        f"gains exceeding 40% in deployment speed. Decision-makers are prioritizing governance, security, "
        f"and seamless developer experience as key evaluation metrics moving into the next quarter."
    )

    # Frontmatter + Markdown Body
    md_content = f"""---
title: "{title}"
date: "{publish_date}"
description: "{description}"
category: "Frontier Models"
image: "{image_url}"
author: "Jamie O'Brien"
author_title: "Silicon Valley Bureau Chief"
author_avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80"
---

{p1}

{p2}

{p3}
"""
    return {"slug": slug, "title": title, "content": md_content}

# ==========================================
# 3. SAVE & REGISTRY SYNC
# ==========================================
def save_and_update_registry(articles):
    os.makedirs(CONTENT_DIR, exist_ok=True)
    
    # Read existing processed news registry
    processed_data = {"slugs": []}
    if os.path.exists(PROCESSED_NEWS_FILE):
        try:
            with open(PROCESSED_NEWS_FILE, "r", encoding="utf-8") as f:
                processed_data = json.load(f)
        except Exception:
            processed_data = {"slugs": []}

    new_slugs = []

    for item in articles:
        slug = item["slug"]
        # Save markdown file to /content/[slug].md
        md_file_path = os.path.join(CONTENT_DIR, f"{slug}.md")
        with open(md_file_path, "w", encoding="utf-8") as f:
            f.write(item["content"])
        
        print(f"✅ Saved Markdown: {md_file_path}")
        new_slugs.append(slug)

    # Prepend new slugs to the top of the processed list (ensures freshest articles show first)
    existing_slugs = [s for s in processed_data.get("slugs", []) if s not in new_slugs]
    updated_slugs = new_slugs + existing_slugs

    with open(PROCESSED_NEWS_FILE, "w", encoding="utf-8") as f:
        json.dump({"slugs": updated_slugs}, f, indent=2)

    print(f"🔄 Updated {PROCESSED_NEWS_FILE} with new article order.\n")

if __name__ == "__main__":
    daily_limit = get_daily_article_limit()
    print(f"🚀 Starting News Generator... (Daily Cap: {daily_limit} articles/day)\n")

    # Sample queue of potential topics
    topic_queue = [
        "Claude 3.7 Sonnet Developer Ecosystem",
        "MCP Server Protocols",
        "Railway Cloud Infrastructure",
        "OpenAI Search & Browser Integration"
    ]

    # Select only up to the daily allowed limit
    selected_topics = topic_queue[:daily_limit]
    generated_articles = []

    for topic in selected_topics:
        article = generate_markdown_article(topic)
        generated_articles.append(article)

    save_and_update_registry(generated_articles)
    print("✨ News generation complete!")
