class Piece {
  constructor(board, type = this.newRandomType()) {
    this.ctx = board.ctx;
    this.tileSize = board.tileSize;
    this.type = type;
    this.matrix = this.createPiece(this.type);
    this.colorScheme = board.colorScheme;
    this.initX = Math.floor(board.width /2) - 2;
    this.initY = 0;
    this.pos = {
      x: this.initX,
      y: this.initY
    }
  }
  //this return a random letter which corresponds with the type of the block
  newRandomType() {
    return 'TLJSZOI'[Math.random() * 7 | 0]
  }

}