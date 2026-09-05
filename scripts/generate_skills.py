#!/usr/bin/env python3
"""
Auto Claude Skills Publisher
Fetches GitHub repos with Claude skills, prompts, rules, and publishes them.
"""
import json, os, re, time
from urllib.request import Request, urlopen
from datetime import datetime

TARGET = 100
PROCESSED = "processed-skills.json"
CONTENT = "content/claude-skills"
os.makedirs(CONTENT, exist_ok=True)

TOKEN = os.environ.get("GITHUB_TOKEN", "")
HEADERS = {"Accept": "application/vnd.github.v3+json", "User-Agent": "ClaudeHub-Skills/1.0"}
if TOKEN: HEADERS["Authorization"] = f"token {TOKEN}"

def api(url):
    try:
        with urlopen(Request(url, headers=HEADERS), timeout=20) as r:
            return json.loads(r.read().decode())
    except Exception as e:
        print(f"   API error: {e}")
        return None

def load_processed():
    if os.path.exists(PROCESSED):
        with open(PROCESSED) as f: return json.load(f)
    return {"ids": [], "slugs": [], "last_run": None, "total": 0}

def save_processed(p):
    p["last_run"] = datetime.now().isoformat()
    with open(PROCESSED, "w") as f: json.dump(p, f, indent=2)

def verify_skill(repo):
    """Verify this is actually a Claude skill/rule/prompt repo."""
    score = 0
    name = repo["name"].lower()
    desc = (repo.get("description") or "").lower()
    topics = [t.lower() for t in repo.get("topics", [])]

    # Check 1: Name contains skill signals
    skill_signals = ["claude-skill", "claude-skill-", "-skill", "claude-prompt", "claude-rule", 
                     "claude.md", "claude-code", "cursor-rule", "cursorrules", "agent-rule"]
    if any(s in name for s in skill_signals):
        score += 1

    # Check 2: Topics
    topic_signals = ["claude-skill", "claude-prompt", "claude-rule", "cursor-rules", "ai-skill"]
    if any(t in topics for t in topic_signals):
        score += 1

    # Check 3: Description
    desc_signals = ["claude skill", "claude prompt", "claude rule", "claude.md", "cursor rule",
                    "claude code skill", "ai agent skill"]
    if any(s in desc for s in desc_signals):
        score += 1

    # Check 4: Has CLAUDE.md or similar file (check via API)
    if has_skill_files(repo["full_name"]):
        score += 1

    # Check 5: Quality
    if repo.get("stargazers_count", 0) >= 5:
        score += 1

    # Exclude non-skills
    red = ["awesome-", "tutorial", "course", "beginner", "example-only"]
    if any(r in name for r in red) and repo.get("stargazers_count", 0) < 200:
        return False

    return score >= 3

def has_skill_files(repo_full):
    """Check for CLAUDE.md, .cursorrules, or skill files."""
    url = f"https://api.github.com/repos/{repo_full}/contents/"
    try:
        with urlopen(Request(url, headers=HEADERS), timeout=15) as r:
            data = json.loads(r.read().decode())
            files = [f["name"].lower() for f in data if isinstance(f, dict)]
            skill_files = ["claude.md", ".cursorrules", "claude-code.md", "skills.md", 
                          "prompts.md", "rules.md", "agents.md"]
            return any(f in files for f in skill_files)
    except:
        return False

def detect_skill_type(repo):
    name = repo["name"].lower()
    desc = (repo.get("description") or "").lower()
    topics = [t.lower() for t in repo.get("topics", [])]

    if any(k in name or k in desc or k in topics for k in ["rule", "rules", ".cursorrules", "claude.md"]):
        return "rules"
    if any(k in name or k in desc or k in topics for k in ["prompt", "prompts", "template"]):
        return "prompts"
    if any(k in name or k in desc or k in topics for k in ["workflow", "automation", "pipeline"]):
        return "workflows"
    return "skills"

def generate_page(repo):
    name = repo["name"]
    full = repo["full_name"]
    desc = repo.get("description", "") or f"Claude skill for {name}"
    stars = repo.get("stargazers_count", 0)
    forks = repo.get("forks_count", 0)
    lang = repo.get("language", "Unknown") or "Unknown"
    updated = repo.get("updated_at", "")[:10]
    skill_type = detect_skill_type(repo)
    slug = re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')

    title = f"{name} — Claude {skill_type.title()} for AI Agents"
    if len(title) > 60: title = f"{name} — Claude Skill"

    meta_desc = f"{desc[:120].rsplit(' ', 1)[0]}... Use with Claude Code, Claude Desktop, and Cursor. {stars:,} GitHub stars."
    if len(meta_desc) > 160:
        meta_desc = f"{name} — A curated Claude {skill_type} for AI coding assistants. {stars:,} stars."

    schema = {
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": f"{name} Claude Skill", "description": desc,
        "applicationCategory": "DeveloperApplication",
        "offers": {"@type": "Offer", "price": "0", "priceCurrency": "USD"},
        "author": {"@type": "Organization", "name": repo["owner"]["login"]},
        "codeRepository": repo["html_url"]
    }

    body = f"""## Overview

{name} is a curated Claude {skill_type} with {stars:,} GitHub stars. Use it to enhance Claude Code, Claude Desktop, or Cursor with specialized capabilities.

## How to Use

1. Clone or download the repository:
```bash
git clone https://github.com/{full}.git
```

2. Copy the relevant files into your project:
   - `CLAUDE.md` → root of your project
   - `.cursorrules` → root of your project (for Cursor)
   - Skill files → your skills directory

3. Claude will automatically read these files and apply the rules/prompts/skills.

## Details

- **Type:** {skill_type.title()}
- **Language:** {lang}
- **Stars:** ⭐ {stars:,}
- **Forks:** 🍴 {forks:,}
- **Updated:** {updated}
- **Repository:** [{full}]({repo["html_url"]})
"""

    md = f"""---
slug: {slug}
title: "{title}"
meta_description: "{meta_desc}"
keywords: "{name}, Claude skill, Claude {skill_type}, AI agent, Claude Code, Cursor"
type: claude-skill
skill_type: {skill_type}
stars: {stars}
language: {lang}
repo: {full}
github_url: {repo["html_url"]}
updated_at: {updated}
schema_json: |
  {json.dumps(schema)}
---

# {name}

{body}
"""
    return slug, md, skill_type

def main():
    print("=" * 55)
    print("  AUTO CLAUDE SKILLS PUBLISHER")
    print("=" * 55)

    proc = load_processed()
    done = set(proc["ids"])
    print(f"📚 Already published: {len(done)}")

    queries = [
        "claude-skill in:name", "claude-prompt in:name", "claude-rule in:name",
        "topic:claude-skill", "topic:cursor-rules", "claude.md in:name",
        "cursorrules in:name", "claude-code skill in:description",
        "ai-agent-skill in:description", "claude skill prompt in:readme",
    ]

    seen = set()
    candidates = []
    for q in queries:
        if len(candidates) >= 300: break
        url = f"https://api.github.com/search/repositories?q={q.replace(' ', '+')}&sort=stars&order=desc&per_page=100"
        data = api(url)
        if data and "items" in data:
            for item in data["items"]:
                if item["id"] not in seen:
                    seen.add(item["id"])
                    candidates.append(item)
        time.sleep(1.5)

    candidates.sort(key=lambda x: x.get("stargazers_count", 0), reverse=True)

    new = []
    for repo in candidates:
        if repo["id"] in done: continue
        if not verify_skill(repo):
            print(f"   ❌ {repo['name']} failed verification")
            continue
        new.append(repo)
        if len(new) >= TARGET: break

    print(f"\n✅ Verified {len(new)} new Claude skills")

    if not new:
        print("   Nothing new to publish.")
        save_processed(proc)
        return

    types = {}
    for repo in new:
        slug, md, st = generate_page(repo)
        types.setdefault(st, []).append(repo)
        with open(os.path.join(CONTENT, f"{slug}.md"), "w", encoding="utf-8") as f:
            f.write(md)
        proc["ids"].append(repo["id"])
        proc["slugs"].append(slug)
        proc["total"] = len(proc["ids"])
        print(f"   ✅ {repo['name']} ({st}) — ⭐ {repo['stargazers_count']:,}")

    for st, repos in types.items():
        cat_path = os.path.join(CONTENT, f"_category-{st}.md")
        with open(cat_path, "w", encoding="utf-8") as f:
            f.write(f"---\nslug: skills-category-{st}\ntitle: \"Claude {st.title()}\"\ncategory: {st}\ntype: category\n---\n\n# Claude {st.title()}\n\n")
            for r in repos:
                d = (r.get("description") or "")[:60]
                if len(d) == 60: d += "..."
                f.write(f"- [{r['name']}](/claude-skill/{re.sub(r'[^a-z0-9]+', '-', r['name'].lower()).strip('-')}/) — ⭐ {r['stargazers_count']:,}\n")

    save_processed(proc)
    print(f"\n💾 Total published: {proc['total']}")
    print("✅ DONE")

if __name__ == "__main__":
    main()
