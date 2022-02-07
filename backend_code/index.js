// ===== standart http server ======
const express = require('express');
const app = express();

// provide static files
app.use(express.static('static_build'))
app.listen(8000, () => { console.log("server running at port 8000") })

// ======== ws code =========
var WebSocketServer = require('websocket').server;
var http = require('http');
var connectionList = [];

var server = http.createServer(function (request, response) {
  console.log((new Date()) + ' Received request for ' + request.url);
  response.writeHead(404);
  response.end();
});
server.listen(8080, function () {
  console.log((new Date()) + ' Server is listening on port 8080');
});

wsServer = new WebSocketServer({ httpServer: server });


wsServer.on('request', function (request) {
  try {
    var connection = request.accept(null, request.origin);

    connectionList.push(connection);

    console.log((new Date()) + ' Connection accepted.');

    connection.on('message', function (message) {
      if (message.type === 'utf8') {
        console.log('Received Message: ' + message.utf8Data);
        connectionList.filter(item => item !== null).forEach(point => {
          point.sendUTF(message.utf8Data); // brodcast to every connected port;
        })
      }
    });

    connection.on('close', function (reasonCode, description) {
      console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected for reason code' + reasonCode);
      connectionList[connectionList.indexOf(connection)] = null; // no more need;
    });

  } catch (err) { console.log(err) }
});

