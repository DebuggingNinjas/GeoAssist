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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";

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

  const [typeFilters, setTypeFilters] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [showTypeFilters, setShowTypeFilters] = useState(false);

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
            "places.displayName,places.formattedAddress,places.priceLevel,places.id,places.photos,places.rating,places.reviews,places.userRatingCount,places.googleMapsUri,places.websiteUri,places.regularOpeningHours,places.editorialSummary,places.shortFormattedAddress,places.types",
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
    let combined = [...firestorePlaces, ...places];

    // First filter by types if any types are selected
    if (selectedTypes.length > 0) {
      combined = combined.filter((place) => {
        // For Google Places API results or Firestore places that might have types
        if (place.types && Array.isArray(place.types)) {
          // Return true if place has ANY of the selected types (OR logic)
          return place.types.some((type) => selectedTypes.includes(type));
        }
        return false;
      });
    }

    // Then apply other filters
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
  }, [places, firestorePlaces, selectedFilter, selectedTypes]);

  // Add this useEffect to extract unique types from places
  useEffect(() => {
    if (places.length > 0) {
      // Extract all types from Google Places API results
      const allTypes = places.flatMap((place) => place.types || []);

      // Get unique types
      const uniqueTypes = [...new Set(allTypes)];

      // Format and sort the types
      const formattedTypes = uniqueTypes
        .map((type) => ({
          original: type,
          formatted: formatTypeName(type),
        }))
        .sort((a, b) => a.formatted.localeCompare(b.formatted));

      setTypeFilters(formattedTypes);
    }
  }, [places]);

  // Add this function to format type names properly
  const formatTypeName = (type) => {
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Create a function to toggle type selection
  const toggleTypeSelection = (type) => {
    setSelectedTypes((prev) => {
      if (prev.includes(type)) {
        // If type is already selected, remove it
        return prev.filter((t) => t !== type);
      } else {
        // If type is not selected, add it
        return [...prev, type];
      }
    });
  };

  // Update the filter button text to show count of selected types
  const getFilterButtonText = () => {
    if (selectedTypes.length === 0) {
      return "Filter by Type";
    } else if (selectedTypes.length === 1) {
      return `${formatTypeName(selectedTypes[0])}`;
    } else {
      return `${selectedTypes.length} Types Selected`;
    }
  };

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

      {/* Add this after the Filters component */}
      <div className="relative w-4/5 mx-auto flex justify-end mb-4">
        <button
          onClick={() => setShowTypeFilters(!showTypeFilters)}
          className="flex items-center bg-white border border-gray-300 rounded-md px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <FontAwesomeIcon icon={faFilter} className="mr-2" />
          {getFilterButtonText()}
        </button>

        {showTypeFilters && (
          <div className="absolute top-full right-0 mt-2 bg-white shadow-lg rounded-md border border-gray-200 z-50 max-h-96 overflow-y-auto w-64">
            <div className="p-2 border-b border-gray-200 bg-gray-50 sticky top-0">
              <h3 className="font-semibold text-gray-700">
                Filter by Place Type
              </h3>
            </div>
            <div className="p-2">
              <button
                onClick={() => {
                  setSelectedTypes([]);
                  // Don't close the dropdown so users can select multiple types
                }}
                className={`block w-full text-left px-3 py-2 rounded-md cursor-pointer ${
                  selectedTypes.length === 0
                    ? "bg-blue-100 text-blue-700"
                    : "hover:bg-gray-100"
                }`}
              >
                Clear All Filters
              </button>

              {/* Apply filter button */}
              <button
                onClick={() => setShowTypeFilters(false)}
                className="block w-full text-center px-3 py-2 mt-2 mb-2 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600"
              >
                Apply Filters ({selectedTypes.length} selected)
              </button>

              <div className="border-t border-gray-200 pt-2">
                {typeFilters.map((type) => (
                  <div
                    key={type.original}
                    className={`flex items-center px-3 py-2 rounded-md cursor-pointer ${
                      selectedTypes.includes(type.original)
                        ? "bg-blue-100 text-blue-700"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => toggleTypeSelection(type.original)}
                  >
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(type.original)}
                      onChange={() => {}} // Handled by the onClick of the parent div
                      className="mr-2"
                    />
                    <span>{type.formatted}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
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
                  website={place.website}
                  googleMapsURI={place.googleMapsURI}
                  openingHours={place.openingHours}
                  types={place.types || []} // Add this line
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
                  types={place.types || []} // Add this line
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
