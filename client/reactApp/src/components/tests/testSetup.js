// Define global mock data that can be used across all tests
global.mockLocations = [
  {
    id: "loc1",
    name: "CN Tower",
    address: "301 Front St W",
    rating: 4.7,
    image: "https://example.com/cntower.jpg",
    details: "Iconic tower with a revolving restaurant",
    city: "Toronto",
    province: "Ontario",
    country: "Canada",
    website: "https://www.cntower.ca",
    googleMapsURI: "https://maps.google.com/?q=CN+Tower",
    openingHours: [
      "Monday: 10:00 AM - 9:00 PM",
      "Tuesday: 10:00 AM - 9:00 PM",
      "Wednesday: 10:00 AM - 9:00 PM",
      "Thursday: 10:00 AM - 9:00 PM",
      "Friday: 10:00 AM - 9:00 PM",
      "Saturday: 10:00 AM - 9:00 PM",
      "Sunday: 10:00 AM - 9:00 PM",
    ],
    coordinates: {
      latitude: 43.6426,
      longitude: -79.3871,
    },
    tags: ["Landmark", "Popular"],
  },
  {
    id: "loc2",
    name: "Royal Ontario Museum",
    address: "100 Queens Park",
    rating: 4.5,
    image: "https://example.com/rom.jpg",
    details: "Museum of art, world culture and natural history",
    city: "Toronto",
    province: "Ontario",
    country: "Canada",
    website: "https://www.rom.on.ca",
    googleMapsURI: "https://maps.google.com/?q=Royal+Ontario+Museum",
    openingHours: [
      "Monday: Closed",
      "Tuesday: 10:00 AM - 5:30 PM",
      "Wednesday: 10:00 AM - 5:30 PM",
      "Thursday: 10:00 AM - 5:30 PM",
      "Friday: 10:00 AM - 5:30 PM",
      "Saturday: 10:00 AM - 5:30 PM",
      "Sunday: 10:00 AM - 5:30 PM",
    ],
    coordinates: {
      latitude: 43.6677,
      longitude: -79.3948,
    },
    tags: ["Museum", "Popular", "Indoor"],
  },
];

// Setup global mocks for Firebase
jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn().mockResolvedValue({
    docs: global.mockLocations.map((location) => ({
      id: location.id,
      data: () => location,
    })),
  }),
  doc: jest.fn(),
  getDoc: jest.fn(),
  deleteDoc: jest.fn().mockResolvedValue({}),
  updateDoc: jest.fn().mockResolvedValue({}),
  addDoc: jest.fn().mockResolvedValue({ id: "new-loc-id" }),
}));

// Mock auth context
jest.mock("../../contexts/authContext", () => ({
  AuthProvider: ({ children }) => children,
  useAuth: () => ({
    currentUser: { uid: "user-123", email: "test@example.com" },
    isAdmin: true,
    login: jest.fn(),
    signup: jest.fn(),
    logout: jest.fn(),
    resetPassword: jest.fn(),
  }),
}));

// Define global fetch mock
global.fetch = jest.fn().mockImplementation(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve({
        places: global.mockLocations.map((location) => ({
          id: location.id,
          name: location.name,
          address: location.address,
          rating: location.rating,
          image: location.image,
          details: location.details,
          website: location.website,
          googleMapsURI: location.googleMapsURI,
        })),
      }),
  })
);
