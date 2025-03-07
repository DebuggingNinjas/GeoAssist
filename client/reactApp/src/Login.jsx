import React, { useState } from 'react';
import axios from 'axios';

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLogingIn, setLogin] = useState(true);
  const [signedIn, setSignedIn] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

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
    if (!agreeTerms) {
      alert("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }
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

  return (
    <>
      {!signedIn ? (
        <div className="login-cont">
          <div className="login-title">
            <span style={{ color: '#00A3E0' }}>Geo</span>
            <span style={{ color: '#00C853' }}>Assist</span>
            <div className="subtitle">
              {isLogingIn ? 'Welcome back! Please enter your details' : 'Create an account'}
            </div>
          </div>
          {isLogingIn ? (
            <>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="login-input login-input-margin"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="login-input"
              />
              <div className="checkbox-container">
                <input
                  type="checkbox"
                  checked={true}
                  readOnly
                  className="checkbox"
                />
                <span className="checkbox-label">Remember me</span>
                <a href="#" className="forgot-password">Forgot password?</a>
              </div>
              <button className="login-reg login-reg-primary" onClick={handleLogin}>
                Sign in
              </button>
              <div className="switch-mode">
                Don’t have an account?{' '}
                <button onClick={() => setLogin(false)} className="switch-link">
                  Sign up
                </button>
              </div>
            </>
          ) : (
            <>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="username"
                className="login-input login-input-margin"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="login-input"
              />
              <div className="checkbox-container">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="checkbox"
                />
                <span className="checkbox-label">Agree to Terms of Service and Privacy Policy</span>
              </div>
              <button className="login-reg login-reg-primary" onClick={handleRegister}>
                Create Account
              </button>
              <div className="switch-mode">
                Already have an account?{' '}
                <button onClick={() => setLogin(true)} className="switch-link">
                  Sign in
                </button>
              </div>
            </>
          )}
          <div className="social-login-label">Or continue with</div>
          <div className="social-login-buttons">
            <button className="social-login-btn">
              <span className="social-login-icon">G</span>
            </button>
            <button className="social-login-btn">
              <span className="social-login-icon"></span>
            </button>
            <button className="social-login-btn">
              <span className="social-login-icon">Ⓞ</span>
            </button>
          </div>
        </div>
      ) : (
        <div>Logged in!</div>
      )}
    </>
  );
}

export default Login;