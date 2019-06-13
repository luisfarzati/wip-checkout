import React, { useState } from "react";
import Donation from "./Donation";

function ProductConfiguration({ product, options, onSubmit }) {
  const [mayContinue, setMayContinue] = useState(false);
  const [configuration, setConfiguration] = useState(null);
  const [title, setTitle] = useState(null);

  const handleConfigurationChange = (config, title) => {
    setConfiguration(config.options);
    setTitle(title);
    setMayContinue(config.isValid);
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(configuration, title);
  };

  return (
    <form onSubmit={handleSubmit} className="uk-grid-small" data-uk-grid>
      <div className="uk-width-1-1">
        {product === "donation" && (
          <Donation options={options} onConfigurationChange={handleConfigurationChange} />
        )}
      </div>
      <div className="uk-width-1-1">
        <button
          type="submit"
          disabled={!mayContinue}
          className="uk-align-right uk-button uk-button-large uk-button-primary"
        >
          Pay
        </button>
      </div>
    </form>
  );
}

export default ProductConfiguration;
