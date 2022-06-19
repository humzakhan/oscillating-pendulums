const app = require('./app');
const logger = require('./config/logger');
const config = require('./config/config');
const { client } = require('./redis');
const { pendulumService } = require('./services');

let server = app.listen(config.port, async () => {
    logger.info(`Listening on port: ${config.port}`);
    await client.connect();
    await pendulumService.addDefaultPendulumConfig();
    await pendulumService.addInitialParameters();
});

const exitHandler = () => {
    if (server) {
        server.close(async () => {
            logger.info(`Closing instance on port: ${config.port}`);
            process.exit();
        });
    }
    else {
        process.exit(1);
    }
};

const handleUnexpectedExceptions = (error) => {
    logger.error(error);
    exitHandler();
}

process.on('uncaughtException', handleUnexpectedExceptions);
process.on('unhandledRejection', handleUnexpectedExceptions);

process.on('SIGTERM', () => {
    logger.info(`SIGTERM received for instance on port: ${config.port}`);
    if (server) {
        server.close();
    }
});