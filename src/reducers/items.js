import _ from "lodash";

const initialState = {
  item: [],
  filteredItems: [],
  filter: "active"
};

const items = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_ITEMS_SUCCESS":
      return {
        ...state,
        items: action.payload,
        filteredItems: _.filter(
          action.payload,
          item => item.status === state.filter
        )
      };
    case "FILTER_DISPLAY_ALL":
      return {
        ...state,
        filteredItems: state.items,
        filter: "all"
      };
    case "FILTER_DISPLAY_ACTIVE":
      return {
        ...state,
        filteredItems: _.filter(state.items, item => item.status === "active"),
        filter: "active"
      };
    case "FILTER_DISPLAY_ARCHIVED":
      return {
        ...state,
        filteredItems: _.filter(
          state.items,
          item => item.status === "archived"
        ),
        filter: "archived"
      };
    case "FILTER_DISPLAY_TOGGLE":
      if (state.filter === "active") {
        return {
          ...state,
          filteredItems: _.filter(
            state.items,
            item => item.status === "archived"
          ),
          filter: "archived"
        };
      } else if (state.filter === "archived") {
        return {
          ...state,
          filteredItems: _.filter(
            state.items,
            item => item.status === "active"
          ),
          filter: "active"
        };
      } else {
        return { ...state };
      }
    default:
      return state;
  }
};

export default items;

export const isAppBusy = (state = true, action) => {
  switch (action.type) {
    case "AUTH_REDIRECT_PENDING":
    case "FETCH_ITEMS_SUCCESS":
    case "FETCH_ITEMS_FAILURE":
    case "NO_EXISTING_USER_DETECTED":
      return false;
    default:
      return state;
  }
};

export const isAddFormActive = (state = false, action) => {
  switch (action.type) {
    case "ADD_ITEM_FORM_ACTIVATE":
      return true;
    case "ADD_ITEM_FORM_CANCEL":
    case "FETCH_ITEMS_SUCCESS":
      return false;
    default:
      return state;
  }
};
