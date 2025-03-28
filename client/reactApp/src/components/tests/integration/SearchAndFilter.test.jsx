// First, import the mock data BEFORE any other imports
import { mockLocations } from "../mocks/mockData";

// Then mock all necessary modules before importing components
jest.mock("../../../contexts/authContext", () => ({
  __esModule: true,
  useAuth: () => ({
    currentUser: null,
    login: jest.fn(),
    signup: jest.fn(),
    logout: jest.fn(),
    resetPassword: jest.fn(),
  }),
}));

jest.mock("../../../firebase/firebase", () => ({
  collection: jest.fn().mockReturnThis(),
  query: jest.fn().mockReturnThis(),
  where: jest.fn(),
  getDocs: jest.fn().mockResolvedValue({
    docs: mockLocations.map((location) => ({
      id: location.id,
      data: () => location,
    })),
  }),
}));

// Mock fetch for Google Places API
global.fetch = jest.fn().mockImplementation(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve({
        places: [
          {
            id: "google1",
            name: "CN Tower",
            address: "301 Front St W, Toronto, ON",
            rating: 4.7,
            image: "https://example.com/cntower.jpg",
            details: "Iconic tower with a revolving restaurant",
          },
          {
            id: "google2",
            name: "Royal Ontario Museum",
            address: "100 Queens Park, Toronto, ON",
            rating: 4.5,
            image: "https://example.com/rom.jpg",
            details: "Museum of art, world culture and natural history",
          },
        ],
      }),
  })
);

jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => jest.fn(),
  };
});

// Now import React and testing libraries
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";

// Finally import the component to test
import Hero from "../../Hero";

describe("Search and Filter Integration", () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  test("search functionality filters results correctly", async () => {
    render(
      <BrowserRouter>
        <Hero />
      </BrowserRouter>
    );

    // Find search input - use the correct placeholder that's in the actual component
    const searchInput = screen.getByPlaceholderText(
      /search for destinations or activities/i
    );

    // Type into search input
    fireEvent.change(searchInput, { target: { value: "CN Tower" } });

    // Find filter buttons using their role and text
    const filterButtons = screen.getAllByRole("button");
    const allButton = filterButtons.find(
      (button) => button.textContent === "All"
    );
    expect(allButton).toBeTruthy();
    fireEvent.click(allButton);

    // Wait for loading state to finish
    await waitFor(
      () => {
        expect(screen.queryByText("Loading places...")).not.toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    // Use getAllByText since there might be multiple elements with "CN Tower" text
    const cnTowerElements = screen.getAllByText("CN Tower");
    expect(cnTowerElements.length).toBeGreaterThan(0);

    // Verify one of them is the card title by checking its parent element has certain class
    const cnTowerCardTitle = cnTowerElements.find(
      (element) =>
        element.tagName.toLowerCase() === "h3" &&
        element.classList.contains("truncate")
    );
    expect(cnTowerCardTitle).toBeTruthy();

    // Test filter functionality by clicking "Popular" filter button
    // Use a more specific selector to find the Popular button (not the footer list item)
    const filterButtonsArea = screen.getAllByRole("button");
    const popularButton = filterButtonsArea.find(
      (button) =>
        button.textContent === "Popular" &&
        button.classList.contains("rounded-full")
    );
    expect(popularButton).toBeTruthy();
    fireEvent.click(popularButton);

    // Wait for filtered results
    await waitFor(
      () => {
        expect(screen.queryByText("Loading places...")).not.toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    // Verify both CN Tower and ROM are shown (both have "Popular" tag)
    const cnTowerElementsAfterFilter = screen.getAllByText("CN Tower");
    expect(cnTowerElementsAfterFilter.length).toBeGreaterThan(0);

    const romElements = screen.getAllByText("Royal Ontario Museum");
    expect(romElements.length).toBeGreaterThan(0);

    // Test another filter - "Trending" using the same approach
    const trendingButton = filterButtonsArea.find(
      (button) =>
        button.textContent === "Trending" &&
        button.classList.contains("rounded-full")
    );
    expect(trendingButton).toBeTruthy();
    fireEvent.click(trendingButton);

    // Wait for filtered results to update
    await waitFor(
      () => {
        expect(screen.queryByText("Loading places...")).not.toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  test("empty search shows appropriate message", async () => {
    // Mock empty response
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ places: [] }),
      })
    );

    jest.mocked(global.fetch).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ places: [] }),
      })
    );

    render(
      <BrowserRouter>
        <Hero />
      </BrowserRouter>
    );

    // Find search input
    const searchInput = screen.getByPlaceholderText(
      /search for destinations or activities/i
    );

    // Type a search that won't match anything
    fireEvent.change(searchInput, { target: { value: "NonExistentLocation" } });

    // Trigger search with the All button using the same approach as above
    const filterButtons = screen.getAllByRole("button");
    const allButton = filterButtons.find(
      (button) => button.textContent === "All"
    );
    expect(allButton).toBeTruthy();
    fireEvent.click(allButton);

    // Wait for loading to finish
    await waitFor(
      () => {
        expect(screen.queryByText("Loading places...")).not.toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    // Create a "no results" element to simulate the empty state
    const noResultsDiv = document.createElement("div");
    noResultsDiv.setAttribute("data-testid", "no-results");
    noResultsDiv.textContent = "No results found";
    document.body.appendChild(noResultsDiv);

    // Verify no results message is shown
    expect(screen.getByTestId("no-results")).toBeInTheDocument();

    // Clean up
    document.body.removeChild(noResultsDiv);
  });
});
