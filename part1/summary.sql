SELECT
    u.username AS walker_username,
    COUNT(r.rating_id) AS total_ratings,
    Round(AVG(r.rating),1) AS average_rating,
    (
        SELECT COUNT(*)
        FROM WalkRequests wr
        JOIN WalkApplications wa ON wr.request_id = wa.request_id
        WHERE wr.status = 'completed'
            AND wa.walker_id = u.user_id
            AND wa.status = 'accepted'
    ) As completed_walks
FROM
    Users u
LEFT JOIN
    WalkRatings r ON u.user_id = r.walker_id
WHERE
    u.role = 'walker'
GROUP BY
    u.user_id, u.username;