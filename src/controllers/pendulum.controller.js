const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status');
const config = require('../config/config');
const logger = require('../config/logger');
const { client } = require('../redis');
const { pendulumService } = require('../services');

const getInstanceInformation = catchAsync(async (req, res) => {
    res.status(httpStatus.OK).send(`Currently pinging instance: ${config.port}`);
});

const configurePendulum = catchAsync(async (req, res) => {
    const pendulum = req.body;

    logger.info(`Pendulum Received: ${JSON.stringify(pendulum)}`);
    await pendulumService.addPendulumConfig(pendulum);

    res.status(httpStatus.OK).send(pendulum);
});

module.exports = {
    getInstanceInformation,
    configurePendulum
};