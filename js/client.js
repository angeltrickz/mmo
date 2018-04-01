/**
 * Created by Jerome on 03-03-17.
 */

var Client = {};
Client.socket = io.connect();

Client.sendTest = function(){
    console.log("test sent");
    Client.socket.emit('test');
};

Client.askNewPlayer = function(){
    Client.socket.emit('newplayer');
};

Client.sendClick = function(x,y){
  Client.socket.emit('click',{x:x,y:y});
};

Client.socket.on('newplayer',function(data){
    Game.addNewPlayer(data.id,data.x,data.y);
});

Client.socket.on('allplayers',function(data){
    for(var i = 0; i < data.length; i++){
        Game.addNewPlayer(data[i].id,data[i].x,data[i].y);
    }

    Client.socket.on('move',function(data){
        Game.movePlayer(data.id,data.x,data.y);
    });

    Client.socket.on('moveleft',function(data){
      Game.movePlayerleft(data.id,data.x,data.y);
  });

  Client.socket.on('moveright',function(data){
        Game.movePlayerright(data.id,data.x,data.y);
    });

  Client.socket.on('stopanima',function(data){
        Game.stopanimation(data.id,data.x,data.y);
    });

  Client.socket.on('jump',function(data){
        Game.saltar(data.id,data.x,data.y);
    });

  Client.socket.on('follow',function(data){
        Game.follow(data.id,data.x,data.y);
    });

    Client.socket.on('remove',function(id){
        Game.removePlayer(id);
    });
});
