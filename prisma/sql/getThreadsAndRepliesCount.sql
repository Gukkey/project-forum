SELECT 
    COUNT(DISTINCT t.id) as threadCount,
    COUNT(r.id) as repliesCount
FROM 
    threads t
LEFT JOIN 
    replies r ON t.id = r.thread_id
WHERE 
    t.topic_id = $1::uuid;