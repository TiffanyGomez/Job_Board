const express = require('express');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const db = require('../config/db');  // MySQL connection
const authenticateSession = require('../middleware/authMiddleware');



const router = express.Router();

// Fetch all applications (available to admin)
router.get('/', authenticateSession, (req, res) => {
    if (req.session.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
    }
    const sql = 'SELECT * FROM application';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching applications:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        res.json(results);
    });
});

// Update an application (available to admin)
router.put('/:id', authenticateSession, (req, res) => {
    if (req.session.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
    }
    const { id } = req.params;
    const { message } = req.body;

    const sql = 'UPDATE application SET message = ? WHERE id = ?';
    db.query(sql, [message, id], (err) => {
        if (err) {
            console.error('Error updating application:', err);
            return res.status(500).json({ message: 'Error updating application' });
        }
        res.json({ message: 'Application updated successfully' });
    });
});

// Delete an application (available to admin)
router.delete('/:id', authenticateSession, (req, res) => {
    if (req.session.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
    }
    const { id } = req.params;

    const sql = 'DELETE FROM application WHERE id = ?';
    db.query(sql, [id], (err) => {
        if (err) {
            console.error('Error deleting application:', err);
            return res.status(500).json({ message: 'Error deleting application' });
        }
        res.json({ message: 'Application deleted successfully' });
    });
});

module.exports = router;
