const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authenticateSession = require('../middleware/authMiddleware');
 
// Fetch all job  (available to employee users and admin)
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM job';  
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching jobs:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        res.json(results);
    });
});
 
// Fetch a specific job listing by ID (available to all users)
router.get('/id/:id', (req, res) => {
    const jobId = req.params.id;
    const sql = 'SELECT * FROM job WHERE id = ?';
    db.query(sql, [jobId], (err, result) => {
        if (err) {
            console.error('Error fetching job:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.json(result[0]);
    });
});

// Apply to a job (only employees can apply)
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

// Route de recherche d'offres d'emploi
router.get('/search', (req, res) => {
    const query = req.query.query;
 
    if (!query) {
        return res.status(400).json({ message: 'Veuillez fournir un terme de recherche.' });
    }
 
    // Requête pour rechercher les offres dont le titre ou la description correspond
    const sql = 'SELECT * FROM job WHERE title LIKE ? OR description LIKE ?';
    const searchTerm = `%${query}%`;
 
    db.query(sql, [searchTerm, searchTerm], (err, results) => {
        if (err) {
            console.error('Erreur lors de la recherche:', err);
            return res.status(500).json({ message: 'Erreur interne du serveur.' });
        }
        res.json(results);
    });
});
 
// Fetch all jobs for the logged-in entreprise (using session)
router.get('/entreprise/jobs', authenticateSession, (req, res) => {
    if (req.session.user.role !== 'entreprise') {
        return res.status(403).json({ message: 'Access denied. Only entreprises can view their jobs.' });
    }
 
    const entrepriseId = req.session.user.id;  // Use entreprise ID from session
 
    const sql = 'SELECT * FROM job WHERE entreprise_id = ?';
    db.query(sql, [entrepriseId], (err, results) => {
        if (err) {
            console.error('Error fetching jobs:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        res.json(results);
    });
});
 
// Routes to create a new enterprise
router.post('/entreprise/create', authenticateSession, (req, res) => {
    if (req.session.user.role !== 'entreprise' && req.session.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Only entreprises can create jobs.' });
    }
 
    const entrepriseId = req.session.user.id;
    const { title, description, wage, location } = req.body;
 
    if (!title || !description || !wage || !location) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }
 
    const sql = 'INSERT INTO job (title, description, wage, location, entreprise_id) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [title, description, wage, location, entrepriseId], (err, result) => {
        if (err) {
            console.error('Error creating job:', err);
            return res.status(500).json({ message: 'Error creating job' });
        }
        res.status(201).json({ message: 'Job created successfully', jobId: result.insertId });
    });
});
 
// If the authenticateSession is OK we can access to all employee who applies to our jobs
router.get('/:jobId/applicants', authenticateSession, (req, res) => {
    if (req.session.user.role !== 'entreprise') {
        return res.status(403).json({ message: 'Access denied. Only entreprises can view applicants.' });
    }
 
    const jobId = req.params.jobId;
    const entrepriseId = req.session.user.id;
    
    //concat is for have the last name and first name together
    const sql = `
        SELECT CONCAT(employee.last_name, ' ', employee.first_name) AS name
        FROM application
        JOIN employee ON application.employee_id = employee.id
        JOIN job ON application.job_id = job.id
        WHERE application.job_id = ?
        AND job.entreprise_id = ?
    `;
    db.query(sql, [jobId, entrepriseId], (err, results) => {
        if (err) {
            console.error('Error fetching applicants:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        res.json(results);
    });
});
 
 
 
// Update a specific job post (only entreprises can update their own jobs)
router.put('/:jobId/edit', authenticateSession, (req, res) => {
    if (req.session.user.role !== 'entreprise' && req.session.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Only entreprises can update jobs.' });
    }
 
    const jobId = req.params.jobId;
    const { title, description, wage, location } = req.body;
    const entrepriseId = req.session.user.id;
 
    const sql = 'UPDATE job SET title = ?, description = ?, wage = ?, location = ? WHERE id = ? AND entreprise_id = ?';
    db.query(sql, [title, description, wage, location, jobId, entrepriseId], (err, result) => {
        if (err) {
            console.error('Error updating job:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Job not found or you do not have permission to update this job.' });
        }
        res.status(200).json({ message: 'Job updated successfully' });
    });
});

//Route for delete a job
router.delete('/:jobId/delete', async (req, res) => {
    const jobId = req.params.jobId;
    const sql = 'DELETE FROM job WHERE id = ?';

    db.query(sql, [jobId], (err, result) => {
        if (err) {
            console.error('Error deleting job:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Job not found' });
        }

        res.status(204).send(); 
    });
});
 
module.exports = router;