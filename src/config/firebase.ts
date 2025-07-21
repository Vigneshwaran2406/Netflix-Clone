import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAZlwqeVFzVQZf-dmp6Vglcjx9zeKE0Ikc",
  authDomain: "sports-f6789.firebaseapp.com",
  projectId: "sports-f6789",
  storageBucket: "sports-f6789.firebasestorage.app",
  messagingSenderId: "1089375819705",
  appId: "1:1089375819705:web:af7492d1c285e78788c868",
  measurementId: "G-QJE2HPWQ9Y"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;