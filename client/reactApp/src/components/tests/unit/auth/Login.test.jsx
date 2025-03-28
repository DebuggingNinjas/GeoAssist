import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";

// Import the actual modules first
import * as firebaseModule from "../../../../firebase/firebase";
import * as authContextModule from "../../../../contexts/authContext";

// Mock Firebase functions
jest.mock("../../../../firebase/firebase", () => ({
  login: jest.fn(),
}));

// Mock the auth context - use a factory function that returns the mock
jest.mock("../../../../contexts/authContext", () => ({
  useAuth: jest.fn(),
}));

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Now import the component that uses these mocks
import Login from "../../../auth/Login";

describe("Login Component", () => {
  let mockLogin;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Create a mock login function we can track
    mockLogin = jest.fn().mockImplementation((email, password) => {
      return firebaseModule.login(email, password);
    });

    // Setup auth context mock for each test
    authContextModule.useAuth.mockReturnValue({
      currentUser: null,
      login: mockLogin,
    });
  });

  // Test 1: Basic Rendering
  test("renders login form", () => {
    const { container } = render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Check for the heading specifically
    expect(screen.getByRole("heading", { name: "Login" })).toBeInTheDocument();

    // Check for labels
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Password")).toBeInTheDocument();

    // Check for input fields
    expect(container.querySelector('input[type="email"]')).toBeInTheDocument();
    expect(
      container.querySelector('input[type="password"]')
    ).toBeInTheDocument();

    // Check for submit button
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
  });

  // Test 2: Form Validation
  test("validates required fields", () => {
    const { container } = render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Find the login button
    const loginButton = screen.getByRole("button", { name: "Login" });

    // Click the button
    fireEvent.click(loginButton);

    // Check that login function was not called
    expect(mockLogin).not.toHaveBeenCalled();
  });
});
