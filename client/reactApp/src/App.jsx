import React, { useState, useEffect } from "react";
import Login from "./login";
import axios, { Axios } from "axios";

function App() {
  const [backendData, setBackendData] = useState({ employees: [] });
  const [newItems, setNewItems] = useState([]);

  

  const getPlaceInfo = async (placeName) => {
    try {
        const response = await fetch(`http://localhost:3000/place/${encodeURIComponent(placeName)}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Place Info:", data);
    } catch (error) {
        console.error("Error fetching place info:", error);
    }
};

  return (
    <>
    <Login/>
    </>
  );
}

export default App;
