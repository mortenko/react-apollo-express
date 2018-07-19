import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import queryString from "query-string";

export default function withPagination(WrappedComponent) {
  class PaginationHoc extends Component {
    constructor(props) {
      super(props);
      const { search } = props.location;
      const parsePageString = queryString.parse(search);
      const parsePageInt = parseInt(parsePageString.page, 10);
      this.state = {
        pageNumber: search ? parsePageInt : 1,
        itemsCountPerPage: 12
      };
    }
    handleChangePage = pageNumber => {
      const { location, push } = this.props.history;
      const newLocation = {
        ...location,
        search: `?page=${pageNumber}`
      };
      push(newLocation);
      this.setState({
        pageNumber
      });
    };

    componentDidMount() {
      const { push, location, location: { search } } = this.props.history;
      if (!search) {
        const newLocation = {
          ...location,
          search: `?page=${this.state.pageNumber}`
        };
        push(newLocation);
      }
    }

    render() {
      const newProps = {
        handleChangePage: pageNumber => this.handleChangePage(pageNumber),
        paginationData: this.state
      };
      return <WrappedComponent {...this.props} {...newProps} />;
    }
  }
  return withRouter(PaginationHoc);
}
withPagination.propTypes = {
  history: PropTypes.object,
  location: PropTypes.object
}.isRequired;
