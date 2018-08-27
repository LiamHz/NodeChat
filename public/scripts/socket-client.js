$(function(){
    var socket = io();

    $("form").submit(function(){
        msg = $("#m").val()

        // Determine user intent by message content
        if(msg.includes("/register")){
            intent = "register";
        }else if(msg.includes("/login")){
            intent = "login"
        }else{
            intent = "message";
        }

        socket.emit(intent, msg);
        $("#m").val("");
        return false;
    });

    // Send the new user the previous chat history
    socket.on("chatLog", function(chatLog){
        for(var i=0; i < chatLog.length; i++){
            $("#messages").append($("<li>").text(chatLog[i]))
        }
    })

    // Notify user when another user joins chat
    socket.on("user connected", function(){
        $("#messages").append($("<li>").text("* a user connected *").css("font-weight", "Bold"));
    });

    // Notify user when they sucessfully register
    socket.on("register", function(user){
        $("#messages").append($("<li>").text("* you are now registered as " + user + " *").css("font-weight", "Bold"));
    });

    socket.on("register InvalidNumArgs", function(){
        $("#messages").append($("<li>").text("* registration failed, use command: *").css("font-weight", "Bold"))
        $("#messages").append($("<li>").text("* /register USERNAME PASSWORD *").css("font-weight", "Bold"))
    });

    // Add new messages to users display
    socket.on("message", function(msg){
        $("#messages").append($("<li>").text(msg));
    });

    socket.on("error", function(err){
        console.log("recieved socket error:");
        console.log(err);
    });
});
