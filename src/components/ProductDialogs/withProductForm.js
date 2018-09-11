import React, { Component } from "react";
import PropTypes from "prop-types";
import uuid from "uuid/v4";

export default function withProductForm(WrappedComponent) {
  return class extends Component {
    static propTypes = {
      formData: PropTypes.shape({
        product: PropTypes.shape({
          name: PropTypes.string,
          description: PropTypes.number,
          pricewithoutdph: PropTypes.number,
          pricewithdph: PropTypes.number,
          barcode: PropTypes.string,
          ProductPhoto: PropTypes.shape({
            photo: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
            name: PropTypes.string
          })
        })
      }),
      initialFormValues: PropTypes.shape({
        product: PropTypes.shape({
          name: PropTypes.string,
          description: PropTypes.number,
          pricewithoutdph: PropTypes.number,
          pricewithdph: PropTypes.number,
          barcode: PropTypes.string,
          ProductPhoto: PropTypes.shape({
            photo: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
            name: PropTypes.string
          })
        })
      }),
      validationFunctions: PropTypes.objectOf(PropTypes.func).isRequired
    };
    static defaultProps = {
      initialFormValues: {
        productname: "",
        description: "",
        pricewithoutdph: "",
        pricewithdph: "",
        barcode: "",
        ProductPhoto: {
          photo: null,
          name: ""
        }
      },
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
      this.setState(
        {
          product: {
            ...this.state.product,
            barcode: generateUUID
          }
        },
        () => {
          this.props.validationFunctions.isUUID("barcode", generateUUID);
        }
      );
    };
    resetForm = () => {
      this.setState({
        ...this.props.initialFormValues
      });
    };
    handleInputChange = ({ target: { files, id, value } }) => {
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
      }
      else if (id === "pricewithoutdph") {
        this.setState(currentState => {
          return {
            product: {
              ...currentState.product,
              pricewithoutdph: value,
              pricewithdph: value && (value * 1.2).toFixed(2)
            }
          };
        });
      }
      else {
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
      const newProps = {
        calculatePriceWithdph: pricewithoutdph =>
          this.calculatePriceWithdph(pricewithoutdph),
        handleInputChange: event => this.handleInputChange(event),
        newData: this.state,
        renderBarcode: () => this.renderBarcode(),
        resetForm: () => this.resetForm()
      };
      return <WrappedComponent {...this.props} {...newProps} />;
    }
  };
}
