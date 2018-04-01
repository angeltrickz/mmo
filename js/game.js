/*
 * Author: Jerome Renaux
 * E-mail: jerome.renaux@gmail.com
 */

 var facing = 'left';
 var jumpButton;
 var cursors;
 var jumpTimer = 0;
 var player;
 var mirando = "espera";


var Game = {};

Game.init = function(){
    game.stage.disableVisibilityChange = true;
};

Game.preload = function() {
    game.load.image('sprite','assets/sprites/sprite.png');
    game.load.spritesheet('personaje', 'assets/sprites/mono.png', 47, 64,11);
    game.load.spritesheet('piso','assets/map/piso.png');
    game.load.image('background','assets/map/background.jpg');
};

Game.create = function(){

    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.gravity.y = 200;
    game.world.setBounds(0, 0, 1920, 550);

    Game.playerMap = {};
    var testKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    testKey.onDown.add(Client.sendTest, this);

    game.add.tileSprite(0, 0, 1920, 550, 'background');

   // tilesheet is the key of the tileset in map's JSON file

    Client.askNewPlayer();

    piso = game.add.sprite(0, 500, 'piso');
  	game.physics.enable(piso, Phaser.Physics.ARCADE);
  	piso.body.collideWorldBounds = true;
    piso.width = 1920;
  	piso.body.immovable = true;
    piso.body.enable = true;




cursors = game.input.keyboard.createCursorKeys();
jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

};

Game.getCoordinates = function(layer,pointer){
    Client.sendClick(pointer.worldX,pointer.worldY);
};

Game.addNewPlayer = function(id,x,y){
    Game.playerMap[id] = game.add.sprite(500,100,'personaje');
    player = Game.playerMap[id];
    game.physics.enable(player, Phaser.Physics.ARCADE);
    player.body.bounce.y = 0.2;
    player.body.collideWorldBounds = true;
    player.body.setSize(20, 32, 5, 16);
    player.frame = 7;

    player.animations.add('left', [9, 10, 11], 10, true);
    player.animations.add('turn', [6,7,8], 10, true);
    player.animations.add('right', [3, 4, 5], 10, true);

    player.body.enable = true;
    Client.socket.emit('follow',"camara");


};

Game.movePlayer = function(id,x,y){
/*
  player = Game.playerMap[id];
  game.physics.enable(player, Phaser.Physics.ARCADE);
  player.body.bounce.y = 0.2;
  player.body.collideWorldBounds = true;
  player.body.setSize(20, 32, 5, 16);
  player.frame = 7;

  player.animations.add('left', [9, 10, 11], 10, true);
  player.animations.add('turn', [6,7,8], 10, true);
  player.animations.add('right', [3, 4, 5], 10, true);
  game.camera.follow(player);

  player.body.enable = true;

  //
*/
};
Game.movePlayerleft = function(id,x,y){

  var  playerleft = Game.playerMap[id];
        //playerleft.position.x = x;
        playerleft.animations.play('left');
        playerleft.x -= 4;
        if(mirando != "left"){
          mirando = "left";
        }

};

Game.movePlayerright = function(id,x,y){
  var  playerright = Game.playerMap[id];
      playerright.animations.play('right');
      playerright.x += 4;
      if(mirando != "rigth"){
        mirando = "right";
      }

};

Game.stopanimation = function(id){
  Game.playerMap[id].animations.stop();
};

Game.saltar = function(id){
  if(Game.playerMap[id].body.touching.down && game.time.now > jumpTimer){
    Game.playerMap[id].body.velocity.y = -250;
    jumpTimer = game.time.now + 750;
  };

};

Game.follow = function(id){
  game.camera.follow(  Game.playerMap[id]);
};


Game.removePlayer = function(id){
    Game.playerMap[id].destroy();
    delete Game.playerMap[id];
};



Game.update = function(){

  try {

    if(mirando == "espera"){
      Client.socket.emit('stop',{move:mirando});
    }
    mirando = "espera";

    for (var i in Game.playerMap) {
    game.physics.arcade.collide(Game.playerMap[i], piso);
    }




       if (cursors.left.isDown)
       {


           Client.socket.emit('left',{x:player.x,y:player.y});

       }
       else if (cursors.right.isDown)
       {

          Client.socket.emit('right',{x:player.x,y:player.y});
       }

       //&& dude.body.onFloor()  && player.body.touching.down && game.time.now > jumpTimer
       if (jumpButton.isDown)
       {
          Client.socket.emit('jump',{x:player.x,y:player.y});

       }
         ///
}
catch(err) {
    console.log(err);
}



};
