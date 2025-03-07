# GeoAssist

GeoAssist is a web-based application designed to help users find, manage, and explore geographic locations with ease. It features a user-friendly interface, a robust backend, and a structured database to support location-based services.

## Features
- **User Authentication**: Secure registration and login system.
- **Location Management**: Add, edit, and remove locations.
- **Favorites System**: Save favorite locations for quick access.
- **Interactive Map**: Display locations using a dynamic map.
- **Admin Panel**: Manage locations and users with an admin interface.

## Tech Stack
- **Frontend**: React.js (client/reactApp)
- **Backend**: Express.js (express)
- **Database**: MySQL (SDAA.sql)
- **APIs**: Google Maps API (or OpenStreetMap)

## Installation
### Prerequisites
- Node.js & npm
- MySQL Database

### Steps
1. Clone the repository:
   ```sh
   git clone https://github.com/DebuggingNinjas/GeoAssist.git
   cd GeoAssist
   ```

2. Install dependencies:
   ```sh
   cd express
   npm install
   ```
   ```sh
   cd ../client/reactApp
   npm install
   ```

3. Configure environment variables:
   - Create a `.env` file in the `express` directory with database credentials and API keys.

4. Start the backend server:
   ```sh
   cd express
   npm start
   ```

5. Start the frontend application:
   ```sh
   cd ../client/reactApp
   npm start
   ```

6. Access the app in the browser at `http://localhost:3000`.

## Database Setup
1. Import the `SDAA.sql` file into your MySQL database.
   ```sh
   mysql -u your_user -p your_database < SDAA.sql
   ```
2. Ensure your `.env` file in `express` matches your database configuration.

## Contributing
1. Fork the repository
2. Create a new branch (`feature-branch`)
3. Commit your changes
4. Push to your fork and create a Pull Request

