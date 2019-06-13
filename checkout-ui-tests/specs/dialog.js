const assert = require("assert");

describe("Checkout page", () => {
  beforeEach(() => {
    browser.url("/dialog");
  });

  it("must have the right title", () => {
    const title = browser.getTitle();
    assert.equal(title, "loots.com");
  });

  it("must show checkout dialog", () => {
    assert.ok(Boolean(browser.react$("CheckoutDialog")));
  });
});
