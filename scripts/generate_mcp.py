#!/usr/bin/env python3
"""
Auto MCP Publisher — Fetches, verifies, and publishes MCP servers.
Runs weekly via GitHub Actions. No manual review needed.
"""
import json, os, re, time
from urllib.request import Request, urlopen
from urllib.error import HTTPError
from datetime import datetime

TARGET = 100
PROCESSED = "processed-mcp.json"
CONTENT = "content/mcp-servers"
os.makedirs(CONTENT, exist_ok=True)

TOKEN = os.environ.get("GITHUB_TOKEN", "")
HEADERS = {"Accept": "application/vnd.github.v3+json", "User-Agent": "ClaudeHub-MCP/1.0"}
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

def verify(repo):
    """5-check verification. Score >= 3 passes."""
    score = 0
    name = repo["name"].lower()
    desc = (repo.get("description") or "").lower()
    topics = [t.lower() for t in repo.get("topics", [])]

    # Check 1: Name signals
    if any(s in name for s in ["-mcp", "mcp-", "mcp-server", "mcp_server", "_mcp"]):
        score += 1
    # Check 2: Topic signals
    if any(t in topics for t in ["mcp-server", "model-context-protocol", "mcp"]):
        score += 1
    # Check 3: Description signals
    if any(s in desc for s in ["mcp server", "model context protocol", "model-context-protocol"]):
        score += 1
    # Check 4: Quality gate
    if repo.get("stargazers_count", 0) >= 10:
        score += 1
    # Check 5: Verified org
    if repo["owner"]["login"].lower() in ["github", "anthropics", "modelcontextprotocol"]:
        score += 1

    # False positive checks
    red = ["awesome-", "tutorial", "course", "curriculum", "beginners", "mcpelauncher", "mcpatcher"]
    if any(r in name for r in red):
        if "awesome-mcp" in name and repo.get("stargazers_count", 0) > 1000:
            pass  # Keep big awesome lists
        else:
            return False

    return score >= 3

def detect_category(repo):
    topics = [t.lower() for t in repo.get("topics", [])]
    desc = (repo.get("description") or "").lower()
    name = repo["name"].lower()
    checks = [
        ("database", ["database", "postgres", "mysql", "sqlite", "mongodb", "redis", "sql", "prisma", "db"]),
        ("browser", ["browser", "puppeteer", "playwright", "selenium", "scraping", "devtools", "headless"]),
        ("filesystem", ["filesystem", "file", "storage", "vault", "local"]),
        ("communication", ["slack", "discord", "telegram", "email", "messaging", "teams"]),
        ("search", ["search", "serp", "retrieval", "index"]),
        ("devops", ["aws", "gcp", "azure", "kubernetes", "docker", "terraform", "cloudflare"]),
        ("api", ["api", "rest", "graphql", "webhook", "stripe", "notion", "linear", "jira"]),
    ]
    for cat, keys in checks:
        if any(k in topics or k in name or k in desc for k in keys):
            return cat
    return "general"

def generate_page(repo):
    name = repo["name"]
    full = repo["full_name"]
    desc = repo.get("description", "") or f"MCP server for {name}"
    stars = repo.get("stargazers_count", 0)
    forks = repo.get("forks_count", 0)
    lang = repo.get("language", "Unknown") or "Unknown"
    updated = repo.get("updated_at", "")[:10]
    license = repo.get("license", {}).get("spdx_id", "Unknown") if repo.get("license") else "Unknown"
    cat = detect_category(repo)
    slug = re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')

    title = f"{name} MCP Server — Claude & Cursor Integration"
    if len(title) > 60: title = f"{name} MCP Server — Claude Integration"

    meta_base = desc.strip()
    if not meta_base or len(meta_base) < 10:
        meta_base = f"A production-ready Model Context Protocol server for {name}."
    meta_base = re.sub(r'\s+', ' ', meta_base).strip()
    if meta_base.endswith("."): meta_base = meta_base[:-1]
    meta_desc = meta_base + f" Install in Claude, Cursor & Claude Code. {stars:,} GitHub stars."
    if len(meta_desc) > 160:
        meta_desc = meta_base[:100].rsplit(" ", 1)[0] + "..." + f" Install in Claude & Cursor. {stars:,} stars."

    schema = {
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": f"{name} MCP Server", "description": desc,
        "applicationCategory": "DeveloperApplication", "operatingSystem": "Cross-platform",
        "programmingLanguage": lang,
        "aggregateRating": {"@type": "AggregateRating", "ratingValue": "5", "ratingCount": str(stars)},
        "offers": {"@type": "Offer", "price": "0", "priceCurrency": "USD"},
        "author": {"@type": "Organization", "name": repo["owner"]["login"]},
        "codeRepository": repo["html_url"]
    }

    body = f"""## What is {name}?

{name} is a production-ready Model Context Protocol (MCP) server with {stars:,} GitHub stars. It allows AI agents like Claude to perform real-world tasks through standardized tool calls.

## Installation

```bash
# Via Smithery (recommended)
npx -y @smithery/cli install {full}

# Or manual
git clone https://github.com/{full}.git
cd {name}
```

## Compatibility

Compatible with: Claude Desktop, Claude Code, Cursor, Windsurf, Cline, and any MCP-compliant client.

## Details

- **Language:** {lang}
- **Stars:** ⭐ {stars:,}
- **Forks:** 🍴 {forks:,}
- **License:** {license}
- **Updated:** {updated}
- **Repo:** [{full}]({repo["html_url"]})
"""

    md = f"""---
slug: {slug}
title: "{title}"
meta_description: "{meta_desc}"
keywords: "{name}, MCP server, Model Context Protocol, Claude integration, {cat} MCP"
category: {cat}
type: mcp-server
stars: {stars}
language: {lang}
repo: {full}
github_url: {repo["html_url"]}
updated_at: {updated}
schema_json: |
  {json.dumps(schema)}
---

# {name} MCP Server

{body}
"""
    return slug, md, cat

def main():
    print("=" * 55)
    print("  AUTO MCP PUBLISHER")
    print("=" * 55)

    proc = load_processed()
    done = set(proc["ids"])
    print(f"📚 Already published: {len(done)}")

    queries = [
        "mcp-server in:name", "topic:mcp-server", "topic:model-context-protocol",
        "anthropic mcp server in:description", "claude mcp integration in:readme",
        "mcp server typescript claude", "mcp server python claude",
        "smithery mcp in:description", "mcp-server stars:>10",
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
        if not verify(repo):
            print(f"   ❌ {repo['name']} failed verification")
            continue
        new.append(repo)
        if len(new) >= TARGET: break

    print(f"\n✅ Verified {len(new)} new MCP servers")

    if not new:
        print("   Nothing new to publish.")
        save_processed(proc)
        return

    categories = {}
    for repo in new:
        slug, md, cat = generate_page(repo)
        categories.setdefault(cat, []).append(repo)
        with open(os.path.join(CONTENT, f"{slug}.md"), "w", encoding="utf-8") as f:
            f.write(md)
        proc["ids"].append(repo["id"])
        proc["slugs"].append(slug)
        proc["total"] = len(proc["ids"])
        print(f"   ✅ {repo['name']} ({cat}) — ⭐ {repo['stargazers_count']:,}")

    # Category indexes
    for cat, repos in categories.items():
        cat_path = os.path.join(CONTENT, f"_category-{cat}.md")
        with open(cat_path, "w", encoding="utf-8") as f:
            f.write(f"---\nslug: mcp-category-{cat}\ntitle: \"Best {cat.title()} MCP Servers\"\ncategory: {cat}\ntype: category\n---\n\n# {cat.title()} MCP Servers\n\n")
            for r in repos:
                d = (r.get("description") or "")[:60]
                if len(d) == 60: d += "..."
                f.write(f"- [{r['name']}](/mcp-server/{re.sub(r'[^a-z0-9]+', '-', r['name'].lower()).strip('-')}/) — ⭐ {r['stargazers_count']:,} — {d}\n")

    save_processed(proc)
    print(f"\n💾 Total published: {proc['total']}")
    print("✅ DONE")

if __name__ == "__main__":
    main()
