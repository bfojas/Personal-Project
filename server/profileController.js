const stripe = require("stripe")(process.env.STRIPE_SECRET);

module.exports = {
  logOut: (req, res) => {
    req.session.destroy();
    res.send();
  },

  edit: (req, res) => {
    const db = req.app.get("db");
    const { auth0_id } = req.body;
    const { name, email, image } = req.body.value;
    req.session.user = name;
    req.session.email = email;
    req.session.picture = image;
    db.edit({
      user: name,
      email,
      image,
      auth0_id
    })
      .then(() => res.send())
      .catch(error => console.log("edit error", error));
  },

  delete: (req, res) => {
    const { id } = req.params;
    req.app
      .get("db")
      .delete_user({ auth0_id: id })
      .then(req.session.destroy())
      .then(() => res.send())
      .catch(error => console.log("delete error", error));
  },

  creditCheck: (req, res) => {
    const { id } = req.body.token;
    const { amount } = req.body.user;
    stripe.charges.create(
      { source: id, amount, currency: "usd", description: "dev-mountain.fun!" },
      (error, response) => {
        error
          ? res.status(500).send({ error })
          : res.status(200).send(response);
      }
    );
  },
  creditAdd: (req, res) => {
    const { amount, auth0_id } = req.body.user;
    req.app
      .get("db")
      .add_credit({
        amount,
        auth0_id
      })
      .then(credit => {
        res.send(credit[0]);
      })
      .catch(error => console.log("credit error", error));
  },

  color: (req, res) => {
    const { color, auth0_id } = req.body;
    req.app
      .get("db")
      .edit_color({ color, auth0_id })
      .then(color => res.send(color[0].color));
  },

  upload: (req, res) => {
    const db = req.app.get("db");
    const { auth0_id, image, name, email } = req.body;
    req.session.picture = image;
    db.edit({
      user: name,
      email,
      image,
      auth0_id
    })
      .then(() => res.send())
      .catch(error => console.log("edit error", error));
  }
};
