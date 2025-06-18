import fs from 'fs';
import firebase from 'firebase-admin';

export function setupFirebase() {
  let serviceAccount;

  if (process.env.FIREBASE_CONFIG_JSON) {
    serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG_JSON);
  } else {
    serviceAccount = JSON.parse(fs.readFileSync('./serviceAccountKey.json', 'utf-8'));
  }

  firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount)
  });
}