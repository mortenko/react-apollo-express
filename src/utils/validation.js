import React, { Component } from "react";

function withValidator(WrappedComponent) {
  return class extends Component {
    state = {
      validationErrors: this.props.initialErrorValues
    };
    hasValidationErrors = () => {
      const { errors } = this.state;
      let hasErrors = false;
      for (const key in errors) {
        if (errors[key].length !== 0) {
          hasErrors = true;
        }
      }
      return hasErrors;
    };
    isRequired = stateObj => {
      let isEmpty = false;
      const isRequiredError = {};
      for (const key in stateObj) {
        if (stateObj[key] === null || stateObj[key].length === 0) {
          isRequiredError[key] = `${key} is required`;
          isEmpty = true;
        } else {
          isRequiredError[key] = "";
        }
      }
      this.setState({
        validationErrors: {
          ...this.state.validationErrors,
          ...isRequiredError
        }
      });
      return isEmpty;
    };

    isEmail = (field, value) => {
      const isEmailError = {};
      if (value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
        isEmailError[field] = "E-mail address is not valid";
      } else {
        isEmailError[field] = "";
      }
      this.setState({
        validationErrors: {
          ...this.state.validationErrors,
          ...isEmailError
        }
      });
    };
    isLength = (min, max) => (field, value) => {
      const isLengthError = {};
      if ((value && value.length < min) || value.length > max) {
        isLengthError[
          field
        ] = `Must be at least ${min} characters or maximum ${max}`;
      } else {
        isLengthError[field] = "";
      }
      this.setState({
        validationErrors: {
          ...this.state.validationErrors,
          ...isLengthError
        }
      });
    };
    isPhoneNumber = (field, value) => {
      const isPhoneNumberError = {};
      if (
        value &&
        !/^(1\s|1|)?((\(\d{3}\))|\d{3})(-|\s)?(\d{3})(-|\s)?(\d{4})$/.test(
          value
        )
      ) {
        isPhoneNumberError[field] = "Invalid phone number";
      } else {
        isPhoneNumberError[field] = "";
      }
      this.setState({
        validationErrors: {
          ...this.state.validationErrors,
          ...isPhoneNumberError
        }
      });
    };
    isNumber = (field, value) => {
      const isNumber = {};
      if ((!isNaN(parseFloat(value)) && isFinite(value)) || value === "") {
        isNumber[field] = "";
      } else {
        isNumber[field] = "It's not a number";
      }
      this.setState({
        validationErrors: {
          ...this.state.validationErrors,
          ...isNumber
        }
      });
    };
    isUUID = (field, value) => {
      const isUUID = {};
      if (
        value &&
        !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
          value
        )
      ) {
        isUUID[field] = "It's not valid UUID";
      } else {
        isUUID[field] = "";
      }
      this.setState({
        validationErrors: {
          ...this.state.validationErrors,
          ...isUUID
        }
      });
    };
    //TODO FINISH FUNCTION isGreaterThen
    isGreaterThen(
      obj1 = { field: 0 },
      obj2 = { comparedField: 0 }
    ) {
      const isGreaterThen = {};
      if (Number(obj1.field) < Number(obj2.comparedField)) {
        isGreaterThen.field = `must be greater then ${Object.key(obj2)[0]}`;
      }
      this.setState({
        validationErrors: {
          ...this.state.validationErrors,
          ...isGreaterThen
        }
      });
    }
    handleServerErrors = error => {
      let serverValidationErrors = {};
      error.graphQLErrors.forEach(({ message }) => {
        const parseJSON = JSON.parse(message);
        parseJSON.forEach(obj => {
          serverValidationErrors = { ...serverValidationErrors, ...obj };
        });
      });
      this.setState({
        validationErrors: {
          ...this.state.validationErrors,
          ...serverValidationErrors
        }
      });
    };

    render() {
      // exclude initialErrorValues
      const { initialErrorValues, ...props } = this.props;
      const validationFunctions = {
        isEmail: this.isEmail,
        isRequired: this.isRequired,
        isLength: this.isLength,
        isPhoneNumber: this.isPhoneNumber,
        isNumber: this.isNumber,
        isUUID: this.isUUID,
        hasValidationErrors: this.hasValidationErrors,
        handleServerErrors: this.handleServerErrors
      };
      return (
        <WrappedComponent
          validationErrors={this.state.validationErrors}
          validationFunctions={validationFunctions}
          {...props}
        />
      );
    }
  };
}
export default withValidator;
