const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

// Temporary in-memory data store
let orders = [];
let nextOrderId = 1;

// Create an order
app.post('/orders', (req, res) => {
    const { item, quantity } = req.body;

    if (!item || !quantity) {
        return res.status(400).json({ error: 'Item and quantity are required' });
    }

    const newOrder = { id: nextOrderId++, item, quantity, completed: false };
    orders.push(newOrder);

    res.status(201).json(newOrder);
});

// Show an order
app.get('/orders/:id', (req, res) => {
    const orderId = parseInt(req.params.id);
    const order = orders.find(o => o.id === orderId);

    if (!order) {
        return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
});

// Update an order
app.put('/orders/:id', (req, res) => {
    const orderId = parseInt(req.params.id);
    const { item, quantity, completed } = req.body;

    const order = orders.find(o => o.id === orderId);
    if (!order) {
        return res.status(404).json({ error: 'Order not found' });
    }

    if (item !== undefined) order.item = item;
    if (quantity !== undefined) order.quantity = quantity;
    if (completed !== undefined) order.completed = completed;

    res.json(order);
});

// Delete an order
app.delete('/orders/:id', (req, res) => {
    const orderId = parseInt(req.params.id);
    const index = orders.findIndex(o => o.id === orderId);

    if (index === -1) {
        return res.status(404).json({ error: 'Order not found' });
    }

    const deletedOrder = orders.splice(index, 1)[0];
    res.json(deletedOrder);
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
