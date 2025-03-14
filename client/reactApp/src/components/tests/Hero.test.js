import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import Hero from "../Hero";
import { AuthContext } from "../../contexts/authContext";
import { BrowserRouter } from "react-router-dom";

// Helper function to render the Hero component with required providers
const renderHero = (currentUser = { email: "test@example.com" }) => {
  return render(
    <AuthContext.Provider value={{ currentUser }}>
      <BrowserRouter>
        <Hero />
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

describe("fetchPlaces functionality in Hero Component", () => {
  beforeEach(() => {
    // Reset and mock the global fetch before each test
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("calls the API and displays places on valid query", async () => {
    // Arrange: Setup a successful fetch response
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        places: [
          {
            id: "1",
            displayName: { text: "Place 1" },
            formattedAddress: "Address 1",
            rating: 4.5,
            photos: [{ name: "photo1" }],
          },
        ],
      }),
    });

    // Render the component with an authenticated user
    renderHero();

    // Act: Find the search input, simulate typing and pressing Enter.
    const input = screen.getByPlaceholderText(
      "Search for destinations or activities..."
    );
    fireEvent.change(input, { target: { value: "Test City" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    // Wait for the fetch call and check it was made with the correct parameters.
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining(
        "https://places.googleapis.com/v1/places:searchText"
      ),
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
          "X-Goog-Api-Key": "AIzaSyAwQTkVetyS2nlgLm--hbeLy8V1QA_Veo4",
        }),
        body: JSON.stringify({ textQuery: "Tourism locations in Test City" }),
      })
    );

    // Assert: Verify that the place data is rendered in the UI
    await waitFor(() => {
      expect(screen.getByText("Place 1")).toBeInTheDocument();
      expect(screen.getByText("Address 1")).toBeInTheDocument();
    });
  });

  test("displays error message when API call fails", async () => {
    // Arrange: Setup a failed API response
    global.fetch.mockResolvedValueOnce({
      ok: false,
    });

    renderHero();
    const input = screen.getByPlaceholderText(
      "Search for destinations or activities..."
    );
    fireEvent.change(input, { target: { value: "Error City" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    // Assert: Wait for the error message to appear on the UI
    const errorMessage = await screen.findByText("Failed to fetch places");
    expect(errorMessage).toBeInTheDocument();
  });
});
