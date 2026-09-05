#!/usr/bin/env python3
"""
Convert GitHub Issues labeled 'manual-news' into news articles.
This is your "WordPress-like" interface — just open a GitHub Issue
with the manual-news label, and it becomes a published article.
"""
import json, os, re
from datetime import datetime

CONTENT = "content/news"
os.makedirs(CONTENT, exist_ok=True)

def main():
    title = os.environ.get("ISSUE_TITLE", "Manual News Article")
    body = os.environ.get("ISSUE_BODY", "")
    issue_num = os.environ.get("ISSUE_NUMBER", "0")

    if not body.strip():
        print("❌ Issue body is empty. Nothing to publish.")
        return

    # Parse issue body
    # Expected format:
    # ## Headline
    # Your headline here
    # ## Summary
    # Your summary here
    # ## Image URL (optional)
    # https://...
    # ## Tags
    # tag1, tag2, tag3

    headline = title
    summary = body
    image = ""
    tags = "AI news, tech news"

    # Try to extract sections
    sections = re.split(r'\n##\s+', body)
    for section in sections:
        if section.lower().startswith("headline"):
            headline = section.split('\n', 1)[1].strip() if '\n' in section else headline
        elif section.lower().startswith("summary") or section.lower().startswith("content"):
            summary = section.split('\n', 1)[1].strip() if '\n' in section else summary
        elif section.lower().startswith("image"):
            image = section.split('\n', 1)[1].strip() if '\n' in section else ""
        elif section.lower().startswith("tags"):
            tags = section.split('\n', 1)[1].strip() if '\n' in section else tags

    # Clean headline for slug
    slug = re.sub(r'[^a-z0-9]+', '-', headline.lower()).strip('-')[:50]
    slug = f"manual-{slug}-{issue_num}"

    today = datetime.now().strftime("%Y-%m-%d")

    # Generate image if not provided
    if not image:
        import urllib.parse
        prompt = f"Tech news illustration about: {headline}. Modern, clean, futuristic, no text."
        encoded = urllib.parse.quote(prompt)
        image = f"https://image.pollinations.ai/prompt/{encoded}?width=800&height=450&nologo=true"

    meta_desc = summary[:150].rsplit(" ", 1)[0] + "..." if len(summary) > 150 else summary
    if len(meta_desc) > 160: meta_desc = meta_desc[:157] + "..."

    md = f"""---
slug: {slug}
title: "{headline}"
meta_description: "{meta_desc}"
keywords: "{tags}, AI news, tech news"
type: news
source: Manual
source_url: ""
image: {image}
published_at: {today}
manual: true
issue_number: {issue_num}
---

# {headline}

![{headline}]({image})

{summary}

---

*Published on {today} via manual submission (Issue #{issue_num}).*
"""

    filepath = os.path.join(CONTENT, f"{slug}.md")
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(md)

    print(f"✅ Manual article published: {filepath}")
    print(f"   Headline: {headline[:60]}...")
    print(f"   Slug: {slug}")

if __name__ == "__main__":
    main()
