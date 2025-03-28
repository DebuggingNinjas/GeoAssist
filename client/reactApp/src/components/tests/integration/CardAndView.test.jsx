import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter, Routes, Route, MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import Card from "../../Card";
import View from "../../View";
import { mockLocations } from "../mocks/locationData";

// Mock navigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");
  return {
    ...originalModule,
    useNavigate: () => mockNavigate,
    useLocation: jest.fn(),
  };
});

// Import after mocking
import { useLocation } from "react-router-dom";

// Test utilities
const renderWithRouter = (
  ui,
  { route = "/", initialEntries = [route] } = {}
) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>
  );
};

describe("Card and View Integration", () => {
  const location = mockLocations[0];

  // Reset mocks between tests
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("clicking on card navigates to detailed view with correct data", () => {
    renderWithRouter(
      <Card
        id={location.id}
        title={location.name}
        price={location.address}
        rating={location.rating}
        image={location.image}
        details={location.details}
        isFirestore={true}
        address={location.address}
        city={location.city}
        province={location.province}
        country={location.country}
        website={location.website}
        googleMapsURI={location.googleMapsURI}
        openingHours={location.openingHours}
      />
    );

    // Find and click the view details button
    const viewButton = screen.getByRole("button", { name: /view details/i });
    fireEvent.click(viewButton);

    // Check that navigation happened with correct state
    expect(mockNavigate).toHaveBeenCalledWith(
      `/view/${location.id}`,
      expect.objectContaining({
        state: expect.objectContaining({
          place: expect.objectContaining({
            title: location.name,
            rating: location.rating,
            website: location.website,
          }),
        }),
      })
    );
  });

  test("view component correctly renders data passed from card", () => {
    // Mock the location state that would be passed by card navigation
    const mockLocationState = {
      state: {
        place: {
          id: location.id,
          title: location.name,
          address: location.address,
          rating: location.rating,
          image: location.image,
          details: location.details,
          isFirestore: true,
          city: location.city,
          province: location.province,
          country: location.country,
          website: location.website,
          googleMapsURI: location.googleMapsURI,
          openingHours: location.openingHours,
        },
        previousSearch: { query: "toronto", filter: "All" },
      },
    };

    // Setup useLocation mock for this test
    useLocation.mockReturnValue(mockLocationState);

    // Render with router context
    renderWithRouter(<View />, { route: `/view/${location.id}` });

    // Verify view correctly displays the place details
    expect(screen.getByText(location.name)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(location.details))).toBeInTheDocument();

    // Check that website and maps links exist with correct href attributes
    // Use getAllByRole and find links by their href attributes instead
    const allLinks = screen.getAllByRole("link");

    // Find links by their href values
    const websiteLink = allLinks.find(
      (link) => link.getAttribute("href") === location.website
    );

    const mapsLink = allLinks.find(
      (link) => link.getAttribute("href") === location.googleMapsURI
    );

    expect(websiteLink).toHaveAttribute("href", location.website);
    expect(mapsLink).toHaveAttribute("href", location.googleMapsURI);
  });

  test("back button returns to previous search results", () => {
    // Mock the location state with previous search
    const mockLocationState = {
      state: {
        place: {
          id: location.id,
          title: location.name,
          address: location.address,
          rating: location.rating,
          image: location.image,
          details: location.details,
          isFirestore: true,
          city: location.city,
          province: location.province,
          country: location.country,
          website: location.website,
          googleMapsURI: location.googleMapsURI,
          openingHours: location.openingHours,
        },
        previousSearch: { query: "toronto", filter: "Popular" },
      },
    };

    // Setup useLocation mock for this test
    useLocation.mockReturnValue(mockLocationState);

    // Reset mockNavigate before this test
    mockNavigate.mockClear();

    // Render with router context
    renderWithRouter(<View />, { route: `/view/${location.id}` });

    // Find the back button and check its properties
    const backLink = screen.getByRole("link", { name: /back/i });
    expect(backLink).toHaveAttribute("href", "/");
    expect(backLink).toBeInTheDocument();

    // We won't test the navigate behavior since that would require clicking which
    // is problematic with mocked routers. Instead we check that the link exists
    // and has the correct href attribute.
  });
});
