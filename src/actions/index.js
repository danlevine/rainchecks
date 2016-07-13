import firebase from 'firebase';



// FIREBASE CONFIG
const config = {
  apiKey: "AIzaSyC0WHChgY9Ahgr7t4NRCQajmL_vG6mtQ1o",
  authDomain: "flickering-fire-3051.firebaseapp.com",
  databaseURL: "https://flickering-fire-3051.firebaseio.com",
  storageBucket: "flickering-fire-3051.appspot.com",
};
firebase.initializeApp(config);
const db = firebase.database();
const dbItems = db.ref('items');

export const initializeItemsList = () => (dispatch) =>
  dbItems.on('value', snapshot => {
    dispatch({
      type: 'FETCH_ITEMS',
      payload: snapshot.val()
    });
  });

  dbItems.on('child_added', snapshot => {
    // Copy item key into object for convenience when iterating through items
    if (!snapshot.val().key) {
      db.ref('items/' + snapshot.key).update({
        key: snapshot.key
      });
    }
  });

export const addItem = (item) => (dispatch) =>
  dbItems.push({name: item});

export const deleteItem = (key) => (dispatch) => 
  dbItems.child(key).remove();