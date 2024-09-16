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
        t.updated_at AS thread_updated_at,
        t.user_id AS thread_created_by
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
        r.user_id AS reply_user_id,
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
    tc_user.id AS latest_thread_created_by,
    tc_user.name AS latest_thread_creator_name,
    lr_user.name AS last_replied_by,
    tcount.thread_count,
    tcount.reply_count
FROM 
    latest_thread lt
LEFT JOIN 
    latest_reply lr ON lt.thread_id = lr.thread_id
LEFT JOIN 
    users lr_user ON lr.reply_user_id = lr_user.id
LEFT JOIN 
    users tc_user ON lt.thread_created_by = tc_user.id
CROSS JOIN 
    thread_counts tcount;