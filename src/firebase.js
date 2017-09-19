import firebase from 'firebase';

var config = {
  apiKey: "AIzaSyBJzj0YiFJQ13wi88VpUwAKgQUzsm_0_Yk",
    authDomain: "todoporject.firebaseapp.com",
    databaseURL: "https://todoporject.firebaseio.com",
    projectId: "todoporject",
    storageBucket: "todoporject.appspot.com",
    messagingSenderId: "494715165932"
};

firebase.initializeApp(config);

export function auth2 (email, pw) {
  return firebase.auth().createUserWithEmailAndPassword(email, pw)
    .then(saveUser)
}

export function login2 (email, pw) {
  return firebase.auth().signInWithEmailAndPassword(email, pw)
}

export function logout2 () {
  return firebase.auth().signOut()
}

export function saveUser (user) {
  return firebase.database().ref().child(`users/${user.uid}/info`)
    .set({
      email: user.email,
      uid: user.uid
    })
    .then(() => user)
}


export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();
export const database = firebase.database();
export default firebase;