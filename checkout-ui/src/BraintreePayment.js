import React, { useState, useEffect } from "react";
import dropin from "braintree-web-drop-in";

const fetchGatewayToken = () => {
  return fetch("http://localhost:8080/test/token")
    .catch(e => console.error("!!!!!!!!!!!!", e))
    .then(r => r && r.text());
};

function BraintreePayment({ onBack, onSubmit }) {
  const [dropinInstance, setDropinInstance] = useState(null);
  const [canRequestPaymentMethod, setCanRequestPaymentMethod] = useState(false);

  const requestPaymentMethod = async () => {
    const { nonce } = await dropinInstance.requestPaymentMethod();
    onSubmit({ nonce });
  };

  useEffect(() => {
    fetchGatewayToken().then(authorization => {
      // @ts-ignore
      // eslint-disable-next-line
      dropin
        .create({
          authorization,
          container: "#pgwContainer",
          paypal: {
            flow: "vault"
          },
          venmo: true
        })
        .then(instance => {
          setDropinInstance(instance);
          instance.on("paymentMethodRequestable", () => setCanRequestPaymentMethod(true));
          instance.on("noPaymentMethodRequestable", () => setCanRequestPaymentMethod(false));
          // instance.on("paymentOptionSelected", o => console.log("paymentOptionSelected", o));
        });
    });
    return () => dropinInstance && dropinInstance.teardown();
  }, []);

  return (
    <>
      <div className="uk-grid-small" data-uk-grid>
        <div
          data-uk-spinner="ratio: 2"
          className="uk-position-center"
          style={{ display: dropinInstance ? "none" : "block" }}
        ></div>
        <div
          id="pgwContainer"
          className="uk-width-1-1"
          style={{ visibility: dropinInstance ? "visible" : "hidden" }}
        ></div>
        <div className="uk-width-1-1">
          <button
            onClick={onBack}
            className="uk-button uk-button-default uk-button-large uk-align-right"
            style={{ visibility: dropinInstance ? "visible" : "hidden" }}
          >
            Go Back
          </button>
          <button
            onClick={requestPaymentMethod}
            className="uk-button uk-button-primary uk-button-large uk-align-right"
            style={{ visibility: dropinInstance ? "visible" : "hidden" }}
            disabled={!canRequestPaymentMethod}
          >
            Pay Now
          </button>
        </div>
      </div>
    </>
  );
}

export default BraintreePayment;
