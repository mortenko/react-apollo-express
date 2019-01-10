import React, { Component } from "react";
import PropTypes from "prop-types";
import uuid from "uuid/v4";
import { productDefaultProps, productPropTypes } from "./propTypes";

export default function withProductForm(WrappedComponent) {
  return class extends Component {
    static propTypes = {
      formData: PropTypes.shape({
        product: productPropTypes
      }),
      initialFormValues: PropTypes.shape({
        product: productPropTypes
      }),
      resetErrorValues: PropTypes.func.isRequired,
      validationFunctions: PropTypes.objectOf(PropTypes.func).isRequired
    };

    static defaultProps = {
      initialFormValues: productDefaultProps,
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

    renderBarcode = () => {
      const generateUUID = uuid();
      const { isUUID, isRequired } = this.props.validationFunctions;
      this.setState(
        {
          product: {
            ...this.state.product,
            barcode: generateUUID
          }
        },
        () => {
          isUUID("barcode", generateUUID);
          isRequired({ barcode: generateUUID });
        }
      );
    };

    resetForm = () => {
      const { formData, resetErrorValues } = this.props;
      resetErrorValues();
      if (typeof formData === "undefined") {
        this.setState({
          ...this.props.initialFormValues
        });
      }
    };

    handleInputChange = (id, value, files = null) => {
      if (files !== null && typeof files !== "undefined") {
        this.setState({
          product: {
            ...this.state.product,
            ProductPhoto: {
              [id]: files[0],
              name: files[0].name
            }
          }
        });
      } else if (id === "pricewithoutdph") {
        this.setState(currentState => {
          return {
            product: {
              ...currentState.product,
              pricewithoutdph: value,
              pricewithdph: value && (value * 1.2).toFixed(2)
            }
          };
        });
      } else {
        this.setState(currentState => {
          return {
            product: {
              ...currentState.product,
              [id]: value
            }
          };
        });
      }
    };

    render() {
      const stateProps = {
        newData: this.state
      };
      const funcProps = {
        calculatePriceWithdph: pricewithoutdph =>
          this.calculatePriceWithdph(pricewithoutdph),
        handleInputChange: (id, value, files) =>
          this.handleInputChange(id, value, files),
        renderBarcode: () => this.renderBarcode(),
        resetForm: () => this.resetForm()
      };
      return (
        <WrappedComponent {...this.props} {...stateProps} {...funcProps} />
      );
    }
  };
}
