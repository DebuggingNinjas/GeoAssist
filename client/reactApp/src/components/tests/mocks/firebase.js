// Mock Firebase implementation
const mockCollection = jest.fn();
const mockDoc = jest.fn();
const mockAddDoc = jest.fn();
const mockGetDocs = jest.fn();
const mockUpdateDoc = jest.fn();
const mockDeleteDoc = jest.fn();
const mockArrayUnion = jest.fn();

// Mock auth
const mockUser = {
  uid: "test-user-id",
  email: "test@example.com",
  isAdmin: true,
};

const mockCreateUserWithEmailAndPassword = jest.fn();
const mockSignInWithEmailAndPassword = jest.fn();
const mockSignOut = jest.fn();
const mockSendPasswordResetEmail = jest.fn();

const auth = {
  currentUser: mockUser,
  createUserWithEmailAndPassword: mockCreateUserWithEmailAndPassword,
  signInWithEmailAndPassword: mockSignInWithEmailAndPassword,
  signOut: mockSignOut,
  sendPasswordResetEmail: mockSendPasswordResetEmail,
};

// Mock Firestore database
const db = {};

export {
  mockCollection,
  mockDoc,
  mockAddDoc,
  mockGetDocs,
  mockUpdateDoc,
  mockDeleteDoc,
  mockArrayUnion,
  auth,
  db,
  mockUser,
};

export const collection = mockCollection;
export const doc = mockDoc;
export const addDoc = mockAddDoc;
export const getDocs = mockGetDocs;
export const updateDoc = mockUpdateDoc;
export const deleteDoc = mockDeleteDoc;
export const arrayUnion = mockArrayUnion;
