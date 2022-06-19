const config = require('../config/config');
const logger = require('../config/logger');
const collisionService = require('./collision.service');
const { client } = require('../redis');

const configKey = config.constructKey('config');
const parametersKey = config.constructKey('params');
const positionKey = config.constructKey('position')

const addPendulumConfig = async(pendulum) => {
    await client.set(configKey, JSON.stringify(pendulum));
    logger.info(`Added pendulum config: [${JSON.stringify(pendulum)}]`);
};

const getPendulumConfig = async() => {
    logger.info(`Finding pendulum config for instance: ${configKey}`);
    const pendulumConfig = await client.get(configKey);

    if (pendulumConfig == null || pendulumConfig == '')
        return {};

    logger.info(`Returning config: ${JSON.stringify(pendulumConfig)}`);
    return JSON.parse(pendulumConfig);
};

const addDefaultPendulumConfig = async() => {
    console.log(configKey);
    const pendulumConfig = getInitialConfigForInstances(configKey);

    await addPendulumConfig(pendulumConfig);
};

const addInitialParameters = async() => {
    const currentConfig = await getPendulumConfig();
    const parameters = {
        gravity: 9.82,
        angle: Math.PI / 4,
        angularVelocity: 0.0,
        angularAcceleration: 0.05,
        damping: 0.995 - 0.0005 * currentConfig.mass
    };

    await client.set(parametersKey, JSON.stringify(parameters));
    logger.info(`Added initial parameters: [${JSON.stringify(parameters)}]`);
};

const getCurrentParamaters = async () => {
    const parameters = await client.get(parametersKey);
    return JSON.parse(parameters);
};

const updatePendulumParameters = async () => {
    const currentConfig = await getPendulumConfig();
    const currentParams = await getCurrentParamaters();
    const updatedParams = JSON.parse(JSON.stringify(currentParams));

    updatedParams.damping = 0.995 - 0.0003 * (currentConfig.mass / 3);
    updatedParams.gravity = 0.1 * currentParams.gravity;
    updatedParams.angularAcceleration = (-1 * updatedParams.gravity  / currentConfig.stringLength) * Math.sin(updatedParams.angle);
    updatedParams.angularVelocity += updatedParams.angularAcceleration;
    updatedParams.angularVelocity += updatedParams.damping;
    updatedParams.angle += updatedParams.angularVelocity;

    await client.set(parametersKey, JSON.stringify(updatedParams));
}

const getCurrentPosition = async() => {
    const position = JSON.parse(await client.get(positionKey));
    logger.info(`Retuning position: [${JSON.stringify(position)}]`);

    return position;
};

const updatePosition = async(position) => {
    logger.info(`Adding position for instance: ${configKey}`);
    await client.set(positionKey, JSON.stringify(position));

    logger.info(`Successfully saved position: ${JSON.stringify(position)}`);
    collisionService.detectCollision();
    return await getCurrentPosition();
}

const computeCurrentPosition = async() => {
    await updatePendulumParameters();
    const currentParams = await getCurrentParamaters();
    const currentConfig = await getPendulumConfig();

    logger.info('Computing current position');
    const position = {
        x: currentConfig.stringLength * Math.sin(currentParams.angle),
        y: currentConfig.stringLength * Math.cos(currentParams.angle),
        ...currentParams
    };

    return position;
};

const getInitialConfigForInstances = (key) => {
    const defaultConfig = {
        "instance-3000-config": {
            initialOffset: -0.60,
            mass: 51,
            stringLength: 250,
            maximumWindFactor: 5,
            color: '#4272c6'
        },
        "instance-3001-config": {
            initialOffset: -0.36,
            mass: 51,
            stringLength: 250,
            maximumWindFactor: 5,
            color: '#4272c6'
        },
        "instance-3002-config": {
            initialOffset: 0.29,
            mass: 32,
            stringLength: 375,
            maximumWindFactor: 5,
            color: '#ed7e32'
        },
        "instance-3003-config": {
            initialOffset: -0.65,
            mass: 60,
            stringLength: 175,
            maximumWindFactor: 5,
            color: '#ffc006'
        },
        "instance-3004-config": {
            initialOffset: 0.33,
            mass: 79,
            stringLength: 289,
            maximumWindFactor: 5,
            color: '#6fac47'
        },
        "instance-3005-config": {
            initialOffset: -0.09,
            mass: 47,
            stringLength: 436,
            maximumWindFactor: 5,
            color: '#5b9ad8'
        }
    };

    return defaultConfig[key];
}

module.exports = {
    addPendulumConfig,
    addDefaultPendulumConfig,
    addInitialParameters,
    updatePendulumParameters,
    getCurrentPosition,
    getCurrentParamaters,
    getPendulumConfig,
    updatePosition
}