import { combineReducers } from "redux";
import user from "./user";
import items, { isFetching, isAddFormActive } from "./items";
import suggestions from "./suggestions";

const rcApp = combineReducers({
  user,
  items,
  suggestions,
  isFetching,
  isAddFormActive
});

export default rcApp;
