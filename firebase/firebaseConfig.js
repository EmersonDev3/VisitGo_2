import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; 
import AsyncStorage from '@react-native-async-storage/async-storage'; 


const firebaseConfig = {
  apiKey: "AIzaSyBdtq0JKpq9rz79YsHJTbPXgRmrNltEiyE",
  authDomain: "fir-configbuscarcidade.firebaseapp.com",
  projectId: "fir-configbuscarcidade",
  storageBucket: "fir-configbuscarcidade.firebasestorage.app",
  messagingSenderId: "703461416727",
  appId: "1:703461416727:web:7728ab85f217cc6cc46152",
  measurementId: "G-CWSLFVPH00",
};


const app = initializeApp(firebaseConfig);


let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (e) {
  if (e.code === "auth/already-initialized") {
    auth = getAuth(app); 
  } else {
    throw e; 
  }
}


const firestore = getFirestore(app);

export { app, auth, firestore };
