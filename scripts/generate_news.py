import os
import json
import re
import random
import urllib.parse
from datetime import datetime

# Optional: Load environment variables if using OpenAI/Claude for text generation
try:
    import requests
except ImportError:
    raise ImportError("Please install 'requests' using: pip install requests")

# ==========================================
# CONFIGURATION & CONSTANTS
# ==========================================
OUTPUT_DIR = os.path.join(os.getcwd(), "content", "news")
IMAGE_MODEL = "flux"  # Models available: flux, turbo, etc.
IMAGE_WIDTH = 1200
IMAGE_HEIGHT = 630

# ==========================================
# 1. 3D COMIC MAGAZINE IMAGE URL GENERATOR
# ==========================================
def generate_3d_comic_image_url(article_title: str, context: str = "") -> str:
    """
    Generates a Pollinations.ai image URL with explicit 3D comic magazine styling instructions.
    Prevents robotic/flat imagery by injecting artistic attributes and utilizing flux/enhance parameters.
    """
    # Clean up title for the prompt
    clean_title = re.sub(r'[^a-zA-Z0-9\s]', '', article_title)
    
    # Enforce 3D Comic Magazine style aesthetics
    style_prompt = (
        f"3D comic book style illustration, vibrant comic magazine cover art, "
        f"detailed 3D render, vivid bold neon colors, dramatic lighting, pop art comic aesthetic, "
        f"expressive characters, highly detailed studio lighting, action comic frame based on: {clean_title}"
    )
    
    if context:
        style_prompt += f", {context}"

    # URL encode prompt
    encoded_prompt = urllib.parse.quote(style_prompt)
    seed = random.randint(1000, 99999)

    # Pollinations API with flux model, custom dimensions, seed, and enhancement flags
    image_url = (
        f"https://image.pollinations.ai/prompt/{encoded_prompt}"
        f"?width={IMAGE_WIDTH}"
        f"&height={IMAGE_HEIGHT}"
        f"&model={IMAGE_MODEL}"
        f"&seed={seed}"
        f"&nologo=true"
        f"&enhance=true"
    )
    
    return image_url

# ==========================================
# 2. SLUG & METADATA HELPERS
# ==========================================
def create_slug(title: str) -> str:
    """Converts article title into a clean URL-friendly slug."""
    slug = title.lower()
    slug = re.sub(r'[^a-z0-9\s-]', '', slug)
    slug = re.sub(r'[\s_]+', '-', slug)
    return slug.strip('-')

# ==========================================
# 3. ARTICLE GENERATOR FUNCTION
# ==========================================
def generate_article_data(topic: str):
    """
    Constructs a complete news article object with title, slug, content, 
    comments, author info, and a 3D comic styled image URL.
    """
    title = f"{topic}: Next-Gen Breakthrough Transmutes Enterprise AI Workloads"
    slug = create_slug(title)
    publish_date = datetime.now().strftime("%B %d, %Y")

    # Generate the high-quality 3D comic image URL
    image_url = generate_3d_comic_image_url(
        article_title=title, 
        context="futuristic tech server, floating glowing holographic data, 3D graphic novel style"
    )

    # Article Body Paragraphs
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

    full_content = f"{p1}\n\n{p2}\n\n{p3}"

    # Sample Community Comments
    comments = [
        {
            "author": "Alex Rivera",
            "handle": "@alexrivera_ai",
            "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
            "text": "Great analysis. The integration complexity seems lower than expected, which could accelerate enterprise adoption.",
            "claps": 42
        },
        {
            "author": "Michael Chang",
            "handle": "@mchang_gpu",
            "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
            "text": "The cost-to-performance ratio here looks extremely promising for early-stage startups.",
            "claps": 116
        }
    ]

    # Author Metadata
    author = {
        "name": "Jamie O'Brien",
        "role": "Silicon Valley Bureau Chief",
        "email": "jamie@lordofclaude.com",
        "image": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80",
        "bio": "Jamie has been reporting on enterprise software and AI infrastructure since 2012."
    }

    # Assembled Article JSON Structure
    article_data = {
        "title": title,
        "slug": slug,
        "published_at": publish_date,
        "category": "Frontier Models",
        "image": image_url,
        "content": full_content,
        "author": author,
        "comments": comments
    }

    return article_data

# ==========================================
# 4. SAVE & RUN SCRIPT
# ==========================================
def save_article(article_data: dict):
    """Saves the generated article to the local file system as JSON."""
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    file_path = os.path.join(OUTPUT_DIR, f"{article_data['slug']}.json")

    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(article_data, f, indent=2, ensure_ascii=False)

    print(f" Successfully generated article: {article_data['title']}")
    print(f" File saved at: {file_path}")
    print(f" 3D Comic Image URL: {article_data['image']}\n")

if __name__ == "__main__":
    # Sample execution topic
    topics = [
        "Railway Cloud Infrastructure",
        "Claude 3.7 Sonnet Developer Ecosystem",
        "MCP Server Protocols"
    ]
    
    print("🚀 Starting News Generator with 3D Comic Magazine Image Engine...\n")
    for topic in topics:
        article = generate_article_data(topic)
        save_article(article)
    print("✨ Generation complete!")
