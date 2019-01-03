insert into users (name, email, picture, auth0_id, credit)
values (${name},${email},${picture},${auth0_id}, 0)
returning *;