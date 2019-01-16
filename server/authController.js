const axios = require('axios')

module.exports ={
    login: (req,res) =>{
        const { code } = req.query;
    let redirect_uri = 
        process.env.HOST == "localhost"
        ? `http://${req.headers.host}/auth/callback`
        : `https://${req.headers.host}/auth/callback`
    const payload = {
        client_id: process.env.REACT_APP_AUTH0_CLIENT_ID,
        client_secret: process.env.AUTH0_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        // redirect_uri: `http://${req.headers.host}/auth/callback`
        redirect_uri
    };

    function tradeCodeForAccessToken() {
        // access token looks like 123
        return axios.post(`https://${process.env.REACT_APP_AUTH0_DOMAIN}/oauth/token`, payload);
    }

    function tradeAccessTokenForUserInfo(response) {
        return axios.get(`https://${process.env.REACT_APP_AUTH0_DOMAIN}/userinfo?access_token=${response.data.access_token}`)
    }

    function storeUserInfoInDatabase(response) {
        const user = response.data;
        const db = req.app.get('db');
        return db.get_user([user.sub]).then(users => {
            if (users.length) {
                req.session.user = {
                name: users[0].name,
                email: users[0].email,
                picture: users[0].picture,
                auth0_id: users[0].auth0_id,
                credit: users[0].credit,
                wins: users[0].wins,
                games: users[0].games
                }
            res.redirect('/');
            } else {
                return db.create_user({
                    name: user.nickname,
                    email: user.email,
                    picture: user.picture,
                    auth0_id :user.sub // github|2394723, google|234872
                })
            .then(newUsers => {
                req.session.user = newUsers[0];
                res.redirect('/');
            })}
        })
    }

    tradeCodeForAccessToken()
        .then(tradeAccessTokenForUserInfo)
        .then(storeUserInfoInDatabase)
        .catch(error => {
            console.log('error in login route', error);
            res.status(500).send('Something bad happened on the server');
        });
    },
    getUser: async (req,res) =>{
        const {name, picture, email, auth0_id} = req.session.user
        stats = await req.app.get('db').get_stats({auth0_id})
        // .then(stats => {
            console.log('stats',stats)
            const {credit, wins, games} = stats[0]
            update = {name, picture, email, auth0_id, credit, wins, games}
            res.status(200).json(update)
        // })
        

    }

    
}


