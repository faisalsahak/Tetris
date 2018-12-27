class Game {

  constructor(props) {
    //creates a canvas
    this.element = props.element;
    this.canvas = this.element.querySelector('.gameCanvas');
    this.canvas.width = props.CANVAS_WIDTH;
    this.canvas.height = props.CANVAS_HEIGHT;

    //Add the canvas context into the existing props defining canvas structure
    this.ctx = this.canvas.getContext('2d');
    this.props = Object.assign({}, props, {ctx: this.ctx});

    this.player = new Player(this.props);

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
    let ctx = this.props.ctx;
    //This is the Sidebar color
    ctx.fillStyle = 'rgba(175,150,200, .3)';
    ctx.fillRect(0,0, this.props.CANVAS_WIDTH, this.props.CANVAS_HEIGHT);
    //Playing area black
    ctx.fillStyle = 'rgba(0,0,0, 1)';
    ctx.fillRect(0,0, this.props.BOARD_WIDTH * this.props.TILESIZE + 2, this.props.BOARD_HEIGHT * this.props.TILESIZE);
    //Border of playing area
    ctx.strokeStyle = 'white';
    ctx.strokeRect(0,0, this.props.BOARD_WIDTH * this.props.TILESIZE + 2, this.props.BOARD_HEIGHT * this.props.TILESIZE);
    //Border and fill of preview area
    ctx.strokeRect(this.props.TILESIZE * this.props.BOARD_WIDTH + 10, 10, 100, 100);
    ctx.fillStyle = 'rgba(100,100,150, .5)';
    ctx.fillRect(this.props.TILESIZE * this.props.BOARD_WIDTH + 10, 10, 100, 100);

    canvasText(this.ctx, 'SCORE', 'Audiowide', '25px', ((this.player.board.width * this.player.board.tileSize) + 60), 170, 80,'yellow', 'center')
    canvasText(this.ctx, this.player.score, 'Audiowide', '20px', ((this.player.board.width * this.player.board.tileSize) + 60), 210, 80,'white', 'center')
    canvasText(this.ctx, 'LINES', 'Audiowide', '25px', ((this.player.board.width * this.player.board.tileSize) + 60), 250, 80, 'yellow', 'center')
    canvasText(this.ctx, this.player.linesCleared, 'Audiowide', '25px', ((this.player.board.width * this.player.board.tileSize) + 60), 290, 80,'white', 'center')
    canvasText(this.ctx, 'LEVEL', 'Audiowide', '25px', ((this.player.board.width * this.player.board.tileSize) + 60), 330, 80,'yellow', 'center')
    canvasText(this.ctx, this.player.level + 1, 'Audiowide', '25px', ((this.player.board.width * this.player.board.tileSize) + 60), 370, 80,'white', 'center')

  }

  draw() {
    cls(this.props);
    this.drawGameBG();
    if(this.paused) {
      this.drawPaused();
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


}
