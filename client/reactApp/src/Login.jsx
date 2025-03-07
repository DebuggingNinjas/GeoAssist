import React, { useState } from 'react';
import axios from 'axios';

function Login() {
    const [username, setUsername] = useState("username");
    const [password, setPassword] = useState("password");
    const [isLogingIn, setLogin] = useState(true);
    const [signedIn, setSignedIn] = useState(false);

    const handleLogin = () => {
        axios.post("http://localhost:5050/login", { username, password })
            .then(response => {
                console.log("Response:", response);
                console.log("Response status:", response.status);
                console.log("Response data:", response.data);
    
                if (response.data.message === "Login successful!") {
                    setSignedIn(true);
                }
                alert(response.data.message);
            })
            .catch(err => {
                console.error("Axios error:", err);
            });
    };
    
    const handleRegister = () => {
        axios.post("http://localhost:5050/register", { username, password })
            .then(response => {
                console.log("Registration successful:", response.data);
                
                if (response.data.message === "User registered successfully!") {
                    setSignedIn(true);
                }
                alert(response.data.message);
            })
            .catch(err => {
                if (err.response) {
                    console.error("Registration error:", err.response.data);
                    alert(err.response.data.message || "Registration failed. Please try again.");
                } else if (err.request) {
                    console.error("No response from server:", err.request);
                    alert("Server is not responding. Please try again later.");
                } else {
                    console.error("Unexpected error:", err.message);
                    alert("An unexpected error occurred.");
                }
            });
    };
    

    return( 
        <>
            {!signedIn ? ( // kinda did this backwards
                <div class="login-cont">
                    {isLogingIn ? (
                        <>
                            <div className="login-title">Login</div>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="login-input"
                            />
                            <input
                                type="text"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="login-input"
                            />
                            <button className="login-reg" onClick={handleLogin}>
                                Login
                            </button>
                            <button className="login-reg" onClick={() => setLogin(false)}>
                                Create Account
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="login-title">Register</div>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="login-input"
                            />
                            <input
                                type="text"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="login-input"
                            />
                            <button className="login-reg" onClick={handleRegister}>
                                Register
                            </button>
                            <button className="login-reg" onClick={() => setLogin(true)}>
                                Login To Existing Account
                            </button>
                        </>
                    )}
                </div>
            ) : (
                <>

                </>
            )}
        </>
    );
}

export default Login