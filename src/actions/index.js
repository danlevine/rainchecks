import axios from "axios";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import firebaseui from "firebaseui";
import dateFnsIsAfter from "date-fns/is_after";
import dateFnsFormat from "date-fns/format";
import dateFnsDifferenceInDays from "date-fns/difference_in_days";

// FIREBASE CONFIG
const config = {
  apiKey: "AIzaSyAHRoNV5kql2MjiR1mBfSpkKJdC59IOLE8",
  authDomain: "rainchecks-20eb9.firebaseapp.com",
  databaseURL: "https://rainchecks-20eb9.firebaseio.com",
  projectId: "rainchecks-20eb9",
  storageBucket: "rainchecks-20eb9.appspot.com",
  messagingSenderId: "716634521126"
};

firebase.initializeApp(config);
const db = firebase.firestore();
db.settings({
  timestampsInSnapshots: true
});

const auth = firebase.auth();
const firebaseAuthObj = firebase.auth;
const ui = new firebaseui.auth.AuthUI(firebaseAuthObj());
var authFirebaseListener;

export const checkForLoggedInUser = () => (dispatch, getState) => {
  authFirebaseListener = auth.onAuthStateChanged(user => {
    // user found from auth service
    if (user) {
      var userRef = db.collection("users").doc(user.uid);

      userRef
        .get()
        .then(function(doc) {
          var userData;

          if (doc.exists) {
            // existing user found
            userData = doc.data();
            getMoviesByList(userData.defaultList)(dispatch, getState);
          } else {
            // no user found - new user just created - add user to DB
            const newListRef = db.collection("lists").doc();

            userData = {
              uid: user.uid,
              defaultList: newListRef.id,
              defaultSortCategory: "dateAdded",
              defaultSortDir: "desc",
              displayName: user.displayName,
              email: user.email,
              searchable: true,
              photoURL: user.photoURL,
              creationTime: user.metadata.creationTime
            };

            userRef.set(userData);

            const currentDateTime = dateFnsFormat(new Date());

            newListRef
              .set({
                createdAt: currentDateTime,
                creator: user.uid,
                lastUpdated: currentDateTime,
                public: false,
                title: "My First List",
                type: "movie",
                usersEditable: [user.uid],
                usersReadOnly: []
              })
              .then(() => getMoviesByList(newListRef.id)(dispatch, getState));
          }

          dispatch({
            type: "USER_DATA_LOADED",
            user: userData
          });
        })
        .catch(function(error) {
          console.log("Error getting document:", error);
        });

      // no user found from auth service
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

export const getMoviesByList = listId => (dispatch, getState) => {
  dispatch({
    type: "FETCH_ITEMS_REQUEST"
  });

  // Find items based on list id and continue to watch using onSnapshot()
  db.collection("movies")
    .where("containingLists", "array-contains", listId)
    .onSnapshot(async function buildMovieList(querySnapshot) {
      // convert movie list object into array for processing
      var movies = [];
      var sortedMovieArray = [];

      // Push each result into movies array for processing
      querySnapshot.forEach(function(doc) {
        movies.push(doc.data());
      });

      await Promise.all(
        movies.map(async function getMetadataByMovie(movie) {
          var metadata = await db
            .collection("movies")
            .doc(movie.key)
            .collection("containingListMetadata")
            .doc(listId)
            .get();

          // Augment each movie object with additional list-specific metadata
          movie.currentListMetadata = metadata.data();
          return movie;
        })
      ).then(results => {
        // Based on each item's added date, sort list in descending order
        // (most recently added first)
        sortedMovieArray = results.sort((a, b) => {
          if (!b.currentListMetadata) return 1;
          if (!a.currentListMetadata) return -1;
          return dateFnsIsAfter(
            b.currentListMetadata.dateAdded,
            a.currentListMetadata.dateAdded
          )
            ? 1
            : -1;
        });

        dispatch({
          type: "FETCH_ITEMS_SUCCESS",
          payload: sortedMovieArray,
          currentList: listId
        });
      });
    });
};

export const addItem = item => (dispatch, getState) => {
  dispatch({
    type: "ADD_ITEM_BEGIN"
  });

  const { currentList } = getState().items;
  var itemRef = db.collection("movies").where("idTmdb", "==", item.id);

  itemRef.get().then(function createOrUpdateItem(querySnapshot) {
    // querySnapshot should return, at most, 1 item, since we are blocking the addition of dupes below
    var itemToAdd;

    if (querySnapshot.empty) {
      console.log("does not exist");
      itemToAdd = createNewItem(item).then(itemRef => {
        addItemToList(itemRef, currentList);
      });
    } else {
      querySnapshot.forEach(function refreshItemIfStale(doc) {
        const docData = doc.data();

        // If item already exists in your list
        if (docData.containingLists.includes(currentList)) {
          console.log("exists and is already in current list");
        } else if (isItemDataStale(docData.lastFetched)) {
          console.log("exists but not recently updated");
          itemToAdd = refreshExistingItem(item);
        } else {
          console.log("exists and recently updated");
          console.log("just add current list to item");
          itemToAdd = doc.ref;
        }
      });

      if (itemToAdd) {
        addItemToList(itemToAdd, currentList);
      } else {
        // alert("already added!");
        dispatch({
          type: "ADD_ITEM_FAILED"
        });
        popMessenger("This movie is already in your list", "Duplicate Movie")(
          dispatch
        );
      }
    }
  });

  function addItemToList(itemRef, listId) {
    const currentDateTime = dateFnsFormat(new Date());

    // Get a new write batch
    var batch = db.batch();
    var itemContainingListMetadata = itemRef
      .collection("containingListMetadata")
      .doc(listId);

    batch.update(itemRef, {
      containingLists: firebase.firestore.FieldValue.arrayUnion(listId)
    });
    batch.set(itemContainingListMetadata, {
      watched: null,
      dateAdded: currentDateTime
    });

    // Commit the batch
    batch.commit().then(function() {
      console.log("Item added to list");
    });
  }

  function isItemDataStale(lastFetched) {
    const now = dateFnsFormat(new Date());
    return dateFnsDifferenceInDays(now, lastFetched) >= 1;
  }
};

export const archiveItem = key => (dispatch, getState) => {
  var currentListId = getState().items.currentList;
  var movieCurrentListMetadata = db
    .collection("movies")
    .doc(key)
    .collection("containingListMetadata")
    .doc(currentListId);

  movieCurrentListMetadata
    .update({
      watched: dateFnsFormat(new Date())
    })
    .then(() => {
      getMoviesByList(getState().items.currentList)(dispatch, getState);
    });
};

export const unarchiveItem = key => (dispatch, getState) => {
  var currentListId = getState().items.currentList;
  var movieCurrentListMetadata = db
    .collection("movies")
    .doc(key)
    .collection("containingListMetadata")
    .doc(currentListId);

  movieCurrentListMetadata
    .update({
      watched: null
    })
    .then(() => {
      getMoviesByList(getState().items.currentList)(dispatch, getState);
    });
};

export const deleteItem = key => (dispatch, getState) => {
  var currentListId = getState().items.currentList;
  var movieRef = db.collection("movies").doc(key);
  var movieCurrentListMetadata = movieRef
    .collection("containingListMetadata")
    .doc(currentListId);

  // Get a new write batch
  var batch = db.batch();

  batch.update(movieRef, {
    containingLists: firebase.firestore.FieldValue.arrayRemove(currentListId)
  });
  batch.delete(movieCurrentListMetadata);

  // Commit the batch
  batch.commit().then(function() {
    console.log(`Item: ${key} removed from list ${currentListId}`);
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

export const closeAddItem = () => dispatch =>
  dispatch({
    type: "ADD_ITEM_FORM_CLOSE"
  });

export const showUnwatchedList = () => dispatch =>
  dispatch({
    type: "FILTER_DISPLAY_UNWATCHED"
  });

export const showWatchedList = () => dispatch =>
  dispatch({
    type: "FILTER_DISPLAY_WATCHED"
  });

export const toggleWatchedList = () => dispatch =>
  dispatch({
    type: "FILTER_DISPLAY_TOGGLE"
  });

export const showFullList = () => dispatch =>
  dispatch({
    type: "FILTER_DISPLAY_ALL"
  });

export const popMessenger = (message, title) => dispatch =>
  dispatch({
    type: "POP_MESSENGER",
    message,
    title
  });

export const hideMessenger = message => dispatch =>
  dispatch({
    type: "HIDE_MESSENGER",
    message
  });

async function createNewItem(item) {
  const newMovieRef = db.collection("movies").doc();
  const movieId = newMovieRef.id;

  const movieDetailsPromise = fetchMovieDetails(item.id);

  // Create new movie record and update with fetched details
  await movieDetailsPromise.then(movieData => {
    const prefetchedMovieData = {
      key: movieId,
      name: item.title,
      idTmdb: item.id,
      overview: item.overview,
      imagePosterPath: item.poster_path,
      imageBackdropPath: item.backdrop_path,
      releaseDate: item.release_date
    };
    const mergedMovieData = Object.assign(prefetchedMovieData, movieData);

    newMovieRef.set(mergedMovieData);
  });

  return newMovieRef;
}

function refreshExistingItem(item) {
  const movieRef = db.collection("movies").doc(item.key);

  const movieDetailsPromise = fetchMovieDetails(item.id);

  // Update existing movie record
  movieRef
    .update({
      name: item.title,
      idTmdb: item.id,
      overview: item.overview,
      imagePosterPath: item.poster_path,
      imageBackdropPath: item.backdrop_path,
      releaseDate: item.release_date
    })
    .then(() => movieDetailsPromise)
    .then(movieData => movieRef.update(movieData));

  return movieRef;
}

function fetchMovieDetails(movieId) {
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
          lastFetched: currentDateTime,
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
}
