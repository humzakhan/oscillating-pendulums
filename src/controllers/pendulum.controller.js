const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status');
const config = require('../config/config');

const getCoordinates = catchAsync(async (req, res) => {
    res.status(httpStatus.OK).send(`Currently pinging instance: ${config.instance}`);
});

module.exports = {
    getCoordinates
};