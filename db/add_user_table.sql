insert into game_table (auth0_id, socket_id)
values (${auth0_id}, ${socket_id});

select * from users where auth0_id = ${auth0_id};