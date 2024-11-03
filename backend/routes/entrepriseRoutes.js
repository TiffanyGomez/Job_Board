const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require('../config/db');
const authenticateSession = require('../middleware/authMiddleware');

const hashPassword = async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};

// Fetch all entreprises
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM entreprise'; 
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching entreprise:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        res.json(results);
    });
});

// Fetch a specific entreprise listing by ID 
router.get('/id/:entrepriseId', (req, res) => {
    const entrepriseId = req.params.entrepriseId; 
    const sql = 'SELECT * FROM entreprise WHERE id = ?';
    db.query(sql, [entrepriseId], (err, result) => {
        if (err) {
            console.error('Error fetching entreprise:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: 'Entreprise not found' });
        }
        res.json(result[0]);
    });
});


router.put('/:entrepriseId/edit', authenticateSession, async(req, res) => {
    const { username, email, first_name, last_name, birthDate, adress, cp, city, password } = req.body;
    const entrepriseId = req.params.entrepriseId;

    // Update password only if it's provided
    if (password) {
        const hashedPassword = await hashPassword(password);
        const sql2 = 'UPDATE entreprise SET password = ? WHERE id = ?';
        db.query(sql2, [hashedPassword, entrepriseId], (err, result) => {
            if (err) {
                console.error('Error updating password:', err);
                return res.status(500).json({ message: 'Internal server error' });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Entreprise not found' });
            }
        });
    }

    // Update other fields
    const sql = 'UPDATE entreprise SET username = ?, email = ?, first_name = ?, last_name = ?, birthDate = ?, adress = ?, cp = ?, city = ? WHERE id = ?';
    db.query(sql, [username, email, first_name, last_name, birthDate, adress, cp, city, entrepriseId], (err, result) => {
        if (err) {
            console.error('Error updating entreprise:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Entreprise not found' });
        }
        res.status(200).json({ message: 'Entreprise updated successfully' });
    });
});




router.post('/create', [
    body('username').notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
 
    const { username, email, password, last_name, first_name, birthDate, adress, cp, city } = req.body;
 
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
            const hash = await hashPassword(password);
            // Insert entreprise into the table enterprise
            const sql = 
                 'INSERT INTO entreprise (username, email, password, last_name, first_name, birthDate, adress, cp, city) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';

            db.query(sql, [username, email, hash, last_name, first_name, birthDate, adress, cp, city], (err, result) => {
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

// This route  DELETE an entreprise
router.delete('/:entrepriseId/delete', async (req, res) => {
    const entrepriseId = req.params.entrepriseId;
    const sql = 'DELETE FROM entreprise WHERE id = ?';

    db.query(sql, [entrepriseId], (err, result) => {
        if (err) {
            console.error('Error deleting entreprise:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Entreprise not found' });
        }

        res.status(204).send(); 
    });
});

module.exports = router;
