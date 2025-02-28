import Logo from "../assets/GeoAssist.svg";
// prob need to add react-router-dom for routing

function Navbar() {
  return (
    <div className="flex justify-between items-center py-10 mx-30">
      <div>
        <img className="w-32" src={Logo} alt="" />
      </div>

      <ul className="flex gap-4 justify-center items-center">
        <li className="font-outfit">Destinations</li>
        <li className="font-outfit">Bookings</li>
        <li className="font-outfit px-4 py-2 bg-blue-600 text-white rounded-3xl">
          Book Now
        </li>
      </ul>
    </div>
  );
}

export default Navbar;
