class Manager {
  constructor(document, isLocal = false) {
    this.isLocal = isLocal;
    this.document = document;
    this.template = this.document.querySelector('#player-template')
    // this.canvasContainer = document.getElementById('canvasContainer');
    this.localContainer = document.getElementById('localContainer');
    this.remoteContainer = document.getElementById('remoteContainer');

    this.instances = [];
  }


}