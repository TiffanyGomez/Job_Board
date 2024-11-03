const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const db = require('../config/db');
const authenticateSession = require('../middleware/authMiddleware');


const router = express.Router();


// Fetch all admins
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM admin';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching admin:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        res.json(results);
    });
});

// Fetch a specific admins listing by ID 
router.get('/:adminId', (req, res) => {
    const jobId = req.params.id;
    const sql = 'SELECT * FROM admin WHERE id = ?';
    db.query(sql, [jobId], (err, result) => {
        if (err) {
            console.error('Error fetching admin:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: 'admin not found' });
        }
        res.json(result[0]);
    });
});


// Update a specific admin account (only admin can update the account)
router.put('/:idAdmin/edit', authenticateSession, (req, res) => {
    if (req.session.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Only admin can update admin account.' });
    }

    const adminId = req.params.adminId;
    const { accountUsername, accountEmail, accountPassword, accountId} = req.body;

    const sql = 'UPDATE admin SET username = ?, email = ?, password = ? WHERE id = ?';
    db.query(sql, [accountUsername, accountEmail, accountPassword, adminId], (err, result) => {
        if (err) {
            console.error('Error updating admin :', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'admin not found or you do not have permission to update this admin.' });
        }
        res.status(200).json({ message: 'admin updated successfully' });
    });
});

const hashPassword = async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};


//Create a new admin
router.post('/create', [
    body('username').notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
 
    const { username, email, password } = req.body;
 
    try {
        // Check if the email already exists in both tables
        const sqlCheckEmail = `
            SELECT email FROM admin WHERE email = ?
            
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
            // Insert admin into the table admin
            const sql = 
                 'INSERT INTO admin (username, email, password) VALUES (?, ?, ?)';

            db.query(sql, [username, email, hashedPassword], (err, result) => {
                if (err) {
                    console.error('Database error during user registration:', err);
                    return res.status(500).json({ message: 'Internal server error' });
                }
                res.status(201).json({ message: 'admin registered successfully!' });
            });
        });
    } catch (error) {
        console.error('Signup error:', error); // Log the error for debugging
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Delete admin by ID
router.delete('/:id/delete', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM admin WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error deleting admin:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        res.status(200).json({ message: 'Admin deleted successfully' });
    });
});


module.exports = router;
