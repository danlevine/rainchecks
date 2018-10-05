const initialState = {
  currentUser: null,
  userDataLoaded: false
};

const user = (state = initialState, action) => {
  switch (action.type) {
    case "CURRENT_USER_LOGGED_IN":
      return {
        ...state,
        currentUser: action.user,
        userDataLoaded: false
      };
    case "CURRENT_USER_LOGGED_OUT":
      return {
        ...state,
        currentUser: null,
        userDataLoaded: true
      };
    case "USER_DATA_LOADED":
      return {
        ...state,
        userDataLoaded: true
      };
    default:
      return state;
  }
};

export default user;
