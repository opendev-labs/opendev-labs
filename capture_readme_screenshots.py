import time
import os
from playwright.sync_api import sync_playwright

def main():
    img_dir = "/home/jarvis/Work/opendev-labs.com/docs/images"
    os.makedirs(img_dir, exist_ok=True)
    
    print("Capturing README screenshots...")
    
    with sync_playwright() as p:
        browser = p.chromium.launch(
            executable_path="/home/jarvis/.local/bin/google-chrome",
            headless=False,
            args=["--no-sandbox", "--disable-setuid-sandbox", "--window-size=1440,900"]
        )
        context = browser.new_context(viewport={"width": 1440, "height": 900})
        page = context.new_page()
        
        # 1. Homepage
        print("Capturing Homepage...")
        page.goto("https://www.opendev-labs.com/", wait_until="networkidle")
        time.sleep(2)
        page.screenshot(path=os.path.join(img_dir, "homepage.png"), full_page=False)
        
        # 2. Auth / Login Page
        print("Capturing Auth/Login Page...")
        page.goto("https://www.opendev-labs.com/auth", wait_until="networkidle")
        time.sleep(2)
        page.screenshot(path=os.path.join(img_dir, "auth_login.png"), full_page=False)
        
        # 3. Solutions / Pricing Page
        print("Capturing Solutions Page...")
        page.goto("https://www.opendev-labs.com/solutions", wait_until="networkidle")
        time.sleep(2)
        page.screenshot(path=os.path.join(img_dir, "solutions.png"), full_page=False)
        
        browser.close()
        print("All screenshots captured successfully in docs/images/")

if __name__ == "__main__":
    main()
