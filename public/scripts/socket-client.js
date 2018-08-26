$(function(){
    var socket = io();

    $("form").submit(function(){
      // Determine user intent by message content

        msg = $("#m").val()

        if(msg.includes("/register")){
            intent = "register";
        }else{
            intent = "message";
        }

        socket.emit(intent, msg);
        $("#m").val("");
        return false;
    });

    socket.on("user connected", function(){
        $("#messages").append($("<li>").text("* a user connected *").css("font-weight", "Bold"));
    });

    socket.on("register", function(user){
        console.log("FAQ");
        $("#messages").append($("<li>").text("* you are now registered as " + user + "*").css("font-weight", "Bold"));
    });

    socket.on("message", function(msg){
        $("#messages").append($("<li>").text(msg));
    });

    socket.on("error", function(err){
        console.log("recieved socket error:");
        console.log(err);
    });
});
