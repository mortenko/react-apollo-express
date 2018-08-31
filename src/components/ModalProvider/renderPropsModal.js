import React, { Component } from "react";
import PropTypes from "prop-types";

export default class RenderPropsModal extends Component {
  constructor() {
    super();
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.state = {
      currentModal: "",
      isOpen: false,
      data: {},
      openModal: this.openModal,
      closeModal: this.closeModal
    };
  }

  openModal(modalType = "", data = {}) {
    this.setState({
      currentModal: modalType,
      data,
      isOpen: true
    });
  }

  closeModal() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  render() {
    return <div> {this.props.children(this.state)} </div>;
  }
}
RenderPropsModal.propTypes = {
  children: PropTypes.func.isRequired
};
