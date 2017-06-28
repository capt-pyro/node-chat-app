var socket = io();

socket.on('connect', function () {
  console.log('Connected to server');

});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

socket.on('newMessage', function (message) {
  console.log('newMessage', message);
  var li = jQuery('<li></li>');
  li.text(`${message.from}: ${message.text}`);
  jQuery('#messages').append(li);
});
socket.on('newLocationMessage', function (message) {
  var li = jQuery('<li></li>');
  var a = jQuery('<a target="_blank">My Current Location</a>');//target blank opens new tab
  li.text(`${message.from}: `);
  a.attr('href',message.url);
  li.append(a);
  jQuery('#messages').append(li);
});

var messageBox = jQuery('[name=message]');
jQuery('#message-form').on('submit', function(e) {
  e.preventDefault();
  socket.emit('createMessage', {
    from: 'User',
    text: messageBox.val()
  }, function () {
    messageBox.val('')
  });
});

var locationButton = jQuery('#send-location');
  locationButton.on('click', function () {
    if(!navigator.geolocation) {
      return alert('geolocation not supported by your browser!!')
    };
    locationButton.attr('disabled','disabled').text('Sending location ...');
    navigator.geolocation.getCurrentPosition(function (position) {
      socket.emit('createLocationMessage', {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      },function (returnConfirm) {//acknowledgement from server
        console.log(returnConfirm);
      });
      locationButton.removeAttr('disabled').text('Send location');
    },function () {
      locationButton.attr('disabled','disabled').text('Location not found');
      alert('Unable to fetch current location. Please turn on location');
      locationButton.removeAttr('disabled').text('Send location');
    });

});
