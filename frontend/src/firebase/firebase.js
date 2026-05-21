import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  GoogleAuthProvider,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA54ulpIuce4CBTXTrX0o4co24r5IuuWoU",
  authDomain: "mediq-c2701.firebaseapp.com",
  projectId: "mediq-c2701",
  storageBucket: "mediq-c2701.firebasestorage.app",
  messagingSenderId: "614064238031",
  appId: "1:614064238031:web:e77b0fd17c366fe097b6ba",
  measurementId: "G-3G1SRH0D6B"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);

export const provider = new GoogleAuthProvider();