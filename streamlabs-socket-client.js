const DISPLAY_INTERVAL = 5000;
const NAME_FIELD = ".center";

var queue = [];

fetch('.streamlabs_key')
  .then(response => response.text())
  .then(socketToken => {
    connectToStreamlabsSocket(socketToken);
  });

var intervalID = window.setInterval(callback, DISPLAY_INTERVAL);

function callback() {
  if (queue.length == 0) {
    console.log("Queue is empty");
    return;
  }

  // queue.shift has O(n) runtime complexity. This is not an issue for the expected load.
  // if it becomes an issue in the future, consider using an O(1) implementaiton e.g. Queue.js
  let lastName = queue.shift();
  console.log("Dequeueing: " + lastName);
  changeName(lastName);
}

function changeName(name) {
  $(NAME_FIELD).text(name);
}

function connectToStreamlabsSocket(token) {

  //Connect to socket
  const streamlabs = io(`https://sockets.streamlabs.com?token=${token}`, { transports: ['websocket'] });

  //Perform Action on event
  streamlabs.on('event', (eventData) => {
    if (eventData.type === 'donation') {
      //code to handle donation events
      console.log(eventData.type);
      console.log(eventData.message);
      queue.push(eventData.message[0].from);
    }
  });
}
