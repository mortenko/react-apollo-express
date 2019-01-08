import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import AutoCompleteInput from "./autocompleteInput";
import styles from "./autocomplete.scss";
import Suggestions from "./renderSuggestion";

export default class AutoComplete extends Component {
  static propTypes = {
    debounceInputChange: PropTypes.func.isRequired,
    filterBy: PropTypes.string.isRequired,
    filterResult: PropTypes.array,
    handleInputChange: PropTypes.func.isRequired,
    handleSelectChange: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
    query: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
  };

  static defaultProps = {
    filterResult: []
  };

  state = {
    isOpen: false,
    selectedValue: "",
    cursor: 0
  };

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  handleClickOutside = event => {
    if (
      this.setAutoCompleteDivRef &&
      !this.setAutoCompleteDivRef.contains(event.target)
    ) {
      this.setState({
        isOpen: false
      });
    }
  };

  setAutocompleteRef = node => {
    this.setAutoCompleteDivRef = node;
  };

  handleInputChange = event => {
    const { isOpen } = this.state;
    if (!isOpen) {
      this.setState({
        isOpen: !isOpen
      });
    }
    this.props.handleInputChange(event);
  };

  handleSelectChange = (filterBy, value) => {
    this.setState({
      isOpen: false,
      selectedValue: value ? value : ""
    });
    this.props.handleSelectChange(filterBy, value);
  };

  handleKeyPressed = event => {
    const { cursor } = this.state;
    const { filterResult } = this.props;
    if (event.keyCode === 38 && cursor > 0) {
      this.setState({
        cursor: cursor - 1
      });
    } else if (event.keyCode === 40 && cursor < filterResult.length - 1) {
      this.setState({
        cursor: cursor + 1
      });
    } else if (event.keyCode === 13) {
      const foundedObj = filterResult.find(
        (obj, index) => (index === cursor ? obj : null)
      );
      // foundedObj should be undefined when input is empty and enter is pressed
      if (foundedObj) {
        this.handleSelectChange(this.props.filterBy, foundedObj.value);
      }
    }
  };
  showAllResults = (client, id, value) => {
    this.props.debounceInputChange(client, id, value);
    this.autoCompleteInputRef.focus();
    this.setState({
      isOpen: !this.state.isOpen
    });
  };
  render() {
    const {
      filterBy,
      value,
      label,
      filterResult,
      debounceInputChange
    } = this.props;

    const { isOpen, cursor, selectedValue } = this.state;
    return (
      <Fragment>
        <div ref={this.setAutocompleteRef} className={styles.autocomplete}>
          <AutoCompleteInput
            debounceInputChange={debounceInputChange}
            handleInputChange={this.handleInputChange}
            handleKeyPressed={this.handleKeyPressed}
            id={filterBy}
            inputRef={input => (this.autoCompleteInputRef = input)}
            label={label}
            showAllResults={this.showAllResults}
            value={value}
          />
          {isOpen && (
            <Suggestions
              cursor={cursor}
              filterBy={filterBy}
              handleSelectChange={this.handleSelectChange}
              selected={selectedValue}
              suggestions={filterResult}
            />
          )}
        </div>
      </Fragment>
    );
  }
}
