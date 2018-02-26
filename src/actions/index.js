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

const fetchMovieDetails = item => (dispatch) => {
  const tmdbMovieDetailsEndpoint = `https://api.themoviedb.org/3/movie/${item.idTmdb}?api_key=6a6b532ea6bf19c0c8430de484d28759&language=en-US&append_to_response=videos,releases,credits`;
  const omdbMovieDetailsEndpoint = imdbId => `https://www.omdbapi.com/?i=${imdbId}&apikey=b73d8c25`;
  const currentDateTime = moment().format();
  let movieData = {};

  axios(tmdbMovieDetailsEndpoint).then(({ data }) => {
    movieData = {
      status: 'active',
      lastFetched: currentDateTime,
      dateAdded: currentDateTime,
      idTmdb: data.id,
      name: data.title,
      overview: data.overview,
      imagePosterPath: data.poster_path,
      imageBackdropPath: data.backdrop_path,
      releaseDate: data.release_date,
      releases: data.releases,
      videos: data.videos,
      runtime: data.runtime,
      genres: data.genres,
      cast: data.credits.cast,
      crew: data.credits.crew,
      idImdb: data.imdb_id,
    };

    // Using fetched imdb id, look up ratings with OMDB
    return axios(omdbMovieDetailsEndpoint(data.imdb_id));
  }).then((response) => {
    const ratings = response.data.Ratings;
    const ratingsObj = {};
    ratings.forEach(i => ratingsObj[i.Source] = i.Value);

    if (ratingsObj['Internet Movie Database']) {
      movieData.scoreImdb = ratingsObj['Internet Movie Database'].replace(/\/10$/, '');
    }
    if (ratingsObj['Rotten Tomatoes']) {
      movieData.scoreTomato = ratingsObj['Rotten Tomatoes'].replace(/%$/, '');
    }
    if (ratingsObj['Metacritic']) {
      movieData.scoreMetacritic = ratingsObj['Metacritic'].replace(/\/100$/, '');
    }

    db.ref(`items/${item.key}`).update(movieData);
  }).catch((error) => {
    // TODO: add error handling mechanism
    console.log(error); // eslint-disable-line no-console
  });
};

export const initializeItemsList = () => (dispatch) => {
  dispatch({
    type: 'FETCH_ITEMS_REQUEST',
  });

  dbItems.on('value', (snapshot) => {
    // convert movie list object into array for processing
    const movieArray = _.values(snapshot.val());
    const sortedMovieArray = movieArray.sort((a, b) => moment(b.dateAdded) - moment(a.dateAdded));
    dispatch({
      type: 'FETCH_ITEMS_SUCCESS',
      payload: sortedMovieArray,
    });
  });

  /*
   *  `child_added` gets called when adding an item but ALSO
   *  when initializing the app (on each item added into the list)
   */
  dbItems.on('child_added', (snapshot) => {
    const currentItem = snapshot.val();

    // Copy item key into object for convenience when iterating through items
    if (!currentItem.key) {
      currentItem.key = snapshot.key;
      db.ref(`items/${snapshot.key}`).update({
        key: snapshot.key,
      });
    }

    // Look up movie info if haven't before
    if (!currentItem.lastFetched) {
      fetchMovieDetails(currentItem)(dispatch);
    }
  });
};

export const refreshAllItems = () => (dispatch) => {

};

export const addItem = item => (dispatch) => {
  if (typeof item === 'object') {
    dbItems.push({
      name: item.title,
      idTmdb: item.id,
      overview: item.overview,
      imagePosterPath: item.poster_path,
      imageBackdropPath: item.backdrop_path,
      releaseDate: item.release_date,
    });
  } else {
    dbItems.push({ name: item.title });
  }
};

export const archiveItem = key => (dispatch) =>
  dbItems.child(key).update({ status: 'archived' });

export const unarchiveItem = key => (dispatch) =>
  dbItems.child(key).update({ status: 'active' });

export const deleteItem = key => (dispatch) =>
  dbItems.child(key).remove();

export const updateInputValue = value => (dispatch) => {
  dispatch({
    type: 'UPDATE_INPUT_VALUE',
    value,
  });
};

export const clearSuggestions = () => (dispatch) => {
  dispatch({
    type: 'CLEAR_SUGGESTIONS',
  });
};

export const loadSuggestionsBegin = () => (dispatch) => {
  dispatch({
    type: 'LOAD_SUGGESTIONS_BEGIN',
  });
};

export const maybeUpdateSuggestions = (suggestions, value) => (dispatch) => {
  dispatch({
    type: 'MAYBE_UPDATE_SUGGESTIONS',
    suggestions,
    value,
  });
};

export const loadSuggestions = value => (dispatch) => {
  if (!value) {
    dispatch(clearSuggestions());
  } else {
    dispatch(loadSuggestionsBegin());

    const omdbEndpoint = `https://api.themoviedb.org/3/search/movie?api_key=6a6b532ea6bf19c0c8430de484d28759&language=en-US&query=${value}&page=1&include_adult=false`;

    axios(omdbEndpoint).then(({ data }) => {
      dispatch(maybeUpdateSuggestions(data.results || [], value));
    });
  }
};

export const activateAddItem = () => dispatch =>
  dispatch({
    type: 'ADD_ITEM_FORM_ACTIVATE',
  });

export const cancelAddItem = () => dispatch =>
  dispatch({
    type: 'ADD_ITEM_FORM_CANCEL',
  });

export const showActiveList = () => dispatch =>
  dispatch({
    type: 'FILTER_DISPLAY_ACTIVE',
  });

export const showArchivedList = () => dispatch =>
  dispatch({
    type: 'FILTER_DISPLAY_ARCHIVED',
  });

export const showFullList = () => dispatch =>
  dispatch({
    type: 'FILTER_DISPLAY_ALL',
  });

