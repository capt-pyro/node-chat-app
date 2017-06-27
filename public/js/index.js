var socket = io();
socket.on('connect', function () {
  console.log(`Connected to server`);

  socket.emit('createMessage', {
    from: 'jen',
    text: 'hey'
  });
});
socket.on('disconnect', function () {
  console.log(`disconnected from server`);
});
socket.on('newMessage', function (email) {
  console.log(`New Email`,email);
});
