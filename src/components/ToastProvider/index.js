import React from "react";
import ToastMesssage from "components/ToastMessage";
import PropTypes from "prop-types";
import styles from "./toastProvider.scss";

const ToastProvider = ({ toasts, removeToastMessage }) => {
  return (
    <div className={styles.toastProvider}>
      {toasts.map(toast => {
        setTimeout(() => {
          removeToastMessage(toast.id);
        }, toast.delay);
        return (
          <ToastMesssage
            key={toast.id}
            type={toast.type}
            content={toast.content}
          />
        );
      })}
    </div>
  );
};
export default ToastProvider;

ToastProvider.propTypes = {
  removeToastMessage: PropTypes.func.isRequired,
  toasts: PropTypes.arrayOf(
    PropTypes.shape({
      content: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
      type: PropTypes.string,
      delay: PropTypes.number
    })
  )
};

ToastProvider.defaultProps = {
  toasts: PropTypes.arrayOf(
    PropTypes.shape({
      content: "",
      type: "success",
      delay: 1000
    })
  )
};
