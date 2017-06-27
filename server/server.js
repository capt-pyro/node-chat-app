const path = require('path');
const http = require('http');
const express = require('express');
const SOCKETIO = require('socket.io');

const publicPath = path.join(__dirname,'../public');
const port = process.env.PORT || 3000;
const app = express();
var server = http.createServer(app);
var io = SOCKETIO(server);
//heroku is acting funny
app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log(`New User Connected`);

  socket.on('createMessage', (message) => {
    console.log(`createMessage`,message);
    io.emit('newMessage',{
      from: message.from,
      text: message.text,
      createdAt: new Date().getTime()
    });
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected`);
  });
});

server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
