import React, { useState } from "react";
import JoiBrowser from "joi-browser";

/** @type {import('joi')} */
const Joi = JoiBrowser;

const amountSchema = Joi.string()
  .required()
  .regex(/^\d+([,.]\d+)?$/);

// @ts-ignore
const schema = Joi.object({
  // @ts-ignore
  to: Joi.string().required(),
  amount: amountSchema,
  currency: Joi.string()
    .required()
    .lowercase()
    .valid("EUR", "GBP", "USD")
});

const symbol = {
  EUR: "€",
  GBP: "£",
  USD: "$"
};

function Donation({ options, onConfigurationChange }) {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState(options.currency || "EUR");

  const triggerConfigurationChange = values => {
    const { error, value } = Joi.validate(
      {
        ...options,
        amount,
        currency,
        ...values
      },
      schema
    );

    onConfigurationChange(
      { options: value, isValid: Boolean(!error) },
      <span>
        You are donating{" "}
        <b>
          {symbol[value.currency]}
          {value.amount}
        </b>{" "}
        to <b>{options.to}</b>{" "}
        <img
          alt="♥️"
          src="https://upload.wikimedia.org/wikipedia/commons/c/c8/Love_Heart_symbol.svg"
          style={{ verticalAlign: "baseline" }}
          width="20"
        ></img>
      </span>
    );
  };

  const handleAmountChange = e => {
    const validation = Joi.validate(e.target.value, amountSchema);
    const isValid = !validation.error;
    if (e.target.value === "" || isValid) {
      const amount = e.target.value;
      setAmount(amount);
      triggerConfigurationChange({ amount });
    }
  };

  const handleCurrencyChange = e => {
    const newCurrency = e.target.value;
    setCurrency(newCurrency);
    triggerConfigurationChange({ currency: newCurrency });
  };

  return (
    <div className="uk-grid-small" data-uk-grid>
      <h3 className="uk-card-title uk-width-1-1">
        Donate to <b>{options.to}</b>
      </h3>
      <div className="uk-width-1-4@s">
        <input
          className="uk-input uk-form-large"
          type="number"
          placeholder="5"
          autoFocus
          required
          pattern="\d+"
          value={amount}
          onChange={handleAmountChange}
        />
      </div>
      <div className="uk-width-1-4@s">
        <select
          className="uk-select uk-form-large"
          onChange={handleCurrencyChange}
          value={currency}
        >
          <option value="EUR">Euros</option>
          <option value="GBP">Pounds</option>
          <option value="USD">Dollars</option>
        </select>
      </div>
      <div className="uk-width-1-2@s" />
    </div>
  );
}

export default Donation;
