const initialState = {
  currentUser: null,
  userStateChecked: false
};

const user = (state = initialState, action) => {
  switch (action.type) {
    case "USER_DATA_LOADED":
      return {
        ...state,
        currentUser: action.user,
        userStateChecked: true
      };
    case "NO_EXISTING_USER_DETECTED":
      return {
        ...state,
        currentUser: null,
        userStateChecked: true
      };
    default:
      return state;
  }
};

export default user;
