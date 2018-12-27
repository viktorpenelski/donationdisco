fetch('.streamlabs_key')
  .then(response => response.text())
  .then(socketToken => {
    console.log(socketToken);
    connectToStreamlabsSocket(socketToken);
  })
// outputs the content of the text file

// const socketToken = ; //Socket token from /socket/token end point


function connectToStreamlabsSocket(token) {

  //Connect to socket
  const streamlabs = io(`https://sockets.streamlabs.com?token=${token}`, { transports: ['websocket'] });

  //Perform Action on event
  streamlabs.on('event', (eventData) => {
    if (eventData.type === 'donation') {
      //code to handle donation events
      console.log(eventData.type);
      console.log(eventData.message);
      $( "div.center" ).text(eventData.message[0].from);
    }
  });
}
