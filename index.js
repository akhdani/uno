var Rx = require('rx'),
    express = require('express'),
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io')(server),
    Uno = require('./src/uno'),
    Player = require('./src/uno/player'),
    game = new Uno(),
    players = [];

// Set static folder
app.use(express.static("./src/client"));

// Http and socket listen port
server.listen(process.env.PORT || 5000);

// Listening to socket
io.on('connection', function (socket) {
    socket.emit('game', game.data());

    // player register to server
    socket.on('register', function(data, fn){
        try{
            players[socket.id] = new Player(data.name);
            io.sockets.emit('game', game.data());
        }catch(e){
            fn(e);
        }
    });

    // player disconnect
    socket.on('disconnect', function(){
        try{
            delete players[socket.id];
            io.sockets.emit('game', game.data());
        }catch(e){

        }
    });

    // player join on game
    socket.on('join', function(data, fn){
        try{
            game.join(players[socket.id]);
            io.sockets.emit('game', game.data());
        }catch(e){
            fn(e);
        }
    });

    // player leave game
    socket.on('leave', function(data, fn){
        try{
            game.leave(players[socket.id]);
            io.sockets.emit('game', game.data());
        }catch(e){
            fn(e);
        }
    });

    // player start game
    socket.on('start', function(data, fn){
        try{
            game.start(players[socket.id]);
            io.sockets.emit('game', game.data());
        }catch(e){
            fn(e);
        }
    });

    // player stop game
    socket.on('stop', function(data, fn){
        try{
            game.stop(players[socket.id]);
            io.sockets.emit('game', game.data());
        }catch(e){
            fn(e);
        }
    });

    // player draw
    socket.on('draw', function(data, fn){
        try{
            players[socket.id].draw(data.num);
            io.sockets.emit('game', game.data());
        }catch(e){
            fn(e);
        }
    });

    // player drop
    socket.on('drop', function(data){
        try{
            players[socket.id].drop(data.card, data.action);
            io.sockets.emit('game', game.data());
        }catch(e){
            fn(e);
        }
    });

    // player uno
    socket.on('uno', function(data, fn){
        try{
            players[socket.id].uno();
            io.sockets.emit('game', game.data());
        }catch(e){
            fn(e);
        }
    });
});