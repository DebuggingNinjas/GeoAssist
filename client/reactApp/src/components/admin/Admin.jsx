import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";

function Admin({ children }) {
  const { currentUser } = useAuth();
  if (!currentUser || !currentUser.isAdmin) {
    // Redirect if not an admin
    return <Navigate to="/" />;
  }

  return <>admin panel</>;
}

export default Admin;
