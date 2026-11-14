"""Phone-size layout: no sideways scrolling on the main screens."""
import pytest
from helpers import go
from playwright.sync_api import Page


@pytest.fixture
def browser_context_args(browser_context_args):
    return {**browser_context_args, "viewport": {"width": 390, "height": 844}}


def no_sideways_scroll(page: Page) -> bool:
    return page.evaluate("document.documentElement.scrollWidth <= window.innerWidth + 1")


def test_gateway_fits_a_phone(app: Page):
    assert no_sideways_scroll(app)


def test_commissioner_screens_fit_a_phone(login_admin):
    page: Page = login_admin("cp", "KLB-CP-01")
    assert no_sideways_scroll(page)
    go(page, "escalations")
    assert no_sideways_scroll(page)


def test_police_screens_fit_a_phone(login_admin):
    page: Page = login_admin("police", "KLB-SHO-01")
    for route in ["overview", "entry", "complaints"]:
        go(page, route)
        assert no_sideways_scroll(page), route
