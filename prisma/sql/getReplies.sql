-- @param {String} $1:id Unique id of the thread
select
	r.*,
	ro.name as role,
	u.name as username
from
	replies r,
	users u,
	roles ro,
	user_roles ur
where
	r.thread_id::text = $1
	and r.user_id = u.id
	and ur.user_id = u.id
	and ro.id = ur.role_id
order by
    r.created_at asc;