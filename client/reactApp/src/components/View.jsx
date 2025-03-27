import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import {
  faMapPin,
  faClock,
  faStar,
  faGlobe,
  faMapLocationDot,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";

function View() {
  return (
    <div className="relative min-h-screen bg-gray-50">
      <div className="absolute top-6 left-6">
        <Link
          to="/"
          className="flex items-center gap-2 bg-white py-2 px-4 rounded-full shadow-md hover:bg-gray-100 transition-colors"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          <span>Back</span>
        </Link>
      </div>

      <div className="flex justify-center items-center h-screen gap-12">
        <div className="imageContainer w-1/2 ml-12">
          <img
            src="https://images.unsplash.com/photo-1507992781348-310259076fe0?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt=""
            className="rounded-md shadow-lg"
          />
        </div>

        <div className="contentContainer w-1/2 mr-12 bg-white p-6 rounded-md shadow-lg">
          <h3 className="text-3xl font-medium">Eiffel Tower</h3>

          <div className="information flex gap-4 py-5">
            {/* Added box shadow to location element */}
            <div className="text-[#4c4c4c] bg-gray-200 px-3 py-2 rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.1)] flex items-center">
              <FontAwesomeIcon
                icon={faMapPin}
                style={{ color: "#575757" }}
                size="sm"
                className="mr-2"
              />
              Paris, France
            </div>

            {/* Added box shadow to opening hours element */}
            <div className="text-[#4c4c4c] bg-gray-200 px-3 py-2 rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.1)] flex items-center">
              <FontAwesomeIcon
                icon={faClock}
                style={{ color: "#575757" }}
                size="xs"
                className="mr-2"
              />
              Open 9:00 - 22:45
            </div>
          </div>

          <div className="description">
            <p className="text-[#737074]">
              The Eiffel Tower is a wrought-iron lattice tower located on the
              Champ de Mars in Paris. It is named after engineer Gustave Eiffel,
              whose company designed and built the tower from 1887 to 1889.
            </p>
          </div>

          <div className="cardHolders py-6 flex gap-4 text-[#737074]">
            <div className="infocard">
              <div>Rating</div>
              <FontAwesomeIcon icon={faStar} size="xs" />
              <FontAwesomeIcon icon={faStar} size="xs" />
              <FontAwesomeIcon icon={faStar} size="xs" />
              <FontAwesomeIcon icon={faStar} size="xs" />
              <FontAwesomeIcon icon={faStar} size="xs" />
            </div>
          </div>

          <button className="bg-black text-[#e8e8e8] py-2 px-6 rounded-md text-sm cursor-pointer mr-2">
            <FontAwesomeIcon icon={faGlobe} />
          </button>
          <button className="bg-black text-[#e8e8e8] py-2 px-6 rounded-md text-sm cursor-pointer">
            <FontAwesomeIcon icon={faMapLocationDot} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default View;
