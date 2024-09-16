WITH thread_counts AS (
    SELECT 
        COUNT(DISTINCT t.id) AS thread_count,
        COUNT(r.id) AS reply_count
    FROM 
        threads t
    LEFT JOIN 
        replies r ON t.id = r.thread_id
    WHERE 
        t.topic_id = $1::uuid
),
latest_thread AS (
    SELECT 
        t.id AS thread_id,
        t.name AS thread_name,
        t.updated_at AS thread_updated_at
    FROM 
        threads t
    WHERE 
        t.topic_id = $1::uuid
    ORDER BY 
        t.updated_at DESC
    LIMIT 1
),
latest_reply AS (
    SELECT 
        r.thread_id,
        r.user_id,
        r.created_at
    FROM 
        replies r
    WHERE 
        r.thread_id = (SELECT thread_id FROM latest_thread)
    ORDER BY 
        r.created_at DESC
    LIMIT 1
)
SELECT 
    lt.thread_id AS latest_thread_id,
    lt.thread_name AS latest_thread_name,
    u.name AS last_replied_by,
    tc.thread_count,
    tc.reply_count
FROM 
    latest_thread lt
LEFT JOIN 
    latest_reply lr ON lt.thread_id = lr.thread_id
LEFT JOIN 
    users u ON lr.user_id = u.id
CROSS JOIN 
    thread_counts tc;