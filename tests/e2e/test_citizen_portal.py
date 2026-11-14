"""Citizen portal: mobile number and OTP login, filing a complaint, acknowledgment."""
import re

from playwright.sync_api import Page, expect

CODE = re.compile(r"CMP/\d{4}/\d{4}")


def test_new_citizen_files_a_complaint_and_gets_a_code(login_citizen):
    page: Page = login_citizen("9876500099")
    assert page.evaluate("ui.page") == "file-complaint"
    page.click('[data-act="cSample"]')  # fills the form with fictional sample details
    page.wait_for_timeout(300)
    page.check("#cf-declare")
    page.click('[data-act="cSubmit"]')
    ack = page.locator(".ack")
    expect(ack).to_be_visible()
    assert CODE.search(ack.inner_text()), "the acknowledgment shows a complaint code"


def test_submit_needs_the_declaration(login_citizen):
    page: Page = login_citizen("9876500098")
    page.click('[data-act="cSample"]')
    page.wait_for_timeout(300)
    page.click('[data-act="cSubmit"]')
    expect(page.locator(".ack")).to_have_count(0)


def test_returning_citizen_sees_their_complaints(login_citizen):
    page: Page = login_citizen("9000000033")  # fictional complainant of CMP/2026/1003
    assert page.evaluate("ui.page") == "my-complaints"
    text = page.inner_text("#app")
    assert "CMP/2026/1003" in text
    assert "0071/2026" in text, "the FIR number of the registered complaint is shown"
