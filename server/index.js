
const express = require('express');
const app = express();
const session = require('express-session');
const dotenv = require('dotenv');
dotenv.config();
const massive = require('massive');
massive(process.env.CONNECTION_STRING).then(db =>{
    app.set('db', db);
    setTimeout(()=>{db.draw_card().then(cardResponse=>{
        console.log('initial' ,cardResponse)
        drawnCard = cardResponse
    })},2000)
}).catch(error => console.log('massive shit',error))
const server = require('http').createServer(app)
const io = require('socket.io')(server);
const authController = require('./authController')
const profileController = require('./profileController')
const connect=require('connect-pg-simple');
const bodyParser = require('body-parser');
app.use(bodyParser.json())
app.use( express.static( `${__dirname}/../build` ) );



app.use(session({
    store: new(connect(session))({
        conString: process.env.CONNECTION_STRING
    }),
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave:false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 * 2
    }
}))



let timeLimit = 10;
let previousCard =[];
let countdown = timeLimit;
let winningGuess = '';
let sockets = [];

io.sockets.on('connection', socket =>{
    sockets.push(socket.id)
    console.log('socket push', sockets)
    socket.join('gameRoom');
    socket.on('user', user=>{
        console.log('socket on', user)
        app.get('db').add_user_table({auth0_id: user.user, socket_id: socket.id})
        // console.log('user', user)
    })

//receive and handle bets
    socket.on('bet', betRequest=>{
        console.log(betRequest.auth0_id)
        let win = false;
        if (winningGuess === "tie" || 
        winningGuess === betRequest.value ){
            win = true
        }
        app.get('db').bet_to_table({
            socket_id: socket.id,
            bet: betRequest.bet,
            win: win
        }).catch(error => console.log('bet error', error))
    })

//initial emits
    socket.emit('messageFromServer', previousCard);//first card
    socket.emit('timer', {countdown: countdown});//timer
    socket.emit('socketId', socket.id);//socket id to client

//get initial bank to user
    setTimeout(()=>app.get('db').get_bank({socket_id:socket.id}).then(res=> {
        console.log('get bank',res)
        return io.sockets.connected[socket.id].emit('bank', res[0].credit)}),700)
//handle chat messages
    socket.on('chatSend', message=>{
        console.log('message received', message)
        io.sockets.to('gameRoom').emit('message', message)
    })


    socket.on('disconnect', () =>{
        // console.log('socket', io.sockets.adapter.rooms['gameRoom'].sockets )
        app.get('db').remove_user_table({socket_id: socket.id})
        sockets = sockets.filter(val=> {
            return val !== socket.id})
        
        console.log('res', sockets)
    })
})

// app.get('db').then(res=>res.draw_card().then(card=> drawnCard = card));

setInterval(function(){
    countdown--;
    io.sockets.emit('timer', {countdown:countdown})
},1000)    

setInterval(function(){ 
    countdown = timeLimit
    if(!io.sockets.adapter.rooms['gameRoom']) return;

//send drawn card
    io.sockets.to('gameRoom').emit('messageFromServer', drawnCard)
        
//send bank info to sockets
    sockets.forEach(s=>{
        app.get('db').get_bank({socket_id: s}).then(res=> {
            return io.sockets.connected[s].emit('bank', res[0].credit)})
        })

//send winners list
    app.get('db').winners().then(winners=>{
        console.log('winners', winners)
        if(winners.length){
        let list = "";
        winners.forEach(val=> list = list + val.name + ", ")

        io.sockets.to('gameRoom')
        .emit('message', {text:list, user:'Winners:'})
        }
    })

//reset game table
    app.get('db').clear_table();
        
//draw card
    app.get('db').draw_card().then(cardResponse=>{
        console.log('card response', cardResponse)
        previousCard = drawnCard.slice(0,1)
        drawnCard = cardResponse
        if (previousCard[0].value < drawnCard[0].value)
        {winningGuess = 'high'} 
        else if (previousCard[0].value > drawnCard[0].value)
        {winningGuess = 'low'}
        else
        {{winningGuess = 'tie'}}
        console.log('winner', winningGuess)
    }); 
}, `${timeLimit}000`);

app.get('/auth/callback', authController.login);
app.get('/auth/user-data', authController.getUser);
app.post('/api/logout', profileController.logOut);
app.put('/api/edit', profileController.edit);
app.delete('/api/delete/:id', profileController.delete);
const path = require('path')
app.get('*', (req, res)=>{
  res.sendFile(path.join(__dirname, '../build/index.html'));
})

const PORT=4000;
server.listen(PORT, ()=>console.log(`server on ${PORT}`));