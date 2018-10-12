import axios from "axios";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import firebaseui from "firebaseui";
import _ from "lodash";
import dateFnsIsAfter from "date-fns/is_after";
import dateFnsFormat from "date-fns/format";

// FIREBASE CONFIG
const config = {
  apiKey: "AIzaSyC0WHChgY9Ahgr7t4NRCQajmL_vG6mtQ1o",
  authDomain: "auth.rainchecks.danlevine.io",
  databaseURL: "https://flickering-fire-3051.firebaseio.com",
  storageBucket: "flickering-fire-3051.appspot.com"
};
firebase.initializeApp(config);
const db = firebase.database();

const createUserDbRefFromState = getState => {
  const { uid } = getState().user.currentUser;
  return db.ref(`users/${uid}/movies`);
};

const fetchMovieDetails = movieId => {
  const tmdbMovieDetailsEndpoint =
    "https://api.themoviedb.org/3/movie/" +
    movieId +
    "?api_key=6a6b532ea6bf19c0c8430de484d28759&language=en-US&append_to_response=videos,releases,credits";
  const omdbMovieDetailsEndpoint = imdbId =>
    `https://www.omdbapi.com/?i=${imdbId}&apikey=b73d8c25`;
  const currentDateTime = dateFnsFormat(new Date());
  var movieData = {};

  return new Promise(function(resolve, reject) {
    // Reset item (ex. unarchive) and grab latest data
    axios(tmdbMovieDetailsEndpoint)
      .then(({ data }) => {
        movieData = {
          status: "active",
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
          idImdb: data.imdb_id
        };

        // Using fetched imdb id, look up ratings with OMDB
        return axios(omdbMovieDetailsEndpoint(data.imdb_id));
      })
      .then(response => {
        const ratings = response.data.Ratings;
        const ratingsObj = {};
        ratings.forEach(i => (ratingsObj[i.Source] = i.Value));

        if (ratingsObj["Internet Movie Database"]) {
          movieData.scoreImdb = ratingsObj["Internet Movie Database"].replace(
            /\/10$/,
            ""
          );
        }
        if (ratingsObj["Rotten Tomatoes"]) {
          movieData.scoreTomato = ratingsObj["Rotten Tomatoes"].replace(
            /%$/,
            ""
          );
        }
        if (ratingsObj["Metacritic"]) {
          movieData.scoreMetacritic = ratingsObj["Metacritic"].replace(
            /\/100$/,
            ""
          );
        }

        return movieData;
      })
      .then(resolve)
      .catch(reject);
  });
};

export const initializeItemsList = () => (dispatch, getState) => {
  dispatch({
    type: "FETCH_ITEMS_REQUEST"
  });

  const dbUserMovies = createUserDbRefFromState(getState);
  dbUserMovies.on("value", snapshot => {
    // convert movie list object into array for processing
    const movieArray = _.values(snapshot.val());

    // Based on each item's added date, sort list in descending order
    // (most recently added first)
    const sortedMovieArray = movieArray.sort(
      (a, b) => (dateFnsIsAfter(b.dateAdded, a.dateAdded) ? 1 : -1)
    );

    dispatch({
      type: "FETCH_ITEMS_SUCCESS",
      payload: sortedMovieArray
    });
  });
};

export const refreshAllItems = () => () => {};

export const addItem = item => (dispatch, getState) => {
  const dbUserMovies = createUserDbRefFromState(getState);
  const newMovieRef = dbUserMovies.push();
  const movieId = newMovieRef.key;

  const movieDetailsPromise = fetchMovieDetails(item.id);

  if (typeof item === "object") {
    // Create new movie record and update with fetched details
    newMovieRef
      .set({
        key: movieId,
        name: item.title,
        idTmdb: item.id,
        overview: item.overview,
        imagePosterPath: item.poster_path,
        imageBackdropPath: item.backdrop_path,
        releaseDate: item.release_date
      })
      .then(() => movieDetailsPromise)
      .then(movieData => newMovieRef.update(movieData));
  } else {
    newMovieRef.set({ name: item.title });
  }
};

export const archiveItem = key => (dispatch, getState) => {
  const dbUserMovies = createUserDbRefFromState(getState);
  dbUserMovies.child(key).update({ status: "archived" });
};

export const unarchiveItem = key => (dispatch, getState) => {
  const dbUserMovies = createUserDbRefFromState(getState);
  dbUserMovies.child(key).update({ status: "active" });
};

export const deleteItem = key => (dispatch, getState) => {
  const dbUserMovies = createUserDbRefFromState(getState);
  dbUserMovies.child(key).remove();
};

const auth = firebase.auth();
const firebaseAuthObj = firebase.auth;
const ui = new firebaseui.auth.AuthUI(firebaseAuthObj());
var authFirebaseListener;

export const checkForLoggedInUser = () => (dispatch, getState) => {
  authFirebaseListener = auth.onAuthStateChanged(user => {
    if (user) {
      dispatch({
        type: "EXISTING_USER_DETECTED_AND_LOGGED_IN",
        user
      });
      initializeItemsList()(dispatch, getState);
    } else if (!user && ui.isPendingRedirect()) {
      dispatch({
        type: "AUTH_REDIRECT_PENDING"
      });
    } else {
      dispatch({
        type: "NO_EXISTING_USER_DETECTED"
      });
    }
  });
};

export const unmountAuth = () => () => {
  authFirebaseListener && authFirebaseListener();
};

export const initAuthBox = () => dispatch => {
  ui.start(".firebaseui-auth-container", {
    callbacks: {
      uiShown: function() {
        // The widget is rendered.
        // Hide the loader.
        if (!ui.isPendingRedirect()) {
          dispatch({
            type: "AUTH_BOX_LOADED"
          });
        }
      }
    },
    signInOptions: [
      firebaseAuthObj.EmailAuthProvider.PROVIDER_ID,
      firebaseAuthObj.GoogleAuthProvider.PROVIDER_ID,
      firebaseAuthObj.TwitterAuthProvider.PROVIDER_ID,
      firebaseAuthObj.GithubAuthProvider.PROVIDER_ID
    ],
    signInFlow: "popup"
  });
};

export const userLogout = () => dispatch => {
  auth.signOut().then(() => {
    dispatch({
      type: "CURRENT_USER_LOGGED_OUT"
    });
  });
};

export const updateInputValue = value => dispatch => {
  dispatch({
    type: "UPDATE_INPUT_VALUE",
    value
  });
};

export const clearSuggestions = () => dispatch => {
  dispatch({
    type: "CLEAR_SUGGESTIONS"
  });
};

export const loadSuggestionsBegin = () => dispatch => {
  dispatch({
    type: "LOAD_SUGGESTIONS_BEGIN"
  });
};

export const maybeUpdateSuggestions = (suggestions, value) => dispatch => {
  dispatch({
    type: "MAYBE_UPDATE_SUGGESTIONS",
    suggestions,
    value
  });
};

export const loadSuggestions = value => dispatch => {
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
    type: "ADD_ITEM_FORM_ACTIVATE"
  });

export const cancelAddItem = () => dispatch =>
  dispatch({
    type: "ADD_ITEM_FORM_CANCEL"
  });

export const showActiveList = () => dispatch =>
  dispatch({
    type: "FILTER_DISPLAY_ACTIVE"
  });

export const showArchivedList = () => dispatch =>
  dispatch({
    type: "FILTER_DISPLAY_ARCHIVED"
  });

export const toggleActiveArchivedList = () => dispatch =>
  dispatch({
    type: "FILTER_DISPLAY_TOGGLE"
  });

export const showFullList = () => dispatch =>
  dispatch({
    type: "FILTER_DISPLAY_ALL"
  });
