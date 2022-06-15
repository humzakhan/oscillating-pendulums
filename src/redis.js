const config = require('./config/config');
const logger = require('./config/logger');
const redis = require('redis');

const client = redis.createClient({
    port: config.redisPort,
    host: config.redisHost,
    password: config.redisPassword
});

client.on('connect', () => {
    logger.info(`Connected to Redis client successfully`);
});

client.on('error', () => {
    logger.error(`Redis client error: ${error}`);
});

module.exports = { client };