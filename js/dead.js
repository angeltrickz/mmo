

var Dead = {
  preload: function(){
    game.stage.backgroundColor = '#000000';

    game.load.image("boton", "assets/sprites/boton.png");


  },
  create: function(){


    var txtTitulo = game.add.text(game.width/2,game.height/2 -125,"You Dead",{font:"bold 100px sans-serif",fill:"red",align:"center"});
    txtTitulo.anchor.setTo(0.5);

    var boton = this.add.button(game.width/2,game.height/2,'boton',this.iniciarJuego,this);
    boton.anchor.setTo(0.5);





  },
  iniciarJuego: function(){

    this.state.start('Game')
  }
};
