const path = require('path');
const http = require('http');
const express = require('express');
const SOCKETIO = require('socket.io');
const moment = require('moment');

const publicPath = path.join(__dirname,'../public');
var {isRealString} = require('./utils/validation');
var {generateMessage, generateLocationMessage}  = require('./utils/message');
const port = process.env.PORT || 3000;
const app = express();
var server = http.createServer(app);
var io = SOCKETIO(server);

app.use(express.static(publicPath));

//start connection with a client
io.on('connection', (socket) => {

  //development only
  console.log(`New User Connected`);
  //
  //Welcome message to new client
  //socket.emit('newMessage',generateMessage('Admin',"Welcome to the chat app"));
  //Notice of New user joining to sent to everyone except New user
  //socket.broadcast.emit('newMessage', generateMessage('Admin',"New user has joined"));

  socket.on('join', (params, callback) => {
    if(!isRealString(params.name) || !isRealString(params.room)) {
      callback('Name and room name are required');
    }
    callback();
    //private room
    socket.join(params.room);
    //sends message to new user who joined
    socket.emit("newMessage", generateMessage("Admin", `Welcome to the room: ${params.room}`));
    socket.broadcast.to(params.room).emit('newMessage', generateMessage("Admin", `${params.name} has joined the room`));
  });

  //Listens for a new message from a client
  socket.on('createMessage', (message, callback) => {
    //development only
    console.log(`createMessage`,message);
    //
    //When a new message arrives send it to every one
    io.emit('newMessage',generateMessage(message.from,message.text));
    callback('This is from the server');//acknowledgement
  });
  //Listens for a location broadcast request
  socket.on('createLocationMessage', (coords) => {
    io.emit('newLocationMessage',generateLocationMessage('Admin', coords.latitude,coords.longitude));
  });
  //Disconnect (within a connect)
  socket.on('disconnect', () => {
    //development only
    console.log(`User disconnected`);
    //
  });


});
//listening for devices on a port
server.listen(port, () => {
  //development only
  console.log(`Server is up on port ${port}`);
  //
});
