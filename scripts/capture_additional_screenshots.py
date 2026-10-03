import asyncio
import os
import sys

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

from playwright.async_api import async_playwright

BASE_URL = "https://supportsense-frontend.onrender.com"

async def capture_more():
    os.makedirs("screenshots", exist_ok=True)
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(viewport={"width": 1920, "height": 1080}, device_scale_factor=1.5)
        page = await context.new_page()

        # 1. Login Page
        try:
            print("1. Capturing Login Page...")
            await page.goto(f"{BASE_URL}/login", wait_until="domcontentloaded", timeout=40000)
            await page.wait_for_timeout(3000)
            await page.screenshot(path="screenshots/login_live.png")
            print("   [OK] Saved screenshots/login_live.png")
        except Exception as e:
            print("   [ERROR] Login error:", e)

        # 2. Knowledge Base Page
        try:
            print("2. Capturing Knowledge Base Page...")
            await page.goto(f"{BASE_URL}/knowledge-base", wait_until="domcontentloaded", timeout=40000)
            await page.wait_for_timeout(3500)
            await page.screenshot(path="screenshots/knowledge_base_live.png")
            print("   [OK] Saved screenshots/knowledge_base_live.png")
        except Exception as e:
            print("   [ERROR] Knowledge base error:", e)

        # 3. Analytics Page
        try:
            print("3. Capturing Analytics Page...")
            await page.goto(f"{BASE_URL}/analytics", wait_until="domcontentloaded", timeout=40000)
            await page.wait_for_timeout(3500)
            await page.screenshot(path="screenshots/analytics_live.png")
            print("   [OK] Saved screenshots/analytics_live.png")
        except Exception as e:
            print("   [ERROR] Analytics error:", e)

        # 4. Light theme toggle on dashboard
        try:
            print("4. Capturing Light Mode Dashboard...")
            await page.goto(f"{BASE_URL}/", wait_until="domcontentloaded", timeout=40000)
            await page.wait_for_timeout(3000)
            theme_btn = await page.query_selector("button:has(svg.lucide-sun), button:has(svg.lucide-moon)")
            if theme_btn:
                await theme_btn.click()
                await page.wait_for_timeout(1500)
                await page.screenshot(path="screenshots/dashboard_light_live.png")
                print("   [OK] Saved screenshots/dashboard_light_live.png")
            else:
                # Try finding theme toggle by role or class
                theme_btn2 = await page.query_selector("[title*='theme' i], [aria-label*='theme' i]")
                if theme_btn2:
                    await theme_btn2.click()
                    await page.wait_for_timeout(1500)
                    await page.screenshot(path="screenshots/dashboard_light_live.png")
                    print("   [OK] Saved screenshots/dashboard_light_live.png")
                else:
                    print("   [INFO] Theme toggle not found by selector.")
        except Exception as e:
            print("   [ERROR] Light theme error:", e)

        # 5. Tone Polisher and Reply Section on Ticket Detail
        try:
            print("5. Capturing Ticket Detail Tone Polisher...")
            await page.goto(f"{BASE_URL}/tickets/d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12", wait_until="domcontentloaded", timeout=40000)
            await page.wait_for_timeout(3500)
            # Find the reply text area and type sample draft
            reply_box = await page.query_selector("textarea")
            if reply_box:
                await reply_box.fill("Hi Alex, we have processed your refund for the duplicate transaction. The funds will reflect in 3-5 business days.")
                await page.wait_for_timeout(1000)
                # Click Empathetic or Concise button if visible
                btn = await page.query_selector("button:has-text('Empathetic'), button:has-text('Concise TL;DR')")
                if btn:
                    await btn.click()
                    await page.wait_for_timeout(1500)
            await page.screenshot(path="screenshots/tone_polisher_live.png")
            print("   [OK] Saved screenshots/tone_polisher_live.png")
        except Exception as e:
            print("   [ERROR] Tone polisher error:", e)

        # 6. Ticket Queue / Tickets Page with filters
        try:
            print("6. Capturing Tickets Queue Table...")
            await page.goto(f"{BASE_URL}/tickets", wait_until="domcontentloaded", timeout=40000)
            await page.wait_for_timeout(3500)
            await page.screenshot(path="screenshots/tickets_queue_live.png")
            print("   [OK] Saved screenshots/tickets_queue_live.png")
        except Exception as e:
            print("   [ERROR] Tickets queue error:", e)

        await browser.close()
        print("\nAll additional screenshots completed!")

if __name__ == "__main__":
    asyncio.run(capture_more())
