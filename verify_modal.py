import time
from playwright.sync_api import sync_playwright

def verify_setor_modal():
    with sync_playwright() as p:
        print("Launching browser...")
        browser = p.chromium.launch(headless=True)
        # Increase timeout for slow CI environments or initial bundle load
        page = browser.new_page()
        page.set_default_timeout(60000)

        try:
            print("Navigating to app...")
            # Navigate to the local Expo web server
            page.goto("http://localhost:8081", wait_until="domcontentloaded")

            # Wait for the app to load (sometimes Expo takes a moment to bundle)
            time.sleep(15)

            # Take initial screenshot for debugging
            page.screenshot(path="debug_initial.png")
            print("Initial screen loaded.")

            print("Checking for Login screen...")

            # Try to find the logo or login text
            if page.get_by_text("Sirius Mobile").is_visible():
                print("On Login Screen.")

                # Tap the logo 10 times to unlock dev mode
                # We need to find the logo image.
                # React Native Web images usually have accessibilityRole="image" if set, or just img tag.

                # Let's try to find by image src partial match
                # The logo source is require('../assets/images/icon.png')

                logo = page.locator("img[src*='icon']")
                if logo.count() > 0:
                    print("Logo found. Tapping 10 times...")
                    # We need to click the parent or the image itself
                    for i in range(10):
                        logo.first.click(force=True)
                        time.sleep(0.2)

                    # Wait for the DEV button to appear
                    # Text: "[DEV] Acesso Bypass Liberado"
                    dev_btn = page.get_by_text("Acesso Bypass Liberado")
                    try:
                        dev_btn.wait_for(state="visible", timeout=5000)
                        print("Dev button appeared. Clicking...")
                        dev_btn.click()

                        # Wait for navigation to Home
                        # The router replaces login with (tabs)
                        # Look for Home title or content
                        time.sleep(5)
                        print("Navigated to Home (assumed).")
                    except:
                        print("Dev button did not appear. Trying manual login simulation or assuming already logged in.")
                else:
                    print("Logo not found.")

            # Now on Home Screen (or Modal might open automatically if no sectors selected)
            print("Checking for Setor Modal...")

            # The SetorModal opens automatically if no sectors are selected.
            # Look for "Gerenciar Setores" header text.
            header_text = page.get_by_text("Gerenciar Setores")

            if header_text.is_visible():
                print("Setor Modal is open (Auto-opened).")
            else:
                print("Setor Modal not open. Opening manually...")
                # Click the filter button (accessibilityLabel="Filtrar chamados")
                # But wait, we are in web mode. The accessibilityLabel might be mapped to aria-label.
                filter_btn = page.get_by_role("button", name="Filtrar chamados")
                if filter_btn.count() > 0:
                    filter_btn.click()
                    header_text.wait_for(state="visible", timeout=5000)
                    print("Setor Modal opened manually.")
                else:
                     # Fallback: maybe use icon name if mapped differently or just click the icon
                     # In web, icons from @expo/vector-icons usually render as text or svg.
                     # Let's try locating by visual icon? No, too hard.
                     # Try finding any button on the right side of header
                     print("Filter button not found by label. Trying generic button...")

            # 1. Verify Accessibility Labels
            print("Verifying Accessibility...")

            # Search Input - Label: "Buscar setor"
            # React Native Web TextInput -> input
            search_input = page.get_by_placeholder("Buscar...")
            if search_input.count() > 0:
                 # Check if aria-label is set correctly
                 label = search_input.get_attribute("aria-label")
                 if label == "Buscar setor":
                     print("✅ Search input found with correct aria-label: 'Buscar setor'")
                 else:
                     print(f"⚠️ Search input found but label is: '{label}'")
            else:
                print("❌ Search input NOT found.")

            # Close Button - Label: "Fechar modal de seleção de setores"
            close_btn = page.get_by_label("Fechar modal de seleção de setores")
            if close_btn.count() > 0:
                print("✅ Close button found with correct label.")
            else:
                 # Check if it has the old label "Fechar modal de setores" (it shouldn't)
                 old_btn = page.get_by_label("Fechar modal de setores")
                 if old_btn.count() > 0:
                     print("❌ Found OLD label on Close button.")
                 else:
                     print("❌ Close button NOT found by label.")

            # Modal Title Role
            # We added accessibilityRole="header" to "Gerenciar Setores"
            title = page.get_by_role("heading", name="Gerenciar Setores")
            if title.count() > 0:
                print("✅ Modal title has correct role 'heading'.")
            else:
                # React Native Web sometimes maps 'header' to role='heading' with level 1 or just role='heading'
                # Let's check if the text exists at least
                if page.get_by_text("Gerenciar Setores").count() > 0:
                    print("⚠️ Title text found but role might be missing or not 'heading'.")
                else:
                    print("❌ Modal title NOT found.")

            # 2. Select a Sector and Verify Animation/Button
            print("Selecting a sector...")

            # Wait for list
            time.sleep(2)

            # Find any sector item. They are TouchableOpacity with accessibilityRole="checkbox"
            # In Web, this should map to role="checkbox"
            sectors = page.get_by_role("checkbox")
            if sectors.count() > 0:
                print(f"Found {sectors.count()} sectors. Clicking the first one...")
                sectors.first.click()
                time.sleep(1)

                # Check Confirm Button
                # Label: "Confirmar seleção de setores"
                confirm_btn = page.get_by_label("Confirmar seleção de setores")

                if confirm_btn.is_visible():
                    print("✅ Confirm button visible with correct label.")

                    # Take screenshot of the Pulse State
                    print("Taking screenshot...")
                    page.screenshot(path="verification_modal.png")
                    print("Screenshot saved to verification_modal.png")
                else:
                    print("❌ Confirm button NOT visible.")
            else:
                print("No sectors found to select. This might be because the mock list is empty or loading failed.")
                # If loading, wait a bit more
                time.sleep(5)
                page.screenshot(path="debug_list_empty.png")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification_error.png")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_setor_modal()
