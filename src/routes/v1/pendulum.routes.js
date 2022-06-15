const express = require('express');
const pendulumController = require('../../controllers/pendulum.controller');

const router = express.Router();

router
    .route('/')
    .get(pendulumController.getCoordinates);

module.exports = router;