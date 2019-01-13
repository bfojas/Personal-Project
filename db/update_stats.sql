update users
set games = games +1
where auth0_id = (select auth0_id from game_table where bet is not null);

update users 
set wins = wins +1
where auth0_id = (select auth0_id from game_table where win = true);
