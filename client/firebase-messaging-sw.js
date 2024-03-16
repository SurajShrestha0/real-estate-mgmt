import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

// Initialize Firebase with your project-specific configuration
const firebaseConfig = {
    apiKey: "AIzaSyDZ1R0SklTOwW3qxY4nhZ5DFT2mH2l9Etg",
    authDomain: "mern-estate-5919e.firebaseapp.com",
    projectId: "mern-estate-5919e",
    storageBucket: "mern-estate-5919e.appspot.com",
    messagingSenderId: "419419797642",
    appId: "1:419419797642:web:829e31baa46b7edb0d5573",
    measurementId: "G-KVYLRVY5ZN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging and get a reference to the service
const messaging = getMessaging(app);

// Function to request notification permission
const requestNotificationPermission = async () => {
    try {
        // Request permission for notifications using the Web Notifications API
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            console.log('Notification permission granted.');
            // Get the FCM token
            const token = await messaging.getToken({vapidKey: 'BCIvM3q9BUY5lgTVFRsxw3YGZNY5V9Zm2qUU_UXNmvW2dHwXUUum-a3UZv683nbqYNHjB09C3GKaGFtLMVSUUYY'});
            console.log('FCM Token:', token);
            // Send the token to your server if needed
        } else {
            console.log('Unable to get permission to notify.');
        }
    } catch (error) {
        console.error('Error requesting notification permission:', error);
    }
};

// Call the function to request permission
requestNotificationPermission();
