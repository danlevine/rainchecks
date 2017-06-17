import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Autosuggest from 'react-autosuggest';
import { addItem, loadSuggestions, updateInputValue, clearSuggestions, loadSuggestionsBegin, maybeUpdateSuggestions } from '../actions';


class AddItem extends Component {
  componentDidMount() {
    document.body.className += document.body.className.length ? ' no-scroll' : 'no-scroll';
  };

  componentWillUnmount() {
    document.body.className = document.body.className.replace(/ ?no-scroll/, '');
  };

  render() {
    let input;
    const value = this.props.suggestions.value;
    const isLoading = this.props.suggestions.isLoading;
    const { addItem, onAddCancel, suggestions, onChange, onSuggestionsFetchRequested, onSuggestionsClearRequested, onSuggestionSelected } = this.props;
    const inputProps = {
      placeholder: 'search movie here',
      value,
      onChange,
      isLoading,
      autoFocus: true,
      className: 'add-item-form__input'
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
          inputProps={inputProps} />
        <button
          type="button"
          className="btn-action btn-round"
          onClick={onAddCancel}>
          <i className="fa fa-times"></i>
        </button>
      </div>
    );
  };
}

const getSuggestionValue = suggestion => suggestion.Title;

const renderInputComponent = inputProps => (
  <div className='add-item-form__input-container'>
    <input {...inputProps} />
    { inputProps.isLoading ?
      <div className="spinner spinner-light">
        <span className="spinner__text">Loading...</span>
      </div>
      : null }
  </div>
);


const renderSuggestion = suggestion => (
  <div className="react-autosuggest__item">
    <h3>{suggestion.title} - <small>{suggestion.release_date}</small></h3>
    <img src={`http://image.tmdb.org/t/p/w185/${suggestion.poster_path}`} />
    <img src={`http://image.tmdb.org/t/p/w185/${suggestion.backdrop_path}`} />
    <p>{suggestion.overview}</p>
  </div>
);

const shouldRenderSuggestions = value => value.trim().length >= 2;

const mapStateToProps = state => {
  const { value, suggestions, isLoading } = state;
  return {
    value,
    suggestions,
    isLoading
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
    onSuggestionSelected(event, { suggestion, suggestionValue, sectionIndex, method }) {
      dispatch(addItem(suggestion));
      dispatch(clearSuggestions());
      dispatch(updateInputValue(''));
    }
  };
};

AddItem = connect(
  mapStateToProps, 
  mapDispatchToProps
)(AddItem);

export default AddItem;