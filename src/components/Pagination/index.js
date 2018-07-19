import React from "react";
import noop from "lodash/noop";
import styles from "./pagination.scss";
import Page from "./Page";
import PropTypes from "prop-types";
import Button from "components/Button";
import { LeftArrow, RightArrow } from "../../assets/material-ui-icons";

// export const defaultPaginationValues = {
//   pageNumber: 1,
//   itemsCountPerPage: 12
// };


class Pagination extends React.Component {
  static buildPages(pagination) {
    const {
      currentPage,
      firstPage,
      lastPage,
      onPageChange,
      totalPages
    } = pagination;
    const pages = [];
    for (let i = firstPage; i <= lastPage; i += 1) {
      if (i !== 1 && i !== totalPages) {
        pages.push(
          <Page
            key={i}
            isActive={i === currentPage}
            pageNumber={i}
            pageText={`${i}`}
            onClick={() => onPageChange(i)}
          />
        );
      }
    }
    if (firstPage > 2) {
      pages.unshift(
        <Page key={"firstDots"} isActive={false} pageText={"\u2026"} />
      );
    }
    pages.unshift(
      <Page
        key={1}
        isActive={currentPage === 1}
        pageNumber={1}
        pageText={`${1}`}
        onClick={() => onPageChange(1)}
      />
    );
    if (lastPage < totalPages && lastPage < totalPages - 1) {
      pages.push(
        <Page key={"LastDots"} isActive={false} pageText={"\u2026"} />
      );
    }
    if (firstPage !== lastPage) {
      pages.push(
        <Page
          key={totalPages}
          isActive={currentPage === totalPages}
          pageNumber={totalPages}
          pageText={`${totalPages}`}
          onClick={() => onPageChange(totalPages)}
        />
      );
    }
    return pages;
  }

  createPagination() {
    const { itemsCountPerPage, totalNumberOfItems, onPageChange } = this.props;
    let pageRangeDisplayed = 3;
    // number of all needed pages
    const totalPages = Math.ceil(totalNumberOfItems / itemsCountPerPage);
    const currentPage = Math.max(
      1,
      Math.min(totalPages, this.props.currentPage)
    );
    // this edge case can occurs when I want to see more pages then it's possible
    if (pageRangeDisplayed > totalPages) {
      pageRangeDisplayed = totalPages;
    }
    let firstPage = null;
    let lastPage = null;
    if (pageRangeDisplayed && pageRangeDisplayed < totalPages) {
      firstPage = Math.max(
        1,
        Math.min(
          currentPage - Math.floor(pageRangeDisplayed / 2, 10),
          totalPages - pageRangeDisplayed + 1
        ),
        1
      );
      lastPage = firstPage + pageRangeDisplayed - 1;
    } else {
      firstPage = 1;
      lastPage = totalPages;
    }
    const isDisableFirst = currentPage !== 1;
    const isDisabledLast = currentPage !== totalPages;
    const nextPage = currentPage + 1;
    const previousPage = currentPage - 1;
    return {
      totalPages,
      currentPage,
      firstPage,
      lastPage,
      previousPage,
      nextPage,
      pageRangeDisplayed,
      onPageChange,
      isDisabledLast,
      isDisableFirst
    };
  }
  render() {
    const pagination = this.createPagination();
    const pages = Pagination.buildPages(pagination);
    const {
      currentPage,
      onPageChange,
      isDisableFirst,
      isDisabledLast,
      totalPages
    } = pagination;
    let leftArrow = null;
    let rightArrow = null;
    if (isDisableFirst) {
      leftArrow = (
        <div
          className={styles.pagination__arrow}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <Button variant="fab" mini color="lightGrey">
            <LeftArrow />
          </Button>
        </div>
      );
    }
    if (isDisabledLast) {
      rightArrow = (
        <div
          className={styles.pagination__arrow}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <Button variant="fab" color="lightGrey" mini>
            <RightArrow />
          </Button>
        </div>
      );
    }

    return (
      Number(totalPages) > 0 && (
        <div className={styles.pagination}>
          {leftArrow}
          <div className={styles.pagination__page}>{pages}</div>
          {rightArrow}
        </div>
      )
    );
  }
}

Pagination.defaultProps = {
  onPageChange: noop
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  itemsCountPerPage: PropTypes.number.isRequired,
  totalNumberOfItems: PropTypes.number.isRequired,
  onPageChange: PropTypes.func
};
export default Pagination;
export { default as PaginationHoc } from "./paginationHoc";