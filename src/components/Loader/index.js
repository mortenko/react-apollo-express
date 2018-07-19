import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import styles from "./loader.scss";

const Loader = () => (
  <div className={styles.loader}>
      <span> Loading Data... </span>
    <CircularProgress size={100} color="primary" thicknes={7} value={70} />
  </div>
);
export default Loader;
