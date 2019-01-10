import React from "react";
import PropTypes from "prop-types";
import styles from "./alert.scss";
const Alert = ({ children }) => {
  return <div className={styles["alert--danger"]}>{children}</div>;
};

Alert.defaultProps = {
  children: ""
};

Alert.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.node])
};
export default Alert;
