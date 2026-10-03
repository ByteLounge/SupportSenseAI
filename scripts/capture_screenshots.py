import asyncio
import os
import sys

# Ensure UTF-8 output on Windows
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

from playwright.async_api import async_playwright

BASE_URL = "https://supportsense-frontend.onrender.com"

async def capture_all_screenshots():
    print(f"Connecting to live production deployment at: {BASE_URL}")
    os.makedirs("screenshots", exist_ok=True)
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        # Use high-DPI 16:9 viewport (1920x1080) for presentation slides
        context = await browser.new_context(
            viewport={"width": 1920, "height": 1080},
            device_scale_factor=1.5
        )
        page = await context.new_page()

        # ----------------------------------------------------------------------
        # 1. Executive Operations / Admin Dashboard (DashboardPage.jsx)
        # ----------------------------------------------------------------------
        try:
            print("1. Capturing Dashboard (Executive Operations & SLA Metrics)...")
            await page.goto(f"{BASE_URL}/", wait_until="domcontentloaded", timeout=45000)
            await page.wait_for_timeout(4000)
            dash_path = "screenshots/dashboard_live.png"
            await page.screenshot(path=dash_path)
            print(f"   [OK] Saved {dash_path}")
        except Exception as e:
            print(f"   [ERROR] Dashboard capture error: {e}")

        # ----------------------------------------------------------------------
        # 2. Agent Workbench (TicketDetailPage.jsx)
        # ----------------------------------------------------------------------
        try:
            print("2. Capturing Agent Workbench (Dual-Pane View with AI Drawer)...")
            await page.goto(f"{BASE_URL}/tickets/d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12", wait_until="domcontentloaded", timeout=45000)
            await page.wait_for_timeout(4000)
            workbench_path = "screenshots/agent_workbench_live.png"
            await page.screenshot(path=workbench_path)
            print(f"   [OK] Saved {workbench_path}")
        except Exception as e:
            print(f"   [ERROR] Workbench capture error: {e}")

        # ----------------------------------------------------------------------
        # 3. Billing Ticket Detail Workbench (Sample 2)
        # ----------------------------------------------------------------------
        try:
            print("3. Capturing Billing Ticket Detail (Sample 2)...")
            await page.goto(f"{BASE_URL}/tickets/d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a10", wait_until="domcontentloaded", timeout=45000)
            await page.wait_for_timeout(4000)
            billing_path = "screenshots/billing_ticket_live.png"
            await page.screenshot(path=billing_path)
            print(f"   [OK] Saved {billing_path}")
        except Exception as e:
            print(f"   [ERROR] Billing ticket capture error: {e}")

        # ----------------------------------------------------------------------
        # 4. AI Concierge Chatbot Widget (Active Floating Modal)
        # ----------------------------------------------------------------------
        try:
            print("4. Capturing Conversational AI Concierge Widget...")
            await page.goto(f"{BASE_URL}/", wait_until="domcontentloaded", timeout=45000)
            await page.wait_for_timeout(3000)
            
            # Click the launcher button
            concierge_btn = await page.query_selector('button[aria-label="Open SupportSense AI Chatbot"], button:has-text("SupportSense AI")')
            if concierge_btn:
                print("   Found Concierge button, opening modal...")
                await concierge_btn.click()
                await page.wait_for_timeout(2500)
                
                # Type an inquiry
                chat_input = await page.query_selector('textarea, input[type="text"]')
                if chat_input:
                    await chat_input.fill("I was billed twice on Stripe for our enterprise subscription yesterday. Could you help check the invoice?")
                    await page.wait_for_timeout(800)
                
                concierge_path = "screenshots/ai_concierge_live.png"
                await page.screenshot(path=concierge_path)
                print(f"   [OK] Saved {concierge_path}")
            else:
                print("   [WARNING] Concierge launcher button not found.")
        except Exception as e:
            print(f"   [ERROR] Concierge capture error: {e}")

        # ----------------------------------------------------------------------
        # 5. AI Learning Insights Page (InsightsPage.jsx)
        # ----------------------------------------------------------------------
        try:
            print("5. Capturing AI Learning Insights Page...")
            await page.goto(f"{BASE_URL}/insights", wait_until="domcontentloaded", timeout=45000)
            await page.wait_for_timeout(4000)
            insights_path = "screenshots/insights_live.png"
            await page.screenshot(path=insights_path)
            print(f"   [OK] Saved {insights_path}")
        except Exception as e:
            print(f"   [ERROR] Insights capture error: {e}")

        # ----------------------------------------------------------------------
        # 6. Ticket Creation & Real-Time FAQ Deflection Panel (CreateTicketPage.jsx)
        # ----------------------------------------------------------------------
        try:
            print("6. Capturing Real-Time FAQ Deflection Panel...")
            await page.goto(f"{BASE_URL}/tickets/new", wait_until="domcontentloaded", timeout=45000)
            await page.wait_for_timeout(3000)
            
            title_input = await page.query_selector('input[type="text"]')
            if title_input:
                print("   Entering 'Cannot download EU VAT invoice' to trigger deflection panel...")
                await title_input.fill("Cannot download EU VAT invoice from billing portal")
                await page.wait_for_timeout(3000)
                
            deflection_path = "screenshots/faq_deflection_live.png"
            await page.screenshot(path=deflection_path)
            print(f"   [OK] Saved {deflection_path}")
        except Exception as e:
            print(f"   [ERROR] FAQ Deflection capture error: {e}")

        # ----------------------------------------------------------------------
        # 7. Departments & Auto-Reply Rules Page
        # ----------------------------------------------------------------------
        try:
            print("7. Capturing Departments & Auto-Reply Rules...")
            await page.goto(f"{BASE_URL}/departments", wait_until="domcontentloaded", timeout=45000)
            await page.wait_for_timeout(3000)
            depts_path = "screenshots/departments_live.png"
            await page.screenshot(path=depts_path)
            print(f"   [OK] Saved {depts_path}")
        except Exception as e:
            print(f"   [ERROR] Departments capture error: {e}")

        await browser.close()
        print("\nAll available live screenshots captured successfully!")

if __name__ == "__main__":
    asyncio.run(capture_all_screenshots())
