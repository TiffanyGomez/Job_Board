const express = require('express');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const db = require('../config/db');  // MySQL connection


const router = express.Router();

// function to hash passwords
const hashPassword = async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};

router.post('/signup', [
    body('username').notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('role').notEmpty().withMessage('Role is required')  // Either 'employee' or 'entreprise'
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
 
    const { username, email, password, role, last_name, first_name, birthDate, adress, cp, city } = req.body;
 
    try {
        // Check if the email already exists in both tables
        const sqlCheckEmail = `
            SELECT email FROM employee WHERE email = ?
            UNION
            SELECT email FROM entreprise WHERE email = ?
        `;
        db.query(sqlCheckEmail, [email, email], async (err, results) => {
            if (err) {
                console.error('Database error during email check:', err);
                return res.status(500).json({ message: 'Internal server error' });
            }
 
            if (results.length > 0) {
                return res.status(400).json({ message: 'Email already exists in use.' });
            }
 
            // Hash the password
            const hashedPassword = await hashPassword(password);
 
            // Insert user into the correct table based on the role
            const sql = role === 'employee'
                ? 'INSERT INTO employee (username, email, password, last_name, first_name, birthDate, adress, cp, city) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
                : 'INSERT INTO entreprise (username, email, password, last_name, first_name, birthDate, adress, cp, city) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
 
            db.query(sql, [username, email, hashedPassword, last_name, first_name, birthDate, adress, cp, city], (err, result) => {
                if (err) {
                    console.error('Database error during user registration:', err); 
                    return res.status(500).json({ message: 'Internal server error' });
                }
                res.status(201).json({ message: 'User registered successfully!' });
            });
        });
    } catch (error) {
        console.error('Signup error:', error); // Log the error for debugging
        res.status(500).json({ message: 'Internal server error' });
    }
});



// Login Route for employee, Entreprise, and admin
router.post('/login', [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Query to check if the user exists in employee, Entreprise, or admin table
    const sql = `
        (SELECT 'employee' AS role, id, username, password FROM employee WHERE email = ?)
        UNION
        (SELECT 'entreprise' AS role, id, username, password FROM entreprise WHERE email = ?)
        UNION
        (SELECT 'admin' AS role, id, username, password FROM admin WHERE email = ?)
    `;

    db.query(sql, [email, email, email], async (err, results) => {
        if (err) {
            console.error('Database error during login:', err); // Log the error
            return res.status(500).json({ message: 'Database error' });
        }
        if (results.length === 0) return res.status(400).json({ message: 'User not found' });

        const user = results[0];

        // Check if the password matches
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) return res.status(401).json({ message: 'Invalid credentials' });

        // Store user information in session
        req.session.user = { id: user.id, role: user.role, username: user.username };

        const userId = user.id; 
        const role = user.role; // Fetch this based on user type
        console.log('Session data after login:', req.session.user); // Log session data



        res.json({ userId, role, message: 'Logged in as ${user.role}' });
    });
});

// Route to check if user is authenticated
router.post('/isAuthenticated', (req, res) => {
    if (req.session.user) {
        res.status(200).json({ 
            isAuthenticated: true, 
            user: req.session.user 
        });
    } else {
        res.status(401).json({ 
            isAuthenticated: false, 
            message: 'User not logged in' 
        });
    }
});

// Logout Route
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to log out' });
        }
        res.json({ message: 'Logged out successfully' });
    });
});

module.exports = router;

