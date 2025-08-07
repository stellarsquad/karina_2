import os
from playwright.sync_api import sync_playwright, expect

def run_verification(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()

    # Get the absolute path to the index.html file
    file_path = os.path.abspath('index.html')

    # Navigate to the local HTML file
    page.goto(f'file://{file_path}')

    # Wait for the main frame and app to be visible
    expect(page.locator('.frame')).to_be_visible()

    # Bypass the authorization flow by setting localStorage directly
    page.evaluate("""
        () => {
            localStorage.setItem('currentUser', 'he');
            localStorage.setItem('currentPairId', 'DUMMY-PAIR');
            localStorage.setItem('userUID', 'DUMMY-UID');
        }
    """)

    # Reload the page to apply the new localStorage state
    page.reload()

    # Wait for the main app content to be ready
    expect(page.locator('.count-box')).to_be_visible()

    # Brute-force close any modals that might be open
    for close_btn_id in [
        '#close-location', '#close-photo-game', '#close-punishment',
        '#close-orgasm-request', '#close-cum-command'
    ]:
        close_button = page.locator(close_btn_id)
        if close_button.is_visible():
            close_button.click()

    # 1. Check for the new buttons
    expect(page.locator('button#undo-btn')).to_be_visible()
    expect(page.locator('button#reset-btn')).to_be_visible()

    # 2. Check that the main counter is visible
    counter_display = page.locator('#counter-display')
    expect(counter_display).to_be_visible()

    # Take a screenshot
    page.screenshot(path="jules-scratch/verification/verification.png")

    browser.close()

with sync_playwright() as playwright:
    run_verification(playwright)

print("Verification script finished and screenshot taken.")
