update users set color = ${color} where auth0_id = ${auth0_id}

returning color;