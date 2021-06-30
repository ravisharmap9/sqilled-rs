
import firebase from 'firebase'

const config = {
  apiKey: "AIzaSyAdCyDboqv_-k7va0l1KYRJ5JZ0PCLO44Y",
  authDomain: "sqilled-91f24.firebaseapp.com",
  projectId: "sqilled-91f24",
  storageBucket: "sqilled-91f24.appspot.com",
  messagingSenderId: "524973311428",
  appId: "1:524973311428:web:31c731554dbcff5b39d091",
  measurementId: "G-Q6X3TS6GFN"
}

firebase.initializeApp(config)

const messaging = firebase.messaging();

export const onMessageListener = () =>
  new Promise((resolve) => {
    messaging.onMessage((payload) => {
      resolve(payload);
    });
});

export default firebase