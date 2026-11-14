"""Commissioner phase: all-station dashboard, escalations, instructions and replies, remarks."""
from helpers import clear_toasts, go
from playwright.sync_api import Page, expect


def test_dashboard_shows_counts_for_all_stations(login_admin):
    page: Page = login_admin("cp", "KLB-CP-01")
    kpis = page.locator(".cp-kpis").inner_text()
    for label in ["Total complaints", "Escalated complaints", "Pending verification", "Resolved"]:
        assert label in kpis
    rows = page.locator(".cp-st tbody tr").count()
    assert rows == page.evaluate("ALL_STATIONS.length"), "every police station has demo complaints"


def test_escalations_page_lists_late_work(login_admin):
    page: Page = login_admin("cp", "KLB-CP-01")
    go(page, "escalations")
    assert page.locator(".esc-row").count() >= 5
    expect(page.locator('[data-act="escInstruct"][data-key="task:T-1"]')).to_be_visible()


def test_instruction_reaches_the_officer_and_the_reply_comes_back(login_admin):
    page: Page = login_admin("cp", "KLB-CP-01")
    go(page, "escalations")
    page.click('[data-act="escInstruct"][data-key="task:T-1"]')
    page.fill("#escText", "Check the recovered vehicle register today.")
    page.click('[data-act="escInstructSend"]')

    login_admin("police", "KLB-HC-03")  # the officer who owns task T-1
    clear_toasts(page)
    page.click('[data-act="toggleBell"]')
    expect(page.locator(".bi.esc").first).to_contain_text("Instruction from the Commissioner")
    page.locator(".bi.esc").first.click()
    page.click('[data-act="escRespond"][data-key="task:T-1"]')
    page.fill("#escReply", "Register checked. The vehicle is not in it.")
    page.click('[data-act="escRespondSend"]')

    login_admin("cp", "KLB-CP-01")
    go(page, "escalations")
    assert "Register checked" in page.inner_text("#app")
    assert not page.evaluate("cpEscAll().some(r => r.key === 'task:T-1')"), "the reply clears the escalation"


def test_commissioner_remark_is_saved_on_the_complaint(login_admin):
    page: Page = login_admin("cp", "KLB-CP-01")
    page.evaluate("ui.cpSel = 'CMP/2026/1003'; location.hash = '#cp-progress'")
    expect(page.locator("#cp-det")).to_be_visible()
    page.fill("#cp-remark", "Return the scooter quickly.")
    page.click('[data-act="cpRemark"]')
    page.wait_for_function("getC('CMP/2026/1003').track.some(t => t.kind === 'remark' && t.text === 'Return the scooter quickly.')")
