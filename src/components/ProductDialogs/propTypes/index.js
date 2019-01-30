import PropTypes from "prop-types";

const productPropTypes = PropTypes.shape({
  product: PropTypes.shape({
    productname: PropTypes.string,
    description: PropTypes.string,
    pricewithoutdph: PropTypes.number,
    pricewithdph: PropTypes.number,
    barcode: PropTypes.string,
    ProductPhoto: PropTypes.shape({
      photo: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
      name: PropTypes.string
    })
  })
});

const productDefaultProps = PropTypes.shape({
  productname: "",
  description: "",
  pricewithoutdph: 0,
  pricewithdph: 0,
  barcode: "",
  ProductPhoto: PropTypes.shape({
    photo: {},
    name: ""
  })
});

export { productDefaultProps, productPropTypes };
