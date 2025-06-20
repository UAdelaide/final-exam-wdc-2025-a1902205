SELECT
    d.name AS dog_name,
    d.size,
    u.username AS owner_username
FROM
    Dogs d
JOIN
    Users u ON d.owner_id = u.user_id;