import PropTypes from "prop-types";

const orderProductPropTypes = PropTypes.shape({
  productID: PropTypes.number,
  productname: PropTypes.string,
  quantity: PropTypes.arrayOf(PropTypes.number),
  selectedQuantity: PropTypes.number,
  pricewithoutdph: PropTypes.number,
  pricewithdph: PropTypes.number,
  totalpricewithoutdph: PropTypes.number,
  totalpricewithdph: PropTypes.number
});

const orderPropTypes = PropTypes.shape({
  firstname: PropTypes.string,
  lastname: PropTypes.string,
  email: PropTypes.string,
  products: PropTypes.arrayOf(orderProductPropTypes),
  totalsumwithoutdph: PropTypes.number,
  totalsumwithdph: PropTypes.number
});

const orderDefaultProps = {
  firstname: "",
  lastname: "",
  email: "",
  incrementProductID: 2,
  products: [
    {
      productID: 1,
      productname: "",
      quantity: [1, 2, 3, 4, 5],
      selectedQuantity: 0,
      pricewithoutdph: 0,
      pricewithdph: 0,
      totalpricewithoutdph: 0,
      totalpricewithdph: 0
    }
  ],
  totalsumwithoutdph: 0,
  totalsumwithdph: 0
};

export { orderPropTypes, orderDefaultProps,orderProductPropTypes };
