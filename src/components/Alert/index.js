import React from "react";
import PropTypes from "prop-types";
import styles from "./alert.scss";
const Alert = ({ children }) => {
  return <div className={styles["alert--danger"]}>{children}</div>;
};

Alert.propTypes = {
  children: PropTypes.element.isRequired
};
export default Alert;
