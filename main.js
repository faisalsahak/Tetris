const express = require('express')
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const path = require('path');
const Session = require('./components/Session');
const Client = require('./components/Client');
const port = 9000; //development port
// const port = process.env.PORT; //PRODUCTION


//map is used to store all players in current session
const sessionsMap = new Map;


//default viws directory for the server to retrieve static files to serve
app.use(express.static(path.join(__dirname, '/client')));


app.get('/', (req, res) => {
  res.sendFile('index.html');
});

app.get('/room', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/room.html'));
});

app.get('/menu-update', function (req, res) {
  const menuInfo = parseMapForDB(sessionsMap)
    res.json(menuInfo);
});


io.on('connection', (socket) => {
  console.log('connection detected', socket.id);

  gameRoom(io, socket);

});

server.listen(port);