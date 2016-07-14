import { combineReducers } from 'redux';
import items, { isFetching, isAddFormActive } from './items';

const rcApp = combineReducers({
  items,
  isFetching,
  isAddFormActive
});

export default rcApp;