import React from "react";
import PropTypes from "prop-types";
import styles from "./contentbar.scss";

const ContentBar = (props) => (
    <div className={styles.contentBar}>{props.children}</div>
);
export default ContentBar;

ContentBar.propTypes = {
   children: PropTypes.node.isRequired,
};

