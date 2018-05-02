// Heroku support

const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

// END Heroku support

var app = require("express")();
var http = require("http").Server(app);
var io = require ("socket.io")(http);

app.get("/", function(req, res){
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", function(socket){
  console.log("a user connected");

  socket.on("chat message", function(msg){
    // When a user sends a message, broadcast the message to all other users
    io.emit("chat message", msg);
  });

  socket.on("disconnect", function(){
      console.log("user disconnected")
  });
});

http.listen(3000, function(){
  console.log("listening on *:3000");
});
