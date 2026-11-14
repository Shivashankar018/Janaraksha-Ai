"""Shared fixtures for the JanaRaksha AI end-to-end tests.

The suite builds dist/index.html once, then opens it from the file system in a
fresh browser context for every test, so each test starts with clean demo data.
Every test also fails if the page throws a JavaScript error.
"""
from __future__ import annotations

import subprocess
import sys
from pathlib import Path

import pytest
from playwright.sync_api import Page, expect

ROOT = Path(__file__).resolve().parent.parent
DIST = ROOT / "dist" / "index.html"
PASSWORD = "demo1234"  # demo accounts only; see docs/demo-guide.md


@pytest.fixture(scope="session")
def app_url() -> str:
    subprocess.run([sys.executable, str(ROOT / "scripts" / "build.py")], check=True)
    return DIST.as_uri()


@pytest.fixture
def app(page: Page, app_url: str):
    """The app on its first page (login gateway), with a page-error guard."""
    errors: list[str] = []
    page.on("pageerror", lambda e: errors.append(str(e)))
    page.goto(app_url)
    expect(page.locator('[data-act="gwAdmin"]')).to_be_visible()
    yield page
    assert not errors, f"JavaScript errors on the page: {errors}"


@pytest.fixture
def login_admin(app: Page):
    """Sign in through Admin login. phase is 'cp' (Commissioner) or 'police'."""

    def _login(phase: str, officer_id: str, station: str | None = None) -> Page:
        if app.locator('.topbar [data-act="logout"]').count():
            app.click('.topbar [data-act="logout"]')
        app.click('[data-act="gwAdmin"]')
        app.click(f'[data-act="alPhase"][data-id="{phase}"]')
        app.fill("#al-id", officer_id)
        app.fill("#al-pw", PASSWORD)
        if station:
            app.select_option("#al-st", station)
        app.click('form[data-form="adminLogin"] button[type="submit"]')
        expect(app.locator(".topbar")).to_be_visible()
        return app

    return _login


@pytest.fixture
def login_citizen(app: Page):
    """Sign in as a citizen with a mobile number and the on-screen demo OTP."""

    def _login(phone: str) -> Page:
        app.click('[data-act="gwCitizen"]')
        app.fill("#cl-phone", phone)
        app.click('form[data-form="citizenLogin"] button[type="submit"]')
        expect(app.locator("#cl-otp")).to_be_visible()
        app.fill("#cl-otp", app.evaluate("ui.otp.code"))
        app.click('form[data-form="citizenLogin"] button[type="submit"]')
        app.wait_for_function("ui.page === 'my-complaints' || ui.page === 'file-complaint'")
        return app

    return _login
