import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";

// Mock Firebase modules first
jest.mock("firebase/app", () => ({
  initializeApp: jest.fn(() => ({
    name: "[DEFAULT]",
    options: {},
  })),
}));

jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(() => ({
    app: { name: "[DEFAULT]" },
    currentUser: null,
  })),
  createUserWithEmailAndPassword: jest.fn(),
}));

// Import the actual modules first
import * as firebaseModule from "../../../../firebase/firebase";
import * as authContextModule from "../../../../contexts/authContext";

// Mock Firebase functions
jest.mock("../../../../firebase/firebase", () => ({
  signup: jest.fn(),
  app: {
    name: "[DEFAULT]",
    options: {},
  },
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
import Signup from "../../../auth/Signup";

describe("Signup Component", () => {
  let mockSignup;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Create a mock signup function we can track
    mockSignup = jest.fn();

    // Setup auth context mock for each test
    authContextModule.useAuth.mockReturnValue({
      currentUser: null,
      signup: mockSignup,
    });
  });

  // Test 1: Basic Rendering
  test("renders signup form", () => {
    const { container } = render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    // Check for the heading specifically - adjust to match actual heading
    expect(
      screen.getByRole("heading", { name: "Create an Account" })
    ).toBeInTheDocument();

    // Check for labels
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Password")).toBeInTheDocument();
    expect(screen.getByText("Confirm Password")).toBeInTheDocument();

    // Check for input fields
    expect(container.querySelector('input[type="email"]')).toBeInTheDocument();
    const passwordInputs = container.querySelectorAll('input[type="password"]');
    expect(passwordInputs.length).toBe(2); // Password and Confirm Password

    // Check for submit button with correct text
    expect(
      screen.getByRole("button", { name: "Create an Account" })
    ).toBeInTheDocument();
  });

  // Test 2: Form Validation
  test("validates required fields", () => {
    const { container } = render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    // Find the signup button
    const signupButton = screen.getByRole("button", {
      name: "Create an Account",
    });

    // Click the button
    fireEvent.click(signupButton);

    // Check that signup function was not called
    expect(mockSignup).not.toHaveBeenCalled();
  });

  // Test 3: Password Mismatch Error
  test("validates password matching", async () => {
    const { container } = render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    // Fill out the form
    const emailInput = container.querySelector('input[type="email"]');
    const passwordInputs = container.querySelectorAll('input[type="password"]');
    const passwordInput = passwordInputs[0];
    const confirmPasswordInput = passwordInputs[1];

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "different" } });

    // Submit the form
    const form = container.querySelector("form");
    fireEvent.submit(form);

    // Wait for password mismatch error to appear
    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });

    // Check that signup function was not called
    expect(mockSignup).not.toHaveBeenCalled();
  });
});
