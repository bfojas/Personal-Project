update users
 set games = games -1 where auth0_id = ${auth0_id};

update users
set wins = wins - 1,
credit = credit - ${bet}
where auth0_id = ${auth0_id}; 

