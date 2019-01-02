class Board {
  constructor(props) {
    // TODO
    //should start tracking x/y for multiple boards later
    this.width = props.BOARD_WIDTH;
    this.height = props.BOARD_HEIGHT;
    this.tileSize = props.TILESIZE ;
    this.ctx = props.ctx;
    // this.ctx.strokeStyle = "white";
    // this.ctx.stroke();
    this.matrix = this.generateEmptyBoard();
    this.colorScheme = props.colorScheme;
  }
  //generates an empty board for us
  generateEmptyBoard() {
    const matrix = [];
    for(let i = 0; i < this.height; i++){
      matrix.push(new Array(this.width).fill(0))
    };
    // for(var i = 0; i<matrix.length; i++){
    //   for(var j = 0; j<matrix[i].length; j++ ){
    //     console.log(matrix[i][j])
    //   }
    // }


    console.log("running");
    return matrix;
  }

  // TODO:  might return an undefined error for empty array, take a look when done
  mergePiece(piece) {
    for (let y = 0; y < piece.matrix.length; y++) {
      for (let x = 0; x < piece.matrix[y].length; x++) {
        if(piece.matrix[y][x] !== 0){
          this.matrix[y + piece.pos.y][x + piece.pos.x] = piece.matrix[y][x];
        }
      }
    }
  }

  render() {
    drawMatrix(this.ctx, this.matrix, {x: 0, y: 0}, this.tileSize, this.colorScheme)
  }
}










