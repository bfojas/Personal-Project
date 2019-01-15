insert into users (name, email, picture, auth0_id, credit, wins, games)
values (${name},${email},${picture},${auth0_id}, 100, 0, 0)
returning *;