import React, { Fragment } from "react";
import PropTypes from "prop-types";
import styles from "./autocomplete.scss";
import classnames from "classnames";

const Suggestions = ({
  suggestions,
  cursor,
  filterBy,
  handleSelectChange,
  selected
}) => (
  <Fragment>
    {suggestions.length > 0 ? (
      <div className={styles.autocomplete__result}>
        {suggestions.map(({ id, value }, index) => {
          const isActive = cursor === index;
          const isSelected = selected === value;
          return (
            <div
              key={id}
              id={index}
              className={classnames(
                styles.autocomplete__result__item,
                isSelected && styles["autocomplete__result__item--selected"],
                isActive && styles["autocomplete__result__item--active"]
              )}
              onClick={() => handleSelectChange(filterBy, value)}
            >
              {value}
            </div>
          );
        })}
      </div>
    ) : (
      <strong>NO MATCHED RESULT FOUND</strong>
    )}
  </Fragment>
);

Suggestions.propTypes = {
  cursor: PropTypes.number.isRequired,
  filterBy: PropTypes.string.isRequired,
  handleSelectChange: PropTypes.func.isRequired,
  selected: PropTypes.string.isRequired,
  suggestions: PropTypes.arrayOf(
    PropTypes.shape({ id: PropTypes.number, value: PropTypes.string })
  ).isRequired
};

export default Suggestions;
