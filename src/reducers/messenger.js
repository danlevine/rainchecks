const initialState = {
  title: null,
  message: null,
  visible: false
};

const messenger = (state = initialState, action) => {
  switch (action.type) {
    case "POP_MESSENGER":
      return {
        ...state,
        title: action.title,
        message: action.message,
        visible: true
      };
    case "HIDE_MESSENGER":
      return {
        ...state,
        title: null,
        message: null,
        visible: false
      };
    default:
      return state;
  }
};

export default messenger;
