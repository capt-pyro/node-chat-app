const path = require('path');
const http = require('http');
const express = require('express');
const SOCKETIO = require('socket.io');
const moment = require('moment');

const publicPath = path.join(__dirname,'../public');
var {isRealString} = require('./utils/validation');
var {Users} = require('./utils/users');
var {generateMessage, generateLocationMessage}  = require('./utils/message');
const port = process.env.PORT || 3000;
const app = express();
var server = http.createServer(app);
var io = SOCKETIO(server);
var users = new Users();

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
      return callback('Name and room name are required');
    }
    callback();
    //private room
    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id,params.name,params.room);
    io.to(params.room).emit('updateUserList', users.getUserList(params.room));
    //sends message to new user who joined
    socket.emit("newMessage", generateMessage("Admin", `Welcome to the room: ${params.room}`));
    socket.broadcast.to(params.room).emit('newMessage', generateMessage("Admin", `${params.name} has joined the room`));
  });

  //Listens for a new message from a client
  socket.on('createMessage', (message, callback) => {
    //development only
    //console.log(`createMessage`,message);
    //
    var user = users.getUser(socket.id);
    if(user && isRealString(message.text)) {
      io.to(user.room).emit('newMessage',generateMessage(user.name,message.text));
    }
    //When a new message arrives send it to every one
    callback('This is from the server');//acknowledgement
  });
  //Listens for a location broadcast request
  socket.on('createLocationMessage', (coords) => {
    var user = users.getUser(socket.id);
    if(user){
    io.to(user.room).emit('newLocationMessage',generateLocationMessage(`${user.name}`, coords.latitude,coords.longitude));
  }
  });
  //Disconnect (within a connect)
  socket.on('disconnect', () => {
    //development only
    var user = users.removeUser(socket.id);

    if(user) {
      io.to(user.room).emit('updateUserList',users.getUserList(user.room));//update user list
      io.to(user.room).emit('newMessage', generateMessage("Admin", `${user.name} has left!`));//informs others about user leaving
    }
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
