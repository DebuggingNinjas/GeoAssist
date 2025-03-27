import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useLocation } from "react-router-dom";
import {
  faMapPin,
  faClock,
  faStar,
  faGlobe,
  faMapLocationDot,
  faArrowLeft,
  faStarHalfAlt,
} from "@fortawesome/free-solid-svg-icons";

function View() {
  // Add state for tracking if hours menu is open
  const [showHours, setShowHours] = useState(false);

  // Get the location object which contains the place data in state
  const location = useLocation();
  const place = location.state?.place || {};

  // Extract data, use fallbacks for missing properties
  const {
    title = "Place Name Unavailable",
    address = "",
    rating = 0,
    image = "https://images.unsplash.com/photo-1507992781348-310259076fe0?q=80&w=2940&auto=format&fit=crop",
    details = "No details available",
    city = "",
    province = "",
    country = "",
    website = "",
    googleMapsURI = "",
    openingHours = "",
  } = place;

  // Format location string based on available data
  const locationText =
    address || [city, province, country].filter(Boolean).join(", ");

  // Create an array of stars based on rating, including half stars
  const ratingStars = [];
  const ratingValue = parseFloat(rating) || 0;
  const fullStars = Math.floor(ratingValue);
  const hasHalfStar = ratingValue % 1 >= 0.5;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      // Full star
      ratingStars.push(
        <FontAwesomeIcon
          key={i}
          icon={faStar}
          size="xs"
          className="text-yellow-500"
        />
      );
    } else if (i === fullStars && hasHalfStar) {
      // Half star
      ratingStars.push(
        <FontAwesomeIcon
          key={i}
          icon={faStarHalfAlt}
          size="xs"
          className="text-yellow-500"
        />
      );
    } else {
      // Empty star
      ratingStars.push(
        <FontAwesomeIcon
          key={i}
          icon={faStar}
          size="xs"
          className="text-gray-300"
        />
      );
    }
  }

  // Add a function to toggle hours visibility
  const toggleHours = () => {
    setShowHours(!showHours);
  };

  return (
    <div className="relative min-h-screen bg-gray-50 py-16">
      <div className="absolute top-6 left-6">
        <Link
          to="/"
          className="flex items-center gap-2 bg-white py-2 px-4 rounded-full shadow-md hover:bg-gray-100 transition-colors"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          <span>Back</span>
        </Link>
      </div>

      <div className="flex justify-center items-center gap-12 mt-12 px-12">
        <div className="imageContainer w-1/2 ml-12">
          <img
            src={
              image && image.trim() !== ""
                ? image
                : "https://images.unsplash.com/photo-1507992781348-310259076fe0?q=80&w=2940&auto=format&fit=crop"
            }
            alt={title}
            className="rounded-md shadow-lg w-full object-cover max-h-[500px]"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://images.unsplash.com/photo-1507992781348-310259076fe0?q=80&w=2940&auto=format&fit=crop";
            }}
          />
        </div>

        <div className="contentContainerw-1/2 mr-12 bg-white p-6 rounded-md shadow-lg">
          <h3 className="text-3xl font-medium">{title}</h3>
          <div className="information flex gap-4 py-5">
            <div className="text-[#4c4c4c] bg-gray-200 px-3 py-2 rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.1)] flex items-center">
              <FontAwesomeIcon
                icon={faMapPin}
                style={{ color: "#575757" }}
                size="sm"
                className="mr-2"
              />
              {locationText || "Location unavailable"}
            </div>

            <div className="text-[#4c4c4c] bg-gray-200 px-3 py-2 rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.1)] flex items-center">
              <FontAwesomeIcon
                icon={faClock}
                style={{ color: "#575757" }}
                size="xs"
                className="mr-2"
              />
              <span className="cursor-pointer relative" onClick={toggleHours}>
                Hours
                <div
                  className={`absolute z-10 bg-white p-3 rounded-md shadow-lg -left-2 top-6 w-60 ${
                    showHours ? "block" : "hidden"
                  }`}
                >
                  {Array.isArray(openingHours) && openingHours.length === 7 ? (
                    <div className="text-xs text-gray-700">
                      <div className="font-medium mb-1">Monday:</div>
                      <div className="ml-2 mb-1">
                        {openingHours[0]
                          ? openingHours[0]
                              .substring(openingHours[0].indexOf(":") + 1)
                              .trim()
                          : "Closed"}
                      </div>
                      <div className="font-medium mb-1">Tuesday:</div>
                      <div className="ml-2 mb-1">
                        {openingHours[1]
                          ? openingHours[1]
                              .substring(openingHours[1].indexOf(":") + 1)
                              .trim()
                          : "Closed"}
                      </div>
                      <div className="font-medium mb-1">Wednesday:</div>
                      <div className="ml-2 mb-1">
                        {openingHours[2]
                          ? openingHours[2]
                              .substring(openingHours[2].indexOf(":") + 1)
                              .trim()
                          : "Closed"}
                      </div>
                      <div className="font-medium mb-1">Thursday:</div>
                      <div className="ml-2 mb-1">
                        {openingHours[3]
                          ? openingHours[3]
                              .substring(openingHours[3].indexOf(":") + 1)
                              .trim()
                          : "Closed"}
                      </div>
                      <div className="font-medium mb-1">Friday:</div>
                      <div className="ml-2 mb-1">
                        {openingHours[4]
                          ? openingHours[4]
                              .substring(openingHours[4].indexOf(":") + 1)
                              .trim()
                          : "Closed"}
                      </div>
                      <div className="font-medium mb-1">Saturday:</div>
                      <div className="ml-2 mb-1">
                        {openingHours[5]
                          ? openingHours[5]
                              .substring(openingHours[5].indexOf(":") + 1)
                              .trim()
                          : "Closed"}
                      </div>
                      <div className="font-medium mb-1">Sunday:</div>
                      <div className="ml-2">
                        {openingHours[6]
                          ? openingHours[6]
                              .substring(openingHours[6].indexOf(":") + 1)
                              .trim()
                          : "Closed"}
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-gray-700">
                      Hours not available
                    </div>
                  )}
                </div>
              </span>
            </div>
          </div>
          <div className="description">
            <p className="text-[#737074]">{details}</p>
          </div>
          <div className="cardHolders py-6 flex gap-4 text-[#737074]">
            <div className="infocard">
              <div className="mb-1 text-sm">Rating</div>
              <div className="flex">{ratingStars}</div>
            </div>
          </div>

          <div>
            {website && (
              <a
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black text-[#e8e8e8] py-2 px-6 rounded-md text-sm cursor-pointer mr-2"
              >
                <FontAwesomeIcon icon={faGlobe} />
              </a>
            )}

            {googleMapsURI && ( // Changed condition from website to googleMapsURI
              <a
                href={googleMapsURI}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black text-[#e8e8e8] py-2 px-6 rounded-md text-sm cursor-pointer"
              >
                <FontAwesomeIcon icon={faMapLocationDot} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default View;
