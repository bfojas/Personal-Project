select credit
from users u
join game_table g on u.auth0_id = g.auth0_id
where g.socket_id = ${socket_id};