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
      })
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
      this.setState({
        ...this.props.initialFormValues
      });
    }
    handleInputChange = event => {
      if (event.target.files !== null) {
        this.setState({
          customer: {
            ...this.state.customer,
            CustomerPhoto: {
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
            customer: {
              ...currentState.customer,
              [name]: value
            }
          };
        });
      }
    };
    render() {
      const newProps = {
        handleInputChange: event => this.handleInputChange(event),
        newData: this.state,
        resetForm: () => this.resetForm()
      };
      return <WrappedComponent {...this.props} {...newProps} />;
    }
  };
}
