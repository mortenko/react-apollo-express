import React from "react";
import PropTypes from "prop-types";
import noop from "lodash/noop";
import styles from "./pagination.scss";
import classnames from "classnames";

class PaginationPage extends React.Component {
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(e) {
    const { isActive, pageNumber, onClick } = this.props;
    e.preventDefault();
    if (isActive) {
      return;
    }
    onClick(pageNumber);
  }
  render() {
    const { isActive, pageText } = this.props;
    return (
      <div className={classnames(styles.page, isActive ? styles["page--active"]:styles["page--noactive"])} onClick={this.handleClick} isActive={isActive}>
        {pageText}
      </div>
    );
  }
}
PaginationPage.defaultProps = {
  isActive: false,
  pageNumber: 1,
  onClick: noop
};

PaginationPage.propTypes = {
  onClick: PropTypes.func.isRequired,
  pageText: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
  pageNumber: PropTypes.number
};

export default PaginationPage;
