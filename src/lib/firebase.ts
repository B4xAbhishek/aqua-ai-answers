
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCWGkmSFQRu_vCMAj7kh7hApmc2OM1QYxs",
  authDomain: "davis-sterling-test.firebaseapp.com",
  projectId: "davis-sterling-test",
  storageBucket: "davis-sterling-test.appspot.com",
  messagingSenderId: "684568252316",
  appId: "1:684568252316:web:7f9a31902669b393774259",
  measurementId: "G-VDS8MS6850"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
