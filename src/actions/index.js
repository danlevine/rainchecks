import axios from 'axios';
import firebase from 'firebase';
import _ from 'lodash';



// FIREBASE CONFIG
const config = {
  apiKey: 'AIzaSyC0WHChgY9Ahgr7t4NRCQajmL_vG6mtQ1o',
  authDomain: 'flickering-fire-3051.firebaseapp.com',
  databaseURL: 'https://flickering-fire-3051.firebaseio.com',
  storageBucket: 'flickering-fire-3051.appspot.com',
};
firebase.initializeApp(config);
const db = firebase.database();
const dbItems = db.ref('items');

export const initializeItemsList = () => (dispatch) => {

  dispatch({
    type: 'FETCH_ITEMS_REQUEST'
  });

  dbItems.on('value', snapshot => {
    dispatch({
      type: 'FETCH_ITEMS_SUCCESS',
      payload: snapshot.val()
    });
  });

  dbItems.on('child_added', snapshot => {

    const currentItem = snapshot.val();

    // Copy item key into object for convenience when iterating through items
    if (!currentItem.key) {
      db.ref('items/' + snapshot.key).update({
        key: snapshot.key
      });
    }

    if (!currentItem.lastFetched) {
      let omdbEndpoint = 'http://www.omdbapi.com/?t=' + currentItem.name.replace(/\s/g, '+') + '&y=&plot=short&r=json&type=movie&tomatoes=true';

      axios(omdbEndpoint).then(({data}) => {
        let appendedProps = {
          lastFetched: _.now(),
          year: data.Year,
          rated: data.Rated,
          runtime: data.Runtime,
          genre: data.Genre,
          director: data.Director,
          actors: data.Actors,
          description: data.Plot,
          country: data.Country,
          awards: data.Awards,
          poster: data.Poster,
          scoreMetacritic: data.Metascore,
          scoreImdb: data.imdbRating,
          scoreTomato: data.tomatoMeter,
          scoreTomatoUser: data.tomatoUserMeter,
          tomatoConsensus: data.tomatoConsensus
        };
        db.ref('items/' + snapshot.key).update(appendedProps);
        return;
      }).catch(error => {
        // TODO: add error handling mechanism
        console.log(error); // eslint-disable-line no-console
      });
    }

  });
};

export const addItem = (item) => (dispatch) =>
  dbItems.push({name: item});

export const deleteItem = (key) => (dispatch) => 
  dbItems.child(key).remove();

export const activateAddItem = () => (dispatch) =>
  dispatch({
    type: 'ADD_ITEM_FORM_ACTIVATE'
  });

export const cancelAddItem = () => (dispatch) =>
  dispatch({
    type: 'ADD_ITEM_FORM_CANCEL'
  });