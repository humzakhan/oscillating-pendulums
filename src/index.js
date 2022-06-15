const app = require('./app');
const logger = require('./config/logger');
const config = require('./config/config');

let server = app.listen(config.port, () => {
    logger.info(`Listening on port: ${config.port}`);
});

const exitHandler = () => {
    if (server) {
        server.close(() => {
            logger.info('Closing instance');
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
    logger.info('SIGTERM received');
    if (server) {
        server.close();
    }
});