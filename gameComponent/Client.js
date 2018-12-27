class Client {
  constructor(socket, id) {
    this.socket = socket;
    this.id = id;
    this.session = null;
    //maintains the state of a users board
    this.state = {
      boardMatrix: [],
      activePieceMatrix: [],
      activePiecePos: {},
      nextPieceMatrix: [],
      level: 0,
      score: 0,
      linesCleared: 0,
      pauseStatus: false,
    }
  }
  //if a session is in progress or exists
  broadcast(data) {

    if(!this.session) {
      throw new Error('No session to broadcast to!')
    }

    data.clientId = this.id;

    [...this.session.clients]
      .filter(client => client !== this)
      .forEach(client => client.send(data))
  }
  //boradcasts the messege
  send(data) {
    // console.log('Sending message', data.type);
    const packet = JSON.stringify(data)
    this.socket.send(packet)
  }
}

module.exports = Client;