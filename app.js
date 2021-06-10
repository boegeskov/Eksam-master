const express = require("express");
const app = express();

const MongoClient = require('mongodb').MongoClient;


var bodyParser=require("body-parser");
  
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
  
  
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));
  
app.post('/sign_up', function(req,res){
    const name = req.body.name;
    const email =req.body.email;
    const pass = req.body.password;
    const phone =req.body.phone;
  
    const data = {
        "name": name,
        "email":email,
        "password":pass,
        "phone":phone
    }
db.collection('details').insertOne(data,function(err, collection){
        if (err) throw err;
        console.log("Record inserted Successfully");
              
    });
          
    return res.redirect('/views/users.html');
});


app.get('/show_prof', function(req, res) {
    const resultArray = [];
    db.connect(url, function(err, db) {
        const cursor = db.collection('details').find();
        cursor.forEach(function(doc, err) {
            resultArray.push(doc);
        }, function() {
            db.close();
            res.send('profile', {items: resultArray});
        });
    });
});
    


const chatRouter = require("./routes/chat.js");
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



app.get("/", (req, res) => {
    res.send(navbar + frontpage + footer);
});

app.get("/chat", (req, res) => {
    res.send(navbar + chat + footer);
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

app.get("/users", (req, res) => {
    res.send(navbar + register + footer);
});

app.get("/register", (req, res) => {
    res.send(navbar + users + footer);
});

app.get("/profile", (req, res) => {
    res.send(navbar + profile + footer);
});






const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, (error) => {
    if (error) {
        console.log(error);
    }
    // you are defining a variable and using it before finsishing the declaration
    console.log("Server is running", server.address().port);
});


