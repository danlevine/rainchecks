import React, { Component } from "react";
import { connect } from "react-redux";
import Autosuggest from "react-autosuggest";
import {
  addItem,
  loadSuggestions,
  updateInputValue,
  clearSuggestions
} from "../actions";

class AddItem extends Component {
  componentDidMount() {
    document.body.className += document.body.className.length
      ? " no-scroll"
      : "no-scroll";
  }

  componentWillUnmount() {
    document.body.className = document.body.className.replace(
      / ?no-scroll/,
      ""
    );
  }

  render() {
    const value = this.props.suggestions.value;
    const isLoading = this.props.suggestions.isLoading;
    const {
      onAddCancel,
      suggestions,
      onChange,
      onSuggestionsFetchRequested,
      onSuggestionsClearRequested,
      onSuggestionSelected
    } = this.props;
    const inputProps = {
      placeholder: "search movie here",
      value,
      onChange,
      autoFocus: true,
      className: "add-item-form__input",
      isLoading
    };

    return (
      <div className="add-item-form" data-loading={isLoading}>
        <Autosuggest
          suggestions={suggestions.suggestions}
          onSuggestionsFetchRequested={onSuggestionsFetchRequested}
          onSuggestionsClearRequested={onSuggestionsClearRequested}
          onSuggestionSelected={onSuggestionSelected}
          getSuggestionValue={getSuggestionValue}
          renderInputComponent={renderInputComponent}
          renderSuggestion={renderSuggestion}
          shouldRenderSuggestions={shouldRenderSuggestions}
          alwaysRenderSuggestions={true}
          inputProps={inputProps}
        />
        <button
          type="button"
          className="btn-action btn-round"
          onClick={onAddCancel}
        >
          <i className="fa fa-times" />
        </button>
      </div>
    );
  }
}

const getSuggestionValue = suggestion => suggestion.Title;

const renderInputComponent = inputProps => (
  <div className="add-item-form__input-container">
    <input
      placeholder={inputProps.placeholder}
      value={inputProps.value}
      onChange={inputProps.onChange}
      autoFocus={inputProps.autoFocus}
      className={inputProps.className}
    />
    {inputProps.isLoading ? (
      <div className="spinner spinner-light">
        <span className="spinner__text">Loading...</span>
      </div>
    ) : null}
  </div>
);

const renderSuggestion = suggestion => (
  <div className="react-autosuggest__item">
    {suggestion.poster_path && (
      <img
        src={`http://image.tmdb.org/t/p/w185/${suggestion.poster_path}`}
        alt={`Movie poster of ${suggestion.title}`}
      />
    )}
    <div className="react-autosuggest__item-info">
      <h3>{suggestion.title}</h3>
      <span>{suggestion.release_date.substring(0, 4)}</span>
    </div>
    <p className="react-autosuggest__item-overview">{suggestion.overview}</p>
  </div>
);

const shouldRenderSuggestions = value => value.trim().length >= 2;

const mapStateToProps = state => {
  const { value, suggestions } = state;
  return {
    value,
    suggestions
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onChange(event, { newValue }) {
      dispatch(updateInputValue(newValue));
    },
    onSuggestionsFetchRequested({ value }) {
      dispatch(loadSuggestions(value));
    },
    onSuggestionsClearRequested() {
      dispatch(clearSuggestions());
    },
    onSuggestionSelected(event, { suggestion }) {
      dispatch(addItem(suggestion));
      dispatch(clearSuggestions());
      dispatch(updateInputValue(""));
    }
  };
};

const ConnectedAddItem = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddItem);

export default ConnectedAddItem;
