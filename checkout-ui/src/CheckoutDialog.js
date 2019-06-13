import React, { useState } from "react";
import { withRouter } from "react-router";
import "uikit";
import BraintreePayment from "./BraintreePayment";
import ProductConfiguration from "./ProductConfiguration";

const submitPayment = paymentInfo => {
  return fetch("http://localhost:8080/payments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(paymentInfo)
  }).then(r => r.json());
};

/**
 * @template K, V
 * @typedef {object} MapLike<K,V>
 * @property {(key: K) => V} get
 */

function CheckoutDialog() {
  const [step, setStep] = useState("productConfiguration");
  const [productConfiguration, setProductConfiguration] = useState(null);
  const [title, setTitle] = useState(null);

  /** @type {Array<[string,string]> & MapLike<string, string>} */
  // @ts-ignore
  const query = new URL(window.location.href).searchParams;
  const product = query.get("prod");
  const productOptions = [...query]
    .filter(([name]) => name.startsWith("params."))
    .reduce((dict, [name, value]) => ({ ...dict, [name.split(".").pop()]: value }), {});

  const handleProductConfigurationSubmit = (configuration, title) => {
    setProductConfiguration(configuration);
    setTitle(title);
    setStep("payment");
  };

  const handlePaymentMethodSubmit = async gatewayParams => {
    setStep("waiting");

    const { amount, currency, ...configuration } = productConfiguration;
    const order = {
      id: 123456789,
      product,
      amount,
      currency,
      configuration
    };
    const paymentInfo = {
      orderId: order.id,
      gateway: "braintree",
      amount,
      currency,
      gatewayParams
    };

    const { transaction, success } = await submitPayment(paymentInfo);
    setStep(success ? "success" : "failure");
    console.log(transaction);
  };

  const backTo = s => setStep(s);

  return (
    <div data-test-id="CheckoutDialog" className="uk-container uk-container-xsmall">
      <div className="uk-card uk-card-default uk-card-body payment-card">
        {step !== "productConfiguration" && title && (
          <h3 className="uk-card-title uk-width-1-1">{title}</h3>
        )}
        {step === "productConfiguration" && (
          <ProductConfiguration
            product={product}
            options={productOptions}
            onSubmit={handleProductConfigurationSubmit}
          />
        )}
        {step === "payment" && (
          <BraintreePayment
            onSubmit={handlePaymentMethodSubmit}
            onBack={() => backTo("productConfiguration")}
          />
        )}
        {step === "waiting" && (
          <div data-uk-spinner="ratio: 2" className="uk-position-center"></div>
        )}
        {step === "success" && (
          <div className="uk-grid-small" data-uk-grid>
            <div id="pgwContainer" className="uk-width-1-1">
              <img src="https://media.giphy.com/media/JpG2A9P3dPHXaTYrwu/giphy.gif" alt="" />
              <h3>Done!</h3>
            </div>
          </div>
        )}
        {step === "failure" && (
          <div className="uk-grid-small" data-uk-grid>
            <div id="pgwContainer" className="uk-width-1-1">
              <img src="https://media.giphy.com/media/yIxNOXEMpqkqA/giphy.gif" alt="" />
              <h4>
                There was a problem processing your credit card; please double check your payment
                information and try again.
              </h4>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default withRouter(CheckoutDialog);
