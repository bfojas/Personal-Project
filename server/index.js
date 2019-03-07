const express = require("express");
const app = express();
const session = require("express-session");
const dotenv = require("dotenv");
dotenv.config();
const massive = require("massive");
massive(process.env.CONNECTION_STRING)
  .then(db => {
    app.set("db", db);
    setTimeout(() => {
      db.draw_card().then(cardResponse => {
        drawnCard = cardResponse;
      });
    }, 2000);
  })
  .catch(error => console.log("massive shit", error));
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const authController = require("./authController");
const profileController = require("./profileController");
const connect = require("connect-pg-simple");
const bodyParser = require("body-parser");

const config = {
  bucketName: "dev-fun-bucket",
  region: "us-east-1",
  accessKeyId: process.env.REACT_APP_ACCESS,
  secretAccessKey: process.env.REACT_APP_SECRET
};

app.use(bodyParser.json());
app.use(express.static(`${__dirname}/../build`));

app.use(
  session({
    store: new (connect(session))({
      conString: process.env.CONNECTION_STRING
    }),
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7 * 2
    }
  })
);

let timeLimit = process.env.HOST == "localhost" ? 6 : 16;
let previousCard = [];
let countdown = timeLimit;
let winningGuess = "";
let sockets = [];

io.sockets.on("connection", async socket => {
  sockets.push(socket.id);
  socket.join("gameRoom");
  socket.on("user", user => {
    app
      .get("db")
      .add_user_table({ auth0_id: user.user, socket_id: socket.id })
      .then(announce => {
        // console.log('announce', announce)
        io.sockets
          .to("gameRoom")
          .emit("message", {
            text: `${announce[0].name} has joined`,
            user: "server",
            key: Date.now()
          });
      });
  });

  //receive and handle bets
  socket.on("bet", betRequest => {
    console.log("bet", betRequest);
    let win = false;
    if (winningGuess === "tie" || winningGuess === betRequest.value) {
      win = true;
    }
    app
      .get("db")
      .bet_to_table({
        socket_id: socket.id,
        bet: betRequest.bet,
        win: win
      })
      .catch(error => console.log("bet error", error));
  });

  //initial emits
  socket.emit("messageFromServer", previousCard); //first card
  socket.emit("timer", { countdown: countdown }); //timer
  socket.emit("socketId", socket.id); //socket id to client

  //handle chat messages
  socket.on("chatSend", message => {
    const chatKey = Date.now();
    const { text, user } = message;
    text === "who here?"
      ? io.sockets
          .to("gameRoom")
          .emit("message", { text: "yo momma", user: "Server", key: chatKey })
      : text === "players?"
      ? app
          .get("db")
          .get_players()
          .then(players => {
            let list = "";
            players.forEach(val => (list = list + val.name + ", "));
            // io.sockets.to('gameRoom')
            io.sockets
              .to("gameRoom")
              .emit("message", {
                text: list.slice(0, -2),
                user: "Players",
                key: chatKey
              });
          })
      : io.sockets
          .to("gameRoom")
          .emit("message", { text: text, user: user, key: chatKey });
  });

  socket.on("disconnect", () => {
    app
      .get("db")
      .remove_user_table({ socket_id: socket.id })
      .then(val => {
        const { auth0_id, bet, win } = val[0];
        if (bet !== null) {
          if (win === true) {
            app.get("db").delete_win({ auth0_id, bet });
          } else if (win === false)
            app.get("db").delete_loss({ auth0_id, bet });
        }
        return app.get("db").announce({ auth0_id });
      })
      .then(res => {
        io.sockets
          .to("gameRoom")
          .emit("message", {
            text: `${res[0].name} has left`,
            user: "server",
            key: Date.now()
          });
      });
    sockets = sockets.filter(val => {
      return val !== socket.id;
    });
  });
});

setInterval(function() {
  countdown--;
  io.sockets.emit("timer", { countdown: countdown });
}, 1000);

setInterval(async function() {
  let data = await app.get("db");
  countdown = timeLimit;
  if (!io.sockets.adapter.rooms["gameRoom"]) return;

  //send drawn card
  io.sockets.to("gameRoom").emit("messageFromServer", drawnCard);

  //send bank info to sockets
  sockets.forEach(s => {
    app
      .get("db")
      .get_bank({ socket_id: s })
      .then(res => {
        res.length ? io.sockets.connected[s].emit("stats", res[0]) : null;
      });
  });

  //send winners list
  data
    .winners()
    .then(async winRes => {
      let winners = await winRes;
      if (winners.length) {
        let list = "";
        winners.forEach(val => (list = list + val.name + ", "));

        io.sockets
          .to("gameRoom")
          .emit("message", {
            text: list.slice(0, -2),
            user: `${previousCard[0].code} winners`
          });
      }
    })

    //reset game table
    .then(
      setTimeout(() => {
        app.get("db").clear_table();
      }, 300)
    );

  //draw card
  app
    .get("db")
    .draw_card()
    .then(cardResponse => {
      previousCard = drawnCard.slice(0, 1);
      drawnCard = cardResponse;
      if (previousCard[0].value < drawnCard[0].value) {
        winningGuess = "high";
      } else if (previousCard[0].value > drawnCard[0].value) {
        winningGuess = "low";
      } else {
        {
          winningGuess = "tie";
        }
      }
    });
}, `${timeLimit}000`);

app.get("/auth/callback", authController.login);
app.get("/auth/user-data", authController.getUser);
app.post("/api/logout", profileController.logOut);
app.post("/api/creditcheck", profileController.creditCheck);
app.post("/api/creditadd", profileController.creditAdd);
app.put("/api/edit", profileController.edit);
app.delete("/api/delete/:id", profileController.delete);
app.put("/api/color", profileController.color);
app.put("/api/upload", profileController.upload);

const path = require("path");
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../build/index.html"));
});

const PORT = 4000;
server.listen(PORT, () => console.log(`server on ${PORT}`));
