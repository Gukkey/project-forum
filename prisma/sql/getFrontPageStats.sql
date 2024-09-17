WITH thread_counts AS (
    SELECT
        t.topic_id,
        COUNT(DISTINCT t.id) AS thread_count,
        COUNT(r.id) AS reply_count
    FROM
        threads t
    LEFT JOIN
        replies r ON t.id = r.thread_id
    GROUP BY
        t.topic_id
),
latest_thread_per_topic AS (
    SELECT
        t.topic_id,
        t.id AS latest_thread_id,
        t.name AS latest_thread_name,
        t.updated_at AS latest_thread_updated_at,
        u.name AS latest_thread_created_by,
        ROW_NUMBER() OVER (PARTITION BY t.topic_id ORDER BY t.updated_at DESC) AS rn
    FROM
        threads t
    JOIN
        users u ON t.user_id = u.id
),
latest_reply_per_thread AS (
    SELECT
        r.thread_id,
        u.name AS last_reply_by,
        ROW_NUMBER() OVER (PARTITION BY r.thread_id ORDER BY r.created_at DESC) AS rn
    FROM
        replies r
    JOIN
        users u ON r.user_id = u.id
),
section_topic_info AS (
    SELECT
        s.id AS section_id,
        s.name AS section_name,
        t.id AS topic_id,
        t.name AS topic_name
    FROM
        sections s
    JOIN
        topics t ON t.section_id = s.id
)
SELECT
    sti.section_id,
    sti.section_name,
    sti.topic_id,
    sti.topic_name,
    lt.latest_thread_id,
    lt.latest_thread_name,
    -- lt.latest_thread_updated_at,
    lt.latest_thread_created_by,
    lr.last_reply_by,
    tc.thread_count,
    tc.reply_count
FROM
    section_topic_info sti
LEFT JOIN
    (SELECT * FROM latest_thread_per_topic WHERE rn = 1) lt ON sti.topic_id = lt.topic_id
LEFT JOIN
    (SELECT * FROM latest_reply_per_thread WHERE rn = 1) lr ON lt.latest_thread_id = lr.thread_id
LEFT JOIN
    thread_counts tc ON sti.topic_id = tc.topic_id
ORDER BY
    sti.section_id, sti.topic_id;