const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./utils/db');
const cors = require('cors'); // Import cors
const todoRoutes = require('./routes/todoRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Use CORS middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api', todoRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/api`);
});

