# GeoAssist

GeoAssist is a web-based application designed to help users find, manage, and explore geographic locations with ease. It features a user-friendly interface, a robust backend, and a structured database to support location-based services.

## Getting Started
- Refer to `README.md` for setup instructions
- Refer to `Developer.md` for the file structure and project component layout 
- Refer to `GeoAssist_User_Manual.pdf` for step by step guides on using the platform
# Setup Instructions:
## Installation
### Prerequisites
- Node.js & npm      Install: https://nodejs.org/en/download
- MySQL Database     Install: https://dev.mysql.com/downloads/mysql/

### Steps
1. Clone the repository:
   ```sh
   git clone https://github.com/DebuggingNinjas/GeoAssist.git
   cd GeoAssist
   ```

2. Install dependencies:
   ```sh
  
   cd ../client/reactApp
   npm install
   ```

3. Configure environment variables:
   - Create a `.env` file in the `express` directory with database credentials and API keys.
  
   - Open the `.env` file in a text editor and add information using the format below:
   ```sh DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=yourpassword
   DB_NAME=geoassist
   API_KEY=your_google_maps_api_key
   ```


5. Start the backend server/build the app:
   ```sh
   cd client/reactAPP
   npm run build

   For unit testing
   npm run test
   ```

6. Start the frontend application:
   ```sh
   cd ../client/reactApp
   npm i
   npm run dev
   ```

7. Access the app in the browser at the location provided by the front end, e.g. 'http://localhost:5173/'.

## Database Setup
1. Import the `SDAA.sql` file into your MySQL database.
   ```sh
   mysql -u your_user -p your_database < SDAA.sql
   ```
2. Ensure your `.env` file in `express` matches your database configuration.

## Core Features
- **User Authentication**: Secure registration and login system, with the option to login as guest
- **Location Management**: Add, edit, and remove locations.
- **Interactive Map**: Display locations using a dynamic map.
- **Admin Panel**: Manage locations and users with an admin interface.
