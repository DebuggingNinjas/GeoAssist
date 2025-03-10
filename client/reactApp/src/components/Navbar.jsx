import Logo from "../assets/GeoAssist.svg";

function Navbar() {
  return (
    <div className="navbar-container">
      <div>
        <img className="navbar-logo" src={Logo} alt="" />
      </div>

      <ul className="navbar-menu">
        <li className="navbar-item">Destinations</li>
        <li className="navbar-item">Bookings</li>
        <li className="navbar-item navbar-button">Book Now</li>
      </ul>
    </div>
  );
}

export default Navbar;