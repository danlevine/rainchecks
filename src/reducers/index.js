import { combineReducers } from 'redux';
import items, { isFetching } from './items';

const rcApp = combineReducers({
  items,
  isFetching
});

export default rcApp;