const path = require('path');
const http = require('http');
const express = require('express');
const SOCKETIO = require('socket.io');

const publicPath = path.join(__dirname,'../public');
const port = process.env.PORT || 3000;
const app = express();
var server = http.createServer(app);
var io = SOCKETIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log(`New User Connected`);
  socket.on('disconnect', () => {
    console.log(`User disconnected`);
  });
});

server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
