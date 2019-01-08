import React from "react";
import { ApolloConsumer } from "react-apollo";
import TextField from "@material-ui/core/TextField";
import PropTypes from "prop-types";
import styles from "./autocomplete.scss";
import { ArrowDropDown } from "../../assets/material-ui-icons";

const AutoCompleteInput = ({
  debounceInputChange,
  id,
  inputRef,
  handleInputChange,
  handleKeyPressed,
  label,
  showAllResults,
  value
}) => (
  <ApolloConsumer>
    {client => (
      <div>
        <TextField
          className={styles.autocomplete__input}
          fullWidth
          id={id}
          inputRef={inputRef}
          label={label}
          margin="normal"
          onKeyDown={handleKeyPressed}
          onChange={event => {
            event.persist();
            handleInputChange(event);
            debounceInputChange(client, event.target.id, event.target.value);
          }}
          placeholder={`filter by ${id}`}
          value={value}
          variant="outlined"
        />
        <div
          className={styles.autocomplete__icon}
          onClick={() => showAllResults(client, id, ".*")}
        >
          <ArrowDropDown />
        </div>
      </div>
    )}
  </ApolloConsumer>
);

AutoCompleteInput.propTypes = {
  debounceInputChange: PropTypes.func.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleKeyPressed: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  inputRef: PropTypes.instanceOf(Element).isRequired,
  label: PropTypes.string.isRequired,
  showAllResults: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired
};

export default AutoCompleteInput;
