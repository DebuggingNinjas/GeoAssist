import Logo from "../assets/GeoAssist.svg";
import React from "react";
import { doSignOut } from "../firebase/auth";
import { Link } from "react-router-dom";

function Navbar({ currentUser }) {
  return (
    <div className="flex justify-between items-center py-10 mx-30">
      <div>
        <img className="w-32" src={Logo} alt="GeoAssist Logo" />
      </div>

      <ul className="flex gap-4 justify-center items-center">
        <li className="font-outfit">
          <Link to="/">Destinations</Link>
        </li>
        <li className="font-outfit">
          <Link to="/bookings">Bookings</Link>
        </li>
        {currentUser && currentUser.isAdmin && (
          <li className="font-outfit">
            <Link to="/admin">Admin Panel</Link>
          </li>
        )}
        <li
          className="font-outfit px-4 py-2 bg-blue-600 hover:cursor-pointer text-white rounded-3xl"
          onClick={doSignOut}
        >
          Log Out
        </li>
      </ul>
    </div>
  );
}

export default Navbar;
