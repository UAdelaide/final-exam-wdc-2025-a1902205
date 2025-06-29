-- WalkRequests with status completed
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


-- Assign walkers
-- bobwalker walked Max
INSERT INTO WalkApplications (request_id, walker_id, status)
VALUES(
    (SELECT request_id FROM WalkRequests WHERE dog_id = (SELECT dog_id FROM Dogs WHERE
    name = 'Max') AND requested_time = '2025-06-09 08:00:00'),
    (SELECT user_id FROM Users WHERE username = 'bobwalker'),
    'accepted'
);

-- bobwalker walked Milo
INSERT INTO WalkApplications (request_id, walker_id, status)
VALUES(
    (SELECT request_id FROM WalkRequests WHERE dog_id = (SELECT dog_id FROM Dogs WHERE
    name = 'Milo') AND requested_time = '2025-06-09 09:00:00'),
    (SELECT user_id FROM Users WHERE username = 'bobwalker'),
    'accepted'
);


-- Owners rated walkers
-- alice123 (owner of Max)
INSERT INTO WalkRatings (request_id, walker_id, owner_id, rating, comments)
VALUES(
    (SELECT request_id from WalkRequests WHERE dog_id = (SELECT dog_id from Dogs WHERE
    name = 'Max') AND requested_time = '2025-06-09 08:00:00'),
    (SELECT user_id FROM Users WHERE username = 'bobwalker'),
    (SELECT user_id FROM Users WHERE username = 'alice123'),
    5,
    'empty'
);

-- ownerJane (owner of Milo)
INSERT INTO WalkRatings (request_id, walker_id, owner_id, rating, comments)
VALUES(
    (SELECT request_id from WalkRequests WHERE dog_id = (SELECT dog_id from Dogs WHERE
    name = 'Milo') AND requested_time = '2025-06-09 09:00:00'),
    (SELECT user_id FROM Users WHERE username = 'bobwalker'),
    (SELECT user_id FROM Users WHERE username = 'ownerJane'),
    4,
    'empty'
);



