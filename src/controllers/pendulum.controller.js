const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status');
const config = require('../config/config');
const logger = require('../config/logger');

const getCoordinates = catchAsync(async (req, res) => {
    res.status(httpStatus.OK).send(`Currently pinging instance: ${config.instance}`);
});

const configurePendulum = catchAsync(async (req, res) => {
    const { initialOffset, mass, stringLength, maximumWindFactor } = req.body;
    const pendulum = { initialOffset, mass, stringLength, maximumWindFactor };

    logger.info(`Pendulum Received: ${JSON.stringify(pendulum)}`);
    res.status(httpStatus.OK).send(pendulum);
});

module.exports = {
    getCoordinates,
    configurePendulum
};