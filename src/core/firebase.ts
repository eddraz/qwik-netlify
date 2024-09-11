import { initializeApp } from "firebase/app";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDmAdHSiPJCbBeZSgzkAhXnEr7o4xkWoBE",
  authDomain: "prueba-1600f.firebaseapp.com",
  projectId: "prueba-1600f",
  storageBucket: "prueba-1600f.appspot.com",
  messagingSenderId: "96450975837",
  appId: "1:96450975837:web:dae2a302aeb1c8a07595b4",
  measurementId: "G-H1D1YMJQKV",
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

if (import.meta.env.DEV) {
  connectFirestoreEmulator(db, "127.0.0.1", 8080);
}

export { db };
