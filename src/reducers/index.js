import { combineReducers } from 'redux';
import items, { isFetching, isAddFormActive } from './items';
import suggestions from './suggestions';

const rcApp = combineReducers({
  items,
  suggestions,
  isFetching,
  isAddFormActive
});

export default rcApp;