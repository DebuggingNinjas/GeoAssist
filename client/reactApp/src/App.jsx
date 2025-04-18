import { Routes, Route } from "react-router-dom";
import Hero from "./components/Hero";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Admin from "./components/admin/Admin";
import View from "./components/View";
import { AuthProvider } from "./contexts/authContext";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/view/:id" element={<View />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
