import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import {
  faPenToSquare,
  faTrash,
  faComments,
} from "@fortawesome/free-solid-svg-icons";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";

function Admin() {
  const { currentUser } = useAuth();
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for adding a new location
  const [newLocation, setNewLocation] = useState({
    name: "",
    address: "",
    image: "",
    details: "",
    rating: 0,
    reviews: [],
    city: "",
    province: "",
    country: "",
  });

  // State for editing an existing location
  const [editLocationId, setEditLocationId] = useState(null);
  const [editLocationData, setEditLocationData] = useState({
    name: "",
    address: "",
    image: "",
    details: "",
    rating: 0,
    reviews: [],
    city: "",
    province: "",
    country: "",
  });

  // State for review management
  const [reviewLocationId, setReviewLocationId] = useState(null);
  const [newReview, setNewReview] = useState({
    reviewer_name: "",
    rating: 0,
    review_text: "",
  });

  // Fetch locations
  useEffect(() => {
    const fetchLocations = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "locations"));
        const locationsData = querySnapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));
        setLocations(locationsData);
      } catch (err) {
        setError("Failed to fetch locations.");
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  // Protect the admin route
  if (!currentUser || !currentUser.isAdmin) {
    return <Navigate to="/" />;
  }

  // Helper: Validate that a rating is between 0 and 5
  const isValidRating = (rating) => rating >= 0 && rating <= 5;

  // CREATE (Add a new location)
  const handleAddLocation = async () => {
    const ratingValue = parseFloat(newLocation.rating);
    if (!isValidRating(ratingValue)) {
      setError("Rating must be between 0 and 5.");
      return;
    }
    try {
      const docRef = await addDoc(collection(db, "locations"), newLocation);
      setLocations([...locations, { id: docRef.id, ...newLocation }]);
      setNewLocation({
        name: "",
        address: "",
        image: "",
        details: "",
        rating: 0,
        reviews: [],
        city: "",
        province: "",
        country: "",
      });
      setError(null);
    } catch (err) {
      setError("Error adding location.");
    }
  };

  // DELETE
  const handleDeleteLocation = async (id) => {
    try {
      await deleteDoc(doc(db, "locations", id));
      setLocations(locations.filter((loc) => loc.id !== id));
      setError(null);
    } catch (err) {
      setError("Error deleting location.");
    }
  };

  // Begin EDIT
  const handleEditLocation = (location) => {
    setEditLocationId(location.id);
    setEditLocationData(location);
  };

  // UPDATE (Save changes to an existing location)
  const handleUpdateLocation = async () => {
    const ratingValue = parseFloat(editLocationData.rating);
    if (!isValidRating(ratingValue)) {
      setError("Rating must be between 0 and 5.");
      return;
    }
    try {
      const locationDocRef = doc(db, "locations", editLocationId);
      await updateDoc(locationDocRef, editLocationData);
      setLocations(
        locations.map((loc) =>
          loc.id === editLocationId
            ? { ...editLocationData, id: editLocationId }
            : loc
        )
      );
      setEditLocationId(null);
      setEditLocationData({
        name: "",
        address: "",
        image: "",
        details: "",
        rating: 0,
        reviews: [],
        city: "",
        province: "",
        country: "",
      });
      setError(null);
    } catch (err) {
      setError("Error updating location.");
    }
  };

  // ADD REVIEW
  const handleAddReview = async () => {
    if (!reviewLocationId) return;

    const ratingValue = parseFloat(newReview.rating);
    if (!isValidRating(ratingValue)) {
      setError("Review rating must be between 0 and 5.");
      return;
    }

    try {
      const review = {
        reviewer_name: newReview.reviewer_name,
        rating: ratingValue,
        review_text: newReview.review_text,
        created_at: new Date().toISOString(),
      };
      const locationRef = doc(db, "locations", reviewLocationId);
      await updateDoc(locationRef, {
        reviews: arrayUnion(review),
      });
      // Update local state
      setLocations(
        locations.map((location) =>
          location.id === reviewLocationId
            ? { ...location, reviews: [...(location.reviews || []), review] }
            : location
        )
      );
      setNewReview({ reviewer_name: "", rating: 0, review_text: "" });
      setReviewLocationId(null);
      setError(null);
    } catch (err) {
      setError("Error adding review.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r bg-gray-50">
      <nav className="px-6 py-4 flex items-center justify-between bg-white shadow-sm">
        <div className="flex items-center space-x-8">
          <h1 className="text-xl font-semibold">GeoAssist</h1>
          <ul className="flex space-x-6 text-gray-500">
            <li className="text-black cursor-pointer">
              <Link to="/">Home</Link>
            </li>
            <li className="text-black font-semibold cursor-pointer">
              Dashboard
            </li>
          </ul>
        </div>
      </nav>

      <div className="px-6 py-4 bg-white flex items-center justify-between shadow-sm">
        <input
          type="text"
          placeholder="Search Locations..."
          className="border rounded-md w-full px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
        />
      </div>

      <div className="px-6 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-5">Admin Panel</h1>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          {loading ? (
            <div>Loading locations...</div>
          ) : (
            <>
              <h2 className="text-xl mb-3 font-semibold">Locations</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-100 text-gray-600 text-sm uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Name</th>
                      <th className="py-3 px-4">Address</th>
                      <th className="py-3 px-4">City</th>
                      <th className="py-3 px-4">Province</th>
                      <th className="py-3 px-4">Country</th>
                      <th className="py-3 px-4">Image</th>
                      <th className="py-3 px-4">Details</th>
                      <th className="py-3 px-4">Rating</th>
                      <th className="py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {locations.map((location) => (
                      <tr
                        key={location.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-3 px-4">
                          {editLocationId === location.id ? (
                            <input
                              type="text"
                              value={editLocationData.name}
                              onChange={(e) =>
                                setEditLocationData({
                                  ...editLocationData,
                                  name: e.target.value,
                                })
                              }
                              className="border p-1 w-full rounded focus:outline-none focus:ring-1 focus:ring-blue-200"
                            />
                          ) : (
                            location.name
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {editLocationId === location.id ? (
                            <input
                              type="text"
                              value={editLocationData.address}
                              onChange={(e) =>
                                setEditLocationData({
                                  ...editLocationData,
                                  address: e.target.value,
                                })
                              }
                              className="border p-1 w-full rounded focus:outline-none focus:ring-1 focus:ring-blue-200"
                            />
                          ) : (
                            location.address
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {editLocationId === location.id ? (
                            <input
                              type="text"
                              value={editLocationData.city || ""}
                              onChange={(e) =>
                                setEditLocationData({
                                  ...editLocationData,
                                  city: e.target.value,
                                })
                              }
                              className="border p-1 w-full rounded focus:outline-none focus:ring-1 focus:ring-blue-200"
                            />
                          ) : (
                            location.city || "Not specified"
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {editLocationId === location.id ? (
                            <input
                              type="text"
                              value={editLocationData.province || ""}
                              onChange={(e) =>
                                setEditLocationData({
                                  ...editLocationData,
                                  province: e.target.value,
                                })
                              }
                              className="border p-1 w-full rounded focus:outline-none focus:ring-1 focus:ring-blue-200"
                            />
                          ) : (
                            location.province || "Not specified"
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {editLocationId === location.id ? (
                            <input
                              type="text"
                              value={editLocationData.country || ""}
                              onChange={(e) =>
                                setEditLocationData({
                                  ...editLocationData,
                                  country: e.target.value,
                                })
                              }
                              className="border p-1 w-full rounded focus:outline-none focus:ring-1 focus:ring-blue-200"
                            />
                          ) : (
                            location.country || "Not specified"
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {editLocationId === location.id ? (
                            <input
                              type="text"
                              value={editLocationData.image}
                              onChange={(e) =>
                                setEditLocationData({
                                  ...editLocationData,
                                  image: e.target.value,
                                })
                              }
                              className="border p-1 w-full rounded focus:outline-none focus:ring-1 focus:ring-blue-200"
                            />
                          ) : location.image ? (
                            <img
                              src={location.image}
                              alt={location.name}
                              className="w-20 rounded"
                            />
                          ) : (
                            "No image"
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {editLocationId === location.id ? (
                            <input
                              type="text"
                              value={editLocationData.details}
                              onChange={(e) =>
                                setEditLocationData({
                                  ...editLocationData,
                                  details: e.target.value,
                                })
                              }
                              className="border p-1 w-full rounded focus:outline-none focus:ring-1 focus:ring-blue-200"
                            />
                          ) : (
                            location.details
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {editLocationId === location.id ? (
                            <input
                              type="number"
                              step="0.1"
                              min="0"
                              max="5"
                              value={editLocationData.rating}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value) || 0;
                                setEditLocationData({
                                  ...editLocationData,
                                  rating: val,
                                });
                              }}
                              className="border p-1 w-full rounded focus:outline-none focus:ring-1 focus:ring-blue-200"
                            />
                          ) : (
                            location.rating
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {editLocationId === location.id ? (
                            <div className="flex space-x-2">
                              <button
                                onClick={handleUpdateLocation}
                                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditLocationId(null)}
                                className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditLocation(location)}
                                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                              >
                                <FontAwesomeIcon icon={faPenToSquare} />
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteLocation(location.id)
                                }
                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </button>
                              <button
                                onClick={() => setReviewLocationId(location.id)}
                                className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600"
                              >
                                <FontAwesomeIcon icon={faComments} />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Review Form */}
              {reviewLocationId && (
                <div className="mt-5 p-4 border rounded bg-gray-50">
                  <h2 className="text-xl font-semibold mb-3">
                    Add Review for Location ID: {reviewLocationId}
                  </h2>
                  <div className="flex flex-col sm:flex-row gap-2 mb-3">
                    <input
                      type="text"
                      placeholder="Reviewer Name"
                      value={newReview.reviewer_name}
                      onChange={(e) =>
                        setNewReview({
                          ...newReview,
                          reviewer_name: e.target.value,
                        })
                      }
                      className="border p-2 rounded w-full focus:outline-none focus:ring-1 focus:ring-blue-200"
                    />
                    <input
                      type="number"
                      placeholder="Rating"
                      step="0.1"
                      min="0"
                      max="5"
                      value={newReview.rating}
                      onChange={(e) =>
                        setNewReview({
                          ...newReview,
                          rating: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="border p-2 rounded w-full focus:outline-none focus:ring-1 focus:ring-blue-200"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Review Text"
                    value={newReview.review_text}
                    onChange={(e) =>
                      setNewReview({
                        ...newReview,
                        review_text: e.target.value,
                      })
                    }
                    className="border p-2 rounded w-full mb-3 focus:outline-none focus:ring-1 focus:ring-blue-200"
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={handleAddReview}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      Submit Review
                    </button>
                    <button
                      onClick={() => setReviewLocationId(null)}
                      className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Add New Location */}
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-3">Add New Location</h2>
                <div className="flex flex-col sm:flex-row gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Name"
                    value={newLocation.name}
                    onChange={(e) =>
                      setNewLocation({ ...newLocation, name: e.target.value })
                    }
                    className="border p-2 rounded w-full focus:outline-none focus:ring-1 focus:ring-blue-200"
                  />
                  <input
                    type="text"
                    placeholder="Address"
                    value={newLocation.address}
                    onChange={(e) =>
                      setNewLocation({
                        ...newLocation,
                        address: e.target.value,
                      })
                    }
                    className="border p-2 rounded w-full focus:outline-none focus:ring-1 focus:ring-blue-200"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Image URL"
                    value={newLocation.image}
                    onChange={(e) =>
                      setNewLocation({ ...newLocation, image: e.target.value })
                    }
                    className="border p-2 rounded w-full focus:outline-none focus:ring-1 focus:ring-blue-200"
                  />
                  <input
                    type="text"
                    placeholder="Details"
                    value={newLocation.details}
                    onChange={(e) =>
                      setNewLocation({
                        ...newLocation,
                        details: e.target.value,
                      })
                    }
                    className="border p-2 rounded w-full focus:outline-none focus:ring-1 focus:ring-blue-200"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="City"
                    value={newLocation.city}
                    onChange={(e) =>
                      setNewLocation({ ...newLocation, city: e.target.value })
                    }
                    className="border p-2 rounded w-full focus:outline-none focus:ring-1 focus:ring-blue-200"
                  />
                  <input
                    type="text"
                    placeholder="Province"
                    value={newLocation.province}
                    onChange={(e) =>
                      setNewLocation({
                        ...newLocation,
                        province: e.target.value,
                      })
                    }
                    className="border p-2 rounded w-full focus:outline-none focus:ring-1 focus:ring-blue-200"
                  />
                  <input
                    type="text"
                    placeholder="Country"
                    value={newLocation.country}
                    onChange={(e) =>
                      setNewLocation({
                        ...newLocation,
                        country: e.target.value,
                      })
                    }
                    className="border p-2 rounded w-full focus:outline-none focus:ring-1 focus:ring-blue-200"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-2 mb-2">
                  <input
                    type="number"
                    placeholder="Rating"
                    step="0.1"
                    min="0"
                    max="5"
                    value={newLocation.rating}
                    onChange={(e) =>
                      setNewLocation({
                        ...newLocation,
                        rating: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="border p-2 rounded w-full focus:outline-none focus:ring-1 focus:ring-blue-200"
                  />
                </div>
                <button
                  onClick={handleAddLocation}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Add Location
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Admin;
