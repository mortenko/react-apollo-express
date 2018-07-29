import React from "react";
import PropTypes from "prop-types";
import { DialogContent, InputAdornment, TextField } from "components/Dialog";
import Alert from "components/Alert";
import Grid from "@material-ui/core/Grid";
import styles from "./baseCustomerForm.scss";
import UploadButton from "components/Button/uploadButton";
import { Email, Person, Phone } from "../../assets/material-ui-icons";

const BaseCustomerForm = ({
  customerState,
  handleInputChange,
  classes,
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
            id="firstname"
            label="First Name:"
            placeholder="first name"
            margin="normal"
            value={firstname}
            fullWidth
            onChange={event => {
              handleInputChange(event);
              isLength(3, 15)(event.target.id, event.target.value);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person />
                </InputAdornment>
              )
            }}
            error={validationErrors.firstname.length !== 0}
          />
          <Alert>{validationErrors.firstname}</Alert>
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="lastname"
            label="Last Name:"
            placeholder="last name"
            margin="normal"
            value={lastname}
            fullWidth
            onChange={event => {
              handleInputChange(event);
              isLength(3, 15)(event.target.id, event.target.value);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person />
                </InputAdornment>
              )
            }}
            error={validationErrors.lastname.length !== 0}
          />
          <Alert>{validationErrors.lastname}</Alert>
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="phone"
            label="Phone:"
            placeholder="phone"
            margin="normal"
            value={phone}
            fullWidth
            onChange={event => {
              handleInputChange(event);
              isPhoneNumber(event.target.id, event.target.value);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Phone />
                </InputAdornment>
              )
            }}
            error={validationErrors.phone.length !== 0}
          />
          <Alert>{validationErrors.phone}</Alert>
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="email"
            type="email"
            label="Email:"
            placeholder="email"
            margin="normal"
            value={email}
            fullWidth
            onChange={event => {
              handleInputChange(event);
              isEmail(event.target.id, event.target.value);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email />
                </InputAdornment>
              )
            }}
            error={validationErrors.email.length !== 0}
          />
          <Alert>{validationErrors.email}</Alert>
        </Grid>
        <Grid item xs={12}>
          <UploadButton
            handleInputChange={handleInputChange}
            photo={photo}
            photoName={name}
            validationPhotoError={validationErrors.photo}
            validate={{ isRequired }}
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
