import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDWoLSBKBslXrfN5YLEGiyawTasnN9POzI",
  authDomain: "nyaai-25.firebaseapp.com",
  projectId: "nyaai-25",
  storageBucket: "nyaai-25.firebasestorage.app",
  messagingSenderId: "55461288035",
  appId: "1:55461288035:web:f371323a2fe0ad03e28056",
  measurementId: "G-9TX0YXRR2S"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);