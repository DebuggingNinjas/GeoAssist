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


app.get("/employees", async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query("SELECT * FROM employees");
        connection.release();
        res.status(200).json({"employees": rows});

        console.log(rows);

      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error", details: err });
      }
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

app.post("/save", async (req, res) => {
  console.log("Received POST request:", req.body);
  const query = `UPDATE employees SET name = "${req.body.name}", id = ${req.body.id}, description = "${req.body.description}" WHERE id = ${req.body.id_copy};`;
  pool.query(query);
  res.status(200).json({ message: "Data saved successfully!"});
});

app.post("/create", async (req, res) => {
  console.log("Received POST request:", req.body);
  const query = `INSERT INTO employees VALUES ("${req.body.name}", ${req.body.id}, "${req.body.description}");`;
  pool.query(query);
  res.status(200).json({ message: "Data created successfully!"});
});




app.post("/register", (req, res) => {
  const { username, password } = req.body;
  console.log("Received register request:", req.body);

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  const query = "INSERT INTO accounts (username, password) VALUES (?, ?)";
  
  pool.query(query, [username, password], (err, result) => {
    console.log("Query callback reached"); // Debugging line

    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: err.message });
    }

    console.log("User successfully inserted, sending response"); // Debugging line
    res.status(201).json({ message: "User registered successfully!" });
  });

  console.log("Query execution started, waiting for callback...");
});




app.post("/login", (req, res) => {
  const { username, password } = req.body;
  console.log("Received login request:", req.body);

  if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
  }

  // Check if the user exists
  const query = "SELECT * FROM accounts WHERE username = ?";
  pool.query(query, [username], (err, results) => {
      if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ error: err.message });
      }

      // If user doesn't exist
      if (results.length === 0) {
          return res.status(400).json({ message: "Invalid username or password." });
      }

      // Check if the password matches (You should use hashed passwords in a real application)
      const user = results[0];
      if (user.password !== password) {
          return res.status(400).json({ message: "Invalid username or password." });
      }

      console.log("User logged in successfully!");
      return res.status(200).json({ message: "Login successful!" });
  });
});




app.listen(5050, () => {console.log("server started on port 5050")})