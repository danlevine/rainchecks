import { combineReducers } from "redux";
import user from "./user";
import items, { isAppBusy, isAddFormActive, isAddingItem } from "./items";
import suggestions from "./suggestions";
import messenger from "./messenger";

const rcApp = combineReducers({
  user,
  items,
  suggestions,
  messenger,
  isAppBusy,
  isAddFormActive,
  isAddingItem
});

export default rcApp;
