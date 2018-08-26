var express = require("express");
var app = require("express")();
var http = require("http").Server(app);
var path = require("path");
var io = require ("socket.io")(http);
var PORT = process.env.PORT || 3000;

// Allows use of stylesheets
app.use(express.static(__dirname + '/public'));

app.set('views', path.join(__dirname, 'views'));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/views/pages/index.html");
});

io.on("connection", function(socket){
  console.log("a user connected");

  socket.on("chat message", function(msg){
      console.log('message: ' + msg)
    // When a user sends a message, broadcast the message to all other users
    io.emit("chat message", msg);
  });

  socket.on("disconnect", function(){
      console.log("user disconnected")
  });
});

http.listen(PORT, () => console.log(`Listening on ${ PORT }`));
