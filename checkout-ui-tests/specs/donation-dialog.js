const assert = require("assert");

describe("Checkout donation dialog", () => {
  beforeEach(() => {
    browser.url("/dialog?prod=donation&to=frank");
  });

  it("must show the product configuration component", () => {
    const productConfigurationComponent = browser.react$("ProductConfiguration");
    assert.ok(Boolean(productConfigurationComponent));
  });
});
