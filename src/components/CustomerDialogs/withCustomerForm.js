import React, { Component } from "react";
import PropTypes from "prop-types";

export default function withCustomerForm(WrappedComponent) {
  return class extends Component {
    static propTypes = {
      formData: PropTypes.shape({
        customer: PropTypes.shape({
          firstname: PropTypes.string,
          lastname: PropTypes.string,
          phone: PropTypes.string,
          email: PropTypes.string,
          CustomerPhoto: PropTypes.shape({
            photo: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
            name: PropTypes.string
          })
        })
      }),
      initialFormValues: PropTypes.shape({
        customer: PropTypes.shape({
          firstname: PropTypes.string,
          lastname: PropTypes.string,
          phone: PropTypes.string,
          email: PropTypes.string,
          CustomerPhoto: PropTypes.shape({
            photo: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
            name: PropTypes.string
          })
        })
      }),
      resetErrorValues: PropTypes.func.isRequired
    };
    static defaultProps = {
      initialFormValues: {
        firstname: "",
        lastname: "",
        phone: "",
        email: "",
        CustomerPhoto: {
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
      const newProps = {
        handleInputChange: (id, value, files) =>
          this.handleInputChange(id, value, files),
        newData: this.state,
        resetForm: () => this.resetForm()
      };
      return <WrappedComponent {...this.props} {...newProps} />;
    }
  };
}
