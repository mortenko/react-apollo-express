import React from "react";
import PropTypes from "prop-types";
import styles from "./image.scss";

const Image = ({ src, width, height, alt, fileName }) => (
  <div className={styles.image}>
    <img src={src} width={width} height={height} alt={alt} />
    {fileName && <p>{fileName} </p>}
  </div>
);

Image.propTypes = {
  src: PropTypes.string.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  alt: PropTypes.string,
  fileName: PropTypes.string,
};

Image.defaultProps = {
  width: 127,
  height: 127,
  alt: "",
  fileName: ""
};

export default Image;
