// export default firebase
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { useSelector } from 'react-redux';
import axios from 'axios';
import {apiUrlFcmToken} from './api'

const config = {
  apiKey: "AIzaSyBStYObv-l5piW4dJcfwMA4qJJUKcO8EaM",
  authDomain: "insight-25cfc.firebaseapp.com",
  projectId: "insight-25cfc",
  storageBucket: "insight-25cfc.appspot.com",
  messagingSenderId: "642600581674",
  appId: "1:642600581674:web:4f755f8e684f3c001e6153",
  measurementId: "G-T32J3WVM2T",
}

initializeApp(config);

const messaging = getMessaging();

export const requestForToken = async () => {
  try {
    const currentToken = await getToken(messaging, { vapidKey: '' });
    if (currentToken) {
      // if (fcmBoolen == false) {
      //   axios.post(apiUrlFcmToken, { fcm_token: currentToken }, { headers: { Authorization: 'Bearer ' + token } })
        
      // }
      // console.log('current token for client: ', currentToken);
    } else {
      // Show permission request UI
      // console.log('No registration token available. Request permission to generate one.');
    }
  } catch (err) {
    // console.log('An error occurred while retrieving token. ', err);
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log("payload", payload)
      resolve(payload);
    });
  });