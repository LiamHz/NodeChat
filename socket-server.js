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


io.on("connect", function(socket){
    console.log("a user connected");

    // Notify all users except for the user who joined
    socket.broadcast.emit("user connected")

    socket.on("register", function(input){
        user = input.substring(10);

        socket.emit("r", user);
        console.log("new user registered: " + user);
    });

    socket.on("message", function(msg){
        console.log("message: " + msg);
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
