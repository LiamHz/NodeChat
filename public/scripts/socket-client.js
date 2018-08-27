$(function(){
    var socket = io();

    var USERNAME = "guest"

    $("form").submit(function(){
        input = $("#m").val()
        newSender = false

        // Determine user intent by message content
        if(input.includes("/register")){
            intent = "register";
        }else if(input.includes("/login")){
            intent = "login"
        }else{
            intent = "message";
            // If the message's sender is diferent than the previous sender
            // Add their name above their username to their message
            if(!($("li:last").attr("class") == USERNAME)){
                newSender = true
            }
        }

        socket.emit(intent, input, USERNAME, newSender);
        $("#m").val("");
        return false;
    });

    // Send the new user the previous chat history
    socket.on("chatLog", function(chatLog){
        for(var i=0; i < chatLog.length; i++){
            // New senders are always preceeded by a blank line
            if(chatLog[i] == ""){
                $("#messages").append($("<li>").text(chatLog[i]));
                i++
                $("#messages").append($("<li class='newSender'>").text(chatLog[i]));
            }else{
                $("#messages").append($("<li>").text(chatLog[i]));
            }
        }
    });

    // Notify user when another user joins chat
    socket.on("user connected", function(){
        $("#messages").append($("<li class='system'>").text("* a user connected *").css("font-weight", "Bold"));
    });

    // Notify user when they sucessfully register
    socket.on("register", function(username){
        $("#messages").append($("<li class='system'>").text("* you are now registered as " + username + " *").css("font-weight", "Bold"));
        USERNAME = username
    });

    socket.on("registerError InvalidNumArgs", function(){
        $("#messages").append($("<li class='system'>").text("* registration failed, use command: *").css("font-weight", "Bold"));
        $("#messages").append($("<li class='system'>").text("* /register USERNAME PASSWORD *").css("font-weight", "Bold"));
    });

    socket.on("registerError UsernameInUse", function(username){
        $("#messages").append($("<li class='system'>").text("* registration failed, username: " + username + " is already in use *").css("font-weight", "Bold"));
    });

    socket.on("login", function(username){
        USERNAME = username;
    });

    // Add new messages to users display
    socket.on("message", function(msg, username, newSender){
        if(newSender){
            $("#messages").append($("<li class='" + username + "'>").text(username).css("font-weight", "Bold"));
        }else{
            $("#messages").append($("<li class='" + username + "'>").text(msg));
        }
    });

    socket.on("error", function(err){
        console.log("recieved socket error:");
        console.log(err);
    });
});
