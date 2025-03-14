// GooglePlacesSearch.js
import React, { useEffect, useState } from "react";

const GOOGLE_API_KEY = "AIzaSyAwQTkVetyS2nlgLm--hbeLy8V1QA_Veo4";
const PLACES_ENDPOINT = "https://places.googleapis.com/v1/places:searchText";

const GooglePlacesSearch = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await fetch(PLACES_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": GOOGLE_API_KEY,
            "X-Goog-FieldMask":
              "places.displayName,places.formattedAddress,places.priceLevel,places.id,places.photos,places.rating",
          },
          body: JSON.stringify({
            textQuery: "Tourists attractions in banff, alberta, canada",
          }),
        });
        if (!response.ok) {
          throw new Error("Failed to fetch places");
        }
        const data = await response.json();
        setPlaces(data.places || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, []);

  if (loading) {
    return <div>Loading places...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="places-container">
      <h2 className="text-2xl font-bold mb-4">Places</h2>
      <ul className="space-y-6">
        {places.map((place) => (
          <li key={place.id} className="border p-4 rounded shadow">
            <h3 className="text-xl font-semibold">{place.displayName?.text}</h3>
            <p>{place.formattedAddress}</p>
            <p>Rating: {place.rating}</p>
            {place.photos && place.photos.length > 0 && (
              <img
                className="mt-2"
                src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${place.photos[0].name}&key=${GOOGLE_API_KEY}`}
                alt={place.displayName?.text}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GooglePlacesSearch;
