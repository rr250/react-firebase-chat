import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

let config = {
    apiKey: "AIzaSyCLVOlBeVmypfN-C2kUoBRRRRwwDeNWsjU",
    authDomain: "reactfchat.firebaseapp.com",
    databaseURL: "https://reactfchat.firebaseio.com",
    projectId: "reactfchat",
    storageBucket: "reactfchat.appspot.com",
    messagingSenderId: "812089869816"
};
firebase.initializeApp(config);

export default firebase;