const config = require('../config/config');
const logger = require('../config/logger');
const { client } = require('../redis');

const addPendulumConfig = async(pendulum) => {
    const key = config.constructKey('config');
    await client.set(key, JSON.stringify(pendulum));
    logger.info(`Successfully added pendulum for key: [${key}] value: [${JSON.stringify(pendulum)}]`);
};

const addDefaultPendulumConfig = async() => {
    const pendulum = {
        "initialOffset": 10,
        "mass": 20,
        "stringLength": 15,
        "maximumWindFactor": 5
    };

    await addPendulumConfig(pendulum);
    logger.info('Adding default pendulum config.');
};

module.exports = {
    addPendulumConfig,
    addDefaultPendulumConfig
}