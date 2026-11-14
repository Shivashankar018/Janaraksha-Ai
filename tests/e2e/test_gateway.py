"""Login gateway: citizen and admin entry points, the two admin phases, language switch."""
from playwright.sync_api import Page, expect


def test_gateway_offers_citizen_and_admin(app: Page):
    expect(app.locator('[data-act="gwCitizen"]')).to_be_visible()
    expect(app.locator('[data-act="gwAdmin"]')).to_be_visible()


def test_admin_login_has_commissioner_and_police_phases(app: Page):
    app.click('[data-act="gwAdmin"]')
    expect(app.locator('[data-act="alPhase"][data-id="cp"]')).to_be_visible()
    expect(app.locator('[data-act="alPhase"][data-id="police"]')).to_be_visible()


def test_wrong_password_is_refused(app: Page):
    app.click('[data-act="gwAdmin"]')
    app.click('[data-act="alPhase"][data-id="police"]')
    app.fill("#al-id", "KLB-SI-02")
    app.fill("#al-pw", "wrong-password")
    app.click('form[data-form="adminLogin"] button[type="submit"]')
    expect(app.locator(".topbar")).to_have_count(0)


def test_commissioner_id_is_refused_in_police_phase(app: Page):
    app.click('[data-act="gwAdmin"]')
    app.click('[data-act="alPhase"][data-id="police"]')
    app.fill("#al-id", "KLB-CP-01")
    app.fill("#al-pw", "demo1234")
    app.click('form[data-form="adminLogin"] button[type="submit"]')
    expect(app.locator(".topbar")).to_have_count(0)


def test_kannada_switch_translates_the_interface(app: Page):
    app.click('[data-act="setLang"][data-id="kn"]')
    app.wait_for_function("S.lang === 'kn'")
    assert any("ಀ" <= ch <= "೿" for ch in app.inner_text("#app"))
