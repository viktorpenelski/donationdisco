// CONFIG
const REFRESH_INTERVAL = 5000;
const KEEP_LAST_NAME_ON_EMPTY = true;

// CONST ELEMENTS FROM index.html
const CENTER_DIV_ID = "#centerDiv";
const CENTER_SPAN_ID = "#centeredNameSpan";

var queue = [];

fetch('.streamlabs_key')
  .then(response => response.text())
  .then(socketToken => {
    connectToStreamlabsSocket(socketToken);
  });

window.setInterval(callback, REFRESH_INTERVAL);

function callback() {
  if (queue.length == 0) {
    console.log("Queue is empty");

    if (!KEEP_LAST_NAME_ON_EMPTY) {
      changeName("");
    }

    return;
  }

  // queue.shift has O(n) runtime complexity. This is not an issue for the expected load.
  // if it becomes an issue in the future, consider using an O(1) implementaiton like Queue.js
  let lastName = queue.shift();
  console.log("Dequeueing: " + lastName);
  changeName(lastName);
}

function changeName(name) {
  $(CENTER_SPAN_ID).text(name);
  $(CENTER_DIV_ID).bigtext();
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
