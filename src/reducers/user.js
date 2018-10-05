const initialState = {
  currentUser: null,
  userStatusChecked: false
};

const user = (state = initialState, action) => {
  switch (action.type) {
    case "CURRENT_USER_LOGGED_IN":
      return {
        ...state,
        currentUser: action.user,
        userStatusChecked: true
      };
    case "CURRENT_USER_LOGGED_OUT":
      return {
        ...state,
        currentUser: null,
        userStatusChecked: true
      };
    default:
      return state;
  }
};

export default user;
