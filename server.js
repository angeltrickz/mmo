var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

app.use('/css',express.static(__dirname + '/css'));
app.use('/js',express.static(__dirname + '/js'));
app.use('/assets',express.static(__dirname + '/assets'));

app.get('/',function(req,res){
    res.sendFile(__dirname+'/index.html');
});

server.lastPlayderID = 0;

server.listen(process.env.PORT || 8081,function(){
    console.log('Listening on '+server.address().port);
});


io.on('connection',function(socket){

    socket.on('newplayer',function(){
        socket.player = {
            id: server.lastPlayderID++,
            x: randomInt(100,400),
            y: randomInt(100,400)
        };
        socket.emit('allplayers',getAllPlayers());
        socket.broadcast.emit('newplayer',socket.player);

        socket.on('click',function(data){
            console.log('click to '+data.x+', '+data.y);
            socket.player.x = data.x;
            socket.player.y = data.y;
            io.emit('move',socket.player);
        });

        socket.on('myid',function(data){

          socket.emit('myid',socket.player);

          });

        socket.on('mover',function(data){

            io.emit('move',socket.player);
        });

        socket.on('left',function(data){

        socket.player.x = data.x;
        socket.player.y = data.y;
        io.emit('moveleft',socket.player);
      });

      socket.on('right',function(data){

          socket.player.x = data.x;
          socket.player.y = data.y;
          io.emit('moveright',socket.player);
        });

        socket.on('stop',function(data){

            if(data.move == "espera"){
              io.emit('stopanima',socket.player);
            }
          });

        socket.on('jump',function(data){

          io.emit('jump',socket.player);

          });

        socket.on('follow',function(data){

          socket.emit('follow',socket.player);

          });

        socket.on('fire',function(data){

            socket.player.dr = data.firedirection;

          io.emit('fire',socket.player);

          });

        socket.on('colision',function(data){


          io.emit('colisionR',{idenemy:data.idenemy,idhealth:data.idhealth});

          });

          socket.on('dead',function(data){


            io.emit('deadR',{deadid:data.deadmyid});

            });


          socket.on('supermov',function(data){
            socket.player.super = data.pos;
            socket.player.dr = data.direc;

            socket.broadcast.emit('supermov',socket.player);

            });



        socket.on('disconnect',function(){
            io.emit('remove',socket.player.id);
        });
    });

    socket.on('test',function(){
        console.log('test received');
    });
});

function getAllPlayers(){
    var players = [];
    Object.keys(io.sockets.connected).forEach(function(socketID){
        var player = io.sockets.connected[socketID].player;
        if(player) players.push(player);
    });
    return players;
}

function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}
