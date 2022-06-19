const config = require('../config/config');
const logger = require('../config/logger');
const { client } = require('../redis');
const WebSocket = require('ws');

const positionKey = config.constructKey('position');
const neighborPositionKey = config.constructNeighborKey('position');
const ws = new WebSocket(`ws://${config.wsbHost}:${config.wsbPort}/ws`);

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

        publishSignal("STOP");
        logger.info('Published STOP signal to all instances');

        logger.info('Publishing RESTART signal in 5 seconds');
        setTimeout(publishRestartSignal, 5000);
    }
}

const publishRestartSignal = () => {
    publishSignal("RESTART");
    logger.info("RESTART signal published");
};

const publishSignal = (state) => {
    const message = {
        instance: config.port,
        neighbor: config.instanceNeighbor,
        state: state
    };

    ws.send(JSON.stringify(message));
}

module.exports = {
    detectCollision,
    getNeighborPosition
}

