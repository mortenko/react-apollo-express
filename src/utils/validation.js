import React, { Component } from "react";
import PropTypes from "prop-types";
import { forIn, has } from "lodash";
import { toastPropTypes, toastDefaultProps } from "../globalProps";

function withValidator(WrappedComponent) {
  return class extends Component {
    static propTypes = {
      initialErrorValues: PropTypes.object.isRequired,
      toast: toastPropTypes
    };
    static defaultProps = {
      toast: toastDefaultProps
    };

    state = {
      validationErrors: this.props.initialErrorValues
    };

    hasValidationErrors = () => {
      const { validationErrors } = this.state;
      let hasErrors = false;
      for (let key in validationErrors) {
        const validationRule = validationErrors[key];
        if (Array.isArray(validationRule) && validationRule.length > 0) {
          hasErrors = true;
          break;
        } else if (
          typeof validationRule === "object" &&
          Object.keys(validationRule).length > 0
        ) {
          hasErrors = true;
          break;
        }
      }
      return hasErrors;
    };

    resetErrorValues = () => {
      const validationErrors = forIn(
        this.props.initialErrorValues,
        (value, key, obj) => {
          if (Array.isArray(value)) {
            obj[key] = [];
          } else if (typeof value === "object") {
            obj[key] = {};
          }
        }
      );
      this.setState({
        validationErrors
      });
    };

    printErrorMessage = fieldType => {
      if (Array.isArray(fieldType)) {
        return fieldType.map(obj => {
          return Object.values(obj)[0];
        });
      } else if (typeof fieldType === "object") {
        return Object.values(fieldType)[0];
      }
    };

    removeValidationMessage = (fieldName, validationRule = "") => {
      const { validationErrors } = this.state;
      for (let validationField in validationErrors) {
        if (
          Array.isArray(validationErrors[validationField]) &&
          validationField === fieldName
        ) {
          validationErrors[validationField] = validationErrors[
            validationField
          ].filter(rule => {
            return Object.keys(rule)[0] !== validationRule;
          });
        } else if (
          // if validation property is string, just assign error message object
          typeof validationErrors[validationField] === "object" &&
          validationField === fieldName
        ) {
          validationErrors[validationField] = {};
        }
      }
      this.setState({
        validationErrors: {
          ...this.state.validationErrors,
          ...validationErrors
        }
      });
    };

    addNewValidationMessage = (fieldName = "", errorMessageObj) => {
      const { validationErrors } = this.state;
      /* if valdiationErrors object does not contain error property add it 
       f.e if you add new product into order ... you need to add new fieldName into validationErrors  
      */
      if (!has(validationErrors, fieldName)) {
        validationErrors[fieldName] = [];
      }
      const [messageKey, messageValue] = Object.entries(errorMessageObj)[0];
      // loop through the initial validationError object
      for (let key in validationErrors) {
        // check if key property of object is an array and if match key name
        if (Array.isArray(validationErrors[key]) && key === fieldName) {
          let hasValidationRule = true;
          /* check if validation error exist in array and if true set hasValidationError to false
            and break cycle (improving performance)
          */
          for (let arrayValue of validationErrors[key]) {
            if (Object.keys(arrayValue)[0] === messageKey) {
              hasValidationRule = false;
              break;
            }
          }
          // if hasValidationError is true -> there is not validation message with this key so add new one
          hasValidationRule &&
            validationErrors[key].push({ [messageKey]: messageValue });
          break;
        } else if (
          // if validation property is object, just assign error message object
          typeof validationErrors[key] === "object" &&
          key === fieldName
        ) {
          validationErrors[key] = { [messageKey]: messageValue };
        }
      }
      this.setState({
        validationErrors
      });
    };

    isRequired = stateObj => {
      let isEmpty = false;
      for (let fieldName in stateObj) {
        if (stateObj[fieldName] === null || stateObj[fieldName].length === 0) {
          this.addNewValidationMessage(fieldName, {
            isRequired: `${fieldName} is Required`
          });
          isEmpty = true;
        } else {
          this.removeValidationMessage(fieldName, "isRequired");
        }
      }
      return isEmpty;
    };

    isEmail = (field, value) => {
      if (value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
        this.addNewValidationMessage(field, {
          isEmail: "E-mail address is not valid"
        });
      } else {
        this.removeValidationMessage(field, "isEmail");
      }
    };

    isLength = (min, max) => (field, value) => {
      if ((value && value.length < min) || value.length > max) {
        this.addNewValidationMessage(field, {
          isLength: `${field} must be at least ${min} characters or maximum ${max}`
        });
      } else {
        this.removeValidationMessage(field, "isLength");
      }
    };

    isPhoneNumber = (field, value) => {
      if (
        !/^(1\s|1|)?((\(\d{3}\))|\d{3})(-|\s)?(\d{3})(-|\s)?(\d{4})$/.test(
          value
        ) &&
        value !== ""
      ) {
        this.addNewValidationMessage(field, {
          isMobilePhone: "Invalid phone number"
        });
      } else {
        this.removeValidationMessage(field, "isMobilePhone");
      }
    };

    isNumber = (field, value) => {
      if ((!isNaN(parseFloat(value)) && isFinite(value)) || value === "") {
        this.removeValidationMessage(field, "isNumber");
      } else {
        this.addNewValidationMessage(field, { isNumber: "It's not a number" });
      }
    };

    isUUID = (field, value) => {
      if (
        value &&
        !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
          value
        )
      ) {
        this.addNewValidationMessage(field, { isUUID: "It's not valid UUID" });
      } else {
        this.removeValidationMessage(field, "isUUID");
      }
    };
    //TODO maybe in future implement isLessThen
    isGreaterThen = (obj1, obj2) => {
      const obj1Val = Object.values(obj1)[0];
      const obj2Val = Object.values(obj2)[0];
      if (Number(obj1Val) > Number(obj2Val) && obj2Val !== "") {
        this.addNewValidationMessage(Object.keys(obj2)[0], {
          isGreaterThen: `${Object.keys(obj2)[0]} must be greater then ${
            Object.keys(obj1)[0]
          }`
        });
      } else {
        this.removeValidationMessage(Object.keys(obj2)[0], "isGreaterThen");
      }
    };
    /**
     * handle server errors
     * @param errors - error (it could be networkError, graphqlError or general error)
     * I'm distinguish three errors types:
     * 1) graphqlErrors -> 1) validationErrors or all other graphQLErrors
     * 2)networkErrors due to some network connection
     * 3) all other errors f.e. some errors that happen on frontend
     */

    handleServerErrors = errors => {
      const { toast } = this.props;
      if (errors.graphQLErrors) {
        const [
          {
            message,
            path,
            extensions: {
              code,
              exception: { serverResponse }
            }
          }
        ] = errors.graphQLErrors;

        if (code === "BAD_USER_INPUT") {
          const { validationErrors } = serverResponse;
          this.setState({
            validationErrors: {
              ...this.state.validationErrors,
              ...validationErrors
            }
          });
        } else {
          toast.addToastMessage({
            content: `[graphQLErrors]: Message: ${message}, code: ${code}, path: ${path}`,
            delay: 5000,
            type: "danger"
          });
        }
      }
      if (errors.networkError) {
        const { name, message } = errors.networkError;
        toast.addToastMessage({
          content: `[NetworkError]: ErrorType: ${name}, Message: ${message} `,
          delay: 5000,
          type: "danger"
        });
      }
      if (errors) {
        const { name, message } = errors;
        toast.addToastMessage({
          content: `ErrorType: ${name}, Message: ${message}`,
          delay: 5000,
          type: "danger"
        });
      }
    };

    render() {
      // exclude initialErrorValues
      const { initialErrorValues, ...props } = this.props;
      const validationState = {
        validationErrors: this.state.validationErrors
      };
      const validationFunctions = {
        isEmail: this.isEmail,
        isGreaterThen: this.isGreaterThen,
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
          resetErrorValues={this.resetErrorValues}
          printErrorMessage={this.printErrorMessage}
          validationFunctions={validationFunctions}
          validationState={validationState}
          {...props}
        />
      );
    }
  };
}

export default withValidator;
