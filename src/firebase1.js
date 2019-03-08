import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

var config = {
    apiKey: "AIzaSyCh-tTqgl5JNiPdTVH5LpKXIfv163nwRDc",
    authDomain: "react-slack-clone-7931b.firebaseapp.com",
    databaseURL: "https://react-slack-clone-7931b.firebaseio.com",
    projectId: "react-slack-clone-7931b",
    storageBucket: "react-slack-clone-7931b.appspot.com",
    messagingSenderId: "649811476865"
  };
  firebase.initializeApp(config);

  export default firebase;