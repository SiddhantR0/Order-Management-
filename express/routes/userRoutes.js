const express = require('express');
const db = require('../db/db');
const router = express.Router();

router.post('/register', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error checking user existence' });
        }

        if (results.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }

        db.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, password], (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Error registering user' });
            }

            res.status(201).json({ message: 'User registered successfully' });
        });
    });
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error checking user existence' });
        }

        if (results.length === 0) {
            return res.status(400).json({ error: 'User not found. Please register first.' });
        }

        const user = results[0];

        if (user.password !== password) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        res.status(200).json({ message: 'Login successful' });
    });
});

module.exports = router;
