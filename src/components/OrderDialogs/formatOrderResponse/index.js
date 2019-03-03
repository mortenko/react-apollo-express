import React from "react";
import PropTypes from "prop-types";
import styles from "./formatOrderResponse.scss";

const FormatOrderResponse = ({
  title = "",
  body: { products, totalsumwithoutdph, totalsumwithdph }
}) => (
  <div className={styles.formatOrderResponse__block}>
    {title && <h5>{title}</h5>}
    {products.map(({ productID, productname, selectedQuantity }) => (
      <div key={productID}>
        <span className={styles.formatOrderResponse__title}>Product:</span>
        <span className={styles.formatOrderResponse__value}>{productname}</span>
        <span className={styles.formatOrderResponse__title}>
          with total Quantity:
        </span>
        <span className={styles.formatOrderResponse__value}>{selectedQuantity}</span>
      </div>
    ))}
    <div className={styles.formatOrderResponse__block}>
      <span className={styles.formatOrderResponse__title}>
        Total Price without DPH:
      </span>
      <span className={styles.formatOrderResponse__value}>
        {totalsumwithoutdph}$
      </span>
      <br />
      <span className={styles.formatOrderResponse__title}>
        Total Price with DPH:
      </span>
      <span className={styles.formatOrderResponse__value}>
        {totalsumwithdph}$
      </span>
    </div>
  </div>
);

FormatOrderResponse.propTypes = {
  body: PropTypes.shape({
    products: PropTypes.array.isRequired,
    totalsumwithdph: PropTypes.number,
    totalsumwithoutdph: PropTypes.number
  }).isRequired,
  title: PropTypes.string
};

export default FormatOrderResponse;
