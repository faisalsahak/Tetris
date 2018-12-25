const manager = new Manager(document, true);
const playerLocal = manager.createPlayer(true);
playerLocal.element.classList.add('local');
playerLocal.run();


const connectionManager = new ConnectionManager(manager);

connectionManager.connect()

//scales the players canvas to fit the screen
resizeCanvas();

const playerKeys = [ //object that maps the gameplay keys with its values i ascii table
  {                 // later we can use the a s d w keys to play as well
    left: 37//65,// coresponds with a
    right: 39 //68, // d
    down: 40//83,// s
    drop: 32,// space
    rotateClock: 38//69, // e
    rotateCount: 81, // q
    pause: 80,// p
  }
]

//37

window.addEventListener("resize", resizeCanvas, false);
document.addEventListener('keydown', handleKeydown);


//handles the key press events
function handleKeydown(event) {
  playerKeys.forEach( (key, index) => {
    const player = playerLocal.player;
    if(!player.isDead){
      if(event.keyCode === key.left) {
        //'a'
        player.movePiece(-1)
      } else if (event.keyCode === key.right) {
        //'d'
        player.movePiece(1)
      } else if (event.keyCode === key.down) {
        //'s' accelerate drop
        player.dropPiece()
      } else if (event.keyCode === key.rotateClock) {
        //'e' for rotate clockwise
        player.rotatePiece(1);
      } else if (event.keyCode === key.rotateCount) {
        //'q' for rotate counter-clockwise
        player.rotatePiece(-1)
      } else if (event.keyCode === key.drop) {
        //'Spacebar' for quick drop
        player.instantDrop();
      } else if (event.keyCode === key.pause) {
        //'p' for pause
        playerLocal.pause();
      }
    }
  })
}