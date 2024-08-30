-- @param {String} $1:id The id of the user
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
	th.user_id = u.id
	and u.id = ur.user_id
	and r.id = ur.role_id
	and th.id::text = $1 ;