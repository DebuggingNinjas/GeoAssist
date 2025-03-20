import { React, useState } from "react";
import {
  doSignInWithEmailAndPassword,
  doSignInWithGoogle,
  doSignInAnonymously,
} from "../../firebase/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext/index";

const Login = () => {
  const { userLoggedIn } = useAuth();

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!isSigningIn) {
      setIsSigningIn(true);
      try {
        const userCredential = await doSignInWithEmailAndPassword(
          email,
          password
        );
        console.log(`Welcome ${userCredential.user.email}`);
        setError("/");
        navigate("/");
      } catch (error) {
        setError(error.message);
      } finally {
        setIsSigningIn(false);
      }
    }
  };

  const onGoogleSignIn = async () => {
    if (!isSigningIn) {
      // setIsSigningIn(true);
      try {
        const userCredential = await doSignInWithGoogle();
        const user = userCredential.user;
        console.log(`Welcome ${user.displayName}`);
        console.log(`Email: ${user.email}`);
        console.log(`Phone Number: ${user.phoneNumber}`);
        setError("/");
        navigate("/");
      } catch (error) {
        setError(error.message);
      } finally {
        setIsSigningIn(false);
      }
    }
  };

  const onAnonymouslySignIn = async () => {
    if (!isSigningIn) {
      setIsSigningIn(true);
      try {
        const userCredential = await doSignInAnonymously();
        const user = userCredential.user;
        console.log(`Welcome ${user.displayName}`);
        console.log(`Email: ${user.email}`);
        console.log(`Phone Number: ${user.phoneNumber}`);
        setError("");
        navigate("/");
      } catch (error) {
        setError(error.message);
      } finally {
        setIsSigningIn(false);
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-96">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-1">
          Login
        </h2>

        <p className="text-center text-gray-500 text-sm">
          Enter you details to login
        </p>

        {error && (
          <p className="text-red-500 text-center text-sm mb-4">{error}</p>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>
          <p className="text-center text-sm">
            Don't have an account?
            <a
              onClick={() => navigate("/signup")}
              className="underline ml-1 text-blue-600 hover:cursor-pointer"
            >
              Sign Up
            </a>
          </p>
          <button
            type="submit"
            disabled={isSigningIn}
            className="w-full bg-blue-600 hover:cursor-pointer text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isSigningIn ? "Signing In..." : "Login"}
          </button>
        </form>

        <div className="flex gap-4">
          <button
            className="w-full bg-blue-600 mt-2 text-white hover:cursor-pointer py-2 rounded-lg hover:bg-blue-700 transition"
            onClick={onAnonymouslySignIn}
          >
            <FontAwesomeIcon icon={faUser} />
          </button>
          <button
            className="w-full bg-blue-600 mt-2 text-white hover:cursor-pointer py-2 rounded-lg hover:bg-blue-700 transition"
            onClick={onGoogleSignIn}
          >
            <FontAwesomeIcon icon={faGoogle} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
