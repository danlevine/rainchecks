const initialState = {
  currentUser: null,
  userStateChecked: false,
  isPendingAuthRedirect: false
};

const user = (state = initialState, action) => {
  switch (action.type) {
    case "EXISTING_USER_DETECTED_AND_LOGGED_IN":
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

export const isPendingAuthRedirect = (state = false, action) => {
  switch (action.type) {
    case "AUTH_REDIRECT_PENDING":
      return true;
    case "EXISTING_USER_DETECTED_AND_LOGGED_IN":
      return false;
    default:
      return state;
  }
};
