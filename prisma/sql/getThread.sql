-- @param {String} $1:title Title of the thread
select
	th.*,
	u.name as username,
	u.image_url as image_url,
	r.name as role
from
	threads th,
	users u ,
	user_roles ur,
	roles r
where
	lower(th.name) like $1
	and th.user_id = u.id
	and u.id = ur.user_id
	and r.id = ur.role_id;