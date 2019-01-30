import PropTypes from "prop-types";

export const toastPropTypes = PropTypes.shape({
  addToastMessage: PropTypes.func.isRequired,
  removeToastMessage: PropTypes.func.isRequired,
  toasts: PropTypes.array
});

export const toastDefaultProps = {
  toasts: []
};
