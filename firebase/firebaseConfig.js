import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth'; // Use `getAuth` também para evitar múltiplas inicializações
import { getFirestore } from 'firebase/firestore'; // Para Firestore
import AsyncStorage from '@react-native-async-storage/async-storage'; // Persistência do estado

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBdtq0JKpq9rz79YsHJTbPXgRmrNltEiyE",
  authDomain: "fir-configbuscarcidade.firebaseapp.com",
  projectId: "fir-configbuscarcidade",
  storageBucket: "fir-configbuscarcidade.firebasestorage.app",
  messagingSenderId: "703461416727",
  appId: "1:703461416727:web:7728ab85f217cc6cc46152",
  measurementId: "G-CWSLFVPH00",
};

// Inicialize o app apenas se ainda não foi inicializado
const app = initializeApp(firebaseConfig);

// Inicialize o Auth com persistência, se necessário
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (e) {
  if (e.code === "auth/already-initialized") {
    auth = getAuth(app); // Reutiliza a instância existente
  } else {
    throw e; // Relança outros erros
  }
}

// Inicializa o Firestore (se necessário)
const firestore = getFirestore(app);

export { app, auth, firestore };
