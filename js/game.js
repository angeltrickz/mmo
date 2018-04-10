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
 var weapon2;
 var fireButton2;
 var firedirect;
 var sprite;
 var myid;
 var text;

 var movimiento ;
 var movimiento1 ;

 var map;
var layer;


var Game = {};

Game.init = function(){
    game.stage.disableVisibilityChange = true;
};

Game.preload = function() {
    game.load.image('sprite','assets/sprites/sprite.png');
    game.load.spritesheet('personaje', 'assets/sprites/mono.png', 47, 64,11);
    game.load.spritesheet('piso','assets/map/piso.png');
    game.load.image('background','assets/map/background.jpg');
    game.load.tilemap('map', 'assets/map/collision_test.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('ground_1x1', 'assets/map/ground_1x1.png');
    game.load.image('bullet', 'assets/sprites/shmup-bullet.png');
};

Game.create = function(){

    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.gravity.y = 200;
    game.world.setBounds(0, 0, 1920, 550);

    Game.playerMap = {};
    Game.weaponMap = {};
    Game.textMap = {};

    var testKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    testKey.onDown.add(Client.sendTest, this);

    game.add.tileSprite(0, 0, 1920, 550, 'background');

   // tilesheet is the key of the tileset in map's JSON file

    Client.askNewPlayer();
    Client.sendmyid();

      sprite = game.add.sprite(510,270,'sprite');
      game.physics.enable(sprite, Phaser.Physics.ARCADE);

    ///

    map = game.add.tilemap('map');

    map.addTilesetImage('ground_1x1');

    layer = map.createLayer('Tile Layer 1');

    layer.resizeWorld();

    map.setCollisionBetween(1, 12);
    ///
/*
    piso = game.add.sprite(0, 500, 'piso');
  	game.physics.enable(piso, Phaser.Physics.ARCADE);
  	piso.body.collideWorldBounds = true;
    piso.width = 1920;
  	piso.body.immovable = true;
    piso.body.enable = true;

*/


cursors = game.input.keyboard.createCursorKeys();
jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);


text = game.add.text(30, 30, "presiona F para disparar", {
        font: "20px Arial",
        fill: "#000000",
        align: "center"
    });


    text.anchor.setTo(0.5, 0.5);

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
    player.health = 300;
    player.name = id;

    player.animations.add('left', [9, 10, 11], 10, true);
    player.animations.add('turn', [6,7,8], 10, true);
    player.animations.add('right', [3, 4, 5], 10, true);

    player.body.enable = true;

      player.hitArea = new Phaser.Rectangle(0, 0, 20, 20);

    Client.socket.emit('follow',"camara");

    Game.textMap[id] = game.add.text(30, 30, player.health, {
            font: "20px Arial",
            fill: "#ff0044",
            align: "center"
        });

        Game.textMap[id].anchor.setTo(0.5, 0.5);



  Game.weaponMap[id]  = game.add.weapon(10, 'bullet');

 weapon2 = Game.weaponMap[id];


    weapon2.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;


    weapon2.bulletSpeed = 400;

    weapon2.fireRate = 10;



    fireButton2 = this.input.keyboard.addKey(Phaser.KeyCode.F);



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

/*
  var  playerleft = Game.playerMap[id];
        //playerleft.position.x = x;
        playerleft.animations.play('left');
        playerleft.x -= 4;
        if(mirando != "left"){
          mirando = "left";
        }

        movimiento1 = playerleft.position;
*/
};

Game.movePlayerright = function(id,x,y){
/*
  var  playerright = Game.playerMap[id];
      playerright.animations.play('right');
      playerright.x += 4;
      if(mirando != "rigth"){
        mirando = "right";
      }

      movimiento1 = playerright.position;
*/
};

Game.stopanimation = function(id){
  Game.playerMap[id].animations.stop();
};

Game.saltar = function(id){
  if(Game.playerMap[id].body.onFloor() && game.time.now > jumpTimer){
    Game.playerMap[id].body.velocity.y = -250;
    jumpTimer = game.time.now + 750;
  };

};

Game.follow = function(id){
  game.camera.follow(  Game.playerMap[id]);
};

Game.fire= function(id,dr){
  if(dr == "left"){
    Game.weaponMap[id].fireAngle = Phaser.ANGLE_LEFT;
    Game.weaponMap[id].bulletAngleOffset = 0;
  }else{
    Game.weaponMap[id].fireAngle = Phaser.ANGLE_RIGHT;
    Game.weaponMap[id].bulletAngleOffset = 0;
  }

  Game.weaponMap[id].trackSprite(Game.playerMap[id], 14, 30);

  Game.weaponMap[id].fire();
};

Game.colision = function(id,bullet){
  //console.log(id.name);

  Client.socket.emit('colision',{idenemy:id.name,idhealth:id.health});
  bullet.kill();
};

Game.colisionR = function(id,idh){

  Game.playerMap[id].health = idh;
  Game.playerMap[id].health -= 5;
  console.log(Game.playerMap[id].health)

  if(Game.playerMap[id].health < 1){
    Game.playerMap[id].frame = 1;
    Game.textMap[id].addColor('#000000', 0) ;
    Game.textMap[id].setText("Dead X_X");

  }else{

    Game.textMap[id].setText(Game.playerMap[id].health)
  }


  if(Game.playerMap[myid].health < 1){

    this.state.start('Dead');
    Client.socket.emit('dead',{deadmyid:myid});
  }
/*
  if(myid == id){
    console.log(" ");

  }else{
    console.log("otro id:"+id);
  }
*/
};

Game.supermov = function(id,pos,dir){


 Game.playerMap[id].position = pos;
 playermove = Game.playerMap[id];
 if(dir == "left"){

   playermove.animations.play('left');

   if(mirando != "left"){
     mirando = "left";
   }

 }
 else if(dir == "right"){

   playermove.animations.play('right');

   if(mirando != "rigth"){
     mirando = "right";
   }

 }else {
   playermove.animations.play('turn');
 }

};


Game.deadR = function(id){
    Game.playerMap[id].destroy();
    delete Game.playerMap[id];
    Game.textMap[id].destroy();
};
Game.removePlayer = function(id){
    Game.playerMap[id].destroy();
    delete Game.playerMap[id];
    Game.textMap[id].destroy();
};



Game.update = function(){

  try {
    //movimiento = Game.playerMap[myid].position;

    text.position.x = Game.playerMap[myid].position.x;

    for(var i in Game.playerMap){
      if(i != myid){

        Game.textMap[i].addColor('#01DF01', 0) ;
      }else{
        Game.textMap[i].addColor('#ff0044', 0) ;
      }

      Game.textMap[i].position.x = Game.playerMap[i].position.x;
      Game.textMap[i].position.y = Game.playerMap[i].position.y-15;
    }


    if(mirando == "espera"){
      Client.socket.emit('stop',{move:mirando});
    }
    mirando = "espera";

    for (var i in Game.playerMap) {
    //game.physics.arcade.collide(Game.playerMap[i], piso);
    game.physics.arcade.collide(Game.playerMap[i], layer);
    game.physics.arcade.collide(sprite, layer);
  };
/*
  movimiento = Game.playerMap[myid].x;
  if(movimiento != movimiento1){
    console.log("mov");
    Client.socket.emit('mover',"posicion");
  }
*/

for(var i in Game.playerMap){
  if (i != myid){

    game.physics.arcade.collide(Game.playerMap[i], Game.weaponMap[myid].bullets,Game.colision, null, this);
  }
}
for(var i in Game.weaponMap){
  if (i != myid){
    game.physics.arcade.collide(Game.playerMap[myid], Game.weaponMap[i].bullets,Game.colision, null, this);
  }
}


/*
    for (var i in Game.playerMap) {
      for (var e in Game.weaponMap) {

          game.physics.arcade.collide(Game.playerMap[i], Game.weaponMap[e].bullets,Game.colision(i,e), null, this);

          }
  };*/

  for (var i in Game.playerMap) {
  //game.physics.arcade.collide(Game.playerMap[i], piso);
  Client.socket.emit('supermov',{pos:Game.playerMap[myid].position,direc:firedirect});
};



       if (cursors.left.isDown)
       {

         Game.playerMap[myid].x -= 4;
         Game.playerMap[myid].animations.play('left');
          firedirect = "left";
           Client.socket.emit('left',{x:player.x,y:player.y});
           if(mirando != "left"){
             mirando = "left";
           }

       }
       else if (cursors.right.isDown)
       {
         Game.playerMap[myid].x += 4;
         firedirect = "right";
          Client.socket.emit('right',{x:player.x,y:player.y});
          Game.playerMap[myid].animations.play('right');

          if(mirando != "rigth"){
            mirando = "right";
          }
       }

       //&& dude.body.onFloor()  && player.body.touching.down && game.time.now > jumpTimer
       if (jumpButton.isDown)
       {
          Client.socket.emit('jump',{x:player.x,y:player.y});

       }
         ///

         if (fireButton2.isDown)
       {
         Client.socket.emit('fire',{firedirection:firedirect});

       }

       //movimiento1 = Game.playerMap[myid].position;


}
catch(err) {
    console.log(err);
}



};

Game.render = function render() {

    for (var i in Game.playerMap) {
      //game.debug.body(Game.playerMap[i]);
      //game.debug.bodyInfo(Game.playerMap[i], 32, 32);
      //game.debug.spriteBounds(Game.playerMap[i], "blue", false);
      //game.debug.spriteBounds(weapon2.bullets, "blue", false);


      //game.debug.body(weapon2);
    };





};
