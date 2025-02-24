
//create web server
var http = require("http");
var express = require("express");
var app = express();
var server = http.createServer(app);
var io = require("socket.io")(server);
var fs = require("fs");

//create web server
server.listen(3000, function() {
    console.log("Server listening at port 3000");
});

//send HTML file to client
app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

//send CSS file to client
app.get("/style.css", function(req, res) {
    res.sendFile(__dirname + "/style.css");
});

//send JS file to client
app.get("/client.js", function(req, res) {
    res.sendFile(__dirname + "/client.js");
});

//create array to store comments
var comments = [];

//send comments to client
io.on("connection", function(socket) {
    socket.emit("loadComments", comments);
});

//receive comment from client
io.on("connection", function(socket) {
    socket.on("newComment", function(comment) {
        comments.push(comment);
        io.emit("updateComments", comments);
    });
});

//receive delete comment from client
io.on("connection", function(socket) {
    socket.on("deleteComment", function(index) {
        comments.splice(index, 1);
        io.emit("updateComments", comments);
    });
});

//receive edit comment from client
io.on("connection", function(socket) {
    socket.on("editComment", function(data) {
        comments[data.index] = data.comment;
        io.emit("updateComments", comments);
    });
});