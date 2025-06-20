const express = require('express');
const path = require('path');
require('dotenv').config();
const session = require('express-session');
const db = require('../models/db');

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));

// added q 13
// Session setup
app.use(session({
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 1000000 } // 1000 seconds
}));


// Routes
const walkRoutes = require('./routes/walkRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/walks', walkRoutes);
app.use('/api/users', userRoutes);

// Route to Return a list of all dogs with their size and owner's username.
app.get('/api/dogs', async (req, res) => {
  try {
    const [rows] = await db.execute(`
        SELECT
            d.name AS dog_name,
            d.size,
            u.username AS owner_username
        FROM
            Dogs d
        JOIN
            Users u ON d.owner_id = u.user_id`);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch dogs' });
  }
});

// Export the app instead of listening here
module.exports = app;
