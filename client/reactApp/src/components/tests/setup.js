import "@testing-library/jest-dom";
import { jest } from "@jest/globals";

// Add TextEncoder/TextDecoder for React Router
global.TextEncoder = require("util").TextEncoder;
global.TextDecoder = require("util").TextDecoder;

// Mock Firebase
jest.mock("../../firebase/firebase", () => require("./mocks/firebase"));

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Setup global mock for fetch
global.fetch = jest.fn();
