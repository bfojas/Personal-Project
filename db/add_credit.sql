update users
set credit = credit + ${amount}
where auth0_id = ${auth0_id}
returning credit;