var express = require('express'),
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io')(server),
    Uno = require('./src/server/uno'),
    Player = require('./src/server/uno/player'),
    game = new Uno(),
    players = {};

// Set static folder
app.use(express.static("./src/client"));

// Http and socket listen port
server.listen(process.env.PORT || 5000);

// Broadcast function, loop through players
var broadcast = function(){
    for(var sid in players) if(players.hasOwnProperty(sid)){
        players[sid].socket.emit('game', game.data(players[sid].data));
    }
};

// Listening to socket
io.on('connection', function (socket) {
    // player register to server
    socket.on('register', function(data, fn){
        try{
            players[socket.id] = {
                socket: socket,
                data: new Player(data.name)
            };
            fn(null, players[socket.id].data);
        }catch(e){
            fn(e.message, null);
        }
    });

    // player disconnect
    socket.on('disconnect', function(){
        try{
            if(players[socket.id] && players[socket.id].data.game){
                players[socket.id].data.leave();
                delete players[socket.id];
                broadcast();
            }
        }catch(e){
            console.log(e);
        }
    });

    socket.on('chat', function(text, fn){
        try{
            players[socket.id].data.chat(text);
            broadcast();
            fn(null, null);
        }catch(e){
            fn(e.message, null);
        }
    });

    // player join on game
    socket.on('join', function(data, fn){
        try{
            players[socket.id].data.join(game);
            broadcast();
            fn(null, null);
        }catch(e){
            fn(e.message, null);
        }
    });

    // player leave game
    socket.on('leave', function(data, fn){
        try{
            players[socket.id].data.leave();
            broadcast();
            fn(null, null);
        }catch(e){
            fn(e.message, null);
        }
    });

    // player start game
    socket.on('start', function(data, fn){
        try{
            players[socket.id].data.start();
            broadcast();
            fn(null, null);
        }catch(e){
            fn(e.message, null);
        }
    });

    // player stop game
    socket.on('stop', function(data, fn){
        try{
            players[socket.id].data.stop();
            broadcast();
            fn(null, null);
        }catch(e){
            fn(e.message, null);
        }
    });

    // player draw
    socket.on('draw', function(data, fn){
        try{
            players[socket.id].data.draw(data.num, data);
            broadcast();
        }catch(e){
            fn(e.message, null);
        }
    });

    // player drop
    socket.on('drop', function(data, fn){
        try{
            players[socket.id].data.drop(data.card, data.action);
            broadcast();
            fn(null, null);
        }catch(e){
            fn(e.message, null);
        }
    });

    // player uno
    socket.on('uno', function(data, fn){
        try{
            players[socket.id].data.uno();
            broadcast();
            fn(null, null);
        }catch(e){
            fn(e.message, null);
        }
    });
});