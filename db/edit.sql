update users set name = ${user}, email = ${email} , picture =${image} where auth0_id = ${auth0_id}

returning *;