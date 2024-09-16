WITH latest_thread AS (
    SELECT id, name, updated_at
    FROM threads
    WHERE topic_id = $1::uuid
    ORDER BY updated_at DESC
    LIMIT 1
),
latest_reply AS (
    SELECT DISTINCT ON (thread_id)
        thread_id,
        user_id,
        created_at
    FROM replies
    WHERE thread_id = (SELECT id FROM latest_thread)
    ORDER BY thread_id, created_at DESC
)
SELECT
    lt.id AS id,
    lt.name AS name,
    u.name AS repliedBy,
    COALESCE(lr.created_at, lt.updated_at) AS last_activity_at
FROM latest_thread lt
LEFT JOIN latest_reply lr ON lt.id = lr.thread_id
LEFT JOIN users u ON lr.user_id = u.id;