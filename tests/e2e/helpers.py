"""Small helpers shared by the end-to-end tests."""
from playwright.sync_api import Page


def go(page: Page, route: str) -> None:
    """Open an in-app page by its hash route and wait until it is shown."""
    page.evaluate(f"location.hash = '#{route}'")
    page.wait_for_function(f"ui.page === '{route}'")


def clear_toasts(page: Page) -> None:
    page.evaluate("ui.toasts = []; renderToasts()")


def ask_raksha(page: Page, code: str) -> str:
    """Ask Raksha AI about a code and return the text of its last answer."""
    if not page.locator(".rk-panel").count():
        page.click(".rk-fab")
    page.fill("#rk-q", code)
    page.press("#rk-q", "Enter")
    page.wait_for_timeout(200)
    return page.locator(".rk-msg.bot").last.inner_text()
