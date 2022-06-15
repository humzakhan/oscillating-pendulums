const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
const routes = require('./routes/v1');
const httpStatus = require('http-status');
const ApiError = require('./utils/ApiError');

const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(cors());
app.options('*', cors());
app.use('/v1', routes);

app.use((req, res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
  });

module.exports = app;
