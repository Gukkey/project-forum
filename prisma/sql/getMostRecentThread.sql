SELECT
    t.id AS id,
    t.name AS name,
    u.name AS repliedBy
FROM
    threads t
LEFT JOIN replies r ON t.id = r.thread_id
LEFT JOIN users u ON r.user_id = u.id
WHERE
    t.topic_id = $1::uuid
ORDER BY
    t.updated_at DESC,
    r.created_at DESC
LIMIT 1;
