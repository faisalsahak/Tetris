class Player {
  constructor(props){
    this.ctx = props.ctx;
    this.eventHandler = new EventHandler();
    this.score = 0;
    this.linesCleared = 0;
    this.lastClearHeight = 0;
    this.level = 0;
    // console.log(this.props);
    this.playerName = "Player "+ this.generateRandomId();
    this.isDead = false;
    this.colorScheme = props.colorScheme;
    this.ctx.lineWidth = 1;
    this.board = new Board(props)
    this.pieceBag = this.generatePieceBag();
    this.activePiece = this.getPiece(); // current piece that user controls

    this.playerNameScores = new Map;


    // the next piece in the queue
    this.nextPiece = this.getPiece();
    this.nextPiece.pos.x = this.board.width+1.5;
    this.nextPiece.pos.y = 0.5;
    // the next next piece in the queue
    this.nextPiece2 = this.getPiece();
    this.nextPiece2.pos.x = this.board.width+1.5;
    this.nextPiece2.pos.y = 3.5;

    this.nextPiece3 = this.getPiece();
    this.nextPiece3.pos.x = this.board.width+1.5;
    this.nextPiece3.pos.y = 6;
  }


generateRandomId(len = 2) {

  const chars = '0123456789';
  let length = len;
  let id = '';
  while(length--) {
    id += chars[Math.random() * chars.length | 0]
  }
  return id;
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
        this.eventHandler.emit('boardMatrix', this.board.matrix);



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
        // console.log("from playersssssssssss")
        var allInfo = this.getPlayerInfo();
        this.eventHandler.emit('allScores', allInfo);

      //TODO:: make more elegant

      //job of these 5 lines are:
      //once done with the current piece, it gets replaced with the next piece on the screen to the right
      this.activePiece = this.nextPiece
      this.activePiece.pos = {x: this.activePiece.initX, y: this.activePiece.initY};
      // this.nextPiece = this.getPiece();
      this.nextPiece = this.nextPiece2;
      this.nextPiece.pos.x = this.board.width+1.5;
      this.nextPiece.pos.y = 0.5;

      // this.props.ctx.lineWidth = 1;


      // this.newPiece = new Piece(this.board, this.pieceBag.splice(1,2).join(''));

      //these 4 lines will get the next next piece in the line up and replace it with the next piece to be active
      this.activePiece.pos = {x: this.activePiece.initX, y: this.activePiece.initY};
      // this.nextPiece2 = this.getPiece();
      this.nextPiece2 = this.nextPiece3
      this.nextPiece2.pos.x = this.board.width+1.5;
      this.nextPiece2.pos.y = 3.6;

      //these lines get the next-next-next piece in the queue
      this.activePiece.pos = {x: this.activePiece.initX, y: this.activePiece.initY};
      this.nextPiece3 = this.getPiece();
      this.nextPiece3.pos.x = this.board.width+1.5;
      this.nextPiece3.pos.y = 6;


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
      var oldScore = this.score;
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
        // console.log(this.playerName+ " "+this.score)
        // console.log(this.props)
        // if(this.score> oldScore)
        // console.log(this.eventHandler)

          // this.setPlayerScores();
    }

    setPlayerScores(){
      // game.player.playerNameScores.set(game.player.playerName, 0)

      var scoreContainer = document.getElementById('scoresTable');
      var el = document.createElement('li');
      el.innerHTML  = this.playerName + " : "  + this.score+"\n";
      scoreContainer.appendChild(el);
    }

    setLines(lines) {
        this.linesCleared = lines;
    }

    updateScore(completedLines) {
        // console.log("from playerss");
      // console.log("score updated")
      // console.log(this.psrops)
      // console.log(io)
      // this.eventHandler.emit('playerScore',, this.playerName);
        const newScore = this.calcScore(completedLines);
        this.setScore(newScore);
        this.eventHandler.emit('score', newScore)
      // this.eventHandler.emit('playerScore', this.playerName);
    }
    //TODO:: add some kind of reward system
    calcScore(completedLines) {
        // determines the multiplier based on previous number of rows
        //The one thing to note is that if the previous clear was a tetris and this one was as well, the multiplier is even higher
        const multiplier = completedLines === 1 ? 40 : completedLines === 2 ? 100 : completedLines === 3 ? 300 : this.lastClearHeight === 4 ? 1800 : 1200;
        const points = multiplier * (this.level + 1)
        return this.score + points;
    }

    // getScores(newScore){

    //   var oldScore = 0;
    //   if(this.score > oldScore){
    //     oldScore = this.score;


    //   }

    // }

    // sendNamesToMap(name, score){

    //   // if(this.playerNameScores.has(name)){
    //     // console.log(name + " is in the map")
    //     this.playerNameScores.set(name, score);
    //   // }else{

    //   // }

    //   var scoreContainer = document.getElementById('scoresTable');
    //     var el = document.createElement('p');
    //     el.setAttribute('id', name);
    //     el.innerHTML  = this.playerNameScores.get(name);
    //     scoreContainer.appendChild(el);
    //   // this.getScores(newScore);
    //   if(this.playerNameScores.has(name)){
    //     var element = document.getElementById(name);
    //     console.log(element)
    //     // element.remove();


    //     var el = document.createElement('p');
    //     el.innerHTML  = this.playerNameScores.get(name);
    //     $(name).replaceWith( el );
    //     // scoreContainer.appendChild(el);
    //   }else{

    //   }

    //   // console.log(this.playerNameScores.get(name));
    //       // function addNameToScoreTable(){
    //   // var scoreContainer = document.getElementById('scoresTable');
    //   // // console.log(this.player.playerName)
    //   // // console.log(manager.instances);
    //   // // console.log(manager.instances[1].player.playerName);
    //   // var counter = 0;
    //   //  for(var i = 0; i<manager.instances.length; i++){
    //   //   // addNameToScoreTable(manager.instances[i].player.playerName);
    //   //   var el = document.createElement('li');
    //   //   var playerInfo = manager.instances[i].player
    //   //   el.innerHTML  = playerInfo.playerName + " : \t "+ playerInfo.score +"\n";
    //   //   scoreContainer.appendChild(el);
    //   //   // console.log(manager)
    //   //   // console.log(manage[i].player)
    //   // }
    //   // el.innerHTML = name
    //   // console.log(name)

    // // }



    //   // for (var key of this.playerNameScores.keys()) {
    //   //   console.log("map key "+key);
    //   // }

    //   // for (var value of this.playerNameScores.values()) {
    //   //   console.log("map value "+value);
    //   // }
    // // console.log(name + " : " + score);
    // }
    getPlayerInfo(){
      // this.eventHandler.emit('score', this.score);
      //   this.eventHandler.emit('score', this.playerName)
      //   this.eventHandler.emit('score', this.level)
        return{
          score: this.score,
          playerName: this.playerName,
          leve: this.level
        }

    }


    setScore(newScore) {
        this.score = newScore;
        // console.log(this.playerName +" : "+ newScore);
        // this.sendNamesToMap(this.playerName, newScore);
        // console.log(this.props)

        // this.getScores(newScore);
        // var scoreContainer = document.getElementById('scoresTable');
        // var el = document.createElement('li');
        // el.innerHTML  = newScore +"\n";
        // scoreContainer.appendChild(el);
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

      // console.log("aa");
        this.activePiece.render();// renders the current piece being played
        this.nextPiece.render();// renders the next piece in the pool
        this.nextPiece2.render(); // renders the next next piece to the right
        this.nextPiece3.render(); // renders the next next piece to the right
        // console.log(this.playerNameScores.get(name));
        // console.log("aa")
        // this.pieceBag[0].render();
    }

}
