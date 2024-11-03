
# Job Portal Project

## Project Overview

This job portal application facilitates job posting, application submission, and administrative management. It comprises a **Node.js Express backend** connected to a **MySQL database** and a **frontend** interface built with HTML, CSS, and JavaScript.

### Features
- Job seekers can view jobs and apply directly.
- Employers can post jobs and manage listings.
- Admins oversee the portal, managing user roles and job postings.

---

## Project Structure

```plaintext
job_portal/
│
├── backend/                   # Backend code and API
│   ├── .env                   # Environment variables
│   ├── package.json           # Dependencies and scripts
│   ├── server.js              # Main server setup
│   ├── config/
│   │   └── db.js              # Database configuration
│   └── routes/
│       └── applicationRoutes.js  # Job application endpoints
│
└── frontend/                  # Frontend code and assets
    ├── index.html             # Main frontend HTML file
    ├── css/
    │   └── index.css          # Styling for the frontend
    └── js/
        └── job-applications.js # JavaScript for frontend interaction
```

---

## Backend Setup

### Prerequisites

- [Node.js](https://nodejs.org/) and [npm](https://npmjs.com/)
- [MySQL](https://www.mysql.com/)

### Configuration

1. **Environment Variables**:
   - Configure database connection details in `backend/.env`:
     ```plaintext
     DB_HOST='localhost'
     DB_USER='root'
     DB_PASSWORD='your_password'
     DB_NAME='job_board'
     DB_PORT=3306
     ```

2. **Install Dependencies**:
   In the `backend` directory, install dependencies:
   ```bash
   npm install
   ```

3. **Database Setup**:
   - Ensure your MySQL server is running.
   - Create a database named `job_board`.
   - Import any initial data or setup SQL if provided.

### Scripts

- Start the server:
  ```bash
  npm start
  ```

### Backend Details

- **server.js**: Initializes the Express server, imports necessary middleware (e.g., CORS, body-parser, session), and loads route configurations.
- **db.js**: Manages the database connection using environment variables.
- **Routes**:
  - **applicationRoutes.js**: Defines API endpoints for job applications, including viewing, applying, and admin-related operations.

---

## Frontend Setup

The frontend is built with static HTML, CSS, and JavaScript. No additional compilation steps are necessary.

### Key Files

- **index.html**: Main entry point. Includes CSS stylesheets and links to JavaScript files.
- **index.css**: Styles the job portal UI elements (e.g., navigation bar, buttons).
- **job-applications.js**: Handles job application functionality. For instance, `applyForJob()` sends a POST request to apply for a job using fetch and processes the response.

---

## Running the Project

1. **Start Backend**: Ensure the backend server is running by navigating to the `backend` directory and executing:
   ```bash
   npm start
   ```

2. **Access the Frontend**: Open `frontend/index.html` in a web browser to interact with the application.

---

## Dependencies

- **Backend**:
  - `bcrypt`: For password hashing.
  - `body-parser`: Parses JSON request bodies.
  - `cors`: Allows cross-origin requests.
  - `express`: Framework for server setup.
  - `express-session`: Manages session data.
  - `express-validator`: Validates input data.
  - `mysql` and `mysql2`: Interfaces with MySQL database.

---

## Contributing

Contributions are welcome! Follow these steps to get started:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/YourFeature
   ```
3. Commit your changes:
   ```bash
   git commit -m 'Add new feature'
   ```
4. Push to your branch and submit a pull request.

---

## License

This project is licensed under the MIT License.

---
