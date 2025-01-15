const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');  //
const db = require('./db/db');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use('/users', userRoutes);  
app.use('/orders', orderRoutes); 

app.get('/', (req, res) => {
    res.send('Welcome to the Express Order Management System!');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
