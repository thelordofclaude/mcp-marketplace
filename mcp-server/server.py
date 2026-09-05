#!/usr/bin/env python3
"""
ClaudeHub MCP Server
====================
Serves your website content directly to Claude Desktop, Cursor, and Windsurf
via the Model Context Protocol. This means users can search your marketplace
WITHOUT leaving their IDE.

Add to Claude Desktop config:
{
  "mcpServers": {
    "claudehub": {
      "command": "python3",
      "args": ["/path/to/repo/mcp-server/server.py"]
    }
  }
}

Or run directly:
    python3 mcp-server/server.py
"""

import json
import os
import sys
from pathlib import Path

# Find content directory (works whether run from repo root or mcp-server/)
REPO_ROOT = Path(__file__).parent.parent
CONTENT_DIR = REPO_ROOT / "content"

def read_stdin():
    """Read a JSON-RPC message from stdin."""
    line = sys.stdin.readline()
    if not line:
        return None
    return json.loads(line)

def write_stdout(data):
    """Write a JSON-RPC message to stdout."""
    print(json.dumps(data), flush=True)

def get_mcp_servers(query=""):
    """List all MCP servers from content directory."""
    mcp_dir = CONTENT_DIR / "mcp-servers"
    if not mcp_dir.exists():
        return []
    servers = []
    for f in sorted(mcp_dir.glob("*.md"), key=lambda x: x.stat().st_mtime, reverse=True):
        if f.name.startswith("_"):
            continue
        name = f.stem.replace("-", " ").title()
        if query and query.lower() not in name.lower():
            continue
        servers.append({
            "name": name,
            "slug": f.stem,
            "url": f"https://claudehub.ai/mcp-server/{f.stem}/"
        })
    return servers

def get_skills(query=""):
    """List all Claude skills."""
    skills_dir = CONTENT_DIR / "claude-skills"
    if not skills_dir.exists():
        return []
    skills = []
    for f in sorted(skills_dir.glob("*.md"), key=lambda x: x.stat().st_mtime, reverse=True):
        if f.name.startswith("_"):
            continue
        name = f.stem.replace("-", " ").title()
        if query and query.lower() not in name.lower():
            continue
        skills.append({
            "name": name,
            "slug": f.stem,
            "url": f"https://claudehub.ai/claude-skill/{f.stem}/"
        })
    return skills

def get_news(limit=5):
    """List latest news articles."""
    news_dir = CONTENT_DIR / "news"
    if not news_dir.exists():
        return []
    articles = []
    for f in sorted(news_dir.glob("*.md"), key=lambda x: x.stat().st_mtime, reverse=True)[:limit]:
        content = f.read_text()
        # Extract title from frontmatter
        title = f.stem.replace("-", " ").title()
        if "title:" in content:
            try:
                title_line = [l for l in content.split("\n") if "title:" in l][0]
                title = title_line.split('"')[1]
            except:
                pass
        articles.append({
            "title": title,
            "slug": f.stem,
            "url": f"https://claudehub.ai/news-article/{f.stem}/"
        })
    return articles

def get_server_details(slug, content_type="mcp-servers"):
    """Get detailed content of a specific server/skill/article."""
    file_path = CONTENT_DIR / content_type / f"{slug}.md"
    if file_path.exists():
        content = file_path.read_text()
        # Strip frontmatter for cleaner output
        if content.startswith("---"):
            parts = content.split("---", 2)
            if len(parts) >= 3:
                body = parts[2].strip()
                return body[:4000]  # Limit output size
        return content[:4000]
    return f"Content not found: {slug}"

def handle_request(request):
    """Handle MCP tool requests."""
    method = request.get("method", "")
    params = request.get("params", {})

    if method == "initialize":
        return {
            "protocolVersion": "2024-11-05",
            "capabilities": {"tools": {}},
            "serverInfo": {"name": "claudehub", "version": "1.0.0"}
        }

    if method == "tools/list":
        return {
            "tools": [
                {
                    "name": "search_mcp_servers",
                    "description": "Search verified MCP servers on ClaudeHub marketplace. Returns name, slug, and URL for each server.",
                    "inputSchema": {
                        "type": "object",
                        "properties": {
                            "query": {"type": "string", "description": "Search term (optional). Leave empty to list all."}
                        }
                    }
                },
                {
                    "name": "search_claude_skills",
                    "description": "Search curated Claude skills, rules, and prompts on ClaudeHub.",
                    "inputSchema": {
                        "type": "object",
                        "properties": {
                            "query": {"type": "string", "description": "Search term (optional). Leave empty to list all."}
                        }
                    }
                },
                {
                    "name": "get_latest_news",
                    "description": "Get the latest AI news articles from ClaudeHub. Auto-curated daily.",
                    "inputSchema": {
                        "type": "object",
                        "properties": {
                            "limit": {"type": "number", "description": "Number of articles to return (default: 5)"}
                        }
                    }
                },
                {
                    "name": "get_mcp_server_details",
                    "description": "Get full details (description, installation, features) of a specific MCP server by its slug.",
                    "inputSchema": {
                        "type": "object",
                        "properties": {
                            "slug": {"type": "string", "description": "The server slug, e.g. 'github-mcp-server'"}
                        },
                        "required": ["slug"]
                    }
                },
                {
                    "name": "get_claude_skill_details",
                    "description": "Get full details of a specific Claude skill by its slug.",
                    "inputSchema": {
                        "type": "object",
                        "properties": {
                            "slug": {"type": "string", "description": "The skill slug, e.g. 'fullstack-dev-kit'"}
                        },
                        "required": ["slug"]
                    }
                }
            ]
        }

    if method == "tools/call":
        tool = params.get("name", "")
        args = params.get("arguments", {}) or {}

        if tool == "search_mcp_servers":
            query = args.get("query", "")
            servers = get_mcp_servers(query)
            if not servers:
                text = "No MCP servers found." if query else "No MCP servers published yet. The auto-publisher runs every Monday."
            else:
                lines = [f"Found {len(servers)} MCP server(s):"]
                for s in servers[:20]:
                    lines.append(f"- {s['name']}: {s['url']}")
                text = "\n".join(lines)
            return {"content": [{"type": "text", "text": text}]}

        if tool == "search_claude_skills":
            query = args.get("query", "")
            skills = get_skills(query)
            if not skills:
                text = "No skills found." if query else "No skills published yet. The auto-publisher runs every Monday."
            else:
                lines = [f"Found {len(skills)} Claude skill(s):"]
                for s in skills[:20]:
                    lines.append(f"- {s['name']}: {s['url']}")
                text = "\n".join(lines)
            return {"content": [{"type": "text", "text": text}]}

        if tool == "get_latest_news":
            limit = args.get("limit", 5)
            articles = get_news(limit)
            if not articles:
                text = "No news articles yet. The auto-publisher runs daily at 8 AM UTC."
            else:
                lines = [f"Latest {len(articles)} AI news article(s):"]
                for a in articles:
                    lines.append(f"- {a['title']}: {a['url']}")
                text = "\n".join(lines)
            return {"content": [{"type": "text", "text": text}]}

        if tool == "get_mcp_server_details":
            slug = args.get("slug", "")
            text = get_server_details(slug, "mcp-servers")
            return {"content": [{"type": "text", "text": text}]}

        if tool == "get_claude_skill_details":
            slug = args.get("slug", "")
            text = get_server_details(slug, "claude-skills")
            return {"content": [{"type": "text", "text": text}]}

        return {"content": [{"type": "text", "text": f"Unknown tool: {tool}"}]}

    return {}

def main():
    while True:
        req = read_stdin()
        if req is None:
            break

        result = handle_request(req)
        response = {
            "jsonrpc": "2.0",
            "id": req.get("id"),
            "result": result
        }
        write_stdout(response)

if __name__ == "__main__":
    main()
