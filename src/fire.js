import firebase from 'firebase'
var config = { /* COPY THE ACTUAL CONFIG FROM FIREBASE CONSOLE */
  apiKey: "AIzaSyBJzj0YiFJQ13wi88VpUwAKgQUzsm_0_Yk",
    authDomain: "todoporject.firebaseapp.com",
    databaseURL: "https://todoporject.firebaseio.com",
    projectId: "todoporject",
    storageBucket: "todoporject.appspot.com",
    messagingSenderId: "494715165932"
};
firebase.initializeApp(config);

export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();
//Authentication module.

export default firebase;
//export default fire;