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

var chatLog = []
registeredUsers = {}

io.on("connect", function(socket){

    socket.emit("chatLog", chatLog);

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

    // socket.on("login", function(input){
    //
    // });

    socket.on("message", function(msg){
        console.log("message: " + msg);

        // Add message to chat log
        chatLog.push(msg)

        // When a user sends a message, broadcast the message to all users
        io.emit("message", msg);
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
