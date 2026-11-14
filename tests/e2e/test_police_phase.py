"""Police phase: station dashboard, Direct Entry, Document Scanner, Case Connection, progress."""
import re

from helpers import go
from playwright.sync_api import Page, expect


def test_station_dashboard_and_no_escalation_for_police(login_admin):
    page: Page = login_admin("police", "KLB-SHO-01")
    expect(page.locator(".st-dash")).to_be_visible()
    nav = " ".join(page.locator(".nav a, .nav button").all_inner_texts())
    assert "Escalations" not in nav
    go(page, "overview")
    page.evaluate("location.hash = '#escalations'")
    page.wait_for_timeout(200)
    assert page.evaluate("ui.page") == "overview", "police cannot open the Commissioner escalation page"
    assert "scalat" not in page.inner_text("#app")


def test_direct_entry_gives_a_code_and_masks_aadhaar(login_admin):
    page: Page = login_admin("police", "KLB-SHO-01")
    go(page, "entry")
    assert re.fullmatch(r"CMP/\d{4}/\d{4}", page.input_value("#e-ref"))
    page.click('button.type[data-id="cheating"]')
    page.fill("#pn0", "Test Complainant")
    page.select_option("#pt0", "aadhaar")
    valid = page.evaluate("(() => { const b = '99990000777'; return b + verhoeffDigit(b); })()")
    page.fill("#px0", valid)
    page.press("#px0", "Tab")
    expect(page.locator("#px0")).to_have_value("XXXX XXXX " + valid[-4:])
    assert valid not in page.evaluate("JSON.stringify(S.draft)"), "the full Aadhaar number is not stored"


def test_case_connection_finds_the_same_phone_number(login_admin):
    page: Page = login_admin("police", "KLB-SHO-01")
    go(page, "entry")
    page.fill("#e-sum", "Complainant got a call from +91 00000 55821 asking for an OTP. Rs 4,500 was debited.")
    page.wait_for_timeout(400)
    conn = page.inner_text("#entry-conn")
    assert "CMP/2026/1013" in conn and "DEMO-215" in conn


def test_scanner_fills_the_direct_entry_form(login_admin):
    page: Page = login_admin("police", "KLB-SHO-01")
    # Block the OCR library download so the sample uses its stored OCR text: the result is then the same on every machine.
    page.route(re.compile(r".*tesseract.*"), lambda route: route.abort())
    go(page, "scanner")
    page.click('[data-act="useSample"][data-id="PAPER-COMPLAINT"]')
    page.locator('[data-act="docToEntry"]').wait_for(timeout=40_000)
    page.click('[data-act="docToEntry"]')
    page.wait_for_function("ui.page === 'entry'")
    draft = page.evaluate("({ type: S.draft.type, station: S.draft.station, people: S.draft.people.map(p => p.name) })")
    assert draft["type"] == "theft"
    assert draft["station"] == "Station Bazaar Police Station"
    assert "Shabana Begum" in draft["people"]


def test_officer_moves_a_complaint_to_the_next_stage(login_admin):
    page: Page = login_admin("police", "KLB-SHO-01")
    page.evaluate("openComplaintById('CMP/2026/1003')")
    expect(page.locator("#prog-card")).to_be_visible()
    page.select_option("#pg-stage", "action")
    page.fill("#pg-text", "Scooter found near the check post and seized.")
    page.click('[data-act="progSave"]')
    page.wait_for_function("getC('CMP/2026/1003').stage === 'action'")
