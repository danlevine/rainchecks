const initialState = {
  currentUser: null
};

const user = (state = initialState, action) => {
  switch (action.type) {
    case "CURRENT_USER_LOGGED_IN":
      return {
        ...state,
        currentUser: action.user
      };
    case "CURRENT_USER_LOGGED_OUT":
      return {
        ...state,
        currentUser: null
      };
    default:
      return state;
  }
};

export default user;
