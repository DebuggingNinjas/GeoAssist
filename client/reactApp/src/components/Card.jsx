import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

function Card({
  id,
  title,
  price,
  rating,
  image,
  details,
  isFirestore,
  address,
  city,
  province,
  country,
  website,
  googleMapsURI,
  openingHours,
}) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    const placeDetails = {
      id,
      title,
      address: price, // In the current implementation, price is used to show address
      rating,
      image,
      details,
      isFirestore,
      city,
      province,
      country,
      website,
      googleMapsURI,
      openingHours,
    };

    // Navigate to the view page with state containing the place details
    navigate(`/view/${id}`, { state: { place: placeDetails } });
  };

  return (
    <div className="max-w-xs rounded-2xl shadow-md overflow-hidden cursor-pointer transition-transform duration-300 hover:-translate-y-2">
      <div className="relative">
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1507992781348-310259076fe0?q=80&w=2940&auto=format&fit=crop"; // fallback image
          }}
        />
        {rating && (
          <div className="absolute top-2 right-2 flex items-center bg-white text-black rounded-full px-2 py-1 shadow">
            <span className="text-sm mr-1">★</span>
            <span className="text-sm font-outfit font-medium">{rating}</span>
          </div>
        )}
      </div>
      <div className="bg-white p-4 flex items-center justify-between">
        <div className="flex-1 mr-3">
          <h3
            className="text-sm font-outfit font-semibold truncate"
            title={title}
          >
            {title}
          </h3>
          <p
            className="font-outfit text-xs text-blue-500 truncate"
            title={price}
          >
            {price}
          </p>
        </div>
        <button
          className="flex-shrink-0 h-9 w-9 flex items-center justify-center font-outfit bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
          onClick={handleViewDetails}
          title="View Details"
        >
          <FontAwesomeIcon icon={faArrowRight} size="sm" />
        </button>
      </div>
    </div>
  );
}

export default Card;
