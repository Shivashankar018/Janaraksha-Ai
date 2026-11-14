"""Raksha AI case assistant: valid and invalid complaint codes."""
from helpers import ask_raksha
from playwright.sync_api import Page, expect


def test_raksha_is_only_for_signed_in_officers(app: Page):
    expect(app.locator(".rk-fab")).to_have_count(0)


def test_valid_code_shows_status_fir_and_timeline(login_admin):
    page: Page = login_admin("police", "KLB-SI-02")
    answer = ask_raksha(page, "CMP/2026/1003")
    assert "Vehicle theft" in answer
    assert "0071/2026" in answer, "the FIR number is shown"
    assert "live tracking" in answer.lower(), "the live timeline is shown"
    assert "next step" in answer.lower()


def test_code_can_be_typed_loosely(login_admin):
    page: Page = login_admin("police", "KLB-SI-02")
    assert "CMP/2026/1004" in ask_raksha(page, "cmp 2026 1004")


def test_unknown_code_says_the_case_does_not_exist(login_admin):
    page: Page = login_admin("police", "KLB-SI-02")
    assert "This case does not exist" in ask_raksha(page, "CMP/2026/9999")
