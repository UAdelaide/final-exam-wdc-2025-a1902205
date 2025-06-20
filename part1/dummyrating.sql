-- 
INSERT INTO WalkRequests (dog_id, requested_time, duration_minutes, location, status)
VALUES
(
    (SELECT dog_id FROM Dogs WHERE name = 'Max'),
    '2025-06-09 08:00:00',
    30,
    'Green Park',
    'completed'
),
(
    (SELECT dog_id FROM Dogs WHERE name = 'Milo'),
    '2025-06-09 09:00:00',
    60,
    'Riverside Trail',
    'completed'
);
