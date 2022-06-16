const config = require('../config/config');
const logger = require('../config/logger');
const { client } = require('../redis');

const configKey = config.constructKey('config');

const addPendulumConfig = async(pendulum) => {
    await client.set(configKey, JSON.stringify(pendulum));
    logger.info(`Successfully added pendulum for key: [${configKey}] value: [${JSON.stringify(pendulum)}]`);
};

const getPendulumConfig = async() => {
    logger.info(`Finding pendulum config for instance: ${configKey}`);
    const pendulumConfig = await client.get(configKey);

    if (pendulumConfig == null || pendulumConfig == '')
        return {};
    
    return JSON.parse(pendulumConfig);
};

const addDefaultPendulumConfig = async() => {
    const pendulumConfig = {
        "initialOffset": 10,
        "mass": 20,
        "stringLength": 15,
        "maximumWindFactor": 5
    };

    await addPendulumConfig(pendulumConfig);
    logger.info('Adding default pendulum config.');
};

module.exports = {
    addPendulumConfig,
    addDefaultPendulumConfig,
    getPendulumConfig
}