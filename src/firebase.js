import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBfausZRSGwSpB5YqjmjR9hi0iutGYQ9h4",
  authDomain: "brutal-rpg.firebaseapp.com",
  databaseURL: "https://brutal-rpg-default-rtdb.firebaseio.com",
  projectId: "brutal-rpg",
  storageBucket: "brutal-rpg.firebasestorage.app",
  messagingSenderId: "1021290330308",
  appId: "1:1021290330308:web:d2a020278d5bcd1995b191",
  measurementId: "G-YQYF94GTTE"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

export { database, auth };
