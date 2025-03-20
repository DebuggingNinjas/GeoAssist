import React, { useState, useEffect, useMemo } from "react";
import Navbar from "./Navbar";
import InputBar from "./InputBar";
import Filters from "./Filters";
import Card from "./Card";
import Footer from "./Footer";
import { useAuth } from "../contexts/authContext";
import { useNavigate } from "react-router-dom";

const GOOGLE_API_KEY = "AIzaSyAwQTkVetyS2nlgLm--hbeLy8V1QA_Veo4";
const PLACES_ENDPOINT = "https://places.googleapis.com/v1/places:searchText";

function Hero() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate("/signup");
    }
  }, [currentUser, navigate]);

  // State for search functionality
  const [query, setQuery] = useState("Toronto");
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);

  const [selectedFilter, setSelectedFilter] = useState("All");

  const fetchPlaces = async () => {
    if (!query.trim()) return; // avoid empty search
    setLoading(true);
    setSearchError(null);
    try {
      const response = await fetch(PLACES_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": GOOGLE_API_KEY,
          "X-Goog-FieldMask":
            "places.displayName,places.formattedAddress,places.priceLevel,places.id,places.photos,places.rating,places.reviews,places.userRatingCount",
        },
        body: JSON.stringify({ textQuery: "Tourism locations in " + query }),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch places");
      }
      const data = await response.json();
      console.log("API Response:", data);
      // Log the photo object for the first place, if available
      if (data.places && data.places[0] && data.places[0].photos) {
        console.log("First photo object:", data.places[0].photos[0]);
      }
      setPlaces(data.places || []);
    } catch (err) {
      console.error("Error fetching places:", err);
      setSearchError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaces();
  }, []);

  const sortedPlaces = useMemo(() => {
    switch (selectedFilter) {
      case "Popular":
        // Sort by highest rating
        return [...places].sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case "Trending":
        // Sort by most user reviews
        return [...places].sort(
          (a, b) => (b.userRatingCount || 0) - (a.userRatingCount || 0)
        );
      case "New":
        // Sort by newest opened date (or use any field representing recency)
        return [...places].sort(
          (a, b) => new Date(b.openedDate) - new Date(a.openedDate)
        );
      case "All":
      default:
        return places;
    }
  }, [places, selectedFilter]);

  return (
    <>
      <div className="text-center py-0">
        {currentUser && (
          <p className="text-xs pt-2 text-gray-500">
            Logged in as {currentUser.email || "Guest"}
          </p>
        )}
      </div>
      <Navbar />

      <div className="text-5xl font-semibold font-outfit text-center">
        Discover Your Next Adventure
      </div>

      <div className="text-lg font-outfit text-center text-[#4B5563] opacity-65 pb-10">
        Explore handpicked destinations around the world
      </div>

      <div className="flex justify-center flex-col pb-10 items-center">
        <InputBar
          iconSize="text-md"
          width="w-4/5"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              fetchPlaces();
            }
          }}
        />
        <Filters
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
        />
      </div>

      {/* Display search status or results */}
      {loading && <div className="text-center">Loading places...</div>}
      {searchError && (
        <div className="text-center text-red-500">{searchError}</div>
      )}
      {places.length > 0 ? (
        <div className="grid grid-cols-3 gap-2 w-4/5 mx-auto pb-20">
          {sortedPlaces.map((place) => {
            if (place.photos && place.photos.length > 0) {
              // console.log(
              //   "Photo object for place",
              //   place.id,
              //   ":",
              //   place.photos[0].name
              // );
              // console.log(places[0].userRatingCount);
            }
            return (
              <Card
                key={place.id}
                title={place.displayName?.text}
                price={place.formattedAddress || "N/A"} // Display location instead of price
                rating={place.rating}
                image={
                  place.photos && place.photos.length > 0
                    ? `https://places.googleapis.com/v1/${place.photos[0].name}/media?key=${GOOGLE_API_KEY}&maxWidthPx=1000`
                    : "https://via.placeholder.com/400"
                }
              />
            );
          })}
        </div>
      ) : (
        // If no search results, show the static cards
        <div className="grid grid-cols-3 gap-4 w-4/5 mx-auto pb-20">
          <Card
            title="Toronto, ON"
            price="$2,500"
            rating={4.5}
            image="https://images.unsplash.com/photo-1507992781348-310259076fe0?q=80&w=2940&auto=format&fit=crop"
          />
          <Card
            title="Toronto, ON"
            price="$2,500"
            rating={4.1}
            image="https://images.unsplash.com/photo-1507992781348-310259076fe0?q=80&w=2940&auto=format&fit=crop"
          />
          <Card
            title="Toronto, ON"
            price="$2,500"
            rating={4.3}
            image="https://images.unsplash.com/photo-1507992781348-310259076fe0?q=80&w=2940&auto=format&fit=crop"
          />
        </div>
      )}

      <div className="w-full py-5">
        <div className="text-5xl pb-2 font-semibold font-outfit text-center">
          Ready to Start Your Journey?
        </div>
        <div className="text-lg font-outfit text-center text-[#4B5563] opacity-65 pb-10">
          Explore handpicked destinations around the world
        </div>
        <div className="flex w-full max-w-xl mb-10 mx-auto items-center border border-gray-300 rounded-md overflow-hidden bg-white">
          <span className="pl-3 text-gray-400">
            <i className="fas fa-envelope"></i>
          </span>
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-grow px-4 py-2 text-gray-700 placeholder-gray-400 focus:outline-none"
          />
          <button className="bg-blue-500 text-white px-4 py-2 hover:bg-blue-600 transition-colors">
            Subscribe
          </button>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Hero;
