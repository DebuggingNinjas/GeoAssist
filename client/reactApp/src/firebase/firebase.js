// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBb-HRZmb2EIFsiVaZePTGryYz18hMlK1s",
  authDomain: "geoassist-1.firebaseapp.com",
  projectId: "geoassist-1",
  storageBucket: "geoassist-1.firebasestorage.app",
  messagingSenderId: "943361342640",
  appId: "1:943361342640:web:2f8a9bb9c73b9497db0f75",
  measurementId: "G-WY499LQZWX",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Only initialize Analytics if not in a test environment and if a window object is available
if (process.env.NODE_ENV !== "test" && typeof window !== "undefined") {
  isSupported(app)
    .then((supported) => {
      if (supported) {
        getAnalytics(app);
      }
    })
    .catch((err) => {
      console.warn("Firebase Analytics is not supported:", err);
    });
}

const auth = getAuth(app);

export { auth };
export default app;
