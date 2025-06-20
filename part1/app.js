var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql2/promise');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

let db;

(async () => {
  try {
    // Connect to MySQL without specifying a database
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '' // No password
    });

    // Create the database if it doesn't exist
    await connection.query('CREATE DATABASE IF NOT EXISTS DogWalkService');
    await connection.end();

    // Now connect to the created database
    db = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'DogWalkService'
    });


    // Create a table if it doesn't exist
    await db.execute(`
        CREATE TABLE Users (
            user_id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            role ENUM('owner', 'walker') NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);


    await db.execute(`
       CREATE TABLE Dogs (
            dog_id INT AUTO_INCREMENT PRIMARY KEY,
            owner_id INT NOT NULL,
            name VARCHAR(50) NOT NULL,
            size ENUM('small', 'medium', 'large') NOT NULL,
            FOREIGN KEY (owner_id) REFERENCES Users(user_id)
        )
    `);

    await db.execute(`
        CREATE TABLE WalkRequests (
            request_id INT AUTO_INCREMENT PRIMARY KEY,
            dog_id INT NOT NULL,
            requested_time DATETIME NOT NULL,
            duration_minutes INT NOT NULL,
            location VARCHAR(255) NOT NULL,
            status ENUM('open', 'accepted', 'completed', 'cancelled') DEFAULT 'open',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (dog_id) REFERENCES Dogs(dog_id)
        )
    `);

    await db.execute(`
        CREATE TABLE WalkApplications (
            application_id INT AUTO_INCREMENT PRIMARY KEY,
            request_id INT NOT NULL,
            walker_id INT NOT NULL,
            applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
            FOREIGN KEY (request_id) REFERENCES WalkRequests(request_id),
            FOREIGN KEY (walker_id) REFERENCES Users(user_id),
            CONSTRAINT unique_application UNIQUE (request_id, walker_id)
        )
    `);


    await db.execute(`
        CREATE TABLE WalkRatings (
            rating_id INT AUTO_INCREMENT PRIMARY KEY,
            request_id INT NOT NULL,
            walker_id INT NOT NULL,
            owner_id INT NOT NULL,
            rating INT CHECK (rating BETWEEN 1 AND 5),
            comments TEXT,
            rated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (request_id) REFERENCES WalkRequests(request_id),
            FOREIGN KEY (walker_id) REFERENCES Users(user_id),
            FOREIGN KEY (owner_id) REFERENCES Users(user_id),
            CONSTRAINT unique_rating_per_walk UNIQUE (request_id)
        )
    `);

    // Insert data as described in question 5
    await db.execute(`
        INSERT INTO Users (username, email, password_hash, role)
        VALUES
            ('alice123', 'alice@example.com', 'hashed123', 'owner'),
            ('bobwalker', 'bob@example.com', 'hashed456', 'walker'),
            ('carol123', 'carol@example.com', 'hashed789', 'owner'),
            ('ownerJane', 'jane@example.com', 'hashed123', 'owner'),
            ('walkerMike', 'ike@example.com', 'hashed456', 'walker')
    `);

    await db.execute(`
        INSERT INTO Dogs (owner_id, name, size)
        VALUES
            ((SELECT user_id FROM Users WHERE username = 'alice123'), 'Max', 'medium'),
            ((SELECT user_id FROM Users WHERE username = 'carol123'), 'Bella', 'small'),
            ((SELECT user_id FROM Users WHERE username = 'carol123'), 'Rocky', 'large'),
            ((SELECT user_id FROM Users WHERE username = 'alice123'), 'Lucy', 'small'),
            ((SELECT user_id FROM Users WHERE username = 'ownerJane'), 'Milo', 'small');

    `);
    await db.execute(`
        INSERT INTO WalkRequests (dog_id, requested_time, duration_minutes, location, status)
        VALUES
            ((SELECT dog_id FROM Dogs WHERE name = 'Max'), '2025-06-10 08:00:00', 30, 'Parklands', 'open'),
            ((SELECT dog_id FROM Dogs WHERE name = 'Bella'), '2025-06-10 09:30:00', 45, 'Beachside Ave', 'accepted'),
            ((SELECT dog_id FROM Dogs WHERE name = 'Lucy'), '2025-06-10 10:30:00', 45, 'Testplace1', 'open'),
            ((SELECT dog_id FROM Dogs WHERE name = 'Milo'), '2025-06-10 11:30:00', 45, 'Testplace2', 'open'),
            ((SELECT dog_id FROM Dogs WHERE name = 'Rocky'), '2025-06-10 12:30:00', 45, 'Testplace2', 'accepted');

    `);

    // Insert dummy data for question 8 to use
    // ohterwise will get all null for total_ratings, average_rating, completed_walks
    // so cannot test whether it's actually working
    // copied from dummyrating.sql
    await db.execute(`
        INSERT INTO WalkRequests (dog_id, requested_time, duration_minutes, location, status)
        VALUES
        (
            (SELECT dog_id FROM Dogs WHERE name = 'Max'),
            '2025-06-09 08:00:00',
            30,
            'Testplace1',
            'completed'
        ),
        (
            (SELECT dog_id FROM Dogs WHERE name = 'Milo'),
            '2025-06-09 09:00:00',
            60,
            'Testplace2',
            'completed'
        );
    `);
    await db.execute(`
    `);
    await db.execute(`
    `);

//     // Insert data if table is empty
//     const [rows] = await db.execute('SELECT COUNT(*) AS count FROM books');
//     if (rows[0].count === 0) {
//       await db.execute(`
//         INSERT INTO books (title, author) VALUES
//         ('1984', 'George Orwell'),
//         ('To Kill a Mockingbird', 'Harper Lee'),
//         ('Brave New World', 'Aldous Huxley')
//       `);
//     }
  } catch (err) {

    // eslint-disable-next-line no-console
    console.error('Error setting up database. Ensure Mysql is running: service mysql start', err);
  }
})();




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


module.exports = app;
