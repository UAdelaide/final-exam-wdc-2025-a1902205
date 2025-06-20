SELECT
    u.username AS walker_username,
    COUNT(r.rating_id) AS total_ratings,
    AVG(r.rating) AS average_rating
    (
        SELECT COUNT(*)
        from
    )
FROM
    Users u
LEFT JOIN
    WalkRatings r ON u.user_id = r.walker_id
WHERE
    u.role = 'walker'
GROUP BY
    u.user_id, u.username;