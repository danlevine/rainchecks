import _ from "lodash";

const initialState = {
  items: [],
  filteredItems: [],
  filter: "unwatched",
  currentList: ""
};

const items = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_ITEMS_SUCCESS":
      return {
        ...state,
        items: action.payload,
        filteredItems: _.filter(
          action.payload,
          item =>
            state.filter === "unwatched"
              ? !item.currentListMetadata.watched
              : item.currentListMetadata.watched
        ),
        currentList: action.currentList
      };
    case "FILTER_DISPLAY_ALL":
      return {
        ...state,
        filteredItems: state.items,
        filter: "all"
      };
    case "FILTER_DISPLAY_UNWATCHED":
      return {
        ...state,
        filteredItems: _.filter(
          state.items,
          item => !item.currentListMetadata.watched
        ),
        filter: "unwatched"
      };
    case "FILTER_DISPLAY_WATCHED":
      return {
        ...state,
        filteredItems: _.filter(
          state.items,
          item => item.currentListMetadata.watched
        ),
        filter: "watched"
      };
    case "FILTER_DISPLAY_TOGGLE":
      if (state.filter === "unwatched") {
        return {
          ...state,
          filteredItems: _.filter(
            state.items,
            item => item.currentListMetadata.watched
          ),
          filter: "watched"
        };
      } else if (state.filter === "watched") {
        return {
          ...state,
          filteredItems: _.filter(
            state.items,
            item => !item.currentListMetadata.watched
          ),
          filter: "unwatched"
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
    case "ADD_ITEM_FORM_CLOSE":
    case "ADD_ITEM_BEGIN":
    case "FETCH_ITEMS_SUCCESS":
      return false;
    default:
      return state;
  }
};

export const isAddingItem = (state = false, action) => {
  switch (action.type) {
    case "ADD_ITEM_BEGIN":
      return true;
    case "FETCH_ITEMS_SUCCESS":
      return false;
    default:
      return state;
  }
};
