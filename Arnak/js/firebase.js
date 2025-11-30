import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyA-kHxOYREKwqPxeMs2PAS-VtoqcFgtOQ0",
  authDomain: "arnak-6e949.firebaseapp.com",
  projectId: "arnak-6e949",
  storageBucket: "arnak-6e949.appspot.app",
  messagingSenderId: "34786113136",
  appId: "1:34786113136:web:d064ec13ba80e735d366b5",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
