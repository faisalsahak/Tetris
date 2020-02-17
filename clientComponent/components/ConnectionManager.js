class ConnectionManager {
  constructor(manager) {
    this.connection = null;
    this.peers = new Map;
    this.manager = manager;
    this.localInstance = this.manager.instances[0];
    // this.localInstance.canvas.height = 200;
    // this.manager.instances[0].canvas.clientHeight = 1900
    // console.log(this.localInstance.canvas.width)
    // console.log(this.localInstance.canvas.height)
    // console.log(this.manager.instances[0].canvas.clientHeight)

    // this.socket = io.connect('http://localhost')

// console.log(this.peers);
    // this.mapValues();
  }

// mapValues(){
//   for (var m in this.peers){
//     for (var i=0;i<this.peers[m].length;i++){
//       console.log(this.peers[m][i]);
//       console.log("ff")
//     }
//   }
// }


//   updateName(len = 5){
//       const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
//       let length = len;
//       let id = '';
//       while(length--) {
//         id += chars[Math.random() * chars.length | 0]
//       }
//       return id;
//   }

//   goThroughAllNames(){
//     for(var i = 0; i <this.manager.instances.length; i++){
//       var name = this.updateName();
//       this.manager.instances[i].player.playerName = name;
//       console.log("name generaged: " + name);
//     }
//   }




  connect() {
    this.connection = io.connect()

    this.connection.on('connect', () => {
      console.log('Connected to server');
      // this.goThroughAllNames();
      // console.log(this.manager.instances[0])

      this.initSession();
      this.initEventHandlers();
      this.localStateListeners();
      this.updateServer();

      //All server messages will be handled through here instead of separate emit/on handlers
      this.connection.on('message', (packet) => {
        this.receive(packet);
      });
    });
  }

  receive(packet) {
    const data = JSON.parse(packet);

    if (data.type === 'sessionCreated') {
      //This hash will act as the session/room id to sync players
      window.location.hash = data.id;
    }
    else if (data.type === 'sessionBroadcast') {
      //adding on new remote instances to track
      this.updateManager(data.peers);
    }
    else if (data.type === 'clientUpdate') {
      this.updatePeer(data)
    }
    // else if(data.type === 'playerScore'){
    //   console.log("got it")
    // }
  }

  send(data) {
    const packet = JSON.stringify(data);
    this.connection.send(packet);
  }

  initSession() {
    const sessionId = window.location.hash.split('#')[1];
    const localState = this.localInstance.sendLocalState()
    if(sessionId) {
      console.log('Joining Session', sessionId)
      this.send({
        type: 'joinSession',
        id: sessionId,
        state: localState
      });
    } else {
      console.log('Creating session')
      this.send({
        type: 'createSession'
      })
    }
  }

  initEventHandlers() {
    // console.log("local instanceeee");
    // console.log(this.manager.instances)

    //Have server broadcast state for new instances to overwrite defaults on initializing them
    const player = this.localInstance.player;
    console.log("player")
    console.log(player.ctx.canvas)
    // player.ctx.canvas.height = player.ctx.canvas.height + 300
    player.eventHandler.emit('pauseStatus', this.localInstance.paused)
    player.eventHandler.emit('boardMatrix', player.board.matrix);
    player.eventHandler.emit('activePieceMatrix', player.activePiece.matrix);
    // player.eventHandler.emit('activePieceMatrix', player.score);
    player.eventHandler.emit('nextPieceMatrix', player.nextPiece.matrix);
    player.eventHandler.emit('score', player.score);
    player.eventHandler.emit('linesCleared', player.linesCleared);
    player.eventHandler.emit('activePiecePos', player.activePiece.pos);
    player.eventHandler.emit('playerScore', player.playerName);
    // console.log(player.score);
  }

  //
  //Listening to all important changes to local instance state to broadcast to server
  localStateListeners() {

    //same listener name as the one below it, this is to make sure that other
    //users see the scores of each other on the canvas,
    // probably a better way of doing it but for now it gets the job done
    this.localInstance.player.eventHandler.listen('score', state => {
      this.send({
        type: 'clientUpdate',
        key: 'score',
        state,
      })
    })

    //This could be refactored to avoid duplication. But for now I like seeing it clearly delineated
    this.localInstance.player.eventHandler.listen('score', state => {
      // console.log("connectionManager")
      this.send({
        type: 'clientUpdate',
        key: 'allInfo',
        name: this.localInstance.player.playerName,
        score: this.localInstance.player.score,
        level: this.localInstance.player.level

      })
    })

    this.localInstance.player.eventHandler.listen('linesCleared', state => {
      this.send({
        type: 'clientUpdate',
        key: 'linesCleared',
        state,
      })
    })

    this.localInstance.player.eventHandler.listen('level', state => {
      this.send({
        type: 'clientUpdate',
        key: 'level',
        state,
      })
    })

    this.localInstance.player.eventHandler.listen('activePiecePos', state => {
      this.send({
        type: 'clientUpdate',
        key: 'activePiecePos',
        score: this.localInstance.player.score,
        state,
      })
    })

    this.localInstance.player.eventHandler.listen('activePieceMatrix', state => {
      this.send({
        type: 'clientUpdate',
        key: 'activePieceMatrix',
        state,
      })
    })

    this.localInstance.player.eventHandler.listen('nextPieceMatrix', state => {
      this.send({
        type: 'clientUpdate',
        key: 'nextPieceMatrix',
        state,
      })
    })

    this.localInstance.player.eventHandler.listen('boardMatrix', state => {
      this.send({
        type: 'clientUpdate',
        key: 'boardMatrix',
        state,
      })
    })

    this.localInstance.player.eventHandler.listen('pauseStatus', state => {
      this.send({
        type: 'clientUpdate',
        key: 'pauseStatus',
        state,
      })
    })

    this.localInstance.player.eventHandler.listen('playerScore', state =>{
      // console.log(this.peers.keys().Array)
      // this.socket.emit('playerScores', this.peers)
      this.send({
        type: 'playerScores',
        allInfo: "this si some infor being sent"
      })
      // this.peers.forEach(function(value, key) {
      //   console.log(value.player);
      //   // console.log(key + ' = ' + value);
      // });
    })
  }

  updateServer() {
    //Compose packet with local game state to send to server to broadcast
    const stateBundle = this.localInstance.sendLocalState();
    for(let key in stateBundle) {
      const packet = {
        type: 'clientUpdate',
        key,
        state: stateBundle[key],
      }
      this.send(packet);
    // console.log("from ConnectionManager")
    }
  }

  //Handle new remote clients joining session or leaving session
  updateManager(instances) {
    console.log(instances)
    //Create a filtered list of remote peers
    const myId = instances.you;
    const remoteInstances = instances.clients.filter(client => client.id !== myId)

    //create local copies of remote instances and initialize their state
    remoteInstances.forEach(instance => {
      if(!this.peers.has(instance.id)) {
        //Create and initialize new local instance (needs to be given remote state or else random seed)
        const newInstance = this.manager.createPlayer();
        this.peers.set(instance.id, newInstance)
        newInstance.receiveRemoteState(instance.state);
        newInstance.run();
      }
    })

        resizeCanvas(); //Immediately resize new copies of remote games to fit window

    //Create an array of the Map entries corresponding to each remote client
    const entries = [...this.peers.entries()];
    //Remove any client from the local DOM that have disconnected from the server
    entries.forEach(([id, game]) => {
            if (!remoteInstances.some(client => client.id === id)) {
                this.manager.removePlayer(game);
                this.peers.delete(id);
            }
    })

    //TODO: Sort so local player is always in first position
        // const local = this.manager.instances[0];
        // const sorted = instances.clients.map(client => this.peers.get(client.id) || local);
        // this.manager.sortPlayers(sorted);
  }

  //Update local copies of remote instances with state changes.
  updatePeer(data) {
    // console.log("updating")
    // console.log(this.localInstance.player.score);
        if (!this.peers.has(data.clientId)) {
            throw new Error('Client does not exist', data.clientId);
        }

        const game = this.peers.get(data.clientId);
        const player = game.player;

        if (data.key === 'activePieceMatrix') {
          player.activePiece.matrix = data.state;
        }
        else if (data.key === 'activePiecePos') {
          player.activePiece.pos = data.state;
        }
        else if (data.key === 'nextPieceMatrix') {
          player.nextPiece.matrix = data.state;
        }
        else if (data.key === 'boardMatrix') {
          player.board.matrix = data.state;
        }
        else if (data.key === 'score') {
          player.setScore(data.state);
        }
        else if (data.key === 'linesCleared') {
          player.setLines(data.state);
        }
        else if (data.key === 'level') {
          player.level = data.state;
        }
        else if (data.key === 'pauseStatus') {
          game.paused = data.state;
        }
  }
}