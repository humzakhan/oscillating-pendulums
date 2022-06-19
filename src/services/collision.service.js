const config = require('../config/config');
const logger = require('../config/logger');
const { client } = require('../redis');
const WebSocket = require('ws');

const positionKey = config.constructKey('position');
const neighborPositionKey = config.constructNeighborKey('position');
const ws = new WebSocket("ws://localhost:8080/ws");

const getNeighborPosition = async() => {
    const position = JSON.parse(await client.get(neighborPositionKey));
    return position;
};

const detectCollision = async() => {
    const currentPosition = JSON.parse(await client.get(positionKey));
    const neighborPosition = await getNeighborPosition();
    const diffX = Math.abs(neighborPosition.x - currentPosition.x);
    const diffY = Math.abs(neighborPosition.y - currentPosition.y);

    if (diffX < 80 && diffY < 80) {
        logger.warn(`Collision imminent between instances: ${config.port} AND ${config.instanceNeighbor}`);
        logger.info(`Position: ${JSON.stringify(currentPosition)}`);
        logger.info(`Neighbor Position: ${JSON.stringify(neighborPosition)}`);
        logger.info(`Distance, x: ${diffX}, y: ${diffY}`);

        const message = {
            instance: config.port,
            neighbor: config.instanceNeighbor,
            state: "STOP"
        };

        ws.send(JSON.stringify(message));

        logger.info('Publishing RESTART signal in 5 seconds');
        setTimeout(publishRestartSignal, 5000);
    }
}

const publishRestartSignal = () => {
    const message = {
        instance: config.port,
        neighbor: config.instanceNeighbor,
        state: "RESTART"
    };

    ws.send(JSON.stringify(message));
    logger.info("RESTART signal published");
};

module.exports = {
    detectCollision,
    getNeighborPosition
}

