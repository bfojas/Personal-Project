-- display winners
select u.name
from users u
join game_table g on u.auth0_id = g.auth0_id
where g.win = true;