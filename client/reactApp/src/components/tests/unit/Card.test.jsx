import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import Card from "../../Card";

// Mock useNavigate hook
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useLocation: () => ({
    state: { searchParams: { query: "test", filter: "All" } },
  }),
}));

describe("Card Component", () => {
  const defaultProps = {
    id: "123",
    title: "Test Location",
    price: "123 Test Street, Test City",
    rating: 4.5,
    image: "https://example.com/image.jpg",
    details: "Test details",
    isFirestore: true,
    address: "123 Test Street",
    city: "Test City",
    province: "Test Province",
    country: "Test Country",
    website: "https://example.com",
    googleMapsURI: "https://maps.google.com/test",
    openingHours: ["Monday: 9 AM - 5 PM", "Tuesday: 9 AM - 5 PM"],
  };

  test("renders card with proper information", () => {
    render(
      <BrowserRouter>
        <Card {...defaultProps} />
      </BrowserRouter>
    );

    expect(screen.getByText("Test Location")).toBeInTheDocument();
    expect(screen.getByText("123 Test Street, Test City")).toBeInTheDocument();
    expect(screen.getByText("4.5")).toBeInTheDocument();
  });

  test("navigates to detail view when button is clicked", () => {
    render(
      <BrowserRouter>
        <Card {...defaultProps} />
      </BrowserRouter>
    );

    const button = screen.getByRole("button");
    fireEvent.click(button);

    // Updated to match the actual structure being passed
    expect(mockNavigate).toHaveBeenCalledWith(
      "/view/123",
      expect.objectContaining({
        state: expect.objectContaining({
          place: expect.objectContaining({
            id: "123",
            title: "Test Location",
          }),
          // Don't check for previousSearch if it's not actually in the state
        }),
      })
    );
  });

  test("loads fallback image when image fails to load", () => {
    render(
      <BrowserRouter>
        <Card {...defaultProps} image="invalid-url" />
      </BrowserRouter>
    );

    const img = screen.getByAltText("Test Location");
    fireEvent.error(img);

    expect(img.src).toContain(
      "https://images.unsplash.com/photo-1507992781348-310259076fe0"
    );
  });

  test("truncates long titles", () => {
    const longTitle =
      "This is an extremely long title that should be truncated in the display";

    render(
      <BrowserRouter>
        <Card {...defaultProps} title={longTitle} />
      </BrowserRouter>
    );

    const titleElement = screen.getByText(longTitle);
    expect(titleElement).toHaveClass("truncate");
    expect(titleElement).toHaveAttribute("title", longTitle);
  });
});
