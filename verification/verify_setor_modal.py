import time
from playwright.sync_api import sync_playwright, expect

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Increase timeout significantly as per memory
        context = browser.new_context()
        page = context.new_page()
        page.set_default_timeout(120000)

        print("Navigating to app...")
        try:
            page.goto("http://localhost:8081", wait_until='domcontentloaded')
        except Exception as e:
            print(f"Error navigating: {e}")
            return

        print("Waiting for logo...")
        logo = page.get_by_role("img", name="icon")
        if not logo.count():
             logo = page.locator("img").first

        print("Tapping logo 7 times...")
        for _ in range(8):
            logo.click()
            time.sleep(0.1)

        print("Looking for Dev Button...")
        dev_btn = page.get_by_text("[DEV] Acesso Bypass Liberado")
        expect(dev_btn).to_be_visible()
        dev_btn.click()

        print("Waiting for Home/SetorModal...")
        modal_title = page.get_by_text("Gerenciar Setores")
        expect(modal_title).to_be_visible(timeout=60000)

        print("SetorModal is visible.")

        # Test Accessibility Props
        search_input = page.get_by_label("Campo de busca")
        expect(search_input).to_be_visible()
        print("Search input found with correct label.")

        # Test Clear Button
        print("Typing in search...")
        search_input.fill("Teste")

        clear_btn = page.get_by_label("Limpar busca")
        expect(clear_btn).to_be_visible()
        print("Clear button appeared.")

        # Screenshot with text
        page.screenshot(path="/home/jules/verification/verification_with_text.png")

        clear_btn.click()
        expect(search_input).to_have_value("")
        print("Search text cleared.")

        # Verify tabs accessibility
        tabs = page.get_by_role("tab", name="Setores")
        expect(tabs).to_be_visible()

        # Debug: Print HTML
        print(f"Tab HTML: {tabs.evaluate('el => el.outerHTML')}")

        # Final Screenshot
        page.screenshot(path="/home/jules/verification/verification.png")
        print("Verification complete.")

        browser.close()

if __name__ == "__main__":
    run()
