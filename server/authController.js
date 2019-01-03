const axios = require('axios')

module.exports ={
    login: (req,res) =>{
        const { code } = req.query;
    console.log('-------------- code', code);
    const payload = {
        client_id: process.env.REACT_APP_AUTH0_CLIENT_ID,
        client_secret: process.env.AUTH0_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: `http://${req.headers.host}/auth/callback`
    };

    function tradeCodeForAccessToken() {
        // access token looks like 123
        return axios.post(`https://${process.env.REACT_APP_AUTH0_DOMAIN}/oauth/token`, payload);
    }

    function tradeAccessTokenForUserInfo(response) {
        console.log('-------------- response.data.access_token', response.data.access_token);
        return axios.get(`https://${process.env.REACT_APP_AUTH0_DOMAIN}/userinfo?access_token=${response.data.access_token}`)
    }

    function storeUserInfoInDatabase(response) {
        console.log('user info', response.data);
        const user = response.data;
        const db = req.app.get('db');
        return db.get_user([user.sub]).then(users => {
            if (users.length) {
                req.session.user = {
                name: users[0].name,
                email: users[0].email,
                picture: users[0].picture,
                auth0_id: users[0].auth0_id,
                credit: users[0].credit
                }
            res.redirect('/');
            } else {
                return db.create_user({
                    name: user.name,
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
    getUser: (req,res) =>{
        res.status(200).json(req.session.user)

    },

    logOut: (req, res) => {
        req.session.destroy();
        res.send();
    },

    editName: (req, res) =>{
        const db = req.app.get('db');
        const {value, auth0_id} = req.body;
        req.session.user = value 
        db.edit_name({value,auth0_id})
        .then(()=>res.send())
        .catch(error=>console.log('edit error', error));
    },
    editEmail: (req, res) =>{
        const db = req.app.get('db');
        const {value, auth0_id} = req.body;
        req.session.email = value 
        db.edit_email({value,auth0_id})
        .then(()=>res.send())
        .catch(error=>console.log('edit error', error));
    },
    editImage: (req, res) =>{
        const db = req.app.get('db');
        const {value, auth0_id} = req.body;
        req.session.picture = value 
        db.edit_image({value,auth0_id})
        .then(()=>res.send())
        .catch(error=>console.log('edit error', error));
    }
}


