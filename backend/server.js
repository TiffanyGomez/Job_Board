const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const port = 3300;
const db = require('./config/db');

// Import the routes
const entrepriseRoutes = require('./routes/entrepriseRoutes'); 
const jobRoutes = require('./routes/jobRoutes');
const adminRoutes = require('./routes/adminRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const authRoutes = require('./routes/authRoutes'); 
const applicationsRoutes = require('./routes/applicationRoutes'); 



const app = express();
app.use(express.static("../frontend"));


// Enable CORS for frontend communication
app.use(cors({
    origin: 'http://127.0.0.1:3300', 
    credentials: true  // Enable sending cookies from frontend
}));

// Middleware for parsing JSON and form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Express session setup
app.use(session({
    secret: 'your_secret_key',
    resave: true,
    saveUninitialized: true,
    cookie: {
        secure: false,  // Set to true if using HTTPS
        maxAge: 24 * 60 * 60 * 1000 // Session expiration time (1 day)
    }
}));

// Register auth routes
app.use('/api/auth', authRoutes);
app.use('/api/job', jobRoutes); 
app.use('/api/admin', adminRoutes);
app.use('/api/entreprise', entrepriseRoutes); 
app.use('/api/application', applicationsRoutes); 
app.use('/api/employee', employeeRoutes);

// Test route
app.get('/', (req, res) => {
    res.send('Server is running');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
const PORT = process.env.port || 3300;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
