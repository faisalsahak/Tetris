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

    this.nextPiece2 = this.getPiece();
    this.nextPiece2.pos.x = this.board.width + 2;
    this.nextPiece2.pos.y = 6;
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

  movePiece(direction) {
        this.activePiece.pos.x += direction;
        if(this.checkBoardCollision()){
            this.activePiece.pos.x -= direction;
            return; //the position change isn't emitted below (it will be emitted in the reset function instead)
        }
        this.eventHandler.emit('activePiecePos', this.activePiece.pos)
    }

    rotatePiece(direction) {
        // TODO:: need to fix the wall-kick effect
        this.activePiece.rotate(direction);
        if(this.checkBoardCollision()) {
            this.movePiece(direction);
            if(this.checkBoardCollision) {
                this.movePiece(direction);
                if(this.checkBoardCollision) {
                    this.movePiece(-direction)
                    this.movePiece(-direction)
                    if(this.checkBoardCollision()) {
                        this.movePiece(-direction)
                        if(this.checkBoardCollision()) {
                            this.movePiece(direction)
                            this.movePiece(direction)
                            this.activePiece.rotate(-direction)
                        }
                    }
                }
            }
        }
        this.eventHandler.emit('activePieceMatrix', this.activePiece.matrix);
    }

    handleDropCollision() {
        this.activePiece.pos.y--;
        this.board.mergePiece(this.activePiece)
        this.eventHandler.emit('activePiecePos', this.activePiece.pos)
        this.eventHandler.emit('boardMatrix', this.board.matrix)

        this.resetPiece();
        this.checkCompletedLines();
    }

    dropPiece() {
            this.activePiece.pos.y++;
            if(this.checkBoardCollision()) {
                this.handleDropCollision();
                return; //the position change isn't emitted below (it will be emitted in the reset function instead)
            }
            this.eventHandler.emit('activePiecePos', this.activePiece.pos)
    }

    instantDrop() {
        //TODO:: to this later
        while(!this.checkBoardCollision()) {
            this.activePiece.pos.y++;
        }
        this.handleDropCollision();
    }

    checkBoardCollision() {
      for (let y = 0; y < this.activePiece.matrix.length; y++){
          for (let x = 0; x < this.activePiece.matrix[y].length; x++) {
              if(this.activePiece.matrix[y][x] !== 0 &&( this.board.matrix[y + this.activePiece.pos.y] &&
               this.board.matrix[y + this.activePiece.pos.y][x + this.activePiece.pos.x]) !== 0){
                  return true;
              }

          }
      }
      return false;
    }

    resetPiece() {
      //TODO:: make more elegant

      //job of these 5 lines are:
      //once done with the current piece, it gets replaced with the next piece on the screen to the right
      this.activePiece = this.nextPiece
      this.activePiece.pos = {x: this.activePiece.initX, y: this.activePiece.initY};
      // this.nextPiece = this.getPiece();
      this.nextPiece = this.nextPiece2;
      this.nextPiece.pos.x = this.board.width + 2;
      this.nextPiece.pos.y = 1;


      // this.newPiece = new Piece(this.board, this.pieceBag.splice(1,2).join(''));

      //these 4 lines will get the next next piece in the line up and replace it with the next piece to be active
      this.activePiece.pos = {x: this.activePiece.initX, y: this.activePiece.initY};
      this.nextPiece2 = this.getPiece();
      this.nextPiece2.pos.x = this.board.width + 2;
      this.nextPiece2.pos.y = 6;


      this.eventHandler.emit('activePiecePos', this.activePiece.pos)
      this.eventHandler.emit('activePieceMatrix', this.activePiece.matrix)
      this.eventHandler.emit('nextPieceMatrix', this.nextPiece.matrix)

      // this.eventHandler.emit('nextPieceMatrix', this.nextPiece2.matrix)

      // this.activePiece = this.nextPiece2;

      //Kills player and ends game as soon as new piece tries to spawn on occupied board space
      if(this.checkBoardCollision()){
          this.isDead = true;
      }

    }
    // this method tracks if a line is completed so it can be removed and the rest dropped down
    checkCompletedLines() {
        //variable to track number of lines in one pass
        let completedLines = 0;
        //loop through board matrix
        for (let i = 0; i < this.board.matrix.length; i++){
            //test if all entries are not 0 (I believe some() is faster - should check)
            //return true if there aren't any elements that are zero
            if(!this.board.matrix[i].some((elem) => {return !elem})) {
                //if so add to variable
                completedLines += 1;
                // then delete that row
                this.board.matrix.splice(i, 1);
                //add a new blank row to beginning of array
                this.board.matrix.unshift(new Array(this.board.matrix[0].length).fill(0))
                this.eventHandler.emit('boardMatrix', this.board.matrix)
            }

        }
        //TODO:: add some sound and also some kind of award system
        if(completedLines) {
            const newLines = this.linesCleared + completedLines;
            this.setLines(newLines);
            this.eventHandler.emit('linesCleared', this.linesCleared)
            this.updateScore(completedLines);
            this.lastClearHeight = completedLines; //Track previous clear to award bonus for back to back tetrises
            this.updatePlayerLevel();
        }
    }

    setLines(lines) {
        this.linesCleared = lines;
    }

    updateScore(completedLines) {
        const newScore = this.calcScore(completedLines);
        this.setScore(newScore);
        this.eventHandler.emit('score', newScore)
    }
    //TODO:: add some kind of reward system
    calcScore(completedLines) {
        // determines the multiplier based on previous number of rows
        //The one thing to note is that if the previous clear was a tetris and this one was as well, the multiplier is even higher
        const multiplier = completedLines === 1 ? 40 : completedLines === 2 ? 100 : completedLines === 3 ? 300 : this.lastClearHeight === 4 ? 1800 : 1200;
        const points = multiplier * (this.level + 1)
        return this.score + points;
    }

    setScore(newScore) {
        this.score = newScore;
    }

    updatePlayerLevel() {
        if(this.linesCleared <= 9) {
            this.level = 0;
        } else if (this.linesCleared >= 10 && this.linesCleared < 90) {
            this.level = Math.floor(this.linesCleared / 10)
        } else {
            this.level = 9;
        }
        this.eventHandler.emit('level', this.level)
    }

    render() {
        this.activePiece.render();// renders the current piece being played
        this.nextPiece.render();// renders the next piece in the pool
        this.nextPiece2.render(); // renders the next next piece to the right
        // this.pieceBag[0].render();
    }

}
