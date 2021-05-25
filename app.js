const express = require("express");
const app = express();


app.use(express.json()); //to check to see if library has been set right
app.use(express.urlencoded({ extended: true}))  

app.use(express.static("public"));



const chatRouter = require("./routes/chat.js");
app.use(chatRouter.router);

const gameRouter = require("./routes/game.js");
app.use(gameRouter.router);

const newsletterRouter = require("./routes/newsletter.js");
app.use(newsletterRouter.router);

const usersRouter = require("./routes/users.js");
app.use(usersRouter.router);



const fs = require("fs");



const navbar = fs.readFileSync(__dirname + "/public/navbar/nav.html", "utf-8");
const footer = fs.readFileSync(__dirname + "/public/footer/footer.html", "utf-8");

const frontpage = fs.readFileSync(__dirname + "/public/frontpage/frontpage.html", "utf-8");
const chat = fs.readFileSync(__dirname + "/public/chat/chat.html", "utf-8");
const chatFood = fs.readFileSync(__dirname + "/public/chat/chatFood.html", "utf-8");
const chatGames = fs.readFileSync(__dirname + "/public/chat/chatGames.html", "utf-8");
const game = fs.readFileSync(__dirname + "/public/game/game.html", "utf-8");
const newsletter = fs.readFileSync(__dirname + "/public/newsletter/contact.html", "utf-8");
const users = fs.readFileSync(__dirname + "/public/users/users.html", "utf-8");



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
    res.send(navbar + users + footer);
});


const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, (error) => {
    if (error) {
        console.log(error);
    }
    // you are defining a variable and using it before finsishing the declaration
    console.log("Server is running", server.address().port);
});