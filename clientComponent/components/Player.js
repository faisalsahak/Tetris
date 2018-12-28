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

    // what this function does is generages 4 picees and returns it and once there is a need
    // for more then another will be generated, this is where we can add more than 1 next pieces
  generatePieceBag() {
    const pieceTypes = 'TLJSZOI';
    let grabBag = [];

    for(let i = 0; i < 4; i++) {
        const pieces = pieceTypes.split('');
        for(let j = 0; j < 7; j++) {
            grabBag.push(pieces.splice(Math.floor(Math.random() * pieces.length), 1));
        }
    }
    grabBag = [].concat(...grabBag); //Flatten array of arrays of one letter each
    return grabBag;
  }

  getPiece() {// utilizes the generatePiceBag function above to generate us a bag of pieces
    if (!this.pieceBag.length) {
        this.pieceBag = this.generatePieceBag()
    }
    const piece = new Piece(this.board, this.pieceBag.splice(0,1).join(''))
    return piece;
  }
}
