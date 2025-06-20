SELECT
    wr.request_id,
    d.name AS dog_name,
    wr.requested_time,
    wr.duration_minutes,
    wr.location,
    u.username AS owner_username
FROM
    WalkRequests wr
JOIN
    Dogs d ON wr.dog_id = d.dog_id
JOIN
    Users u ON d.owner_id = u.user_id
WHERE
    wr.status = 'open';