import PropTypes from "prop-types";

const customerPropTypes = PropTypes.shape({
  firstname: PropTypes.string,
  lastname: PropTypes.string,
  phone: PropTypes.string,
  email: PropTypes.string,
  CustomerPhoto: PropTypes.shape({
    photo: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    name: PropTypes.string
  })
});

const customerDefaultProps = {
  firstname: "",
  lastname: "",
  phone: "",
  email: "",
  CustomerPhoto: {
    photo: null,
    name: ""
  }
};

export { customerPropTypes, customerDefaultProps };
