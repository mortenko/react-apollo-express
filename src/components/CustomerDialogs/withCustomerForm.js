import React, { Component } from "react";
import PropTypes from "prop-types";
import { customerPropTypes, customerDefaultProps } from "./propTypes";

export default function withCustomerForm(WrappedComponent) {
  return class extends Component {
    static propTypes = {
      formData: PropTypes.shape({
        customer: customerPropTypes
      }),
      initialFormValues: PropTypes.shape({
        customer: customerDefaultProps
      }),
      resetErrorValues: PropTypes.func.isRequired
    };

    static defaultProps = {
      initialFormValues: customerDefaultProps,
      formData: undefined
    };

    constructor(props) {
      super(props);
      const setInitialFormValues = props.formData
        ? { ...props.formData }
        : { ...props.initialFormValues };
      this.state = {
        ...setInitialFormValues
      };
    }

    resetForm = () => {
      this.props.resetErrorValues();
      this.setState({
        ...this.props.initialFormValues
      });
    };

    handleInputChange = (id, value, files = null) => {
      if (files !== null && typeof files !== "undefined") {
        this.setState({
          customer: {
            ...this.state.customer,
            CustomerPhoto: {
              [id]: files[0],
              name: files[0].name
            }
          }
        });
      } else {
        this.setState(currentState => {
          return {
            customer: {
              ...currentState.customer,
              [id]: value
            }
          };
        });
      }
    };

    render() {
      const state = {
        newData: this.state
      };
      const funcProps = {
        handleInputChange: (id, value, files) =>
          this.handleInputChange(id, value, files),
        resetForm: () => this.resetForm()
      };
      return <WrappedComponent {...state} {...funcProps} />;
    }
  };
}
