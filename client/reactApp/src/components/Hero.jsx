import React, { useState, useEffect, useMemo } from "react";
import Navbar from "./Navbar";
import InputBar from "./InputBar";
import Filters from "./Filters";
import Card from "./Card";
import Footer from "./Footer";
import { useAuth } from "../contexts/authContext";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebase";

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
  const [searchQuery, setSearchQuery] = useState("Toronto");
  const [places, setPlaces] = useState([]);
  const [firestorePlaces, setFirestorePlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);

  const [selectedFilter, setSelectedFilter] = useState("All");

  // Fetch places from both Google API and Firestore
  const fetchPlaces = async () => {
    if (!searchQuery.trim()) return; // avoid empty search
    setLoading(true);
    setSearchError(null);

    try {
      // Fetch from Google Places API
      const googlePlacesPromise = fetchGooglePlaces(searchQuery);

      // Fetch from Firestore
      const firestorePlacesPromise = fetchFirestorePlaces(searchQuery);

      // Wait for both requests to complete
      const [googlePlaces, dbPlaces] = await Promise.all([
        googlePlacesPromise,
        firestorePlacesPromise,
      ]);

      // Set the state with both results
      setPlaces(googlePlaces);
      setFirestorePlaces(dbPlaces);
    } catch (err) {
      console.error("Error fetching places:", err);
      setSearchError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch places from Google Places API
  const fetchGooglePlaces = async (query) => {
    try {
      const response = await fetch(PLACES_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": GOOGLE_API_KEY,
          "X-Goog-FieldMask":
            "places.displayName,places.formattedAddress,places.priceLevel,places.id,places.photos,places.rating,places.reviews,places.userRatingCount,places.googleMapsUri,places.websiteUri,places.regularOpeningHours,places.editorialSummary,places.shortFormattedAddress",
        },
        body: JSON.stringify({ textQuery: "Tourism locations in " + query }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch places from Google API");
      }

      const data = await response.json();
      console.log("Google API Response:", data);

      return data.places || [];
    } catch (err) {
      console.error("Error fetching from Google Places API:", err);
      return [];
    }
  };

  // Function to fetch places from Firestore based on search query
  const fetchFirestorePlaces = async (searchQuery) => {
    try {
      const locationsRef = collection(db, "locations");
      const locationsSnapshot = await getDocs(locationsRef);

      // Get all locations from Firestore
      const allLocations = locationsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        isFirestore: true, // Mark as Firestore location for rendering differently
      }));

      // Filter locations based on search query
      // Check if city, province, country, or name contains the search query
      const searchLower = searchQuery.toLowerCase();
      const filteredLocations = allLocations.filter((location) => {
        return (
          (location.city &&
            location.city.toLowerCase().includes(searchLower)) ||
          (location.province &&
            location.province.toLowerCase().includes(searchLower)) ||
          (location.country &&
            location.country.toLowerCase().includes(searchLower)) ||
          (location.name &&
            location.name.toLowerCase().includes(searchLower)) ||
          (location.address &&
            location.address.toLowerCase().includes(searchLower))
        );
      });

      console.log("Firestore locations found:", filteredLocations.length);
      return filteredLocations;
    } catch (err) {
      console.error("Error fetching from Firestore:", err);
      return [];
    }
  };

  useEffect(() => {
    fetchPlaces();
  }, []);

  // Combine and sort places from both sources
  const combinedPlaces = useMemo(() => {
    const combined = [...firestorePlaces, ...places];

    switch (selectedFilter) {
      case "Popular":
        // Sort by highest rating
        return combined.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case "Trending":
        // Sort by most user reviews
        return combined.sort((a, b) => {
          // For Firestore locations, use reviews.length
          // For Google locations, use userRatingCount
          const aCount = a.isFirestore
            ? a.reviews?.length || 0
            : a.userRatingCount || 0;
          const bCount = b.isFirestore
            ? b.reviews?.length || 0
            : b.userRatingCount || 0;
          return bCount - aCount;
        });
      case "New":
        // Sort with Firestore locations first (as they're our custom data)
        return combined.sort((a, b) => {
          if (a.isFirestore && !b.isFirestore) return -1;
          if (!a.isFirestore && b.isFirestore) return 1;
          return 0;
        });
      case "All":
      default:
        return combined;
    }
  }, [places, firestorePlaces, selectedFilter]);

  return (
    <>
      <div className="text-center py-0">
        {currentUser && (
          <p className="text-xs pt-2 text-gray-500">
            Logged in as {currentUser.email || "Guest"}
          </p>
        )}
      </div>
      <Navbar currentUser={currentUser} />

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
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
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
      {combinedPlaces.length > 0 ? (
        <div className="grid grid-cols-3 gap-2 w-4/5 mx-auto pb-20">
          {combinedPlaces.map((place) => {
            // Different rendering logic for Firestore vs Google Places
            if (place.isFirestore) {
              // Render Firestore location
              return (
                <Card
                  key={`firestore-${place.id}`}
                  id={place.id}
                  title={place.name || "Unnamed Location"}
                  price={`${place.address || ""}`}
                  rating={place.rating}
                  image={
                    place.image ||
                    "https://images.unsplash.com/photo-1507992781348-310259076fe0?q=80&w=2940&auto=format&fit=crop"
                  }
                  details={place.details}
                  isFirestore={true}
                  address={place.address}
                  city={place.city}
                  province={place.province}
                  country={place.country}
                  // make sure to add this to admin panel
                  website={place.websiteUri}
                  googleMapsURI={place.googleMapsURI}
                  openingHours={place.openingHours}
                />
              );
            } else {
              // Render Google Places API location
              return (
                <Card
                  key={`google-${place.id}`}
                  id={place.id}
                  title={place.displayName?.text}
                  price={place.shortFormattedAddress || "N/A"}
                  rating={place.rating}
                  image={
                    place.photos && place.photos.length > 0
                      ? `https://places.googleapis.com/v1/${place.photos[0].name}/media?key=${GOOGLE_API_KEY}&maxWidthPx=1000`
                      : "https://images.unsplash.com/photo-1507992781348-310259076fe0?q=80&w=2940&auto=format&fit=crop"
                  }
                  isFirestore={false}
                  details={place.editorialSummary?.text}
                  website={place.websiteUri}
                  googleMapsURI={place.googleMapsUri}
                  openingHours={
                    place.regularOpeningHours
                      ? place.regularOpeningHours.weekdayDescriptions
                      : "Hours Unavailable"
                  }
                />
              );
            }
          })}
        </div>
      ) : (
        // Static cards
        <div className="w-4/5 mx-auto pb-20 text-center font-bold">
          No Locations Found
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
