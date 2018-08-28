var express = require("express");
var app = require("express")();
var server = require("http").Server(app);
var path = require("path");
var io = require("socket.io")(server);
var PORT = process.env.PORT || 3000;

// Allows use of stylesheets
app.use(express.static(__dirname + "/public"));

app.set("views", path.join(__dirname, "views"));

// Send HTML file to user
app.get("/", function(req, res){
    res.sendFile(__dirname + "/views/pages/index.html");
});

var guestID = 1
var chatLog = []
registeredUsers = {}
var helpInfo = ["Register a new account", "/register USERNAME PASSWORD", "", "Login to existing account", "/login USERNAME PASSWORD", ""]

io.on("connect", function(socket){

    socket.emit("chatLog", chatLog);
    socket.emit("explainHelp");
    socket.emit("registerGuest", guestID)
    guestID++

    // Notify all users except for the user who joined
    socket.broadcast.emit("user connected");
    console.log("a user connected")

    socket.on("register", function(input){
        inputs = input.split(" ")

        if(inputs.length == 3){
            username = inputs[1]
            password = inputs[2]

            // If the username is not already registered, register it
            if(!(username in registeredUsers)){
                registeredUsers[username] = password

                socket.emit("register", username);
                console.log("new user registered: " + username);
            }else{
                socket.emit("registerError UsernameInUse", username)
            }
        }else{
            socket.emit("registerError InvalidNumArgs")
            console.log("Registration failed: expected 2 arguments, recieved " + (inputs.length - 1))
        }
    });

    socket.on("login", function(input){
        inputs = input.split(" ")
        username = inputs[1]
        password = inputs[2]

        if(inputs.length == 3){
            // If user exists
            if(username in registeredUsers){
                // Check if credentials match
                if(registeredUsers[username] == password){
                    // Login user
                    socket.emit("login", username)
                }else{
                    socket.emit("loginError auth")
                }
            }else{
                socket.emit("loginError exist", username)
            }
        }else{
            socket.emit("loginError InvalidNumArgs")
            console.log("Loginfailed: expected 2 arguments, recieved " + (inputs.length - 1))
        }
    });

    socket.on("message", function(msg, username, newSender){
        if(newSender){
            console.log("sender: " + username)
            chatLog.push("")
            chatLog.push(username)
            io.emit("message", "", "system", false)
            io.emit("message", username, username, true)
        }

        console.log("message: " + msg);

        // Add message to chat log
        chatLog.push(msg)

        // When a user sends a message, broadcast the message to all users
        io.emit("message", msg, username, false);
    });

    socket.on("help", function(){
        console.log("sending help info");
        socket.emit("helpInfo", helpInfo);
    });

    socket.on("disconnect", function(){
        console.log("user disconnected")
    });

    socket.on("error", function(err){
        console.log("recieved error from client:", socket.id);
        console.log(err);
    })
});

server.listen(PORT, function(err){
    if (err) throw err
    console.log(`Listening on ${ PORT }`);
});
