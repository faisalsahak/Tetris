class Manager {
  constructor(document, isLocal = false) {
    this.isLocal = isLocal;
    this.document = document;
    this.template = this.document.querySelector('#player-template')
    // this.canvasContainer = document.getElementById('canvasContainer');
    this.localContainer = document.getElementById('localContainer');
    this.remoteContainer = document.getElementById('remoteContainer');

    this.instances = [];
    this.colorSchemeIndex = 3;
    // console.log(this.document)
  }

  createPropsBundle(element, index) {

    const TILESIZE = 20;
    const BOARD_WIDTH = 12;
    const BOARD_HEIGHT = 20;

    const COLOR_SCHEMES = [
      {
        pieces: ['red', 'blue', 'purple', 'pink','orange', 'indigo', 'green'],
        outline: 'black',
      },
      {
        pieces: ['#A60037', '#F47992', '#FFE8B8', '#8BB195','#73725F', '#786171', '#00DDAA'],
        outline: 'black',
      },
      {
        pieces: ['red', 'blue', 'purple', 'pink','orange', 'indigo', 'green'],
        outline: 'black',
      },
      {
        pieces: ['#A60037', '#F47992', '#FFE8B8', '#8BB195','#73725F', '#786171', '#00DDAA'],
        outline: 'black',
      },
    ]

    const CANVAS_WIDTH = TILESIZE * (BOARD_WIDTH + 6);
    const CANVAS_HEIGHT = TILESIZE * BOARD_HEIGHT;

    // const PLAYERNAME = this.generateRandomName();

    //create a bundle
    return {
      element: element,
      isLocal: this.isLocal,
      CANVAS_WIDTH,
      CANVAS_HEIGHT,
      TILESIZE,
      // PLAYERNAME,
      BOARD_HEIGHT,
      BOARD_WIDTH,
      colorScheme: COLOR_SCHEMES[index],
    }

  }

  createPlayer(local = false) {
    // console.log("user created")
    // console.log("new Player has joinnnnneeeeeeed")
    const element = document.importNode(this.template.content, true)
                   .children[0];
    const game = new Game(this.createPropsBundle(element, this.colorSchemeIndex)); //need to dynamically change index later for color change
    //Add Game Instance to row based on whether or not is the local instance
    // console.log(game)
    var playerCounter = this.instances.length + 1;
    if (local) {
      this.localContainer.appendChild(game.element);
      // game.player.playerName = "Player "+playerCounter

    } else {
      this.remoteContainer.appendChild(game.element);
    }

      // game.player.playerName = "Player "+ playerCounter;

      // game.player.playerNameScores.set(game.player.playerName, 0)

      // var scoreContainer = document.getElementById('scoresTable');
      // var el = document.createElement('li');
      // el.innerHTML  = game.player.playerName + " : "  + game.player.playerNameScores.get(game.player.playerName)+"\n";
      // scoreContainer.appendChild(el);
      // console.log(game.player.playerNameScores)
    // console.log(game)

    this.instances.push(game);



    return game;
  }

  removePlayer(game) {
    console.log('removing remote game')
    if (game.element.classList.contains('local')) {
      this.localContainer.removeChild(game.element);
    } else {
      this.remoteContainer.removeChild(game.element);
    }
  }


//   addNameToScoreTable(){
//   // console.log(this.player.playerName)
//   // console.log(manager.instances);
//   // console.log(manager.instances[1].player.playerName);
//   var counter = 0;
//    for(var i = 0; i<manager.instances.length; i++){
//     // addNameToScoreTable(manager.instances[i].player.playerName);
//     var playerInfo = manager.instances[i].player
//     // console.log(manager)
//     // console.log(manage[i].player)
//   }
//   // el.innerHTML = name
//   // console.log(name)

// }

  // generateRandomName(len = 5){
  //   const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  //   let length = len;
  //   let id = '';
  //   while(length--) {
  //     id += chars[Math.random() * chars.length | 0]
  //   }
  //   return id;
  // }

  // sortPlayers(players) {
  //  players.forEach(player => {
  //    this.canvasContainer.appendChild(player.element)
  //  })
  // }

}