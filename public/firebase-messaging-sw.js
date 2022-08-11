importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing the generated config
const config = {
  apiKey: "AIzaSyBStYObv-l5piW4dJcfwMA4qJJUKcO8EaM",
  authDomain: "insight-25cfc.firebaseapp.com",
  projectId: "insight-25cfc",
  storageBucket: "insight-25cfc.appspot.com",
  messagingSenderId: "642600581674",
  appId: "1:642600581674:web:4f755f8e684f3c001e6153"
  // measurementId: "G-T32J3WVM2T",
}

firebase.initializeApp(config);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);
 // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});