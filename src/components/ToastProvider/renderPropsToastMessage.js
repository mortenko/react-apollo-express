import React, { Component } from "react";
import PropTypes from "prop-types";
import uniqueId from "lodash/uniqueId";

export default class RenderPropsToastMessage extends Component {
  removeToastMessage = id => {
    const { toasts } = this.state;
    const filteredToasts = toasts.filter(obj => {
      return obj.id !== id;
    });
    this.setState(
      {
        toasts: filteredToasts
      },
      () => {
        console.log("removeToastMessage", this.state);
      }
    );
  };
  addToastMessage = (toastProps = {}) => {
    toastProps["id"] = uniqueId();
    this.setState(
      {
        toasts: this.state.toasts.concat([toastProps])
      },
      () => {
        console.log("addToastMessage", this.state);
      }
    );
  };
  state = {
    toasts: [],
    addToastMessage: this.addToastMessage,
    removeToastMessage: this.removeToastMessage
  };

  render() {
    return <div>{this.props.children(this.state)}</div>;
  }
}

RenderPropsToastMessage.propTypes = {
  children: PropTypes.func
};

