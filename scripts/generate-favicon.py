#!/usr/bin/env python3
"""
Generate favicon from SVG using PIL only
"""

import os
import sys
from pathlib import Path

try:
    from PIL import Image, ImageDraw
except ImportError:
    print("Installing pillow...")
    os.system("pip install pillow")
    from PIL import Image, ImageDraw

def create_favicon_ico():
    """Create favicon ICO from scratch using PIL"""
    public_dir = Path(__file__).parent.parent / "public"
    ico_path = public_dir / "favicon.ico"
    
    print("Creating favicon.ico...")
    
    # Create images for different sizes
    sizes = [16, 32, 64, 128, 256]
    images = []
    
    for size in sizes:
        # Create a new image with tea-forest background
        img = Image.new('RGBA', (size, size), color=(26, 58, 42, 255))  # #1a3a2a
        draw = ImageDraw.Draw(img)
        
        # Scale for this size
        scale = size / 256
        
        # Draw tea leaf
        center_x = size // 2
        center_y = size // 2
        
        # Tea leaf path (simplified for rasterization)
        # Main leaf shape
        leaf_size = int(size * 0.35)
        
        # Leaf points
        points = [
            (center_x, center_y - leaf_size),  # top
            (center_x + leaf_size * 0.6, center_y - leaf_size * 0.5),
            (center_x + leaf_size * 0.7, center_y),
            (center_x + leaf_size * 0.5, center_y + leaf_size * 0.4),
            (center_x, center_y + leaf_size * 0.5),
            (center_x - leaf_size * 0.5, center_y + leaf_size * 0.4),
            (center_x - leaf_size * 0.7, center_y),
            (center_x - leaf_size * 0.6, center_y - leaf_size * 0.5),
        ]
        
        # Draw filled leaf (tea-gold color)
        draw.polygon(points, fill=(212, 165, 116, 255))  # #D4A574
        
        # Draw leaf outline
        draw.polygon(points, outline=(26, 58, 42, 255), width=max(1, int(size // 128)))
        
        # Draw center vein
        draw.line(
            [(center_x, center_y - leaf_size), (center_x, center_y + leaf_size * 0.5)],
            fill=(26, 58, 42, 200),
            width=max(1, int(size // 64))
        )
        
        images.append(img)
    
    # Save as ICO
    images[0].save(
        ico_path,
        format='ICO',
        sizes=[(s, s) for s in sizes]
    )
    
    print(f"✅ Favicon created: {ico_path}")
    
    # Also save individual PNG files
    for size, img in zip(sizes, images):
        png_path = public_dir / f"favicon-{size}.png"
        img.save(png_path)
        print(f"✅ PNG created: favicon-{size}.png")
    
    return True

if __name__ == "__main__":
    create_favicon_ico()
