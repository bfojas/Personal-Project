
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
        previousCard = cardResponse
    })},2000)
}).catch(error => console.log('massive shit',error))
const server = require('http').createServer(app)
const io = require('socket.io')(server);
const authController = require('./authController.js')
const connect=require('connect-pg-simple');
const bodyParser = require('body-parser');
app.use(bodyParser.json())



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
// const dbInstance = app.get('db');

// io.sockets.on('connection', socket =>{
//     console.log('socket to me')
//     socket.join('gameRoom')
//     setInterval(function(){ 
//         app.get('db').draw_card().then(cardResponse=>{
//             console.log('card response', cardResponse)
//             io.in('gameRoom').emit('messageFromServer', cardResponse)
//             console.log('emit')
//         }); 
//     }, 15000);
// })

let sockets = [];
let drawnCard = [];
let previousCard =[];
let countdown = 5;

io.sockets.on('connection', socket =>{
    console.log('socket to me')
    socket.join('gameRoom')
    sockets.push(socket);
    socket.emit('messageFromServer', previousCard)
    socket.emit('timer', {countdown: countdown})
})
setInterval(function(){
    countdown--;
    io.sockets.emit('timer', {countdown:countdown})
},1000)    
setInterval(function(){ 
    countdown = 5
    if(!sockets.length) return;
        sockets.forEach((s) => s.emit('messageFromServer', drawnCard))
        app.get('db').draw_card().then(cardResponse=>{
            console.log('card response', cardResponse)
            previousCard = drawnCard.slice(0,1)
            drawnCard = cardResponse
            console.log('emit')
        }); 
    }, 5000);

app.get('/auth/callback', authController.login);
app.get('/auth/user-data', authController.getUser);
app.post('/api/logout', authController.logOut);
app.get('/auth/test', (req,res)=>{res.send('test')});
app.put('/api/edit/name', authController.editName);
app.put('/api/edit/email', authController.editEmail);
app.put('/api/edit/image', authController.editImage);

const PORT=4000;
server.listen(PORT, ()=>console.log(`server on ${PORT}`));