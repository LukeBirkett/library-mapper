const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const path = require('path');

// Debug logs for environment variables
console.log('Current directory:', __dirname);
console.log('ENV file path:', path.join(__dirname, '../.env'));
require('dotenv').config({ path: path.join(__dirname, '../.env') });
console.log('Environment variables:', {
    PORT: process.env.PORT,
    MONGODB_URI: process.env.MONGODB_URI,
    NODE_ENV: process.env.NODE_ENV
});

const authRoutes = require('./routes/auth');
const libraryRoutes = require('./routes/libraries');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Basic test route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Library Mapper API' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/libraries', libraryRoutes);

// Database Connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    family: 4
})
.then(() => console.log('MongoDB Connected'))
.catch(err => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
});

const PORT = process.env.PORT || 5001;
console.log('Starting server on port:', PORT);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app; 