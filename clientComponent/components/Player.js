class Player {
  constructor(props){
    this.ctx = props.ctx;
    this.eventHandler = new EventHandler();
    this.score = 0;
    this.linesCleared = 0;
    this.lastClearHeight = 0;
    this.level = 0;
    this.isDead = false;
    this.colorScheme = props.colorScheme;
    this.board = new Board(props)
    this.pieceBag = this.generatePieceBag();
    this.activePiece = this.getPiece();
    this.nextPiece = this.getPiece();
    this.nextPiece.pos.x = this.board.width + 2;
    this.nextPiece.pos.y = 1;
  }

}
