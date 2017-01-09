import axios from 'axios';
import firebase from 'firebase';
import _ from 'lodash';
import moment from 'moment';


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
    // convert movie list object into array for processing
    const movieArray = _.values(snapshot.val());
    const sortedMovieArray = movieArray.sort((a, b) => moment(b.dateAdded) - moment(a.dateAdded));
    console.log('dbitems:value');
    dispatch({
      type: 'FETCH_ITEMS_SUCCESS',
      payload: sortedMovieArray
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
      if (currentItem.imdbID) {
        var omdbEndpoint = 'https://www.omdbapi.com/?i=' + currentItem.imdbID + '&y=&plot=short&r=json&type=movie&tomatoes=true';
      }
      else {
        var omdbEndpoint = 'https://www.omdbapi.com/?t=' + currentItem.name.replace(/\s/g, '+') + '&y=&plot=short&r=json&type=movie&tomatoes=true';
      }

      let currentDateTime = moment().format();
      axios(omdbEndpoint).then(({data}) => {
        let appendedProps = {
          status: 'active',
          lastFetched: currentDateTime,
          dateAdded: currentDateTime,
          name: data.Title,
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
          tomatoConsensus: data.tomatoConsensus,
          imdbID: data.imdbID
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

export const addItem = (item) => (dispatch) => {
  if (typeof item === 'object') {
    dbItems.push({name: item.Title, imdbID: item.imdbID});
  }
  else {
    dbItems.push({name: item.Title});
  }
}

export const archiveItem = (key) => (dispatch) =>
  dbItems.child(key).update({ status: 'archived' });

export const unarchiveItem = (key) => (dispatch) =>
  dbItems.child(key).update({ status: 'active' });

export const deleteItem = (key) => (dispatch) => 
  dbItems.child(key).remove();

export const loadSuggestions = (value) => (dispatch) => {
  dispatch(loadSuggestionsBegin());

  let omdbEndpoint = 'https://www.omdbapi.com/?s=' + value + '&type=movie';
  
  axios(omdbEndpoint).then(({data}) => {
    dispatch(maybeUpdateSuggestions(data.Search || [], value));
  });
};

export const updateInputValue = (value) => (dispatch) => {
  dispatch({
    type: 'UPDATE_INPUT_VALUE',
    value
  });
};

export const clearSuggestions = () => (dispatch) => {
  dispatch({
    type: 'CLEAR_SUGGESTIONS'
  });
};

export const loadSuggestionsBegin = () => (dispatch) => {
  dispatch({
    type: 'LOAD_SUGGESTIONS_BEGIN'
  });
};

export const maybeUpdateSuggestions = (suggestions, value) => (dispatch) => {
  dispatch({
    type: 'MAYBE_UPDATE_SUGGESTIONS',
    suggestions,
    value
  });
};

export const activateAddItem = () => (dispatch) =>
  dispatch({
    type: 'ADD_ITEM_FORM_ACTIVATE'
  });

export const cancelAddItem = () => (dispatch) =>
  dispatch({
    type: 'ADD_ITEM_FORM_CANCEL'
  });

export const showActiveList = () => (dispatch) =>
  dispatch({
    type: 'FILTER_DISPLAY_ACTIVE'
  });

export const showArchivedList = () => (dispatch) =>
  dispatch({
    type: 'FILTER_DISPLAY_ARCHIVED'
  });

export const showFullList = () => (dispatch) =>
  dispatch({
    type: 'FILTER_DISPLAY_ALL'
  });