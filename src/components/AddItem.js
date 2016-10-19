import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Autosuggest from 'react-autosuggest';
import { addItem, loadSuggestions, updateInputValue, clearSuggestions, loadSuggestionsBegin, maybeUpdateSuggestions } from '../actions';


class AddItem extends Component {
  render() {
    let input;
    const value = this.props.suggestions.value;
    const isLoading = this.props.suggestions.isLoading;
    const { addItem, onAddCancel, suggestions, onChange, onSuggestionsFetchRequested, onSuggestionsClearRequested, onSuggestionSelected } = this.props;
    const inputProps = {
      placeholder: 'type move here',
      value,
      onChange,
      autoFocus: true,
      className: 'add-item-form__input'
    };
    const status = (isLoading ? 'Loading...' : 'Type to load suggestions');

    return (
      <div className="add-item-form">
        <form onSubmit={e => {
          e.preventDefault();
          if (!input.value.trim()) {
            return;
          }
          onAddSubmit(input.value);
        }}>
          <Autosuggest
            suggestions={suggestions.suggestions}
            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
            onSuggestionsClearRequested={onSuggestionsClearRequested}
            onSuggestionSelected={onSuggestionSelected}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            shouldRenderSuggestions={shouldRenderSuggestions}
            alwaysRenderSuggestions={true}
            inputProps={inputProps} />
          <div className="add-item-form__footer">
            <button type="submit">
              Add
            </button>
            <button
              type="button" 
              onClick={onAddCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  };
}

function getSuggestionValue(suggestion) {
  return suggestion.Title;
}

function renderSuggestion(suggestion) {
  return (
    <div className="react-autosuggest__item">
      <h3>{suggestion.Title} - <small>{suggestion.Year}</small></h3>
    </div>
  );
}

function shouldRenderSuggestions(value) {
  return value.trim().length >= 0;
}

function mapStateToProps(state) {
  const { value, suggestions, isLoading } = state;
  return {
    value,
    suggestions,
    isLoading
  };
}

function mapDispatchToProps(dispatch) {
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
    onSuggestionSelected(event, { suggestion, suggestionValue, sectionIndex, method }) {
      dispatch(addItem(suggestion));
      dispatch(clearSuggestions());
      dispatch(updateInputValue(''));
    }
  };
}

AddItem = connect(
  mapStateToProps, 
  mapDispatchToProps
)(AddItem);

export default AddItem;