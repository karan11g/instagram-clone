import firebase from 'firebase'

const firebaseApp=firebase.initializeApp({
   
apiKey: "AIzaSyBJEwsCgtHdW33zVyGhwk4XfhN7JYdR8CA",
authDomain: "instagram11k.firebaseapp.com",
databaseURL: "https://instagram11k.firebaseio.com",
projectId: "instagram11k",
storageBucket: "instagram11k.appspot.com",
messagingSenderId: "823839084033",
appId: "1:823839084033:web:07e6d27460a07f860dba00",
measurementId: "G-JKSDEMSR9P"

})



const db=firebaseApp.firestore();
const auth=firebase.auth();
const storage=firebase.storage();



export {db,auth,storage}