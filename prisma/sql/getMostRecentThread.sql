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

-- export async function getRecentPost(topicId: String) {
--   const mostRecentThread = await prisma.thread.findFirst({
--     select: {
--       id: true,
--       name: true
--     },
--     where: {
--       topic_id: String(topicId)
--     },
--     orderBy: {
--       updated_at: "desc"
--     }
--   })

--   if (!mostRecentThread) {
--     return {
--       id: null,
--       name: null,
--       repliedBy: null
--     }
--   }

--   const mostRecentReplyCreatedBy = await prisma.reply.findFirst({
--     relationLoadStrategy: "join",
--     include: {
--       users: {
--         select: {
--           name: true
--         }
--       }
--     },
--     where: {
--       thread_id: mostRecentThread?.id
--     },
--     orderBy: {
--       created_at: "desc"
--     }
--   })

--   if (!mostRecentReplyCreatedBy?.id) {
--     return {
--       id: mostRecentThread?.id,
--       name: mostRecentThread?.name,
--       repliedBy: null
--     }
--   } else {
--     return {
--       id: mostRecentThread?.id,
--       name: mostRecentThread?.name,
--       repliedBy: mostRecentReplyCreatedBy?.users.name
--     }
--   }
-- }