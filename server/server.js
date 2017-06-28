const path = require('path');
const http = require('http');
const express = require('express');
const SOCKETIO = require('socket.io');

const publicPath = path.join(__dirname,'../public');
var {generateMessage, generateLocationMessage}  = require('./utils/message');
const port = process.env.PORT || 3000;
const app = express();
var server = http.createServer(app);
var io = SOCKETIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log(`New User Connected`);

  socket.emit('newMessage',generateMessage('Admin',"Welcome to the chat app"));
  socket.broadcast.emit('newMessage', generateMessage('Admin',"New user has joined"));

  socket.on('createMessage', (message, callback) => {
    console.log(`createMessage`,message);
    io.emit('newMessage',generateMessage(message.from,message.text));
    callback('This is from the server');
  });

  socket.on('createLocationMessage', (coords) => {
    io.emit('newLocationMessage',generateLocationMessage('Admin', coords.latitude,coords.longitude));
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected`);
  });
});

server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
