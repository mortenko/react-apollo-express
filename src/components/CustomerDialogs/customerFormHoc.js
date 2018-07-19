import React, { Component } from "react";

export default function withCustomerForm(WrappedComponent) {
  return class extends Component {
    constructor(props) {
      super(props);
      const setInitialFormValues = props.formData
        ? { ...props.formData }
        : { ...props.initialFormValues };
      this.state = {
        ...setInitialFormValues
      };

    }
    handleInputChange = event => {
      if (event.target.files !== null) {
        this.setState({
          customer: {
            ...this.state.customer,
            CustomerPhoto: {
              [event.target.id]: event.target.files[0],
              name: event.target.files[0].name,
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
        newData: this.state,
        handleInputChange: event => this.handleInputChange(event)
      };
      return <WrappedComponent {...this.props} {...newProps} />;
    }
  };
}
