const express = require("express");
const app = express();

const MongoClient = require('mongodb').MongoClient;


//nyt
/*let database
let dbUsers*/
const bcrypt = require('bcrypt');
const saltRounds = 10;
let salt;
bcrypt.genSalt(saltRounds, (e,salt1) => {

    salt = salt1
    
});


//nyt
const passport = require('passport');
app.use(express.json()); //to check to see if library has been set right
app.use(express.urlencoded({ extended: true})); 


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
  
//nyt
app.use(express.static("chat"))
  
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
    


/*const chatRouter = require("./routes/chat.js");
app.use(chatRouter.router);*/

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

//nyt
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

/*app.get("/users", (req, res) => {
    res.send(navbar + register + footer);
});*/

app.get("/register", (req, res) => {
    res.send(navbar + users + footer);
});

app.get("/profile", (req, res) => {
    res.send(navbar + profile + footer);
});

//nyt
app.post('/loginPassPort',
  passport.authenticate('local', { successRedirect: '/chat',
                                   failureRedirect: '/login' }));

app.get("/login", (req, res) => {
    res.send(navbar + login.replace("${message}","") + footer);
});

app.get("/newUser", (req, res) => {
    res.send(navbar + newUser + footer)
});

app.post('/newUser', async (req, res) => 
{
    let email = req.body.email
    let username = req.body.username
    let password = req.body.password
 
    console.log("New username ", username, ' email',email,' new password', password)  
    const query = { name: req.body.username };
    const newUser = await db.findOne(query);
    console.log('new user ', newUser);

    

    if (newUser === null)
    {
        const passwordHash = await bcrypt.hash(password, salt)
        console.log('hash for ', password, " = ", passwordHash)
        const dbResult = await db.insertOne( {email: email, username: username, password: passwordHash})
        console.log("db insert ",dbResult)

        if (dbResult.insertedCount === 1)
        {
            res.send(navbar + chat.replace('${username}', req.body.username) + footer)
            return
        }
        
        
        
        if (false){
            bcrypt.hash(password, salt, (error,hash) => {
                console.log('hash for ', password, " = ", hash)
                db.insertOne( {username: username, password: hash})
            })

        }
    }
    res.send(navbar + login.replace("{message}","Det gik galt") + footer)  
});

app.post("/login", async function(req, res) {
    console.log('LOGIN username', req.body.username, ' og password', req.body.password)


    //var password = "hundenViggo";
    
        // Query for a movie that has the title 'Back to the Future'
        const query = { name: req.body.username };
        const user = await db.findOne(query);
        if (user === null)
        {
            res.send(navbar + login.replace("${message}","Unknown user") + footer)  
            return
        }
        console.log(user);
        console.log("user password = ", user.password);
  
  
      //if user.password 
  
      bcrypt.compare(req.body.password, user.password, (err, result) => {
          if (result) {
            console.log("It matches!")
            //console.log(querystring.stringify({username: req.body.username}))
            //res.send('/chat')//, req.body.username)//, querystring.stringify({username: req.body.username}))//, querystring.parse(username=req.body.username))//, {body: req.body.username})
            res.send(navbar + chat.replace('${username}', req.body.username) + footer)
            }
          
          else {
            console.log("Invalid password!");
            res.send(navbar + login.replace("${message}","Wrong password") + footer)  
          }
        });
  
  
  
     // }
      // finally {
        // Ensures that the client will close when you finish/error
       // await client.close();
      //}
    //run().catch(console.dir);
})


app.get("/users", (req, res) => {
    res.send(navbar + users + footer);
});

app.get("/rooms/list", (req, res) => {
    res.send(roomsList);
});

/*
/asus/users
*/
app.get('/rooms/:name/users', (req, res) => 
{
    
    console.log("room ",req.params.name)

    res.send(roomsArray[req.params.name.toLowerCase()].users);
});





const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, (error) => {
    if (error) {
        console.log(error);
    }
    // you are defining a variable and using it before finsishing the declaration
    console.log("Server is running", server.address().port);
});


//nyt
//Socket functions

//Json Arrays containing the chatrooms and users
const usersArray = {}
let roomsList = ["Games","Food","General"];
let roomsArray = { "games"   :  {name:"Games",   users:['Louise','Per','Thor','Thea','Viggo']},
                   "food"    :  {name:"Food",    users:['Viggo', 'Mikkel']},
                   "general" :  {name:"General", users:['Nicklas', 'emilie']}
                 };


const io = require("socket.io")(PORT)

//General chatroom
io.on('connection', socket => 
{

    socket.on('new-user', name => 
    {
        //Give the new user connected to a chat a new name
        usersArray[socket.id] = name
        //Server sends broadcast message to everyone subscribed to the same topic,
        //with the name of the newly connected user
        socket.broadcast.emit('user-connected', name)
        //console.log('new user "',name,'"', room)  //Debug line
    })

    socket.on('join-room', room => 
    {
        //Give the new user connected to a chat a new name
        const name = usersArray[socket.id]
        console.log('User "'+name+'" joined room "'+room+'"')  //Debug line
        console.log(roomsArray['games'])
        roomsArray[room.toLowerCase()].users.push(name)
        console.log(roomsArray['games'])



        //Server sends broadcast message to everyone subscribed to the same topic,
        //with the name of the newly connected user
        socket.broadcast.emit('room-'+room.toLowerCase()+'-user-connected', name)
    })


    socket.on('send-chat-message', (message, room) => 
    {
        //'room-'+room.toLowerCase()+'-chat-message'
        //Server broadcasts message to every user subscribed, with a new message, except for the one sending that message
        console.log("Is the room undefined?", room)
        socket.broadcast.emit('room-'+room.toLowerCase()+'-chat-message', {message: message, name:usersArray[socket.id]})
        console.log('char-message "',message,'"')   //Debug line
    })

    //When a user disconnects from a chat
    socket.on('disconnect', () => {
        //Broadcast message to everyone on the topic with disconnect message
        socket.broadcast.emit('user-disconnected', usersArray[socket.id])

        console.log(roomsArray['games'])
        //User gets removed from Json 
        const name = usersArray[socket.id]
        if (name !=undefined)
        {
            for (const [room, obj] of Object.entries(roomsArray)) 
            {
                //if(obj.users[room])
                console.log("Deleting",name, "from", room)
                console.log(obj.users[0])
                console.log(obj.users.indexOf(name))

                //roomsArray[room.users].splice(0,1)
                //roomsArray[room.users].splice(0,1);
                //delete obj.name[room];
                obj.users.splice(obj.users.indexOf(name), 1)
            }
            delete usersArray[socket.id]
            console.log(roomsArray['games'])
        }
        else
        {
            console.log("disconnect unknown user")
        }
    })

    socket.on('leave-room', room => 
    {
        const name = usersArray[socket.id]
        console.log(name, 'left the room', room)
        let speRoom = roomsArray[room.toLowerCase()];
        //let speRoom = roomsArray.findIndex(room=> room.name === name)
        console.log('room',speRoom)
        console.log('value of roomsarray',roomsArray)

        let idx = speRoom.users.indexOf(name);
        console.log('user at index', idx)
        speRoom.users.splice(idx, 1)
        socket.broadcast.emit('room-'+room.toLowerCase()+'-user-leave', name)
        //console.log('char-message "',message,'"')   //Debug line
    })
});


/* io.on('connecton', (socket) => {
    console.log('a user connected');

    socket.on('message');

    socket.on('message', (message) => {
        console.log(message);
        io.emit('message', `${socket.id.substr(0,2)} said ${message}`);
    });
}); */