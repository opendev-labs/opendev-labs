import os
from PIL import Image

def regenerate_favicons():
    base_dir = "/home/jarvis/Work/opendev-labs.com/public"
    source_img_path = os.path.join(base_dir, "favicon.png") # 512x512 PNG
    
    if not os.path.exists(source_img_path):
        print(f"Source file {source_img_path} not found!")
        return

    img = Image.open(source_img_path)
    print(f"Loaded base image {source_img_path} ({img.size[0]}x{img.size[1]})")

    # 1. Save multi-size favicon.ico containing 48x48, 64x64, 128x128, 256x256
    ico_path = os.path.join(base_dir, "favicon.ico")
    img.save(ico_path, format='ICO', sizes=[(48, 48), (64, 64), (128, 128), (256, 256)])
    print(f"Generated multi-res favicon.ico at {ico_path}")

    # 2. Save 48x48 PNG (Google Search mandatory minimum)
    f48 = img.resize((48, 48), Image.Resampling.LANCZOS)
    f48.save(os.path.join(base_dir, "favicon-48x48.png"))
    print("Generated favicon-48x48.png")

    # 3. Save 192x192 PNG
    f192 = img.resize((192, 192), Image.Resampling.LANCZOS)
    f192.save(os.path.join(base_dir, "favicon-192x192.png"))
    print("Generated favicon-192x192.png")

    # 4. Save 180x180 Apple Touch Icon
    f180 = img.resize((180, 180), Image.Resampling.LANCZOS)
    f180.save(os.path.join(base_dir, "apple-touch-icon.png"))
    print("Generated apple-touch-icon.png")

if __name__ == "__main__":
    regenerate_favicons()
