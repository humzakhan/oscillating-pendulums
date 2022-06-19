const express = require('express');
const logger = require('./config/logger');
const WebSocket = require('ws');

const app = express();

const websockets = async (expressServer) => {
    const websocketServer = new WebSocket.Server({
        noServer: true,
        path: "/ws",
    });

    expressServer.on("upgrade", (request, socket, head) => {
        websocketServer.handleUpgrade(request, socket, head, (websocket) => {
            websocketServer.emit("connection", websocket, request);
        });
    });

    websocketServer.broadcast = function broadcast(data) {
        websocketServer.clients.forEach(function each(wssClient) {
          if (wssClient.readyState == WebSocket.OPEN && data != undefined) 
            wssClient.send(data);
        });
    };

    websocketServer.on("connection",
        function connection(websocketConnection) {
          websocketConnection.on("message", (message) => {
            websocketServer.broadcast(message.toString());
          });
        }
    );

    return websocketServer;
};

let server = app.listen(8080, async () => {
    logger.info(`WSB started on port 8080`);
});

websockets(server);

