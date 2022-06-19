const config = require('../config/config');
const logger = require('../config/logger');
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
    const pendulumConfig = {
        initialOffset: 0,
        mass: 50,
        stringLength: 250,
        maximumWindFactor: 5,
        color: '#9b9888'
    };

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
    await updatePendulumParameters();
    const currentParams = await getCurrentParamaters();
    const currentConfig = await getPendulumConfig();

    logger.info('Computing current position');
    const position = {
        x: currentConfig.stringLength * Math.sin(currentParams.angle),
        y: currentConfig.stringLength * Math.cos(currentParams.angle),
        ...currentParams
    };

    await client.set(positionKey, JSON.stringify(position));
    logger.info(`Retuning position: [${JSON.stringify(position)}]`);

    return position;
};

module.exports = {
    addPendulumConfig,
    addDefaultPendulumConfig,
    addInitialParameters,
    updatePendulumParameters,
    getCurrentPosition,
    getCurrentParamaters,
    getPendulumConfig,
}