$(document).ready(function(){
    var socket = io();

    var USERNAME = "guest";

    $("#username").text("Username: " + USERNAME);

    // User input
    $("form").submit(function(){
        input = $("#m").val();
        newSender = false;

        input = input.trim();

        // Determine user intent by message content
        if(input == ""){
            $("#m").val("");
            return false;
        }else if(input.includes("/register")){
            intent = "register";
        }else if(input.includes("/login")){
            intent = "login"
        }else if(input.includes("/help")){
            intent = "help"
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


    // ChatLog
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

        // Scroll to bottom of page
        window.scrollBy(0, 9001);
    });


    // Help info
    socket.on("explainHelp", function(){
        // Explain help will be hidden behind the usename display without this code
        if ($(window).width() < 800){
            i = 1
            while(i <= 4){
                $("#messages").append($("<li class='system'>").text(""))
                i++
            }
        }
        $("#messages").append($("<li class='system'>").text(""))
        $("#messages").append($("<li class='system'>").text("Type /help to learn the different chat commands"));
        $("#messages").append($("<li class='system'>").text(""))

        // Scroll to bottom of page
        window.scrollBy(0, 9001);
    });

    socket.on("helpInfo", function(helpInfo){
        $("#messages").append($("<li class='system'>").text(""))
        for(var i=0; i < helpInfo.length; i++){
            $("#messages").append($("<li class='system'>").text(helpInfo[i]));
        }

        // Scroll to bottom of page
        window.scrollBy(0, 9001);
    });


    // User joins chat
    socket.on("user connected", function(){
        $("#messages").append($("<li class='system'>").text(""))
        $("#messages").append($("<li class='system'>").text("A user connected"))
        $("#messages").append($("<li class='system'>").text(""))

        // Scroll to bottom of page
        window.scrollBy(0, 9001);
    });


    // Registration
    socket.on("registerGuest", function(guestID){
        USERNAME = ("guest" + guestID)
        $("#username").text("Username: " + USERNAME);
    });

    socket.on("register", function(username){
        $("#messages").append($("<li class='system'>").text(""))
        $("#messages").append($("<li class='system'>").text("You are now registered as " + username + ""))
        $("#messages").append($("<li class='system'>").text(""))

        USERNAME = username
        $("#username").text("Username: " + USERNAME);

        // Scroll to bottom of page
        window.scrollBy(0, 9001);
    });

    socket.on("registerError InvalidNumArgs", function(){
        $("#messages").append($("<li class='system'>").text(""))
        $("#messages").append($("<li class='system'>").text("Registration failed, use command format"))
        $("#messages").append($("<li class='system'>").text("/register USERNAME PASSWORD"))
        $("#messages").append($("<li class='system'>").text(""))

        // Scroll to bottom of page
        window.scrollBy(0, 9001);
    });

    socket.on("registerError UsernameInUse", function(username){
        $("#messages").append($("<li class='system'>").text(""))
        $("#messages").append($("<li class='system'>").text("Registration failed, username: " + username + " is already in use"))
        $("#messages").append($("<li class='system'>").text(""))

        // Scroll to bottom of page
        window.scrollBy(0, 9001);
    });


    // Logins
    socket.on("login", function(username){
        $("#messages").append($("<li class='system'>").text(""))
        $("#messages").append($("<li class='system'>").text("You are now logged in as " + username))
        $("#messages").append($("<li class='system'>").text(""))

        USERNAME = username;
        $("#username").text("Username: " + USERNAME);

        // Scroll to bottom of page
        window.scrollBy(0, 9001);
    });

    socket.on("loginError auth", function(){
        $("#messages").append($("<li class='system'>").text(""))
        $("#messages").append($("<li class='system'>").text("Login failed, invalid password"))
        $("#messages").append($("<li class='system'>").text(""));

        // Scroll to bottom of page
        window.scrollBy(0, 9001);
    });

    socket.on("loginError exist", function(username){
        $("#messages").append($("<li class='system'>").text(""))
        $("#messages").append($("<li class='system'>").text("Login failed, the username" + username + " is not registered"))
        $("#messages").append($("<li class='system'>").text(""));

        // Scroll to bottom of page
        window.scrollBy(0, 9001);
    });

    socket.on("loginError InvalidNumArgs", function(){
        $("#messages").append($("<li class='system'>").text(""))
        $("#messages").append($("<li class='system'>").text("Login failed, use command format"))
        $("#messages").append($("<li class='system'>").text("/login USERNAME PASSWORD"))
        $("#messages").append($("<li class='system'>").text(""));

        // Scroll to bottom of page
        window.scrollBy(0, 9001);
    });

    // Messages
    socket.on("message", function(msg, username, newSender){
        if(newSender){
            $("#messages").append($("<li class='" + username + "'>").text(username).css("font-weight", "Bold"));
        }else{
            $("#messages").append($("<li class='" + username + "'>").text(msg));
        }

        // Scroll to bottom of page
        window.scrollBy(0, 9001);
    });

    socket.on("error", function(err){
        console.log("recieved socket error:");
        console.log(err);
    });
});
