import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
  updatePassword,
  sendEmailVerification,
  signInAnonymously,
} from "firebase/auth";
import { auth } from "./firebase.js";

export const doCreateUserWithEmailAndPassword = async (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const doSignInAnonymously = async () => {
  return signInAnonymously(auth);
};

export const doSignInWithEmailAndPassword = async (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const doSignInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider); // ✅ This was missing

  // result.user can be used to store user details in Firestore if needed

  return result;
};

export const doSignOut = async () => {
  return signOut(auth);
};

export const doPasswordReset = async (email) => {
  return sendPasswordResetEmail(auth, email);
};

export const doPasswordUpdate = async (password) => {
  return updatePassword(auth.currentUser, password);
};

export const doSendEmailVerification = async () => {
  return sendEmailVerification(auth.currentUser);
};
