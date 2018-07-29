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
      })
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
      this.setState({
        product: {
          ...this.state.product,
          barcode: generateUUID
        }
      },() => {
        this.props.validationFunctions.isUUID("barcode", generateUUID);
      });
    };
    resetForm = () => {
      this.setState({
        ...this.props.initialFormValues
      })
  };
    handleInputChange = event => {
      if (
        event.target.files !== null &&
        typeof event.target.files !== "undefined"
      ) {
        this.setState({
          product: {
            ...this.state.product,
            ProductPhoto: {
              [event.target.id]: event.target.files[0],
              name: event.target.files[0].name
            }
          }
        });
      } else {
        const name = event.target.id;
        const value = event.target.value;
        this.setState(currentState => {
          return {
            product: {
              ...currentState.product,
              [name]: value
            }
          };
        });
      }
    };
    render() {
      const newProps = {
        newData: this.state,
        handleInputChange: event => this.handleInputChange(event),
        renderBarcode: () => this.renderBarcode(),
        resetForm: () => this.resetForm()
      };
      return <WrappedComponent {...this.props} {...newProps} />;
    }
  };
}
