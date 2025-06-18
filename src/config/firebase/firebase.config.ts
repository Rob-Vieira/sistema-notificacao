import firebase from 'firebase-admin';

export function setupFirebase(){
    const serviceAccount = require("./serviceAccountKey.json");
    
    firebase.initializeApp({
      credential: firebase.credential.cert(serviceAccount)
    });
}