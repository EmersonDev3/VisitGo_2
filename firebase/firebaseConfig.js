// src/firebase/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';  // Para autenticação
import { getFirestore } from 'firebase/firestore'; // Para Firestore (se necessário)

// Sua configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBdtq0JKpq9rz79YsHJTbPXgRmrNltEiyE",
    authDomain: "fir-configbuscarcidade.firebaseapp.com",
    projectId: "fir-configbuscarcidade",
    storageBucket: "fir-configbuscarcidade.firebasestorage.app",
    messagingSenderId: "703461416727",
    appId: "1:703461416727:web:7728ab85f217cc6cc46152",
    measurementId: "G-CWSLFVPH00"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Inicializa os serviços que você quer usar (por exemplo, auth e firestore)
const auth = getAuth(app);
const firestore = getFirestore(app);

export { app, auth, firestore };
