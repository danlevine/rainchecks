const items = (state = {}, action) => {
  switch (action.type) {
    case 'FETCH_ITEMS_SUCCESS':
      return action.payload;
  }

  return state;
};

export default items;

export const isFetching = (state = false, action) => {
 switch (action.type) {
   case 'FETCH_ITEMS_REQUEST':
     return true;
   case 'FETCH_ITEMS_SUCCESS':
   case 'FETCH_ITEMS_FAILURE':
     return false;
   default:
     return state;
 }
};