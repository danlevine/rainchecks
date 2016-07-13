import _ from 'lodash';



const items = (state = {}, action) => {
  switch (action.type) {
    case 'FETCH_ITEMS':
      return action.payload;
  }

  return state;
};

export default items;