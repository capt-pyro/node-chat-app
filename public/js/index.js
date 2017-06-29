var socket = io();//intialize socket
//Connect
socket.on('connect', function () {
  console.log('Connected to server');
});
//prevents spamming of send key (doesn't send blank strings)
jQuery("[name=message]").keyup(function () {
  if(jQuery("[name=message]").val() != '') {
    jQuery("#send-button").removeAttr('disabled');
  }
  else {
    jQuery("#send-button").attr('disabled', 'disabled');
  }
});
//Listens for a new message from server
socket.on('newMessage', function (message) {
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = jQuery('#message-template').html();
  var html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });
  jQuery('#messages').append(html);
});
//Listens for a new Location message from server
socket.on('newLocationMessage', function (message) {
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = jQuery('#location-message-template').html();
  var html = Mustache.render(template, {
    url: message.url,
    from: message.from,
    createdAt: formattedTime
  });
  jQuery('#messages').append(html);
});
//Sends data when submit is clicked
var messageBox = jQuery('[name=message]');
jQuery('#message-form').on('submit', function(e) {
  e.preventDefault();
  jQuery("#send-button").attr('disabled', 'disabled');
  socket.emit('createMessage', {
    from: 'User',
    text: messageBox.val()
  }, function () {
    messageBox.val('')
  });
});
//Handles sending of location request (including fancy animation of location button)
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
//Disconnect
socket.on('disconnect', function () {
  console.log('Disconnected from server');
});
