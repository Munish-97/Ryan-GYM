import os
import re
from PIL import Image, ImageDraw, ImageFont

# 1. Create Favicons

os.makedirs('assets/icons', exist_ok=True)

# Generate SVG
svg_content = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <!-- Background -->
  <circle cx="256" cy="256" r="240" fill="#0B0B0B" />
  <!-- Outer Ring -->
  <circle cx="256" cy="256" r="230" fill="none" stroke="#E0BE16" stroke-width="12" />
  <!-- Dumbbell Handle -->
  <rect x="180" y="236" width="152" height="40" rx="10" fill="#FFFFFF" />
  <!-- Left Weights -->
  <rect x="110" y="156" width="45" height="200" rx="12" fill="#FFFFFF" />
  <rect x="60" y="186" width="35" height="140" rx="10" fill="#FFFFFF" />
  <!-- Right Weights -->
  <rect x="357" y="156" width="45" height="200" rx="12" fill="#FFFFFF" />
  <rect x="417" y="186" width="35" height="140" rx="10" fill="#FFFFFF" />
  <!-- Small Yellow Accent -->
  <circle cx="256" cy="256" r="8" fill="#E0BE16" />
</svg>"""
with open('assets/icons/favicon.svg', 'w') as f:
    f.write(svg_content)

# Generate PNGs using Pillow
def draw_favicon(size, filename):
    img = Image.new('RGBA', (512, 512), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    # Background
    draw.ellipse([16, 16, 496, 496], fill="#0B0B0B")
    # Outer Ring
    draw.ellipse([26, 26, 486, 486], outline="#E0BE16", width=12)
    # Handle
    draw.rounded_rectangle([180, 236, 332, 276], radius=10, fill="#FFFFFF")
    # Left Weights
    draw.rounded_rectangle([110, 156, 155, 356], radius=12, fill="#FFFFFF")
    draw.rounded_rectangle([60, 186, 95, 326], radius=10, fill="#FFFFFF")
    # Right Weights
    draw.rounded_rectangle([357, 156, 402, 356], radius=12, fill="#FFFFFF")
    draw.rounded_rectangle([417, 186, 452, 326], radius=10, fill="#FFFFFF")
    # Center accent
    draw.ellipse([248, 248, 264, 264], fill="#E0BE16")
    
    # Resize with antialiasing
    res = img.resize((size, size), Image.Resampling.LANCZOS)
    res.save(f'assets/icons/{filename}')

draw_favicon(16, 'favicon-16x16.png')
draw_favicon(32, 'favicon-32x32.png')
draw_favicon(180, 'apple-touch-icon.png')
draw_favicon(512, 'favicon-512x512.png')
print("Favicons generated.")

# 2. Generate Social Share Image
try:
    bg_img = Image.open('assets/images/gym-image-60.jpg')
    # Crop to 1200x630
    target_ratio = 1200 / 630
    bg_ratio = bg_img.width / bg_img.height
    if bg_ratio > target_ratio:
        new_w = int(bg_img.height * target_ratio)
        offset = (bg_img.width - new_w) // 2
        bg_img = bg_img.crop((offset, 0, offset + new_w, bg_img.height))
    else:
        new_h = int(bg_img.width / target_ratio)
        offset = (bg_img.height - new_h) // 2
        bg_img = bg_img.crop((0, offset, bg_img.width, offset + new_h))
    
    bg_img = bg_img.resize((1200, 630), Image.Resampling.LANCZOS).convert('RGB')
    
    # Add Gradient Overlay (Left to Right)
    overlay = Image.new('RGBA', (1200, 630), (0,0,0,0))
    draw = ImageDraw.Draw(overlay)
    for x in range(1200):
        # Linear gradient dark on left, semi-transparent on right
        alpha = int(255 * (1 - (x / 1200) * 0.7))
        draw.line([(x, 0), (x, 630)], fill=(0, 0, 0, alpha))
    
    # Also add a slight bottom vignette
    for y in range(630):
        if y > 300:
            alpha = int(180 * ((y - 300) / 330))
            draw.line([(0, y), (1200, y)], fill=(0, 0, 0, alpha))
            
    bg_img.paste(overlay, (0,0), overlay)
    
    # Add Text
    draw = ImageDraw.Draw(bg_img)
    try:
        font_main = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Bold.ttf", 90)
        font_sub = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial.ttf", 36)
        font_tag = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Bold.ttf", 24)
    except:
        font_main = ImageFont.load_default()
        font_sub = ImageFont.load_default()
        font_tag = ImageFont.load_default()
        
    # Draw text
    draw.text((100, 200), "THE RYAN GYM", fill="#FFFFFF", font=font_main)
    draw.text((100, 310), "MUBARIKPUR · UNA · HIMACHAL PRADESH", fill="#E0BE16", font=font_sub)
    draw.text((100, 480), "BUILT BY DISCIPLINE.", fill="#FFFFFF", font=font_tag)
    
    # Add a thin yellow accent line
    draw.rectangle([100, 180, 220, 186], fill="#E0BE16")
    
    bg_img.save('assets/images/the-ryan-gym-social-share.jpg', quality=85)
    print("Social share image generated.")
except Exception as e:
    print(f"Failed to generate social share image: {e}")

# 3. Inject Metadata into HTML Files
base_url = "https://ryan-gym.vercel.app/"

pages = {
    "index.html": {
        "title": "THE RYAN GYM | Fitness & Strength Training in Mubarikpur",
        "desc": "Build strength, confidence and lasting fitness at THE RYAN GYM in Mubarikpur, District Una, Himachal Pradesh."
    },
    "about.html": {
        "title": "About THE RYAN GYM | Mubarikpur, Himachal Pradesh",
        "desc": "Discover the training environment, equipment and fitness philosophy of THE RYAN GYM in Mubarikpur."
    },
    "programs.html": {
        "title": "Training Programs | THE RYAN GYM",
        "desc": "Explore strength training, personal training, cardio, fat loss, muscle building and general fitness programs."
    },
    "gallery.html": {
        "title": "Gym Gallery | THE RYAN GYM",
        "desc": "View the real training environment, equipment and facilities at THE RYAN GYM in Mubarikpur."
    },
    "memberships.html": {
        "title": "Membership Plans | THE RYAN GYM",
        "desc": "Contact THE RYAN GYM for monthly, quarterly, half-yearly, annual and personal training membership details."
    },
    "contact.html": {
        "title": "Contact THE RYAN GYM | Mubarikpur",
        "desc": "Contact THE RYAN GYM for membership information, training enquiries, timings and directions."
    }
}

base_meta_template = """
  <!-- Basic Metadata -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <meta name="author" content="THE RYAN GYM">
  
  <!-- Favicons -->
  <link rel="icon" href="assets/icons/favicon.svg" type="image/svg+xml">
  <link rel="icon" href="assets/icons/favicon-32x32.png" sizes="32x32" type="image/png">
  <link rel="icon" href="assets/icons/favicon-16x16.png" sizes="16x16" type="image/png">
  <link rel="apple-touch-icon" href="assets/icons/apple-touch-icon.png">
  <meta name="theme-color" content="#0B0B0B">

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="THE RYAN GYM">
  <meta property="og:image" content="https://ryan-gym.vercel.app/assets/images/the-ryan-gym-social-share.jpg">
  <meta property="og:image:secure_url" content="https://ryan-gym.vercel.app/assets/images/the-ryan-gym-social-share.jpg">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="THE RYAN GYM in Mubarikpur, Himachal Pradesh">

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:image" content="https://ryan-gym.vercel.app/assets/images/the-ryan-gym-social-share.jpg">
  <meta name="twitter:image:alt" content="THE RYAN GYM in Mubarikpur, Himachal Pradesh">
"""

for filename, data in pages.items():
    if not os.path.exists(filename):
        print(f"Warning: {filename} not found.")
        continue
        
    with open(filename, 'r') as f:
        html = f.read()
        
    # Clean up existing viewport, title, description, and related meta tags to avoid duplication
    html = re.sub(r'<meta name="viewport"[^>]*>\s*', '', html)
    html = re.sub(r'<title>.*?</title>\s*', '', html, flags=re.IGNORECASE|re.DOTALL)
    html = re.sub(r'<meta name="description"[^>]*>\s*', '', html, flags=re.IGNORECASE)
    html = re.sub(r'<meta name="author"[^>]*>\s*', '', html, flags=re.IGNORECASE)
    html = re.sub(r'<meta name="robots"[^>]*>\s*', '', html, flags=re.IGNORECASE)
    html = re.sub(r'<meta name="theme-color"[^>]*>\s*', '', html, flags=re.IGNORECASE)
    html = re.sub(r'<link rel="icon"[^>]*>\s*', '', html, flags=re.IGNORECASE)
    html = re.sub(r'<link rel="apple-touch-icon"[^>]*>\s*', '', html, flags=re.IGNORECASE)
    html = re.sub(r'<link rel="canonical"[^>]*>\s*', '', html, flags=re.IGNORECASE)
    html = re.sub(r'<meta property="og:[^>]*>\s*', '', html, flags=re.IGNORECASE)
    html = re.sub(r'<meta name="twitter:[^>]*>\s*', '', html, flags=re.IGNORECASE)
    
    # Construct the specific meta block
    page_url = base_url if filename == "index.html" else base_url + filename
    
    specific_meta = f"""
  <title>{data['title']}</title>
  <meta name="description" content="{data['desc']}">
  <link rel="canonical" href="{page_url}">
  
  <meta property="og:title" content="{data['title']}">
  <meta property="og:description" content="{data['desc']}">
  <meta property="og:url" content="{page_url}">
  
  <meta name="twitter:title" content="{data['title']}">
  <meta name="twitter:description" content="{data['desc']}">
"""
    
    full_meta = specific_meta + base_meta_template
    
    # Inject into <head>
    html = re.sub(r'(<head>)', r'\1' + full_meta, html, flags=re.IGNORECASE)
    
    with open(filename, 'w') as f:
        f.write(html)
        
print("HTML metadata injection completed.")
