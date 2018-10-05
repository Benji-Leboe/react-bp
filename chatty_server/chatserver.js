// server.js

const express = require('express');
const WebSocket = require('ws');
const SocketServer = require('ws').Server;

// Set the port to 3001
const PORT = 3001;

// Create a new express server
const server = express()
  // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new SocketServer({
  server
});

function isJSON(string) {
  try {
    JSON.parse(string);
  } catch (err) {
    return false;
  }
  return true;
}
// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.
const clients = [];

wss.broadcast = (data) => {
  console.log(data, typeof data);
  wss.clients.forEach((client) => {
    console.log(client);
    if (client.readyState === WebSocket.OPEN) {
      console.log('Sending data')
      client.send(JSON.stringify(data));
    }
  });
}

wss.on('connection', (ws) => {
  
  clients.push(ws);
  console.log('SKEET SKEET');
  ws.on('message', (data) => {if (isJSON(data)) {wss.broadcast(data)}});
  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => console.log('YEET BITCHEZ'));
});