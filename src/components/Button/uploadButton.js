import React from "react";
import Image from "components/Image";
import PropTypes from "prop-types";
import Button from "components/Button";
import Alert from "components/Alert";
import styles from "./uploadButton.scss";
import { AddAPhoto } from "../../assets/material-ui-icons";

const UploadButton = ({
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
        className={styles.uploadButton__input}
        id="photo"
        type="file"
        onChange={({ target: { id, value, files } }) => {
          handleInputChange(id, value, files);
          validate.isRequired({ [id]: files[0] });
        }}
      />
      <label htmlFor="photo">
        <Button info variant="contained" component="span">
          <AddAPhoto className={styles.uploadButton__icon} />
          Upload Photo
        </Button>
      </label>
      <div className={styles.uploadButton__text}>
        {Object.keys(validationPhotoError).length > 0 && (
          <Alert>{Object.values(validationPhotoError)[0]}</Alert>
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
  handleInputChange: PropTypes.func.isRequired,
  photo: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  photoName: PropTypes.string,
  validate: PropTypes.objectOf(PropTypes.func),
  validationPhotoError: PropTypes.object
};

UploadButton.defaultProps = {
  photo: "",
  photoName: "",
  validate: {},
  validationPhotoError: {}
};

export default UploadButton;
