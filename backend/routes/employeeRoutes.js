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


// Fetch all employees
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM employee';  
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching employee:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        res.json(results);
    });
});

// Fetch a specific employee listing by ID 
router.get('/id/:employeeId', (req, res) => {
    const employeeId = req.params.employeeId;
    const sql = 'SELECT * FROM employee WHERE id = ?';
    db.query(sql, [employeeId], (err, result) => {
        if (err) {
            console.error('Error fetching employee:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: 'employee not found' });
        }
        res.json(result[0]);
    });
});

//An employee can apply to a job
router.post('/:jobId/application', authenticateSession, (req, res) => {
    if (req.session.user.role !== 'employee') {
        return res.status(403).json({ message: 'Access denied. Only employees can apply for jobs.' });
    }

    const jobId = req.params.jobId;
    const { message } = req.body;
    const employeeId = req.session.user.id;

    const sql = 'INSERT INTO application (employee_id, job_id, message) VALUES (?, ?, ?)';
    db.query(sql, [employeeId, jobId, message], (err, result) => {
        if (err) {
            console.error('Error submitting application:', err);
            return res.status(500).json({ message: 'Error submitting application' });
        }
        res.status(200).json({ message: 'Application submitted successfully' });
    });
});


router.put('/:employeeId/edit', authenticateSession, async(req, res) => {
    const { username, email, first_name, last_name, birthDate, adress, cp, city, password } = req.body;
    const employeeId = req.params.employeeId;

    // Update password only if it's provided
    if (password) {
        const hashedPassword = await hashPassword(password);
        const sql2 = 'UPDATE Employee SET password = ? WHERE id = ?';
        db.query(sql2, [hashedPassword, employeeId], (err, result) => {
            if (err) {
                console.error('Error updating password:', err);
                return res.status(500).json({ message: 'Internal server error' });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Employee not found' });
            }
        });
    }

    // Update other fields
    const sql = 'UPDATE employee SET username = ?, email = ?, first_name = ?, last_name = ?, birthDate = ?, adress = ?, cp = ?, city = ? WHERE id = ?';
    db.query(sql, [username, email, first_name, last_name, birthDate, adress, cp, city, employeeId], (err, result) => {
        if (err) {
            console.error('Error updating Employee:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json({ message: 'Employee updated successfully' });
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
            // Insert employee into the table employee
            const sql = 
                'INSERT INTO employee (username, email, password, last_name, first_name, birthDate, adress, cp, city) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';

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

// This route  DELETE an employee
router.delete('/:employeeId/delete', async (req, res) => {
    const employeeId = req.params.employeeId;
    const sql = 'DELETE FROM employee WHERE id = ?';

    db.query(sql, [employeeId], (err, result) => {
        if (err) {
            console.error('Error deleting employee:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.status(204).send(); t
    });
});



module.exports = router;
