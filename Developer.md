# GeoAssist - Developer README

## 🧭 Project Overview
GeoAssist is a geolocation-based web application that allows users to view and filter geolocation-based data points through a modern UI. Built using React for the frontend, it includes user and admin interfaces, search/filter capabilities, and a scalable architecture to support future backend and database integration.

---

## 📁 Folder Structure
```
GeoAssist-master/
├── Files/                     # Design mockups, sample media, and reference files
├── SDAA.sql                   # SQL file to initialize backend database structure
├── client/
│   └── reactApp/             # React-based frontend application
│       ├── public/           # Static assets and root HTML
│       ├── src/
│       │   ├── components/   # All reusable components used in views
│       │   │   ├── admin/    # Admin-specific dashboard component
│       │   ├── App.jsx       # Root component with routing
│       │   ├── Item.jsx      # Component rendering a data item
│       │   ├── main.jsx      # Entry point of React app
│       ├── .env              # Environment variable placeholders (API endpoints, keys)
│       ├── vite.config.js    # Vite configuration for build optimizations
│       ├── jest.setup.js     # Unit testing setup for Jest
├── README.md                 # User/Application Documentation
└── Developer.md              # Developer Documentation
```

---

## ⚛️ Frontend Components & Files

### `App.jsx`
- **Role:** The root-level component housing the entire frontend interface.
- **Details:** Uses routing to navigate between different views (homepage, admin dashboard). Imports global components like `Navbar`, `Footer`, and view-specific containers.

### `main.jsx`
- **Role:** Entry point that attaches the React component tree to the DOM.
- **Key Logic:**
  - Initializes React app using `ReactDOM.createRoot`
  - Imports global stylesheets and `App.jsx`

### `Item.jsx`
- **Role:** Represents a data card that visualizes a geolocation-based item.
- **Props:** Accepts `title`, `description`, `imageUrl`, `location`, etc.
- **Design:** Responsive layout showing an image, location pin, description, and categories.

### `components/Card.jsx`
- **Purpose:** A reusable card component used to render data visually in grid layouts.
- **Props:** `name`, `location`, `description`, `category`, and optional styling props.
- **Integration:** Used within `View.jsx` and `Admin.jsx` to display a collection of items.

### `components/Filters.jsx`
- **Purpose:** Provides filtering UI for categories, keywords, and location.
- **Key Functions:**
  - `handleCategoryChange(category: string)` – Filters displayed data by category
  - `handleSearch(query: string)` – Filters based on user-typed keyword
  - `resetFilters()` – Clears all filters and shows default view

### `components/Footer.jsx`
- **Role:** Displays footer information, contact links, or copyright.
- **Static Component:** No props or interactivity; styled layout only.

### `components/Hero.jsx`
- **Purpose:** Renders a full-width call-to-action banner or hero section.
- **Use Case:** Usually used on the homepage or landing screens to attract user attention.

### `components/InputBar.jsx`
- **Purpose:** Accepts user input for free-text keyword search.
- **Key Logic:**
  - `handleInputChange(event)` – Updates search state in real-time
  - `handleSubmit()` – Triggers search request using the current input

### `components/Navbar.jsx`
- **Purpose:** Top-level navigation bar.
- **Contents:** Logo, navigation links (Home, Admin), and authentication buttons.
- **Features:** Sticky positioning, responsive toggle for mobile.

### `components/View.jsx`
- **Purpose:** Renders a grid view of multiple `Card` components after filtering.
- **Props:** Receives filtered item array and maps each item to a `Card`.

### `components/admin/Admin.jsx`
- **Purpose:** Admin-specific panel that lists uploaded data and admin actions.
- **Functions:**
  - `fetchStats()` – Makes API calls to retrieve current system data
  - `renderTable()` – Renders an admin-specific table view with interactive controls
  - `handleDelete(id)` – Deletes an item or user by ID (simulated or via backend)

---

## 🛢 Database File: `SDAA.sql`
- Defines schema for relational database backend (likely MySQL/PostgreSQL)
- **Tables Include:**
  - `Users`: Stores user credentials and roles (admin/user)
  - `Items`: Stores location-tagged content
  - `Categories`: Master table for filtering options
  - `Logs`: Tracks changes or audit history (optional, if implemented)
- To use:
```bash
mysql -u username -p database_name < SDAA.sql
```

---

## ⚙️ Configuration Files

### `.env`
- **Purpose:** Stores API base URLs, secret tokens, and environment flags.
- **Example:**
```
VITE_API_URL=http://localhost:5000/api
```

### `vite.config.js`
- **Role:** Build and development bundler configuration
- **Highlights:**
  - Optimizes React builds
  - Defines module resolution aliases if used

### `jest.setup.js`
- **Purpose:** Prepares environment before test suites are run
- **Configuration:**
  - Sets up DOM mocking tools
  - Initializes global objects if needed for React Testing Library

---

## 🛠 Setup Instructions

### ✅ Prerequisites
- Node.js >= 16.x (LTS preferred)
- Vite (installed via `npm install`)
- MySQL or compatible RDBMS for `SDAA.sql`

### 🔧 Install & Run (Frontend Only)
```bash
cd GeoAssist-master/client/reactApp
npm install
npm run dev
```

### ⚙️ Setup (Database)
```bash
mysql -u <username> -p <database_name> < SDAA.sql
```

> Visit your app at: `http://localhost:5173`

---

## 🧪 Testing
- Uses **Jest** for unit testing React components
- Folder structure can include `__tests__/` or `.test.jsx` per component
- Basic test template:
```jsx
import { render } from '@testing-library/react';
import Card from '../Card';

test('renders Card with props', () => {
  const { getByText } = render(<Card name="Test" location="Test City" />);
  expect(getByText(/Test/)).toBeInTheDocument();
});
```

---

## 📌 Notes
- Backend code (e.g., Express, FastAPI) is **not included** in this package
- Consider enabling CORS or proxy middleware in dev if backend is hosted separately
- If using `localhost` backend, ensure both ports are synced with CORS rules

---

## 📷 UI Design References (in `/Files`)
- `GeoAssist_Main_Page_Figma.png` – Homepage mockup
- `GeoAssist_Sign_In_Figma.png` – Sign-in screen
- `GeoAssist_Sign_Up_Figma.png` – Sign-up screen
- `.mkv video file` – Demo or screen recording (if available)
---