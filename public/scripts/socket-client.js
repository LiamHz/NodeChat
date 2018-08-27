$(function(){
    var socket = io();

    var USERNAME = "guest"

    $("form").submit(function(){
        input = $("#m").val()

        // Determine user intent by message content
        if(input.includes("/register")){
            intent = "register";
        }else if(input.includes("/login")){
            intent = "login"
        }else{
            intent = "message";
        }

        socket.emit(intent, input, USERNAME);
        $("#m").val("");
        return false;
    });

    // Send the new user the previous chat history
    socket.on("chatLog", function(chatLog){
        for(var i=0; i < chatLog.length; i++){
            $("#messages").append($("<li>").text(chatLog[i]));
        }
    });

    // Notify user when another user joins chat
    socket.on("user connected", function(){
        $("#messages").append($("<li>").text("* a user connected *").css("font-weight", "Bold"));
    });

    // Notify user when they sucessfully register
    socket.on("register", function(username){
        $("#messages").append($("<li>").text("* you are now registered as " + username + " *").css("font-weight", "Bold"));
        USERNAME = username
    });

    socket.on("registerError InvalidNumArgs", function(){
        $("#messages").append($("<li>").text("* registration failed, use command: *").css("font-weight", "Bold"));
        $("#messages").append($("<li>").text("* /register USERNAME PASSWORD *").css("font-weight", "Bold"));
    });

    socket.on("registerError UsernameInUse", function(username){
        $("#messages").append($("<li>").text("* registration failed, username: " + username + " is already in use *").css("font-weight", "Bold"));
    });

    // Add new messages to users display
    socket.on("message", function(msg, username){
        $("#messages").append($("<li class='" + username + "'>").text(msg + " - " + username));
    });

    socket.on("error", function(err){
        console.log("recieved socket error:");
        console.log(err);
    });
});
