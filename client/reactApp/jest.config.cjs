module.exports = {
  testEnvironment: "jsdom",
  roots: ["<rootDir>/src"],
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(jpg|jpeg|png|gif|webp|svg)$":
      "<rootDir>/src/components/tests/__mocks__/fileMock.js",
  },
  setupFilesAfterEnv: ["<rootDir>/src/components/tests/setup.js"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/", "/build/"],
  collectCoverageFrom: [
    "src/**/*.{js,jsx}",
    "!src/**/*.test.{js,jsx}",
    "!**/node_modules/**",
  ],
  setupFiles: ["<rootDir>/src/components/tests/testSetup.js"],
};
