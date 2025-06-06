/* eslint-disable react/prop-types */
import { React, useContext, createContext, useEffect, useState } from "react";
import { auth } from "../../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";

const AuthContext = createContext(null);
export { AuthContext }; // <-- Export AuthContext

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, initializeUser);
    return unsubscribe;
  }, []);

  async function initializeUser(user) {
    if (user) {
      // Define admin emails
      const adminEmails = [
        "geoassistadmin@gmail.com",
        "shamsharoon7@gmail.com",
        "patelsagar200511@gmail.com",
        "admin@gmail.com"
      ];
      // Create a new user object with the isAdmin property
      const updatedUser = {
        ...user,
        isAdmin: adminEmails.includes(user.email),
      };
      setCurrentUser(updatedUser);
      setUserLoggedIn(true);
    } else {
      setCurrentUser(null);
      setUserLoggedIn(false);
    }
    setLoading(false);
  }

  const value = {
    currentUser,
    userLoggedIn,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
