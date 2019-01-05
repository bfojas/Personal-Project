-- insert into game_table (bet, win)
-- values (${bet}, ${win})
-- where auth0_id = ${auth0_id}

update game_table
set bet = ${bet}, win = ${win}
where socket_id = ${socket_id};

update users
set credit = credit + ${bet}
where auth0_id = (select auth0_id from game_table 
    where win = true and socket_id = ${socket_id});

update users
set credit = credit - ${bet}
where auth0_id = (select auth0_id from game_table 
    where win = false and socket_id = ${socket_id});