#!/usr/bin/env python3
import os
import re

TEMPLATES_ROOT = "public/templates"

def rebrand_html_file(file_path, template_name, rel_path):
    if not os.path.exists(file_path):
        print(f"[WARNING] File not found: {file_path}")
        return

    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    canonical_url = f"https://www.opendev-labs.com/templates/{rel_path}"
    brand_title = f"{template_name} — Curated by opendev-labs"

    # Replace <title> if exists, or insert in <head>
    if re.search(r'<title>.*?</title>', content, flags=re.IGNORECASE | re.DOTALL):
        content = re.sub(r'<title>.*?</title>', f'<title>{brand_title}</title>', content, flags=re.IGNORECASE | re.DOTALL)
    else:
        content = content.replace('<head>', f'<head>\n  <title>{brand_title}</title>')

    # Inject Canonical & OpenGraph metadata before </head>
    meta_tags = f"""  <!-- opendev-labs Ecosystem Metadata -->
  <link rel="canonical" href="{canonical_url}">
  <meta property="og:site_name" content="opendev-labs">
  <meta property="og:title" content="{brand_title}">
  <meta property="og:url" content="{canonical_url}">
  <meta name="twitter:card" content="summary_large_image">
"""
    if '</head>' in content and 'opendev-labs Ecosystem Metadata' not in content:
        content = content.replace('</head>', f'{meta_tags}</head>')

    # Update footer branding
    opendev_footer = 'Crafted with open-source excellence by <a href="https://www.opendev-labs.com/templates" class="text-blue-500 font-bold hover:underline">opendev-labs</a> — Free &amp; Production Ready.'
    
    content = re.sub(
        r'Copyright &copy;.*?all rights reserved.?',
        f'Copyright &copy; opendev-labs. {opendev_footer}',
        content,
        flags=re.IGNORECASE
    )

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"[REBRANDED] {file_path} -> {brand_title}")

def main():
    template_names = {
        "mua/index.html": ("Aurora Studio Makeup Artist MUA", "mua/index.html"),
        "food/grilli/index.html": ("Grilli Fine Dining", "food/grilli/index.html"),
        "food/restoran/index.html": ("Restoran Bistro & Dining", "food/restoran/index.html"),
        "ecommerce/glowy/index.html": ("Glowy Skincare & Cosmetics Store", "ecommerce/glowy/index.html"),
        "ecommerce/shop-homepage/dist/index.html": ("Shop Homepage E-Commerce", "ecommerce/shop-homepage/dist/index.html"),
        "agency/creative/dist/index.html": ("Creative Studio Agency", "agency/creative/dist/index.html"),
        "portfolio/bedimcode/index.html": ("Bedimcode Interactive Portfolio", "portfolio/bedimcode/index.html"),
        "portfolio/resume/dist/index.html": ("Resume & Freelancer Profile", "portfolio/resume/dist/index.html"),
    }

    for rel_file, (name, rel_url) in template_names.items():
        full_path = os.path.join(TEMPLATES_ROOT, rel_file)
        rebrand_html_file(full_path, name, rel_url)

if __name__ == "__main__":
    main()
