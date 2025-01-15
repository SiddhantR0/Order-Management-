const express = require('express');
const db = require('../db/db');
const router = express.Router();

// POST
router.post('/', (req, res) => {
    const { user_id, item, quantity } = req.body;  

    if (!user_id || !item || !quantity) {
        return res.status(400).json({ error: 'User ID, item, and quantity are required' });
    }

    db.query('INSERT INTO orders (user_id, item, quantity) VALUES (?, ?, ?)', [user_id, item, quantity], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error creating order' });
        }

        res.status(201).json({ message: 'Order created successfully', orderId: result.insertId });
    });
});

// GET ALL
router.get('/:user_id', (req, res) => {
    const userId = req.params.user_id;  

    db.query('SELECT * FROM orders WHERE user_id = ?', [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error retrieving orders' });
        }

        res.json(results);
    });
});

// GET SPECIFIC
router.get('/:user_id/:order_id', (req, res) => {
    const orderId = req.params.order_id;
    const userId = req.params.user_id;

    db.query('SELECT * FROM orders WHERE id = ? AND user_id = ?', [orderId, userId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error retrieving order' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.json(results[0]);
    });
});

// PUT
router.put('/:user_id/:order_id', (req, res) => {
    const orderId = req.params.order_id;
    const { item, quantity } = req.body;
    const userId = req.params.user_id;

    if (!item || !quantity) {
        return res.status(400).json({ error: 'Item and quantity are required' });
    }

    db.query('UPDATE orders SET item = ?, quantity = ? WHERE id = ? AND user_id = ?', [item, quantity, orderId, userId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error updating order' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Order not found or not owned by user' });
        }

        res.json({ message: 'Order updated successfully' });
    });
});

// DELETE
router.delete('/:user_id/:order_id', (req, res) => {
    const orderId = req.params.order_id;
    const userId = req.params.user_id;

    db.query('DELETE FROM orders WHERE id = ? AND user_id = ?', [orderId, userId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error deleting order' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Order not found or not owned by user' });
        }

        res.json({ message: 'Order deleted successfully' });
    });
});

module.exports = router;