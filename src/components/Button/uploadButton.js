import React from "react";
import Image from "components/Image";
import PropTypes from "prop-types";
import Button from "components/Button";
import Alert from "components/Alert";
import styles from "./uploadButton.scss";
import { AddAPhoto } from "../../assets/material-ui-icons";

const UploadButton = ({
  classes,
  handleInputChange,
  photo,
  validate,
  photoName,
  validationPhotoError
}) => {
  return (
    <div className={styles.uploadButton}>
      <input
        accept="image/*"
        className={classes.uploadInput}
        id="photo"
        type="file"
        onChange={event => {
          handleInputChange(event);
          validate.isRequired({ [event.target.id]: event.target.files[0] });
        }}
      />
      <label htmlFor="photo">
        <Button color="materialBlue" variant="contained" component="span">
          <AddAPhoto className={classes.iconLeft} />
          Upload Photo
        </Button>
      </label>
      <div className={styles.uploadButton__text}>
        {validationPhotoError.length !== 0 && (
          <Alert>{validationPhotoError}</Alert>
        )}
      </div>
      <div className={styles.uploadButton__image}>
        {photo !== null && (
          <Image
            src={typeof photo === "object" ? URL.createObjectURL(photo) : photo}
            width={127}
            height={127}
            alt={photoName}
            fileName={photoName}
          />
        )}
      </div>
    </div>
  );
};
UploadButton.propTypes = {
  classes: PropTypes.object.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  photo: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  photoName: PropTypes.string,
  validate: PropTypes.objectOf(PropTypes.func),
  validationPhotoError: PropTypes.string
};
UploadButton.defaultProps = {
  classes: {},
  photo: "",
  photoName: "",
  validate: {},
  validationPhotoError: ""
};

export default UploadButton;
