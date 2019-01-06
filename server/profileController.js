module.exports ={

    logOut: (req, res) => {
        req.session.destroy();
        res.send();
        
    },

    edit: (req, res) =>{
        console.log('req', req.body.value)
        const db = req.app.get('db');
        const {auth0_id} = req.body;
        const {name, email, image} = req.body.value;
        req.session.user = name;
        req.session.email = email;
        req.session.picture = image
        db.edit({
            user:name, email, image, auth0_id})
        .then(()=>res.send())
        .catch(error=>console.log('edit error', error));
    },
    delete: (req,res) =>{
        console.log('delete params',req.params)
        const {id} = req.params;
        req.app.get('db').delete_user({auth0_id:id})
        .then(req.session.destroy())
        .then(()=>res.send())
        .catch(error=>console.log('delete error', error));

    }

}