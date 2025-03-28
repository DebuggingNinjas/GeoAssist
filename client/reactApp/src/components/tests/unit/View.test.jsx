import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import View from "../../View";

// Mock useLocation and useNavigate
const mockNavigate = jest.fn();

// Create a function to reset mocks between tests
beforeEach(() => {
  mockNavigate.mockClear();
});

// Default place data
const defaultPlaceData = {
  title: "Test Location",
  address: "123 Test Street",
  rating: 4.5,
  image: "https://example.com/image.jpg",
  details: "This is a test location with details.",
  city: "Test City",
  province: "Test Province",
  country: "Test Country",
  website: "https://example.com",
  googleMapsURI: "https://maps.google.com/test",
  openingHours: [
    "Monday: 9:00 AM - 5:00 PM",
    "Tuesday: 9:00 AM - 5:00 PM",
    "Wednesday: 9:00 AM - 5:00 PM",
    "Thursday: 9:00 AM - 5:00 PM",
    "Friday: 9:00 AM - 5:00 PM",
    "Saturday: 10:00 AM - 3:00 PM",
    "Sunday: Closed",
  ],
};

// Mock react-router-dom
jest.mock("react-router-dom", () => {
  const original = jest.requireActual("react-router-dom");
  return {
    ...original,
    useLocation: jest.fn().mockImplementation(() => ({
      state: {
        place: defaultPlaceData,
        previousSearch: { query: "toronto", filter: "All" },
      },
    })),
    useNavigate: () => mockNavigate,
    Link: ({ to, children, ...props }) => (
      <a href={to} {...props}>
        {children}
      </a>
    ),
  };
});

// Mock FontAwesomeIcon
jest.mock("@fortawesome/react-fontawesome", () => ({
  FontAwesomeIcon: ({ icon }) => (
    <span data-testid={icon?.iconName || "icon"}></span>
  ),
}));

describe("View Component", () => {
  test("renders location details correctly", () => {
    render(<View />);

    expect(screen.getByText("Test Location")).toBeInTheDocument();
    expect(screen.getByText("123 Test Street")).toBeInTheDocument();
    expect(
      screen.getByText("This is a test location with details.")
    ).toBeInTheDocument();
    expect(screen.getByText("Hours")).toBeInTheDocument();
  });

  test("displays rating stars correctly", () => {
    render(<View />);

    expect(screen.getByText("Rating")).toBeInTheDocument();
    // Check for star icons
    const stars = screen.getAllByTestId(/star/);
    expect(stars.length).toBe(5); // 4 full stars and 1 half star
  });

  test("shows hours when clicked", () => {
    render(<View />);

    const hoursButton = screen.getByText("Hours");
    fireEvent.click(hoursButton);

    // Check for days
    expect(screen.getByText("Monday:")).toBeInTheDocument();
    expect(screen.getByText("Sunday:")).toBeInTheDocument();

    // Use getAllByText for times that appear multiple times
    const mondayHours = screen.getAllByText("9:00 AM - 5:00 PM")[0];
    expect(mondayHours).toBeInTheDocument();

    // Check for the unique "Closed" text
    expect(screen.getByText("Closed")).toBeInTheDocument();
  });

  test("renders fallback image when image URL is invalid", () => {
    // Override the mock for this specific test
    const useLocationMock = require("react-router-dom").useLocation;
    useLocationMock.mockImplementationOnce(() => ({
      state: {
        place: {
          ...defaultPlaceData,
          image: "", // Empty image URL should trigger fallback
        },
      },
    }));

    render(<View />);

    const img = screen.getByAltText("Test Location");
    expect(img.src).toContain("images.unsplash.com");
  });
});
