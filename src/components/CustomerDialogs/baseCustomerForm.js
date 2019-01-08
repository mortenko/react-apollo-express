import React from "react";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import { DialogContent, InputAdornment, TextField } from "components/Dialog";
import Alert from "components/Alert";
import styles from "./baseCustomerForm.scss";
import UploadButton from "components/Button/uploadButton";
import { Email, Person, Phone } from "../../assets/material-ui-icons";

const BaseCustomerForm = ({
  customerState,
  handleInputChange,
  printErrorMessage,
  validationFunctions: { isEmail, isPhoneNumber, isLength, isRequired },
  validationErrors
}) => {
  const {
    customer: {
      firstname,
      lastname,
      phone,
      email,
      CustomerPhoto: { photo, name }
    }
  } = customerState;
  return (
    <Grid container>
      <DialogContent className={styles.dialog__content}>
        <Grid item xs={12}>
          <TextField
            error={Object.keys(validationErrors.firstname).length > 0}
            fullWidth
            id="firstname"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person />
                </InputAdornment>
              )
            }}
            label="First Name:"
            margin="normal"
            placeholder="first name"
            value={firstname}
            onChange={({ target: { id, value } }) => {
              isLength(3, 15)(id, value);
              isRequired({ [id]: value });
              handleInputChange(id, value);
            }}
          />
          <Alert>{printErrorMessage(validationErrors.firstname)}</Alert>
        </Grid>
        <Grid item xs={12}>
          <TextField
            error={Object.keys(validationErrors.lastname).length > 0}
            fullWidth
            id="lastname"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person />
                </InputAdornment>
              )
            }}
            label="Last Name:"
            margin="normal"
            placeholder="last name"
            value={lastname}
            onChange={({ target: { id, value } }) => {
              handleInputChange(id, value);
              isLength(3, 15)(id, value);
              isRequired({ [id]: value });
            }}
          />
          <Alert>{printErrorMessage(validationErrors.lastname)}</Alert>
        </Grid>
        <Grid item xs={12}>
          <TextField
            error={Object.keys(validationErrors.phone).length > 0}
            fullWidth
            id="phone"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Phone />
                </InputAdornment>
              )
            }}
            label="Phone:"
            margin="normal"
            placeholder="phone"
            value={phone}
            onChange={({ target: { id, value } }) => {
              handleInputChange(id, value);
              isPhoneNumber(id, value);
              isRequired({ [id]: value });
            }}
          />
          <Alert>{printErrorMessage(validationErrors.phone)}</Alert>
        </Grid>
        <Grid item xs={12}>
          <TextField
            error={Object.keys(validationErrors.email).length > 0}
            fullWidth
            id="email"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email />
                </InputAdornment>
              )
            }}
            label="Email:"
            margin="normal"
            placeholder="email"
            type="email"
            value={email}
            onChange={({ target: { id, value } }) => {
              handleInputChange(id, value);
              isEmail(id, value);
              isRequired({ [id]: value });
            }}
          />
          <Alert>{printErrorMessage(validationErrors.email)}</Alert>
        </Grid>
        <Grid item xs={12}>
          <UploadButton
            handleInputChange={handleInputChange}
            photo={photo}
            photoName={name}
            validate={{ isRequired }}
            validationPhotoError={validationErrors.photo}
          />
        </Grid>
      </DialogContent>
    </Grid>
  );
};

BaseCustomerForm.propTypes = {
  classes: PropTypes.object.isRequired,
  customerState: PropTypes.shape({
    firstname: PropTypes.string,
    lastname: PropTypes.string,
    phone: PropTypes.string,
    email: PropTypes.string,
    CustomerPhoto: PropTypes.shape({
      photo: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
      name: PropTypes.string
    })
  }),
  handleInputChange: PropTypes.func.isRequired,
  printErrorMessage: PropTypes.func.isRequired,
  validationErrors: PropTypes.object,
  validationFunctions: PropTypes.objectOf(PropTypes.func)
};

BaseCustomerForm.defaultProps = {
  customerState: PropTypes.shape({
    firstname: "",
    lastname: "",
    phone: "",
    email: "",
    CustomerPhoto: {
      photo: {},
      name: ""
    }
  }),
  validationErrors: {},
  validationFunctions: {}
};

export default BaseCustomerForm;
