-- display winners
update users
set games = games +1
where auth0_id = (select auth0_id from game_table where bet is not null);

update users 
set wins = wins +1
where auth0_id = (select auth0_id from game_table where win = true);

select u.name
from users u
join game_table g on u.auth0_id = g.auth0_id
where g.win = true;