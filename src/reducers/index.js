import { combineReducers } from "redux";
import user from "./user";
import items, { isAppBusy, isAddFormActive } from "./items";
import suggestions from "./suggestions";

const rcApp = combineReducers({
  user,
  items,
  suggestions,
  isAppBusy,
  isAddFormActive
});

export default rcApp;
