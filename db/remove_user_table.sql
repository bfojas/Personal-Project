delete from game_table where socket_id = ${socket_id}

returning *;