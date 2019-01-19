select u.name from users u
join game_table g on g.auth0_id = u.auth0_id;