import axios from "axios";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import firebaseui from "firebaseui";
import dateFnsIsAfter from "date-fns/is_after";
import dateFnsFormat from "date-fns/format";
import dateFnsDifferenceInDays from "date-fns/difference_in_days";
import { querystring } from "@firebase/util";

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

// const createUserDbRefFromState = getState => {
//   debugger;
//   const { uid } = getState().user.currentUser;
//   return db.ref(`users/${uid}/movies`);
// };

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
      var moviesWithMetadata = [];

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
        results.forEach(movie => moviesWithMetadata.push(movie));
      });

      // Based on each item's added date, sort list in descending order
      // (most recently added first)
      const sortedMovieArray = await moviesWithMetadata.sort(
        (a, b) =>
          dateFnsIsAfter(
            b.currentListMetadata.dateAdded,
            a.currentListMetadata.dateAdded
          )
            ? 1
            : -1
      );

      dispatch({
        type: "FETCH_ITEMS_SUCCESS",
        payload: sortedMovieArray,
        currentList: listId
      });
    });
};

export const addItem = item => (dispatch, getState) => {
  const { currentList } = getState().items;
  var itemRef = db.collection("movies").where("idTmdb", "==", item.id);

  itemRef.get().then(function createOrUpdateItem(querySnapshot) {
    // querySnapshot should return, at most, 1 item, since we are blocking the addition of dupes below
    var itemToAdd;

    if (querySnapshot.empty) {
      console.log("does not exist");
      itemToAdd = createNewItem(item);
    } else {
      querySnapshot.forEach(function refreshItemIfStale(doc) {
        if (isItemDataStale(doc.data().lastFetched)) {
          console.log("exists but not recently updated");
          itemToAdd = refreshExistingItem(item);
        } else {
          console.log("exists and recently updated");
          console.log("just add current list to item");
          itemToAdd = doc.ref;
        }
      });
    }

    const currentDateTime = dateFnsFormat(new Date());

    // Get a new write batch
    var batch = db.batch();
    var itemToAddContainingListMetadata = itemToAdd
      .collection("containingListMetadata")
      .doc(currentList);

    batch.update(itemToAdd, {
      containingLists: firebase.firestore.FieldValue.arrayUnion(currentList)
    });
    batch.set(itemToAddContainingListMetadata, {
      archived: false,
      dateAdded: currentDateTime
    });

    // Commit the batch
    batch.commit().then(function() {
      console.log("Item added to list");
    });
  });

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
      archived: true
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
      archived: false
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

function createNewItem(item) {
  const newMovieRef = db.collection("movies").doc();
  const movieId = newMovieRef.id;

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

function addItemToList(itemRef, listId) {
  // const movieRef = db.collection("movies").doc(itemRef);
  itemRef.update({
    containingLists: firebase.firestore.FieldValue.arrayUnion(listId)
  });
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
          status: "active",
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
