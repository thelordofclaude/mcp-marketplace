# ClaudeHub — Auto-Curated MCP Marketplace

A fully automated, zero-cost marketplace for MCP servers, Claude skills, and AI news.
Built with Next.js, GitHub Actions, and Vercel.

## 🚀 What This Does (Automatically)

| Content | Frequency | How |
|---------|-----------|-----|
| **MCP Servers** | 100 new / week | Mondays 9 AM UTC |
| **Claude Skills** | 100 new / week | Mondays 10 AM UTC |
| **AI News** | 1→2→3 articles / day | Daily 8 AM UTC (scales over time) |
| **Manual News** | Instant | GitHub Issue with `manual-news` label |

**Zero manual review needed.** Everything is auto-verified, auto-written, and auto-published.

---

## 📸 Live Site Preview

After deploy, your site looks like this:

- **Homepage**: Search bar, featured servers, hero carousel, trending sidebar, news grid, newsletter
- **MCP Directory** (`/mcp-servers/`): Card grid with category filters, stars, language badges
- **Skills Directory** (`/claude-skills/`): Same layout with skill-type filters
- **News** (`/news/`): Image cards with auto-generated header images
- **Individual Pages**: Full SEO content, breadcrumbs, schema markup, install guides

---

## ⚡ Setup (10 Minutes)

### Step 1: Create GitHub Repo
1. Go to [github.com](https://github.com) → New Repository
2. Name: `claudehub` (or anything you want)
3. Make it **PUBLIC** (GitHub Actions is free & unlimited for public repos)
4. Upload ALL files from this folder

### Step 2: Add API Keys (Optional but Recommended)
Go to **Settings → Secrets and variables → Actions → New repository secret**:

| Secret | Purpose | Without It |
|--------|---------|------------|
| `OPENAI_API_KEY` | Rewrites news with GPT-4 | Basic paraphrasing (still works) |
| `ANTHROPIC_API_KEY` | Alternative news rewriter | Same as above |

**Get keys:**
- OpenAI: [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
- Anthropic: [console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys)

### Step 3: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) → Sign up with GitHub
2. Click **Add New Project** → Import your `claudehub` repo
3. Framework Preset: **Next.js** (auto-detected)
4. Click **Deploy**

Your site is now live at `https://your-project.vercel.app`

### Step 4: Custom Domain (Optional)
1. Vercel Dashboard → Your project → **Settings → Domains**
2. Add your domain (e.g., `claudehub.ai`)
3. Follow DNS instructions

Your pages will be at:
- `yourdomain.com/` — Homepage
- `yourdomain.com/mcp-servers/` — MCP directory
- `yourdomain.com/mcp-server/github-mcp-server/` — Individual server page
- `yourdomain.com/claude-skills/` — Skills directory
- `yourdomain.com/news/` — AI news

### Step 5: Connect as MCP Server
Add to your **Claude Desktop** or **Cursor** config:

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`  
**Windows:** `%APPDATA%/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "claudehub": {
      "command": "python3",
      "args": ["/path/to/your/repo/mcp-server/server.py"]
    }
  }
}
```

Restart Claude Desktop. Now you can ask:
- "Search for GitHub MCP servers on ClaudeHub"
- "Get the latest AI news"
- "Show me details about the Context7 MCP server"

---

## ✍️ How to Submit News Manually

This is your "WordPress-like" interface — no code needed.

1. Go to your GitHub repo → **Issues → New Issue**
2. Choose template: **"Submit News Article"**
3. Fill in:
   - **Headline**: Your article title
   - **Content**: Full article or summary (200-500 words)
   - **Image URL**: Optional (leave blank to auto-generate)
   - **Tags**: Comma-separated keywords
4. Add label: `manual-news` (auto-applied by template)
5. Submit

**The bot publishes it within 1 minute** and closes the issue automatically.

---

## 📁 File Structure

```
claudehub/
├── .github/
│   ├── workflows/              # Auto-publish robots
│   │   ├── auto-publish-mcp.yml
│   │   ├── auto-publish-skills.yml
│   │   ├── auto-publish-news.yml
│   │   └── manual-news-from-issues.yml
│   └── ISSUE_TEMPLATE/
│       └── manual-news.yml     # Manual submission form
├── scripts/
│   ├── generate_mcp.py         # MCP fetcher + verifier + writer
│   ├── generate_skills.py      # Skills fetcher + verifier + writer
│   ├── generate_news.py        # News fetcher + rewriter + publisher
│   └── convert_issue_to_news.py # Manual issue → article converter
├── content/                    # Auto-generated pages (git-tracked)
│   ├── mcp-servers/
│   ├── claude-skills/
│   └── news/
├── app/                        # Next.js frontend
│   ├── page.js                 # Homepage
│   ├── layout.js               # Root layout + navbar + footer
│   ├── globals.css             # Light theme + pink accents
│   ├── mcp-servers/page.js     # MCP listing
│   ├── mcp-server/[slug]/      # MCP detail page
│   ├── claude-skills/page.js   # Skills listing
│   ├── claude-skill/[slug]/    # Skill detail page
│   ├── news/page.js            # News listing
│   ├── news-article/[slug]/    # News detail page
│   ├── submit/page.js          # Submit page
│   └── advertise/page.js       # Advertise page
├── components/                 # React components
│   ├── Navbar.js
│   ├── SearchBar.js
│   ├── FeaturedBar.js
│   ├── HeroCarousel.js
│   ├── NewsGrid.js
│   └── Footer.js
├── lib/
│   └── content.js              # Markdown loader
├── mcp-server/
│   └── server.py               # MCP protocol server
├── processed-*.json            # Trackers (auto-updated by bots)
├── package.json
├── next.config.js
└── README.md
```

---

## 🤖 Automation Schedule

| Bot | Trigger | What It Does |
|-----|---------|--------------|
| MCP Publisher | Every Monday 9 AM UTC | Fetches 100 new MCP servers from GitHub, verifies them (5-check system), writes SEO pages, commits to repo |
| Skills Publisher | Every Monday 10 AM UTC | Same for Claude skills, rules, and prompts |
| News Publisher | Daily 8 AM & 6 PM UTC | Fetches from 20+ RSS feeds, rewrites with AI, generates images, publishes articles. Scales from 1→2→3 per day over 3 months |
| Manual Converter | On every new Issue | Converts GitHub Issues labeled `manual-news` into published articles instantly |

**Vercel auto-redeploys** on every commit. New content goes live in ~30 seconds.

---

## 🛡️ Verification System (No Manual Review)

Every MCP server and skill passes **5 automated checks** before publishing:

| Check | What It Validates | Weight |
|-------|-------------------|--------|
| Name | Repo name contains `-mcp`, `mcp-`, or `mcp-server` | 1 point |
| Topics | GitHub topics include `mcp-server` or `model-context-protocol` | 1 point |
| Description | README/description mentions "MCP server" or "Model Context Protocol" | 1 point |
| Files | Repo contains `smithery.yaml`, `mcp.json`, or MCP dependencies | 1 point |
| Quality | Has at least 10 GitHub stars (filters out toys/experiments) | 1 point |
| **Bonus** | From verified orgs (GitHub, Anthropic, ModelContextProtocol) | +1 point |

**Pass requirement: 3+ points out of 5.**

**Auto-rejected:** Minecraft mods (`mcpelauncher`), tutorials, courses, beginner guides, awesome lists under 200 stars.

---

## 💰 Cost

| Service | Cost | Why |
|---------|------|-----|
| GitHub (public repo) | **$0** | Unlimited free Actions minutes |
| GitHub API | **$0** | 5,000 req/hour with built-in `GITHUB_TOKEN` |
| Vercel Hobby | **$0** | Free forever for personal/static sites |
| OpenAI API (optional) | **~$0.02/article** | Only if you add API key for news rewriting |
| Domain name | **~$12/year** | Optional — Vercel gives free subdomain |
| **Total** | **$0-12/year** | |

---

## 📈 Growth Trajectory

| Timeline | Pages | Traffic Signal |
|----------|-------|----------------|
| Day 1 | 100 MCP + 100 skills = 200 pages | Site goes live |
| Week 4 | 400 MCP + 400 skills + 28 news = 828 pages | Google starts indexing |
| Month 3 | 1,200 MCP + 1,200 skills + 180 news = 2,580 pages | Long-tail keywords rank |
| Month 6 | 2,400 MCP + 2,400 skills + 450 news = 5,250 pages | Major organic traffic |
| Month 12 | 5,200 MCP + 5,200 skills + 900 news = 11,300 pages | Domain authority established |

---

## 🔧 Customization

### Change the brand name
1. Edit `app/layout.js` → metadata title/description
2. Edit `components/Navbar.js` → logo text
3. Edit `components/Footer.js` → brand name

### Change colors
Edit `app/globals.css` → `:root` variables:
```css
--accent: #ec4899;        /* Pink → change to your brand color */
--accent-light: #fce7f3;  /* Light pink */
--accent-dark: #be185d;   /* Dark pink */
```

### Change publishing frequency
Edit `.github/workflows/*.yml` → `cron` schedule:
```yaml
# Every day at 9 AM (instead of weekly)
cron: '0 9 * * *'

# Every 6 hours
 cron: '0 */6 * * *'
```

### Add more news sources
Edit `scripts/generate_news.py` → `RSS_FEEDS` list. Add any RSS feed URL.

---

## 🐛 Troubleshooting

**"No items found" on first deploy**
→ Normal. The auto-publishers haven't run yet. Trigger them manually:
GitHub → Actions → Select workflow → **Run workflow**.

**"GitHub API rate limit"**
→ The built-in `GITHUB_TOKEN` gives 5,000 requests/hour. If you hit limits, the script pauses and retries. No action needed.

**"News articles look robotic"**
→ Add `OPENAI_API_KEY` or `ANTHROPIC_API_KEY` to repo secrets. The script will use GPT-4/Claude to humanize content.

**"Vercel build fails"**
→ Make sure `next.config.js` has `output: 'export'` and `distDir: 'dist'`.

---

## 📜 License

MIT — Use it, modify it, sell it. No attribution required.

Built with 🤖 robots for 🤖 AI developers.
