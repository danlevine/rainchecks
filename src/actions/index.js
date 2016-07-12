export const addItem = (name) => {
  return {
    type: 'ADD_ITEM',
    name
  } 
};

export const deleteItem = (id) => {
  return {
    type: 'DELETE_ITEM',
    id
  } 
};

export const fetchItems = () => {
  return {
    type: 'FETCH_ITEMS'
  };
};