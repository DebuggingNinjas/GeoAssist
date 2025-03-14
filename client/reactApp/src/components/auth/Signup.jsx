import { useState } from "react";
import {
  doCreateUserWithEmailAndPassword,
  doSendEmailVerification,
  doSignInWithGoogle,
} from "../../firebase/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const navigate = useNavigate();

  const onGoogleSignIn = async () => {
    if (!isSigningIn) {
      setIsSigningIn(true);
      try {
        const userCredential = await doSignInWithGoogle();
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

  const onSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    setError("");
    doCreateUserWithEmailAndPassword(email, password)
      .then((result) => {
        if (result && result.code === "auth/email-already-in-use") {
          console.error("Error:", result);
        } else {
          console.log("Result:", result);
          doSendEmailVerification(); //for email confirmation
          navigate("/");
        }
      })
      .catch((error) => {
        console.error("Unexpected Error:", error.code);
        setError(error.code);
      });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-96">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-1">
          Create an Account
        </h2>
        <p className="text-center text-gray-500 text-sm">
          Enter you details to get started
        </p>

        {error && (
          <p className="text-red-500 text-center text-xs mb-4">{error}</p>
        )}

        <form onSubmit={onSubmit} className="space-y-2">
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
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>
          <p className="text-center text-sm">
            Already have an account?
            <a
              onClick={() => navigate("/login")}
              className="underline ml-1 text-blue-600 hover:cursor-pointer"
            >
              Sign In
            </a>
          </p>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white hover:cursor-pointer py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Create an Account
          </button>
        </form>
        <button
          className="w-full bg-blue-600 mt-2 text-white hover:cursor-pointer py-2 rounded-lg hover:bg-blue-700 transition"
          onClick={onGoogleSignIn}
        >
          <FontAwesomeIcon icon={faGoogle} />
        </button>
      </div>
    </div>
  );
};

export default Signup;
