const express = require('express')
const app = express()
const cors = require('cors')
app.use(cors())  
app.use(express.json())
const mysql = require('mysql2/promise')
const dotenv = require('dotenv')
dotenv.config()
const axios = require("axios");


const pool = mysql.createPool({
    host: "127.0.0.1",
    user: "root",
    password: process.env.PASSWORD,
    database: 'SDAA'
});




app.get("/search:name", async (req, res) => {
  const name = req.params.name;
  try {
    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/place/findplacefromtext/json',
      {
        params: {
            input: name,
            inputtype: "textquery",
            fields: "name,formatted_address,geometry",
            key: GOOGLE_MAPS_API_KEY,
        },
    }
    );
    const place = response.data.candidates[0];
        if (!place) {
            return res.status(404).json({ error: "Place not found" });
        }

        res.json({
            name: place.name,
            address: place.formatted_address,
            location: place.geometry.location,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
  }
);


app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  console.log("Received register request:", req.body);

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  try {
    // Check if username already exists
    const checkQuery = "SELECT * FROM accounts WHERE username = ?";
    const [existingUsers] = await pool.query(checkQuery, [username]);

    console.log("Existing users found:", existingUsers.length); 

    if (existingUsers.length > 0) {
      console.log("Username already exists, returning error");
      return res.status(400).json({ message: "Username already exists. Please choose a different one." });
    }

    // Insert new user
    const insertQuery = "INSERT INTO accounts (username, password) VALUES (?, ?)";
    await pool.query(insertQuery, [username, password]);

    console.log("User successfully registered");
    res.status(201).json({ message: "User registered successfully!" });

  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: err.message });
  }
});



app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  console.log("Received login request:", req.body);

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  try {
    // Check if the user exists
    const query = "SELECT * FROM accounts WHERE username = ?";
    const [users] = await pool.query(query, [username]);

    if (users.length === 0) {
      return res.status(400).json({ message: "Invalid username or password." });
    }

    const user = users[0];

    // Compare the plain text passwords (Use hashing in a real-world app)
    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid username or password." });
    }

    console.log("User logged in successfully!");
    res.status(200).json({ message: "Login successful!" });

  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: err.message });
  }
});





app.listen(5050, () => {console.log("server started on port 5050")})