const express = require("express");
const app = express();

const MongoClient = require('mongodb').MongoClient;


const bcrypt = require('bcrypt');

const expressSession = require('express-session');
const cookieParser = require('cookie-parser');


app.use(express.json()); //to check to see if library has been set right
app.use(express.urlencoded({ extended: true})); 
app.use(cookieParser());

const bodyParser = require("body-parser");
  
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://nicklas:ncnfunmax@node.gs8f9.mongodb.net/mydb?retryWrites=true&w=majority'), {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

const db = mongoose.connection;
db.on('error', console.log.bind(console, "connection error"));
db.once('open', function(callback){
    console.log("connection succeeded");
});


app.use(express.static("chat"));
  
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));


const session = expressSession({
    secret: 'your secret key',
    resave: false,
    saveUninitialized: false
});

app.use(session);

const passport = require('passport');

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
    done(null, user);
});
passport.deserializeUser(function(user, done) {
    done(null, user);
});

const LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy(
    function(username, password, done) {
      db.collection('users').findOne({ username }, function (err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        bcrypt.compare(password, user.password, function(err, result) {
            if (err) return done(err);
            if (result) return done(null, user);
        });
      });
    }
));


const chatRouter = require("./routes/chatroute.js");
app.use(chatRouter.router);

const gameRouter = require("./routes/game.js");
app.use(gameRouter.router);

const newsletterRouter = require("./routes/newsletter.js");
app.use(newsletterRouter.router);

const usersRouter = require("./routes/users.js");
app.use(usersRouter.router);

const registerRouter = require("./routes/register.js");
app.use(registerRouter.router);

const profileRouter = require("./routes/profile.js");
app.use(profileRouter.router);


const fs = require("fs");


const navbar = fs.readFileSync(__dirname + "/public/navbar/nav.html", "utf-8");
const footer = fs.readFileSync(__dirname + "/public/footer/footer.html", "utf-8");

const frontpage = fs.readFileSync(__dirname + "/public/frontpage/frontpage.html", "utf-8");
const chat = fs.readFileSync(__dirname + "/public/chat/chat.html", "utf-8");
const chatFood = fs.readFileSync(__dirname + "/public/chat/chatFood.html", "utf-8");
const chatGames = fs.readFileSync(__dirname + "/public/chat/chatGames.html", "utf-8");
const game = fs.readFileSync(__dirname + "/public/game/game.html", "utf-8");
const newsletter = fs.readFileSync(__dirname + "/public/newsletter/contact.html", "utf-8");
const users = fs.readFileSync(__dirname + "/public/views/users.html", "utf-8");
const register = fs.readFileSync(__dirname + "/public/views/register.html", "utf-8");
const profile = fs.readFileSync(__dirname + "/public/views/profile.html", "utf-8");

const chat2 = fs.readFileSync(__dirname + "/public/chat/chat2.html", "utf-8");
const login = fs.readFileSync(__dirname + "/public/chat/login.html", "utf-8");



app.get("/", (req, res) => {
    res.send(navbar + frontpage + footer);
});

app.get("/chat", (req, res) => {
    res.send(navbar + chat + footer);
});

app.get("/chat2", (req, res) => {
    res.send(navbar + chat2 + footer);
});

app.get("/chatFood", (req, res) => {
    res.send(navbar + chatFood + footer);
});

app.get("/chatGames", (req, res) => {
    res.send(navbar + chatGames + footer);
});

app.get("/game", (req, res) => {
    res.send(navbar + game + footer);
});

app.get("/newsletter", (req, res) => {
    res.send(navbar + newsletter + footer);
});

app.post('/login',
  passport.authenticate('local', { successRedirect: '/chat2',
                                   failureRedirect: '/login' }));


app.get("/login", (req, res) => {
    res.send(navbar + login.replace("${message}","") + footer);
});

app.get("/newUser", (req, res) => {
    res.send(navbar + newUser + footer)
});

app.post('/newUser', async (req, res) => 
{
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    
    const hashedPassword = await bcrypt.hash(password, 10);

    const data = {
        "email":email,
        "username": username,
        "password":hashedPassword
    }

    db.collection('users').insertOne(data,function(err, collection){
        if (err) throw err;
        console.log("Record inserted Successfully");
    });
            
    return res.redirect('/views/users.html');

});


app.get("/users", (req, res) => {
    res.send(navbar + users + footer);
});

app.get("/rooms/list", (req, res) => {
    res.send(roomsList);
});


app.get('/rooms/:name/users', (req, res) => 
{
    
    console.log("room ",req.params.name)

    res.send(roomsArray[req.params.name.toLowerCase()].users);
});


const PORT = process.env.PORT || 80;

const server = app.listen(PORT, (error) => {
    if (error) {
        console.log(error);
    }
    console.log("Server is running", server.address().port);
});


const rooms = {
    chat: {
        name: 'Chat',
        users: []
    },
    food: {
        name: 'Food',
        users: []
    },
    games: {
        name: 'Games',
        users: []
    }
}


const io = require("socket.io")(server)


io.use((socket, next) => {
  session(socket.request, socket.request.res, next);
}).use((socket, next) => {
  passport.initialize()(socket.request, socket.request.res, next);
}).use((socket, next) => {
  passport.session()(socket.request, socket.request.res, next);
});

io.use((socket, next) => {
    if (socket.request.isAuthenticated()) return next();
    next(new Error('Authentication failed.'));
});


io.on('connection', socket => 
{
    const user = socket.request.user;

    socket.on('send-chat-message', ({ room, message }) => {
        for (const socketId of rooms[room].users) {
            io.to(socketId).emit('chat-message', { message: message, name: user.username });
        }
    });

    socket.on('join-room', (room) => {
        rooms[room].users.push(socket.id);
        io.to(room).emit(`${user.name} has joined ${room}`);
    });

    socket.on('disconnect', () => {
        for (const [roomId, room] of Object.entries(rooms)) {
            if (room.users.indexOf(socket.id) !== -1) {
                room.users.splice(room.users.indexOf(socket.id), 1);
            }
        }
    });

});
