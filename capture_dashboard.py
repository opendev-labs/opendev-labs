import time
import os
from playwright.sync_api import sync_playwright

def main():
    img_dir = "/home/jarvis/Work/opendev-labs.com/docs/images"
    os.makedirs(img_dir, exist_ok=True)
    
    print("Capturing Pricing/Plans page screenshot...")
    
    with sync_playwright() as p:
        browser = p.chromium.launch(
            executable_path="/home/jarvis/.local/bin/google-chrome",
            headless=False,
            args=["--no-sandbox", "--disable-setuid-sandbox", "--window-size=1440,900"]
        )
        context = browser.new_context(viewport={"width": 1440, "height": 900})
        page = context.new_page()
        
        # Capture Pricing & Retainers page
        page.goto("https://www.opendev-labs.com/pricing", wait_until="networkidle")
        time.sleep(2)
        page.screenshot(path=os.path.join(img_dir, "pricing.png"), full_page=False)
        
        browser.close()
        print("Pricing screenshot captured in docs/images/pricing.png")

if __name__ == "__main__":
    main()
