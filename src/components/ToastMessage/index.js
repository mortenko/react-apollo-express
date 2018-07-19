import React from "react";
import classnames from "classnames";
import styles from "./toastMessage.scss";

const ToastMessage = ({ type, content }) => {
  return (
    <div className={classnames(styles.toaster, styles[`toaster--${type}`])}>
      {content}
    </div>
  );
};

export default ToastMessage;
