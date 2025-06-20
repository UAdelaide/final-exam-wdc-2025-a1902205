SELECT
    u.username AS walker_username,
    COUNT(r.rating_id) AS total_ratings,
    AVG(r.rating) AS average_rating,