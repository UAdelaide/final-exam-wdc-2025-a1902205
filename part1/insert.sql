-- Users
-- Two more users with details from the Part2 sample.
-- A user with the username ownerJane，email jane@example.com， password hash hashed123, and role owner.
-- A user with the username walkerMike，email ike@example.com， password hash hashed456, and role walker.

INSERT INTO Users (username, email, password_hash, role)
VALUES
    ('alice123', 'alice@example.com', 'hashed123', 'owner'),
    ('bobwalker', 'bob@example.com', 'hashed456', 'walker'),
    ('carol123', 'carol@example.com', 'hashed789', 'owner'),
    ('ownerJane', 'jane@example.com', 'hashed123', 'owner'),
    ('walkerMike', 'ike@example.com', 'hashed456', 'walker');

-- Dogs
-- Three more dogs with details from the Part2 sample.
-- A dog named Rocky, who is large and owned by carol123.
-- A dog named Lucy, who is small and owned by alice123.
-- A dog named Milo, who is small and owned by ownerJane.
INSERT INTO Dogs (owner_id, name, size)
VALUES
    ((SELECT user_id FROM Users WHERE username = 'alice123'), 'Max', 'medium'),
    ((SELECT user_id FROM Users WHERE username = 'carol123'), 'Bella', 'small'),
    ((SELECT user_id FROM Users WHERE username = 'carol123'), 'Rocky', 'large'),
    ((SELECT user_id FROM Users WHERE username = 'alice123'), 'Lucy', 'small'),
    ((SELECT user_id FROM Users WHERE username = 'ownerJane'), 'Milo', 'small');

-- WalkRequests
-- Three more walk requests with details from the Part2 sample.

INSERT INTO WalkRequests (dog_id, requested_time, duration_minutes, location, status)
VALUES
    ((SELECT dog_id FROM Dogs WHERE name = 'Max'), '2025-06-10 08:00:00', 30, 'Parklands', 'open'),
    ((SELECT dog_id FROM Dogs WHERE name = 'Bella'), '2025-06-10 09:30:00', 45, 'Beachside Ave', 'accepted'),
    ((SELECT dog_id FROM Dogs WHERE name = 'Lucy'), '2025-06-10 10:30:00', 45, 'Testplace1', 'open'),
    ((SELECT dog_id FROM Dogs WHERE name = 'Milo'), '2025-06-10 11:30:00', 45, 'Testplace2', 'open'),
    ((SELECT dog_id FROM Dogs WHERE name = 'Rocky'), '2025-06-10 12:30:00', 45, 'Testplace2', 'accepted');