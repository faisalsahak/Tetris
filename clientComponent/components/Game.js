class Game {

  constructor(props) {
    //creates a canvas
    this.element = props.element;
    this.canvas = this.element.querySelector('.gameCanvas');
    this.canvas.width = props.CANVAS_WIDTH ;
    this.canvas.height = props.CANVAS_HEIGHT;
    // this.canvas.width = 400;
    // this.canvas.height =580;
    // console.log(this.canvas.width);
    // console.log(this.canvas.height);
    // this.playerNameScores = new Map;

    //  for the shadow canvas
    // this.shadowCanvas = document.getElementById('shadow_canvas');
    // // console.log(this.element)
    // this.shadowCanvas.width = props.CANVAS_WIDTH ;
    // this.shadowCanvas.height = props.CANVAS_HEIGHT;
    // this.shadowY = 0;
    // this.pieceY = 0;


    // this.scoreCanvas = this.element.querySelector('.scoreCanvas');
    // this.ctx2 = this.scoreCanvas.getContext('2d');
    // this.props2 = Object.assign({}, props, {ctx2: this.ctx2});

    //Add the canvas context into the existing props defining canvas structure
    this.ctx = this.canvas.getContext('2d');
    this.props = Object.assign({}, props, {ctx: this.ctx});
    // this.ctx.strokeStyle = "white";
    // this.ctx.stroke();

    this.player = new Player(this.props);
    this.player.eventHandler.emit('initialBroadcast', {name: this.player.playerName, score: this.player.score})

    // this.counter = 0;
    // this.player.playerName = "player "+this.counter;
    // console.log()
    // this.counter = this.counter+ 1;

    this.paused = false;

    //Used to control drop timing
    this.DROP_INIT = 1000;
    this.initSpeed = .8;
    this.speedModifier = this.initSpeed;

    this.dropInterval = this.DROP_INIT * this.speedModifier; //in milliseconds
    this.dropCounter = 0;
    this.lastTime = 0;

    this.run = this.run.bind(this);


  }


  drawGameBG() {
    // console.log(outline)
    // console.log(this.player)
    let ctx = this.props.ctx;
    //This is the Sidebar color
    ctx.fillStyle = 'rgba(175,150,200, .3)';
    ctx.fillRect(0,0, this.props.CANVAS_WIDTH, this.props.CANVAS_HEIGHT);
    //Playing area black
    ctx.fillStyle = '#2f2f2f';
    ctx.fillRect(0,0, this.props.BOARD_WIDTH * this.props.TILESIZE + 2, this.props.BOARD_HEIGHT * this.props.TILESIZE);
    //Border of playing area
    ctx.strokeStyle = 'white';
    ctx.strokeRect(0,0, this.props.BOARD_WIDTH * this.props.TILESIZE + 2, this.props.BOARD_HEIGHT * this.props.TILESIZE);
    //Border and fill of preview area
    // ctx.strokeRect(this.props.TILESIZE * this.props.BOARD_WIDTH + 20, 20, 90, 90);
    // ctx.fillStyle = 'rgba(100,100,150, .5)';
    // ctx.fillRect(this.props.TILESIZE * this.props.BOARD_WIDTH + 20, 20, 90, 90);

    // ctx.strokeRect(this.props.TILESIZE * this.props.BOARD_WIDTH + 30, 100, 190, 190);
    // ctx.fillStyle = 'rgba(100,100,150, .5)';
    // ctx.fillRect(this.props.TILESIZE * this.props.BOARD_WIDTH + 30, 100, 190, 190);

    canvasText(this.ctx, 'SCORE', 'Audiowide', '25px', ((this.player.board.width * this.player.board.tileSize) + 60), 220, 80,'yellow', 'center')
    canvasText(this.ctx, this.player.score, 'Audiowide', '20px', ((this.player.board.width * this.player.board.tileSize) + 60), 250, 80,'white', 'center')
    canvasText(this.ctx, 'LINES', 'Audiowide', '25px', ((this.player.board.width * this.player.board.tileSize) + 60), 290, 80, 'yellow', 'center')
    canvasText(this.ctx, this.player.linesCleared, 'Audiowide', '20px', ((this.player.board.width * this.player.board.tileSize) +60), 320, 80,'white', 'center')
    canvasText(this.ctx, 'LEVEL', 'Audiowide', '25px', ((this.player.board.width * this.player.board.tileSize) + 60), 360, 80,'yellow', 'center')
    canvasText(this.ctx, this.player.level + 1, 'Audiowide', '20px', ((this.player.board.width * this.player.board.tileSize) +60), 390, 80,'white', 'center')
    // console.log(((this.player.board.width * this.player.board.tileSize) + 60));
    // console.log("called");



  }



drawLine(ctx,p1,p2,color){// draws the vertical and horizontal grid
  ctx.beginPath();
  ctx.moveTo(p1.x,p1.y);
  ctx.lineTo(p2.x,p2.y);

  ctx.lineWidth=1; // thinckness of each line in the grid
  ctx.strokeStyle= color;

  ctx.stroke();
  ctx.closePath();
};


//Draw game grids
drawGrids(el,gridSize,colCount,rowCount){
  var gridSize = this.props.TILESIZE;
  var ctx = el.getContext('2d');

  var width = this.props.BOARD_WIDTH* this.props.TILESIZE;
  var height = this.props.BOARD_HEIGHT * this.props.TILESIZE ;

  var lineColor = 'rgba(255,255,255,0.1)';//the color of the grid, and also the visibility of it

  for (var i = 1; i < colCount-8; i++) { //goes through the colcount and draws that many lines
      var x = gridSize*i+0.5;
    this.drawLine(ctx,{x:x,y:0},{x:x,y:height},lineColor);
  };
  for (var i = 1; i < rowCount; i++) { // goes through the rowCount and raws the lines
    var y = gridSize*i+0.5;
    this.drawLine(ctx,{x:0,y:y},{x:width,y:y},lineColor);
  };
};





  draw() {
    cls(this.props);
        // this.ctx.lineWidth = 1;

    this.drawGameBG();
    //function call to draw the grid
    this.drawGrids(this.canvas,this.gridSize,(this.props.BOARD_WIDTH +
      this.player.board.width)-3,this.canvas.width);

    if(this.paused) {
      this.drawPaused();
      // this.reset();
      // this.draw();

    } else if (this.player.isDead){
      this.player.board.render();
      this.player.render();
      this.drawDead();
    } else {
      this.player.board.render();
      this.player.render();
    }
  }

  pause() {
    this.paused = !this.paused;
    this.player.eventHandler.emit('pauseStatus', this.paused)
  }


  drawPaused() {
    let ctx = this.props.ctx;
    ctx.fillStyle = 'rgba(100,100,150, .85)';
    ctx.fillRect(1 * this.props.TILESIZE, 8 * this.props.TILESIZE, 10 * this.props.TILESIZE, 4 * this.props.TILESIZE)
    ctx.strokeStyle = 'white';
    ctx.strokeRect(1 * this.props.TILESIZE, 8 * this.props.TILESIZE, 10 * this.props.TILESIZE, 4 * this.props.TILESIZE);
    canvasText(ctx, 'PAUSED', 'Audiowide', '25px', 6 * this.props.TILESIZE, 10.5 * this.props.TILESIZE, 80, 'white', 'center')
  }


  drawDead() {
    let ctx = this.props.ctx;
    ctx.fillStyle = 'rgba(100,100,150, .85)';
    ctx.fillRect(1 * this.props.TILESIZE, 8 * this.props.TILESIZE, 10 * this.props.TILESIZE, 4 * this.props.TILESIZE)
    ctx.strokeStyle = 'white';
    ctx.strokeRect(1 * this.props.TILESIZE, 8 * this.props.TILESIZE, 10 * this.props.TILESIZE, 4 * this.props.TILESIZE);
    canvasText(ctx, 'GAME OVER', 'Audiowide', '60px', 6 * this.props.TILESIZE, 11 * this.props.TILESIZE, 180, 'white', 'center')
  }

  //requestAnimationFrame returns callback with single argument of timestamp
  //On first run through needs to have a placeholder of 0
  run(time = 0) {


    //This is an attempt to stop the glitching where localInstances of copies are automatically drawing drops between
    //remote updates
    //Note: It's not working. Perhaps I'm broadcasting redundantly instead. But this may still cut down on a bit cycles on the
    //local client
    if(this.props.isLocal) {

      //Allow the game to speed up incrementally based on current level (Maxes at 10)
      this.dropInterval = this.DROP_INIT * this.speedModifier;

      const deltaTime = time - this.lastTime;
      this.lastTime = time;
      this.dropCounter += deltaTime;
      if(!this.paused) {
        if (this.dropCounter > this.dropInterval) {
          if(!this.player.isDead) {
            // console.log(this.player.score)
            //This last IF is because the program was running initially without a board or piece to merge and throwing an error
            if(this.player.board.matrix.length && this.player.activePiece.matrix !== undefined) {

              this.player.dropPiece();
              this.dropCounter = 0;
            }
          }
        }
      }
      requestAnimationFrame(this.run);
    }
    this.updateDropInterval()
    this.draw();
    // this.addNameToScoreTable();

  }

  updateDropInterval() {

    // if (player.linesCleared) <- Could add handling only in this case for efficiency
    this.speedModifier = .8 - (this.player.level * 0.07);
  }

  // sendNamesToMap(name, score){
  //   this.playerNameScores.set(name, score);
  //   // console.log(name + " : " + score);
  // }

  sendLocalState() {
        // console.log(this.player.score);

    // console.log("ff")
    //Send local state to server to broadcast to all other players
    // this.sendNamesToMap(this.player.playerName, this.player.score)
    return {
      board: this.player.board.matrix,
      activePieceMatrix: this.player.activePiece.matrix,
      activePiecePos: this.player.activePiece.pos,
      nextPieceMatrix: this.player.nextPiece.matrix,
      score: this.player.score,
      linesCleared: this.player.linesCleared,
      pauseStatus: this.paused,
      level: this.player.level,
    }
  }



  receiveRemoteState(state) {
    //Update local copies of remote instance's state
    // console.log(this.player.playerName)
    // console.log("ff");
    // this.sendNamesToMap(this.player.playerName, this.player.score)
    this.player.board.matrix = Object.assign(state.boardMatrix);
    this.player.activePiece.matrix = Object.assign(state.activePieceMatrix);
    this.player.activePiece.pos = Object.assign(state.activePiecePos);
    this.player.nextPiece.matrix = Object.assign(state.nextPieceMatrix);
    this.player.score = state.score;
    this.player.linesCleared = state.linesCleared;
    this.player.level = state.level;
    this.paused = state.pauseStatus;
    this.draw();
  }



  // clearMatrix (matrix){
  //   for(var i = 0;i<matrix.length;i++){
  //     for(var j = 0;j<matrix[i].length;j++){
  //       matrix[i][j] = 0;
  //     }
  //   }
  // }

  // reset(){
  //   // this.running = false;
  //   this.player.isDead = false;
  //   this.player.level = 1;
  //   this.player.score = 0;
  //   this.paused = false;
  //   // this.startTime = new Date().getTime();
  //   // this.currentTime = this.startTime;
  //   // this.prevTime = this.startTime;
  //   // this.levelTime = this.startTime;
  //   this.clearMatrix(this.player.board.matrix);
  //   console.log(this.player.board.matrix);
  //   // views.setLevel(this.level);
  //   // views.setScore(this.score);
  //   // views.setGameOver(this.isGameOver);
  //   // this._draw();
  //   this.run = this.run.bind(this);
  // }

  // Does not need to be called every frame like updatePiece is.
// will be called from left and right moves, also
//   updateShadow() {
//     var ctx = document.getElementById('shadow_canvas').getContext('2d');
//     drawShadow(ctx);
//   }


//  drawShadow(context) {
//   var curY;
//   var count = 0;
//   var origY = pieceY;
//   while(!isPieceInside()) {
//     curY = pieceY;
//     pieceY++;
//   count++;
//   } // This is a little bad --
//   // I am modifying critical program state
//   // when it is not necessary.
//   // This is done to increase code reuse
//   pieceY = origY;
//   this.shadowY = curY;
//   if (!count) return;
//   drawShadowPieceAt(context,pieceX,curY);
// }

}


















