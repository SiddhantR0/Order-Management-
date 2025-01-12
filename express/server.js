const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;

app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '**************',  
    database: 'order_management'  
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
        return;
    }
    console.log('Connected to the MySQL database.');
});

// POST
app.post('/orders', (req, res) => {
    const { item, quantity } = req.body;

    if (!item || !quantity) {
        return res.status(400).json({ error: 'Item and quantity are required' });
    }

    const sql = 'INSERT INTO orders (item, quantity) VALUES (?, ?)';
    db.query(sql, [item, quantity], (err, result) => {
        if (err) {
            console.error('Error creating order:', err.message);
            return res.status(500).json({ error: 'Failed to create order' });
        }
        const newOrder = { id: result.insertId, item, quantity, completed: false };
        res.status(201).json(newOrder);
    });
});

// GET ALL
app.get('/orders', (req, res) => {
    const sql = 'SELECT * FROM orders';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching orders:', err.message);
            return res.status(500).json({ error: 'Failed to fetch orders' });
        }
        res.json(results);
    });
});

// GET SPECIFIED
app.get('/orders/:id', (req, res) => {
    const orderId = parseInt(req.params.id);
    const sql = 'SELECT * FROM orders WHERE id = ?';
    db.query(sql, [orderId], (err, results) => {
        if (err) {
            console.error('Error fetching order:', err.message);
            return res.status(500).json({ error: 'Failed to fetch order' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.json(results[0]);
    });
});

// PUT
app.put('/orders/:id', (req, res) => {
    const orderId = parseInt(req.params.id);
    const { item, quantity, completed } = req.body;

    const sql = 'UPDATE orders SET item = ?, quantity = ?, completed = ? WHERE id = ?';
    db.query(sql, [item, quantity, completed, orderId], (err, result) => {
        if (err) {
            console.error('Error updating order:', err.message);
            return res.status(500).json({ error: 'Failed to update order' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.json({ id: orderId, item, quantity, completed });
    });
});

// DELETE
app.delete('/orders/:id', (req, res) => {
    const orderId = parseInt(req.params.id);
    const sql = 'DELETE FROM orders WHERE id = ?';
    db.query(sql, [orderId], (err, result) => {
        if (err) {
            console.error('Error deleting order:', err.message);
            return res.status(500).json({ error: 'Failed to delete order' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.json({ message: 'Order deleted successfully' });
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
